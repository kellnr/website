import { describe, expect, it } from "vitest";
import changelogData from "@/data/changelog.json";
import { KELLNR_IMAGE, latestMajor } from "@/data/release";
import type { ChangeLogDocument } from "@/types/changelog";

function doc(...versions: string[]): ChangeLogDocument {
  return { releases: versions.map((version) => ({ version, date: "", entries: [] })) };
}

describe("latestMajor", () => {
  it("returns the major version of the newest release", () => {
    expect(latestMajor(doc("7.2.0", "6.11.0"))).toBe(7);
  });

  it("handles multi-digit majors", () => {
    expect(latestMajor(doc("12.0.1"))).toBe(12);
  });

  it("fails without releases", () => {
    expect(() => latestMajor(doc())).toThrow("changelog.json lists no releases");
  });

  it("fails on a version without numeric major", () => {
    expect(() => latestMajor(doc("v7.2.0"))).toThrow(/"v7.2.0"/);
  });
});

describe("KELLNR_IMAGE", () => {
  it("gets the major version of the changelog from the build", () => {
    expect(__KELLNR_MAJOR__).toBe(latestMajor(changelogData as ChangeLogDocument));
  });

  it("tags the image with the major version from the changelog", () => {
    const major = (changelogData as ChangeLogDocument).releases[0]!.version.split(".")[0];
    expect(KELLNR_IMAGE).toBe(`ghcr.io/kellnr/kellnr:${major}`);
  });
});
