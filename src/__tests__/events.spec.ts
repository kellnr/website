import { describe, expect, it } from "vitest";
import { isPlainLeftClick } from "@/utils/events";

describe("isPlainLeftClick", () => {
  it("accepts a plain left click", () => {
    expect(isPlainLeftClick(new MouseEvent("click", { button: 0 }))).toBe(true);
  });

  it.each(["metaKey", "ctrlKey", "shiftKey", "altKey"] as const)(
    "leaves a click with %s to the browser",
    (key) => {
      expect(isPlainLeftClick(new MouseEvent("click", { button: 0, [key]: true }))).toBe(false);
    }
  );

  it("leaves a middle click to the browser", () => {
    expect(isPlainLeftClick(new MouseEvent("click", { button: 1 }))).toBe(false);
  });
});
