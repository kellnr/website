#!/usr/bin/env python3
"""
Apply a `repository_dispatch` release-notes payload to `src/data/changelog.json`.

This is used by the website repo to react to a dispatch event (e.g. `kellnr_release_notes`)
by updating the changelog JSON in a deterministic, reviewable way.

Expected payload shape (as JSON):
{
  "version": "1.2.3",
  "tag": "v1.2.3",
  "date": "2025-12-29T23:00:00+00:00",   # RFC3339 (GitHub release.published_at)
  "source_repo": "kellnr/kellnr",
  "keep_a_changelog": {
    "Added": [...],
    "Changed": [...],
    "Deprecated": [...],
    "Removed": [...],
    "Fixed": [...],
    "Security": [...],
    "Other": [...]
  }
}

What it does:
- Converts RFC3339 `date` into changelog.json's human format: "DD. Month YYYY"
- Maps Keep-a-Changelog buckets into entries:
    { "type": "Added|Changed|Deprecated|Removed|Fixed|Security", "content": "...", "links": [...] }
- Heuristically turns trailing "#123" (or "(#123)") into a GitHub link to the source repo and
  removes the trailing reference from content to avoid duplication.
- Moves a leading git-cliff scope like "*(ui)*" into the entry's `scope` field.
- Converts the remaining Markdown into the HTML that `content` holds: escapes `<`, `>` and `&`
  and turns `code` spans into <code> elements.
- Inserts a new release at the top if it doesn't exist; otherwise updates the existing release.
- Maintains `isLatest`:
  - If inserting a new release: sets `isLatest=true` on it and removes `isLatest` from others.
  - If updating an existing release: preserves `isLatest` if previously true.

Additionally:
- Emits a short Markdown summary of the release (to stdout) that can be used in PR descriptions.
  To get only the summary, use: `--print-summary`.

Usage:
  python3 .github/scripts/apply_release_notes_to_changelog.py \
      --payload-json payload.json \
      --changelog-json src/data/changelog.json

In GitHub Actions you can pass the dispatch payload via stdin:
  echo "$PAYLOAD_JSON" | python3 ... --payload-stdin
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


KAC_TYPE_ORDER: Tuple[str, ...] = (
    "Added",
    "Changed",
    "Deprecated",
    "Removed",
    "Fixed",
    "Security",
    "Other",
)

ALLOWED_ENTRY_TYPES: Tuple[str, ...] = (
    "Added",
    "Changed",
    "Deprecated",
    "Removed",
    "Fixed",
    "Security",
)

_TRAILING_GH_REF_RE = re.compile(r"(?:\s|\()#(\d+)\)?\s*$")

# Matches GitHub pull/issue URLs inside a sentence.
# Examples:
#   https://github.com/kellnr/kellnr/pull/949
#   https://github.com/kellnr/kellnr/issues/880
_GH_URL_RE = re.compile(
    r"https?://github\.com/(?P<repo>[^\s/]+/[^\s/]+)/(?:pull|issues)/(?P<num>\d+)"
)

# Common GitHub release-note phrasing: "... in <url>" at the end.
_TRAILING_IN_URL_RE = re.compile(r"\s+in\s+https?://github\.com/[^\s]+\s*$")

# Markdown reference like "([#123]())" or "[#123]()" that is left over once its URL was extracted.
_EMPTY_MD_REF_RE = re.compile(r"\s*\(?\[#\d+\]\(\s*\)\)?")

# git-cliff scope prefix, e.g. "*(ui)* show crate size".
_SCOPE_RE = re.compile(r"^\*\((?P<scope>[^)]+)\)\*\s*")

_CODE_SPAN_RE = re.compile(r"`([^`]+)`")



class PayloadError(RuntimeError):
    pass


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def _parse_rfc3339(dt: str) -> datetime:
    """
    Parse RFC3339 datetime as produced by GitHub, e.g.:
      2025-12-29T23:00:00Z
      2025-12-29T23:00:00+00:00
    """
    s = (dt or "").strip()
    if not s:
        raise PayloadError("client_payload.date must be non-empty")
    # Python fromisoformat doesn't accept trailing Z; normalize:
    s = s.replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(s)
    except Exception as e:
        raise PayloadError(
            f"client_payload.date is not valid RFC3339: {dt!r} ({e})"
        ) from e


def _to_human_date(dt: datetime) -> str:
    # Keep existing website convention: "DD. Month YYYY"
    return f"{dt.day:02d}. {dt.strftime('%B')} {dt.year}"


def _must_be_str(value: Any, path: str) -> str:
    if not isinstance(value, str):
        raise PayloadError(f"Expected string at {path}, got {type(value).__name__}")
    s = value.strip()
    if not s:
        raise PayloadError(f"Expected non-empty string at {path}")
    return s


def _must_be_obj(value: Any, path: str) -> Dict[str, Any]:
    if not isinstance(value, dict):
        raise PayloadError(f"Expected object at {path}, got {type(value).__name__}")
    return value


def _must_be_list(value: Any, path: str) -> List[Any]:
    if not isinstance(value, list):
        raise PayloadError(f"Expected list at {path}, got {type(value).__name__}")
    return value


def validate_payload(payload: Dict[str, Any]) -> None:
    required = ["version", "tag", "date", "source_repo", "keep_a_changelog"]
    missing = [k for k in required if k not in payload]
    if missing:
        raise PayloadError(f"Missing required fields in payload: {missing}")

    _must_be_str(payload["version"], "payload.version")
    _must_be_str(payload["tag"], "payload.tag")
    _must_be_str(payload["source_repo"], "payload.source_repo")

    # Validate date parses
    _parse_rfc3339(_must_be_str(payload["date"], "payload.date"))

    kac = _must_be_obj(payload["keep_a_changelog"], "payload.keep_a_changelog")
    for section in KAC_TYPE_ORDER:
        if section not in kac:
            # allow missing, treat as empty
            continue
        items = kac[section]
        _must_be_list(items, f"payload.keep_a_changelog.{section}")
        # elements can be any JSON scalar; we will stringify
    # no return


def split_scope(text: str) -> Tuple[Optional[str], str]:
    """Split a leading git-cliff scope like "*(ui)*" from the text."""
    m = _SCOPE_RE.match(text)
    if not m:
        return None, text
    return m.group("scope"), text[m.end():]


def markdown_to_html(text: str) -> str:
    """Escape HTML special characters and turn `code` spans into <code> elements."""
    s = _EMPTY_MD_REF_RE.sub("", text).strip()
    s = html.escape(s, quote=False)
    return _CODE_SPAN_RE.sub(r"<code>\1</code>", s)


def _extract_github_url_links(s: str) -> Tuple[str, List[Dict[str, str]]]:
    """Move GitHub pull/issue URLs from the text into links, preferring /pull/ URLs."""
    urls = sorted(
        {m.group(0): m.group("num") for m in _GH_URL_RE.finditer(s)}.items(),
        key=lambda x: ("/pull/" not in x[0], x[0]),
    )
    if not urls:
        return s, []

    links = [{"label": f"#{num}", "url": url} for url, num in urls]
    # Remove trailing 'in <url>' noise and any remaining bare URLs.
    s = _TRAILING_IN_URL_RE.sub("", s).rstrip()
    s = _GH_URL_RE.sub("", s)
    return re.sub(r"\s{2,}", " ", s).strip(), links


def _extract_trailing_ref_link(s: str, source_repo: str) -> Tuple[str, List[Dict[str, str]]]:
    """Turn a trailing '#123' or '(#123)' into a link to the source repo."""
    m = _TRAILING_GH_REF_RE.search(s)
    if not m or not source_repo:
        return s, []

    num = m.group(1)
    # Use /issues/ as a stable target; GitHub auto-resolves PRs too.
    links = [{"label": f"#{num}", "url": f"https://github.com/{source_repo}/issues/{num}"}]
    return _TRAILING_GH_REF_RE.sub("", s).rstrip(), links


def _entry_item_from_text(text: str, source_repo: str) -> Dict[str, Any]:
    """
    Convert a single bullet line into:
      { "content": "...", "links": [ {label, url}, ... ], "scope": "..." }

    GitHub references are moved from `content` into `links`: embedded pull/issue URLs,
    or as fallback a trailing '#123'. `scope` is only set for a git-cliff scope like "*(ui)*".
    """
    s = (text or "").strip()
    s, links = _extract_github_url_links(s)
    if not links:
        s, links = _extract_trailing_ref_link(s, source_repo)

    scope, s = split_scope(s)
    item: Dict[str, Any] = {"content": markdown_to_html(s), "links": links}
    if scope:
        item["scope"] = scope
    return item


def build_release_from_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    version = _must_be_str(payload["version"], "payload.version")
    source_repo = _must_be_str(payload["source_repo"], "payload.source_repo")

    dt = _parse_rfc3339(_must_be_str(payload["date"], "payload.date"))
    human_date = _to_human_date(dt)

    kac = _must_be_obj(payload["keep_a_changelog"], "payload.keep_a_changelog")

    entries: List[Dict[str, Any]] = []

    for section in KAC_TYPE_ORDER:
        raw_items = kac.get(section, [])
        if raw_items is None:
            continue
        items = _must_be_list(raw_items, f"payload.keep_a_changelog.{section}")

        mapped_type = "Changed" if section == "Other" else section
        if mapped_type not in ALLOWED_ENTRY_TYPES:
            # Skip unknown types, but keep determinism
            continue

        for item in items:
            s = str(item).strip()
            if not s:
                continue
            entry = {"type": mapped_type, **_entry_item_from_text(s, source_repo)}
            if not entry.get("links"):
                entry["links"] = []
            entries.append(entry)

    return {
        "version": version,
        "date": human_date,
        "entries": entries,
    }


def _markdown_escape_inline(text: str) -> str:
    # Keep it simple: escape backticks so we can safely wrap code blocks/inline snippets elsewhere.
    return (text or "").replace("`", r"\`")


def _summary_link_suffix(links: Any) -> str:
    # Only show the first link in the summary to keep it short
    if not isinstance(links, list) or not links or not isinstance(links[0], dict):
        return ""
    label = _markdown_escape_inline(str(links[0].get("label", "")).strip())
    url = str(links[0].get("url", "")).strip()
    if label and url:
        return f" ([{label}]({url}))"
    if url:
        return f" ({url})"
    return ""


def build_markdown_summary(payload: Dict[str, Any], release: Dict[str, Any]) -> str:
    """
    Generate a concise Markdown summary for use in PR descriptions.
    """
    version = str(release.get("version", "")).strip()
    date = str(release.get("date", "")).strip()
    source_repo = str(payload.get("source_repo", "")).strip()
    tag = str(payload.get("tag", "")).strip()

    entries = release.get("entries", [])
    if not isinstance(entries, list):
        entries = []

    # Group by type in a stable order
    order = ["Added", "Changed", "Deprecated", "Fixed", "Removed", "Security"]
    grouped: Dict[str, List[Dict[str, Any]]] = {k: [] for k in order}
    for e in entries:
        t = str(e.get("type", "")).strip()
        if t in grouped:
            grouped[t].append(e)

    lines: List[str] = []
    lines.append(f"## Release {version}")
    if date:
        lines.append(f"- Date: {date}")
    if tag:
        lines.append(f"- Tag: `{_markdown_escape_inline(tag)}`")
    if source_repo:
        lines.append(f"- Source: `{_markdown_escape_inline(source_repo)}`")
    lines.append("")

    has_any = False
    for t in order:
        items = grouped.get(t, [])
        if not items:
            continue
        has_any = True
        lines.append(f"### {t}")
        for item in items:
            content = _markdown_escape_inline(str(item.get("content", "")).strip())
            lines.append(f"- {content}{_summary_link_suffix(item.get('links', []))}")
        lines.append("")

    if not has_any:
        lines.append("_No categorized entries found in payload._")
        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def load_changelog(path: Path) -> Dict[str, Any]:
    obj = json.loads(_read_text(path))
    if not isinstance(obj, dict):
        raise PayloadError(f"{path} must contain a JSON object")
    releases = obj.get("releases")
    if not isinstance(releases, list):
        raise PayloadError(f"{path} must contain a top-level 'releases' array")
    return obj


def apply_release(changelog: Dict[str, Any], release: Dict[str, Any]) -> bool:
    """
    Apply release into changelog in-place.
    Returns True if changelog was modified.
    """
    releases: List[Dict[str, Any]] = changelog["releases"]
    new_version = str(release["version"])

    existing_idx: Optional[int] = None
    for i, r in enumerate(releases):
        if str(r.get("version", "")) == new_version:
            existing_idx = i
            break

    new_release = dict(release)  # shallow copy

    changed = False

    if existing_idx is None:
        # Remove isLatest from all existing releases, set on the new one
        for r in releases:
            if "isLatest" in r:
                r.pop("isLatest", None)
                changed = True

        new_release["isLatest"] = True
        releases.insert(0, new_release)
        changed = True
        return changed

    # Update existing, preserve isLatest if true
    prev = releases[existing_idx]
    if prev.get("isLatest") is True:
        new_release["isLatest"] = True

    if prev != new_release:
        releases[existing_idx] = new_release
        changed = True

    return changed


def dump_json_pretty(obj: Any) -> str:
    return json.dumps(obj, ensure_ascii=False, indent=2) + "\n"


def parse_args(argv: List[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Apply release-notes payload to changelog.json"
    )
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--payload-json", type=str, help="Path to payload JSON file")
    g.add_argument(
        "--payload-stdin", action="store_true", help="Read payload JSON from stdin"
    )
    p.add_argument(
        "--changelog-json",
        type=str,
        default="src/data/changelog.json",
        help="Path to changelog.json (default: src/data/changelog.json)",
    )
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate and compute changes but do not write changelog.json",
    )
    p.add_argument(
        "--print-summary",
        action="store_true",
        help="Print a Markdown summary (for PR descriptions) to stdout. Still applies changes unless --dry-run is used.",
    )
    return p.parse_args(argv)


def _load_payload(args: argparse.Namespace) -> Dict[str, Any]:
    if args.payload_json:
        payload_raw = _read_text(Path(args.payload_json))
    else:
        payload_raw = sys.stdin.read()

    try:
        payload = json.loads(payload_raw)
    except Exception as e:
        raise PayloadError(f"Failed to parse payload JSON: {e}") from e

    if not isinstance(payload, dict):
        raise PayloadError(
            f"Payload must be a JSON object, got {type(payload).__name__}"
        )

    validate_payload(payload)
    return payload


def main(argv: List[str]) -> int:
    args = parse_args(argv)
    changelog_path = Path(args.changelog_json)
    payload = _load_payload(args)

    release = build_release_from_payload(payload)

    # Optionally print Markdown summary for PR bodies.
    if args.print_summary:
        sys.stdout.write(build_markdown_summary(payload, release))

    changelog = load_changelog(changelog_path)
    changed = apply_release(changelog, release)

    if args.dry_run:
        # In dry-run mode we avoid printing the full changelog JSON by default,
        # because GitHub PR diffs are sufficient and PR bodies should stay short.
        return 0

    if changed:
        _write_text(changelog_path, dump_json_pretty(changelog))
        sys.stdout.write(
            f"Updated {changelog_path} for version {release['version']} ({release['date']})\n"
        )
    else:
        sys.stdout.write(
            "No changes needed (changelog already up to date for this version).\n"
        )

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except PayloadError as e:
        sys.stderr.write(f"ERROR: {e}\n")
        raise SystemExit(2)
