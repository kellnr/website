import { afterEach, describe, expect, it, vi } from "vitest";
import { revealInContainer } from "@/utils/scroll";

interface Box {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

function element(box: Box): HTMLElement {
  const el = document.createElement("div");
  el.getBoundingClientRect = () =>
    ({ ...box, x: box.left, y: box.top, width: 0, height: 0, toJSON: () => box }) as DOMRect;
  return el;
}

function container(box: Box) {
  const el = element(box);
  const scrollBy = vi.fn();
  el.scrollBy = scrollBy as unknown as HTMLElement["scrollBy"];
  return { el, scrollBy };
}

const box: Box = { top: 0, bottom: 100, left: 0, right: 200 };

describe("revealInContainer", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not scroll when the item is visible", () => {
    const { el, scrollBy } = container(box);
    revealInContainer(el, element({ top: 20, bottom: 40, left: 20, right: 60 }), "y");
    revealInContainer(el, element({ top: 20, bottom: 40, left: 20, right: 60 }), "x");
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("scrolls up by the hidden part plus the margin", () => {
    const { el, scrollBy } = container(box);
    revealInContainer(el, element({ top: -30, bottom: -10, left: 0, right: 10 }), "y", 16);
    expect(scrollBy).toHaveBeenCalledWith({ top: -46, behavior: "smooth" });
  });

  it("scrolls down by the hidden part plus the margin", () => {
    const { el, scrollBy } = container(box);
    revealInContainer(el, element({ top: 90, bottom: 120, left: 0, right: 10 }), "y", 16);
    expect(scrollBy).toHaveBeenCalledWith({ top: 36, behavior: "smooth" });
  });

  it("scrolls left and right on the x axis", () => {
    const { el, scrollBy } = container(box);
    revealInContainer(el, element({ top: 0, bottom: 10, left: -25, right: 5 }), "x");
    revealInContainer(el, element({ top: 0, bottom: 10, left: 190, right: 230 }), "x");
    expect(scrollBy.mock.calls).toEqual([
      [{ left: -25, behavior: "smooth" }],
      [{ left: 30, behavior: "smooth" }],
    ]);
  });

  it("jumps when the user prefers reduced motion", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduce") }));
    const { el, scrollBy } = container(box);
    revealInContainer(el, element({ top: 0, bottom: 10, left: 190, right: 230 }), "x");
    expect(scrollBy).toHaveBeenCalledWith({ left: 30, behavior: "auto" });
  });
});
