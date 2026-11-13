export interface HashPosition {
  el?: Element;
  top: number;
  behavior: ScrollBehavior;
}

function decodeFragment(fragment: string): string {
  try {
    return decodeURIComponent(fragment);
  } catch {
    // Not valid percent-encoding, e.g. "#100%": the raw fragment is the id.
    return fragment;
  }
}

/**
 * Scroll position for a URL hash. Looks the target up by id, since fragments like "#7.2.0"
 * are not valid CSS selectors. The router ignores CSS scroll-margin-top, which keeps
 * targets clear of the sticky header, so it is passed as offset.
 */
export function hashPosition(hash: string, behavior: ScrollBehavior): HashPosition {
  const el = document.getElementById(decodeFragment(hash.slice(1)));
  if (!el) {
    return { top: 0, behavior };
  }
  const top = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  return { el, top, behavior };
}
