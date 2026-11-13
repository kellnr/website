import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { THEME_STORAGE_KEY, applyTheme, nextTheme, readStoredTheme } from "@/composables/useTheme";

describe("theme", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("cycles system, light, dark", () => {
    expect(nextTheme("system")).toBe("light");
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("system");
  });

  it("reads system when nothing or an unknown value is stored", () => {
    expect(readStoredTheme()).toBe("system");
    localStorage.setItem(THEME_STORAGE_KEY, "sepia");
    expect(readStoredTheme()).toBe("system");
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    expect(readStoredTheme()).toBe("dark");
  });

  it("sets data-theme for an explicit choice and removes it for system", () => {
    applyTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    applyTheme("system");
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it("still applies the theme when storage is unavailable", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    applyTheme("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(setItem).toHaveBeenCalled();
  });

  it("toggle button names the current theme and switches to the next one", async () => {
    // The theme state is read once per module load, so the toggle gets a fresh one.
    vi.resetModules();
    const { default: ThemeToggle } = await import("@/components/ThemeToggle.vue");
    const wrapper = mount(ThemeToggle);
    const button = wrapper.get("button");
    expect(button.attributes("aria-label")).toBe("Color theme: system. Switch to light");

    await button.trigger("click");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(button.attributes("aria-label")).toBe("Color theme: light. Switch to dark");
  });
});

describe("theme state with blocked storage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("keeps the chosen theme when another component reads it later", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.resetModules();
    const { useTheme } = await import("@/composables/useTheme");

    const toggle = useTheme();
    toggle.cycle();
    toggle.cycle();
    expect(toggle.theme.value).toBe("dark");

    expect(useTheme().theme.value).toBe("dark");
  });
});
