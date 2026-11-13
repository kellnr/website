import type {
  ChangeLogEntry,
  ChangeLogEntryType,
  ChangeLogLink,
  ChangeLogRelease,
} from "@/types/changelog";
import { ENTRY_TYPES, majorOf } from "../../scripts/changelog-format.mjs";
import { escapeHtml } from "@/utils/html";

export { ENTRY_TYPES, latestMajor, majorOf, versionId } from "../../scripts/changelog-format.mjs";

// Blog posts that explain the upgrade to a major version, by blog post id.
export const UPGRADE_POST_IDS: Readonly<Record<number, string>> = {
  7: "kellnr-v7",
  6: "release6",
  5: "release5",
  3: "release3",
};

export interface MajorGroup {
  major: number;
  releases: ChangeLogRelease[];
}

/** Groups releases by major version; the input order (newest first) is kept. */
export function groupByMajor(releases: readonly ChangeLogRelease[]): MajorGroup[] {
  const groups: MajorGroup[] = [];
  for (const release of releases) {
    const major = majorOf(release.version);
    const last = groups[groups.length - 1];
    if (last?.major === major) {
      last.releases.push(release);
    } else {
      groups.push({ major, releases: [release] });
    }
  }
  return groups;
}

// A leading marker like "[**breaking**]" or "Breaking:", as git-cliff writes it.
// The plain word ("breaking DB on migrate") describes a bug, not a breaking change.
const BREAKING_MARKER = /^\[?\*{0,2}breaking(?:\*\*\]?|\]|:)\s*/i;

function isMajorRelease(version: string): boolean {
  return /^\d+\.0\.0$/.test(version);
}

export function isBreaking(entry: ChangeLogEntry, version: string): boolean {
  if (entry.type === "Removed" && isMajorRelease(version)) return true;
  return BREAKING_MARKER.test(entry.content) || entry.content.includes("BREAKING");
}

/** Removes the breaking marker, which the "Breaking" label replaces. */
export function displayContent(content: string): string {
  return content.replace(BREAKING_MARKER, "");
}

function isHttpsUrl(url: string): boolean {
  return URL.canParse(url) && new URL(url).protocol === "https:";
}

function linkHtml(link: ChangeLogLink, version: string): string {
  if (!isHttpsUrl(link.url)) {
    throw new Error(
      `Changelog entry of version ${version} has a link that is not https: "${link.url}"`
    );
  }
  return `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`;
}

/** The entry content (trusted HTML from the changelog) followed by its escaped links. */
export function entryHtml(entry: ChangeLogEntry, version: string): string {
  const links = (entry.links ?? []).map((link) => ` ${linkHtml(link, version)}`).join("");
  return `${displayContent(entry.content)}${links}`;
}

type QueryValue = string | null | (string | null)[] | undefined;

/** Parses `?type=Fixed,Added`; unknown types are ignored, the result is in Keep a Changelog order. */
export function parseTypeFilter(value: QueryValue): ChangeLogEntryType[] {
  const raw = (Array.isArray(value) ? value : [value]).flatMap((v) => (v ?? "").split(","));
  return ENTRY_TYPES.filter((type) => raw.includes(type));
}

export function serializeTypeFilter(types: readonly ChangeLogEntryType[]): string | undefined {
  const ordered = ENTRY_TYPES.filter((type) => types.includes(type));
  return ordered.length > 0 ? ordered.join(",") : undefined;
}

export function countByType(
  releases: readonly ChangeLogRelease[]
): Record<ChangeLogEntryType, number> {
  const counts = Object.fromEntries(ENTRY_TYPES.map((type) => [type, 0])) as Record<
    ChangeLogEntryType,
    number
  >;
  for (const release of releases) {
    for (const entry of release.entries) {
      counts[entry.type] += 1;
    }
  }
  return counts;
}

/** Keeps only entries of the given types and drops releases left without entries. */
export function filterReleases(
  releases: readonly ChangeLogRelease[],
  types: readonly ChangeLogEntryType[]
): ChangeLogRelease[] {
  if (types.length === 0) return [...releases];
  return releases
    .map((release) => ({
      ...release,
      entries: release.entries.filter((entry) => types.includes(entry.type)),
    }))
    .filter((release) => release.entries.length > 0);
}
