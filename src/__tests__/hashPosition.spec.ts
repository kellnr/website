import { afterEach, describe, expect, it } from "vitest";
import { hashPosition } from "@/router/hashPosition";

function addTarget(id: string, scrollMarginTop = ""): HTMLElement {
  const el = document.createElement("h2");
  el.id = id;
  el.style.scrollMarginTop = scrollMarginTop;
  document.body.append(el);
  return el;
}

describe("hashPosition", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("targets the element and keeps its scroll margin", () => {
    const el = addTarget("installation", "80px");

    expect(hashPosition("#installation", "smooth")).toEqual({ el, top: 80, behavior: "smooth" });
  });

  it.each(["7.2.0", "1st-step", "a:b"])("finds the id %j that is not a valid selector", (id) => {
    const el = addTarget(id);

    expect(hashPosition(`#${id}`, "instant")).toEqual({ el, top: 0, behavior: "instant" });
  });

  it("decodes a percent-encoded fragment", () => {
    const el = addTarget("über uns");

    expect(hashPosition("#%C3%BCber%20uns", "instant").el).toBe(el);
  });

  it("uses the raw fragment when it is not valid percent-encoding", () => {
    const el = addTarget("100%");

    expect(hashPosition("#100%", "instant").el).toBe(el);
  });

  it("falls back to the top of the page when no element has the id", () => {
    expect(hashPosition("#missing", "instant")).toEqual({ top: 0, behavior: "instant" });
  });
});
