import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, type Ref } from "vue";
import { mount } from "@vue/test-utils";
import { THEME_STORAGE_KEY, resolveTheme, type ResolvedTheme } from "@/composables/useTheme";

type ThemeModule = typeof import("@/composables/useTheme");

// The theme state lives in the module and reads storage once, so each test loads it afresh.
async function freshThemeModule(): Promise<ThemeModule> {
  vi.resetModules();
  return import("@/composables/useTheme");
}

const DARK_QUERY = "(prefers-color-scheme: dark)";

// A media query list for the dark color scheme whose result the test can change.
function mockColorScheme(dark: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const list = {
    matches: dark,
    media: DARK_QUERY,
    addEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) =>
      listeners.add(listener)
    ),
    removeEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) =>
      listeners.delete(listener)
    ),
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => {
      if (query !== DARK_QUERY) throw new Error(`Unexpected media query: ${query}`);
      return list;
    })
  );
  return {
    list,
    listeners,
    setDark(value: boolean) {
      list.matches = value;
      listeners.forEach((listener) => listener({ matches: value } as MediaQueryListEvent));
    },
  };
}

function mountResolved({ useResolvedTheme }: ThemeModule) {
  let resolved!: Readonly<Ref<ResolvedTheme>>;
  const wrapper = mount(
    defineComponent({
      setup() {
        resolved = useResolvedTheme();
        return () => h("span", resolved.value);
      },
    })
  );
  return { wrapper, resolved };
}

describe("resolveTheme", () => {
  it("follows the OS for the system theme", () => {
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("system", true)).toBe("dark");
  });

  it("keeps an explicit choice regardless of the OS", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});

describe("useResolvedTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("is light on a light OS and dark on a dark OS on the first render", async () => {
    const themes = await freshThemeModule();
    mockColorScheme(false);
    expect(mountResolved(themes).wrapper.text()).toBe("light");

    mockColorScheme(true);
    expect(mountResolved(themes).wrapper.text()).toBe("dark");
  });

  it("follows a change of the OS color scheme", async () => {
    const scheme = mockColorScheme(false);
    const { wrapper, resolved } = mountResolved(await freshThemeModule());

    scheme.setDark(true);
    await nextTick();

    expect(resolved.value).toBe("dark");
    expect(wrapper.text()).toBe("dark");
  });

  it("prefers a stored explicit choice over the OS", async () => {
    mockColorScheme(true);
    localStorage.setItem(THEME_STORAGE_KEY, "light");

    expect(mountResolved(await freshThemeModule()).resolved.value).toBe("light");
  });

  it("follows the theme toggle", async () => {
    mockColorScheme(true);
    const themes = await freshThemeModule();
    const { resolved } = mountResolved(themes);
    const { cycle } = themes.useTheme();

    cycle();
    expect(resolved.value).toBe("light");
    cycle();
    expect(resolved.value).toBe("dark");
    cycle();
    expect(resolved.value).toBe("dark");
  });

  it("ignores OS changes while an explicit theme is chosen", async () => {
    const scheme = mockColorScheme(false);
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    const { resolved } = mountResolved(await freshThemeModule());

    scheme.setDark(true);
    await nextTick();

    expect(resolved.value).toBe("light");
  });

  it("stops listening to the OS on unmount", async () => {
    const scheme = mockColorScheme(false);
    const { wrapper } = mountResolved(await freshThemeModule());
    expect(scheme.listeners.size).toBe(1);

    wrapper.unmount();

    expect(scheme.listeners.size).toBe(0);
  });
});
