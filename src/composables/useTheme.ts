import { computed, onScopeDispose, readonly, ref, type Ref } from "vue";

export type Theme = "system" | "light" | "dark";
export type ResolvedTheme = Exclude<Theme, "system">;

/** Also read by the inline script in index.html, which applies the theme before the first paint. */
export const THEME_STORAGE_KEY = "kellnr-theme";

const ORDER: readonly Theme[] = ["system", "light", "dark"];

export function nextTheme(theme: Theme): Theme {
  return ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]!;
}

function isTheme(value: string | null): value is Theme {
  return ORDER.includes(value as Theme);
}

// Storage throws in private windows or with blocked site data; the theme then lasts only for the page view.
export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function storeTheme(theme: Theme): void {
  try {
    if (theme === "system") {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch (error) {
    console.warn(`Cannot store the color theme "${theme}":`, error);
  }
}

/** "system" removes data-theme, so color-scheme: light dark on :root follows the OS. */
export function applyTheme(theme: Theme): void {
  if (theme === "system") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }
  storeTheme(theme);
}

// Shared by all components and read from storage once: with blocked storage a choice made in
// this page view must survive the next component that asks for the theme.
const current = ref<Theme>(readStoredTheme());

export function useTheme(): { theme: Readonly<Ref<Theme>>; cycle: () => void } {
  function cycle() {
    current.value = nextTheme(current.value);
    applyTheme(current.value);
  }

  return { theme: readonly(current), cycle };
}

export function resolveTheme(theme: Theme, systemDark: boolean): ResolvedTheme {
  if (theme !== "system") return theme;
  return systemDark ? "dark" : "light";
}

/** The theme the page shows: the toggle choice, or for "system" the color scheme of the OS. */
export function useResolvedTheme(): Readonly<Ref<ResolvedTheme>> {
  const { theme } = useTheme();
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const systemDark = ref(media.matches);
  const onChange = (event: MediaQueryListEvent) => {
    systemDark.value = event.matches;
  };
  media.addEventListener("change", onChange);
  onScopeDispose(() => media.removeEventListener("change", onChange));

  return computed(() => resolveTheme(theme.value, systemDark.value));
}
