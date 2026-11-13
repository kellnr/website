import { afterEach, describe, expect, it } from "vitest";
import { canonicalUrl, syncCanonicalLink } from "@/router/canonical";

function canonicalLinks(): HTMLLinkElement[] {
  return [...document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')];
}

describe("canonicalUrl", () => {
  it.each([
    ["/", "https://kellnr.io/"],
    ["", "https://kellnr.io/"],
    ["/documentation", "https://kellnr.io/documentation"],
    ["/documentation/", "https://kellnr.io/documentation"],
    ["/blog/async-closures-in-rust", "https://kellnr.io/blog/async-closures-in-rust"],
  ])("maps %j to %s", (path, expected) => {
    expect(canonicalUrl(path)).toBe(expected);
  });
});

describe("syncCanonicalLink", () => {
  afterEach(() => {
    canonicalLinks().forEach((link) => link.remove());
  });

  it("creates the canonical link when the document has none", () => {
    syncCanonicalLink({ path: "/features", name: "features" });

    expect(canonicalLinks().map((link) => link.href)).toEqual(["https://kellnr.io/features"]);
  });

  it("updates an existing canonical link instead of adding a second one", () => {
    syncCanonicalLink({ path: "/features", name: "features" });
    syncCanonicalLink({ path: "/blog/", name: "blog" });

    expect(canonicalLinks().map((link) => link.href)).toEqual(["https://kellnr.io/blog"]);
  });

  it("removes the canonical link on the not found page", () => {
    syncCanonicalLink({ path: "/features", name: "features" });
    syncCanonicalLink({ path: "/no-such-page", name: "notFound" });

    expect(canonicalLinks()).toEqual([]);
  });

  it("adds no canonical link on the not found page", () => {
    syncCanonicalLink({ path: "/no-such-page", name: "notFound" });

    expect(canonicalLinks()).toEqual([]);
  });
});
