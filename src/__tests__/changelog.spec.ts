import { describe, expect, it } from "vitest";
import blogData from "@/data/blog-posts.json";
import changelogData from "@/data/changelog.json";
import type { ChangeLogDocument, ChangeLogEntry, ChangeLogRelease } from "@/types/changelog";
import {
  releaseCount,
  countByType,
  displayContent,
  entryHtml,
  filterReleases,
  groupByMajor,
  isBreaking,
  majorOf,
  parseTypeFilter,
  serializeTypeFilter,
  UPGRADE_POST_IDS,
  versionId,
} from "@/utils/changelog";

function entry(type: ChangeLogEntry["type"], content = "something"): ChangeLogEntry {
  return { type, content };
}

function release(version: string, entries: ChangeLogEntry[] = []): ChangeLogRelease {
  return { version, date: "2026-01-01", entries };
}

describe("changelog.json", () => {
  const doc = changelogData as ChangeLogDocument;

  it.each(doc.releases.map((r) => [r.version, r.date]))(
    "release %s has an ISO date (%s)",
    (_version, date) => {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  );
});

describe("versionId", () => {
  it("turns dots into dashes and prefixes v", () => {
    expect(versionId("7.2.0")).toBe("v7-2-0");
  });
});

describe("UPGRADE_POST_IDS", () => {
  it.each(Object.entries(UPGRADE_POST_IDS))(
    "the upgrade post of Kellnr %s (%s) exists in blog-posts.json",
    (_major, id) => {
      expect(blogData.posts.map((post) => post.id)).toContain(id);
    }
  );
});

describe("majorOf", () => {
  it("returns the major version", () => {
    expect(majorOf("6.13.0")).toBe(6);
  });

  it("rejects a version without a numeric major", () => {
    expect(() => majorOf("next")).toThrow('Invalid version: "next"');
  });
});

describe("groupByMajor", () => {
  it("groups releases by major version and keeps their order", () => {
    const groups = groupByMajor([release("7.1.0"), release("7.0.0"), release("6.0.0")]);
    expect(groups.map((g) => [g.major, g.releases.map((r) => r.version)])).toEqual([
      [7, ["7.1.0", "7.0.0"]],
      [6, ["6.0.0"]],
    ]);
  });
});

describe("isBreaking", () => {
  it("marks removals in a major release", () => {
    expect(isBreaking(entry("Removed"), "7.0.0")).toBe(true);
  });

  it("does not mark removals in a minor release", () => {
    expect(isBreaking(entry("Removed"), "7.1.0")).toBe(false);
  });

  it("marks entries with a breaking marker", () => {
    expect(isBreaking(entry("Fixed", "[**breaking**] answer with 403"), "7.0.0")).toBe(true);
    expect(isBreaking(entry("Changed", "Breaking: new config format"), "6.1.0")).toBe(true);
  });

  it("marks entries that contain BREAKING", () => {
    expect(isBreaking(entry("Changed", "new CLI (BREAKING)"), "6.1.0")).toBe(true);
  });

  it("does not mark entries that only use the word breaking", () => {
    expect(isBreaking(entry("Fixed", "breaking DB on migrate"), "5.14.1")).toBe(false);
  });
});

describe("displayContent", () => {
  it("removes the breaking marker that the label replaces", () => {
    expect(displayContent("[**breaking**] answer with 403")).toBe("answer with 403");
    expect(displayContent("Breaking: new config format")).toBe("new config format");
  });

  it("keeps other content unchanged", () => {
    expect(displayContent("breaking DB on <code>migrate</code>")).toBe(
      "breaking DB on <code>migrate</code>"
    );
  });
});

describe("parseTypeFilter", () => {
  it("returns no types without a query value", () => {
    expect(parseTypeFilter(undefined)).toEqual([]);
  });

  it("parses a comma separated list in Keep a Changelog order", () => {
    expect(parseTypeFilter("Fixed,Added")).toEqual(["Added", "Fixed"]);
  });

  it("parses repeated query values", () => {
    expect(parseTypeFilter(["Security", "Fixed"])).toEqual(["Fixed", "Security"]);
  });

  it("ignores unknown types and duplicates", () => {
    expect(parseTypeFilter("Fixed,Bogus,Fixed")).toEqual(["Fixed"]);
  });
});

describe("serializeTypeFilter", () => {
  it("joins types with commas in Keep a Changelog order", () => {
    expect(serializeTypeFilter(["Security", "Added", "Fixed"])).toBe("Added,Fixed,Security");
  });

  it("returns undefined for an empty filter", () => {
    expect(serializeTypeFilter([])).toBeUndefined();
  });
});

describe("countByType", () => {
  it("counts the entries of every type", () => {
    const counts = countByType([
      release("2.0.0", [entry("Added"), entry("Fixed")]),
      release("1.0.0", [entry("Added")]),
    ]);
    expect(counts).toEqual({
      Added: 2,
      Changed: 0,
      Deprecated: 0,
      Removed: 0,
      Fixed: 1,
      Security: 0,
    });
  });
});

describe("filterReleases", () => {
  const releases = [
    release("2.0.0", [entry("Added"), entry("Fixed")]),
    release("1.0.0", [entry("Added")]),
  ];

  it("keeps everything without a filter", () => {
    expect(filterReleases(releases, [])).toEqual(releases);
  });

  it("keeps matching entries and drops releases without one", () => {
    const result = filterReleases(releases, ["Fixed"]);
    expect(result.map((r) => r.version)).toEqual(["2.0.0"]);
    expect(result[0]!.entries.map((e) => e.type)).toEqual(["Fixed"]);
  });
});

describe("entryHtml", () => {
  it("appends the links to the content", () => {
    const html = entryHtml(
      {
        type: "Added",
        content: "new <code>cargo</code> command",
        links: [{ label: "#12", url: "https://github.com/kellnr/kellnr/pull/12" }],
      },
      "7.0.0"
    );
    expect(html).toBe(
      'new <code>cargo</code> command <a href="https://github.com/kellnr/kellnr/pull/12" target="_blank" rel="noopener noreferrer">#12</a>'
    );
  });

  it("removes the breaking marker", () => {
    expect(entryHtml({ type: "Changed", content: "Breaking: new config" }, "7.0.0")).toBe(
      "new config"
    );
  });

  it("escapes link label and URL", () => {
    const html = entryHtml(
      {
        type: "Fixed",
        content: "fix",
        links: [{ label: "<b>x</b>", url: 'https://e.org/?a=1&b="2"' }],
      },
      "7.0.0"
    );
    expect(html).toContain('href="https://e.org/?a=1&amp;b=&quot;2&quot;"');
    expect(html).toContain(">&lt;b&gt;x&lt;/b&gt;</a>");
  });

  it.each(["javascript:alert(1)", "http://example.org", "not a url"])(
    "rejects the link URL %s",
    (url) => {
      expect(() =>
        entryHtml({ type: "Fixed", content: "fix", links: [{ label: "x", url }] }, "7.1.0")
      ).toThrow(`Changelog entry of version 7.1.0 has a link that is not https: "${url}"`);
    }
  );
});

describe("releaseCount", () => {
  it("uses the singular for one release", () => {
    expect(releaseCount(1)).toBe("1 release");
    expect(releaseCount(22)).toBe("22 releases");
  });
});
