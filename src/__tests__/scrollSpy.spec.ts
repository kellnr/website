import { describe, expect, it } from "vitest";
import { activeSectionId } from "@/composables/useScrollSpy";

const ids = ["intro", "setup", "usage"] as const;

function tops(positions: Record<string, number | null>) {
  return (id: string) => positions[id] ?? null;
}

describe("activeSectionId", () => {
  it("returns null before the first section reaches the offset", () => {
    expect(activeSectionId(ids, tops({ intro: 300, setup: 900, usage: 1500 }), 100, false)).toBe(
      null
    );
  });

  it("returns the last section whose top passed the offset", () => {
    expect(activeSectionId(ids, tops({ intro: -400, setup: 80, usage: 700 }), 100, false)).toBe(
      "setup"
    );
  });

  it("counts a section exactly at the offset as active", () => {
    expect(activeSectionId(ids, tops({ intro: -400, setup: 100, usage: 700 }), 100, false)).toBe(
      "setup"
    );
  });

  it("skips ids without element", () => {
    expect(activeSectionId(ids, tops({ intro: -400, setup: null, usage: 700 }), 100, false)).toBe(
      "intro"
    );
  });

  it("activates the last section at the bottom of the page", () => {
    expect(activeSectionId(ids, tops({ intro: -900, setup: 50, usage: 400 }), 100, true)).toBe(
      "usage"
    );
  });

  it("returns null for no ids", () => {
    expect(activeSectionId([], tops({}), 100, true)).toBe(null);
  });
});
