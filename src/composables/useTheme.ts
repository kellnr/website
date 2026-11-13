import { readonly, ref, type Ref } from "vue";

export type Theme = "system" | "light" | "dark";

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

const current = ref<Theme>("system");

export function useTheme(): { theme: Readonly<Ref<Theme>>; cycle: () => void } {
  current.value = readStoredTheme();

  function cycle() {
    current.value = nextTheme(current.value);
    applyTheme(current.value);
  }

  return { theme: readonly(current), cycle };
}
