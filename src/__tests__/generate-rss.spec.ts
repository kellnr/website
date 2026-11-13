import { describe, expect, it } from "vitest";
import type { ChangeLogEntry } from "@/types/changelog";
import {
  changelogDateToRfc3339,
  groupEntriesByType,
  validateChangelogDocument,
} from "../../scripts/feed-data.mjs";
import { ENTRY_TYPES } from "../../scripts/changelog-format.mjs";

describe("changelogDateToRfc3339", () => {
  it("converts an ISO date to noon UTC", () => {
    expect(changelogDateToRfc3339("2026-11-13", "releases[0].date")).toBe(
      "2026-11-13T12:00:00.000Z"
    );
  });

  it.each(["13. November 2026", "2026-11-13T00:00:00Z", "2026-1-3", " 2026-11-13"])(
    "rejects %j with the value and its path",
    (value) => {
      expect(() => changelogDateToRfc3339(value, "releases[3].date")).toThrow(
        `Invalid ISO date (expected YYYY-MM-DD) at releases[3].date: "${value}"`
      );
    }
  );

  it("rejects a date that does not exist", () => {
    expect(() => changelogDateToRfc3339("2026-02-30", "releases[1].date")).toThrow(
      'Invalid ISO date (expected YYYY-MM-DD) at releases[1].date: "2026-02-30"'
    );
  });
});

describe("validateChangelogDocument entry types", () => {
  function docWithType(type: string) {
    return {
      releases: [
        { version: "7.2.0", date: "2026-11-01", entries: [{ type, content: "an entry" }] },
      ],
    };
  }

  it.each(["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security"])(
    "accepts the type %s",
    (type) => {
      expect(() => validateChangelogDocument(docWithType(type), "changelog.json")).not.toThrow();
    }
  );

  it.each(["Bugfix", "fixed", ""])("rejects the type %j with its path", (type) => {
    expect(() => validateChangelogDocument(docWithType(type), "changelog.json")).toThrow(
      `Unknown entry type at changelog.releases[0].entries[0].type: "${type}"`
    );
  });
});

function docWithLink(link: { label: string; url: string }) {
  return {
    releases: [
      {
        version: "7.2.0",
        date: "2026-11-01",
        entries: [{ type: "Fixed", content: "a fix", links: [link] }],
      },
    ],
  };
}

const LINK_PATH = "changelog.releases[0].entries[0].links[0]";

describe("validateChangelogDocument", () => {
  it("accepts an https link", () => {
    const doc = docWithLink({ label: "#42", url: "https://github.com/kellnr/kellnr/pull/42" });

    expect(() => validateChangelogDocument(doc, "changelog.json")).not.toThrow();
  });

  it.each([
    "http://github.com/kellnr/kellnr/pull/42",
    "javascript:alert(1)",
    "//github.com/kellnr/kellnr",
    "not a url",
  ])("rejects the link URL %j with its path", (url) => {
    const doc = docWithLink({ label: "#42", url });

    expect(() => validateChangelogDocument(doc, "changelog.json")).toThrow(
      `Expected https URL at ${LINK_PATH}.url: "${url}"`
    );
  });

  it.each(["<b>#42</b>", "#42 >", 'say "hi"'])(
    "rejects the link label %j with its path",
    (label) => {
      const doc = docWithLink({ label, url: "https://github.com/kellnr/kellnr/pull/42" });

      expect(() => validateChangelogDocument(doc, "changelog.json")).toThrow(
        `Invalid character (<, > or ") at ${LINK_PATH}.label: "${label}"`
      );
    }
  );
});

describe("groupEntriesByType", () => {
  it("groups in the order of the changelog page and skips empty types", () => {
    const entries: ChangeLogEntry[] = [
      { type: "Fixed", content: "a" },
      { type: "Added", content: "b" },
      { type: "Removed", content: "c" },
      { type: "Fixed", content: "d" },
    ];
    expect(groupEntriesByType(entries)).toEqual([
      ["Added", [entries[1]]],
      ["Removed", [entries[2]]],
      ["Fixed", [entries[0], entries[3]]],
    ]);
    const order = groupEntriesByType(entries).map(([type]) => type);
    expect(order).toEqual(ENTRY_TYPES.filter((type) => order.includes(type)));
  });
});
