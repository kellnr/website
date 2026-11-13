import type { RouteLocationNormalized } from "vue-router";

const SITE_ORIGIN = "https://kellnr.io";

/** Name of the catch-all route that renders the not found page. */
export const NOT_FOUND_ROUTE = "notFound";

/** Canonical URL of a route path: no query or hash, trailing slash only for the root. */
export function canonicalUrl(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return `${SITE_ORIGIN}${trimmed || "/"}`;
}

function canonicalLink(): HTMLLinkElement | null {
  return document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
}

function createCanonicalLink(): HTMLLinkElement {
  const link = document.createElement("link");
  link.rel = "canonical";
  document.head.append(link);
  return link;
}

/**
 * Points `<link rel="canonical">` at the route. The not found page gets none, so search
 * engines do not index unknown URLs as pages of their own.
 */
export function syncCanonicalLink(route: Pick<RouteLocationNormalized, "path" | "name">): void {
  if (route.name === NOT_FOUND_ROUTE) {
    canonicalLink()?.remove();
    return;
  }
  (canonicalLink() ?? createCanonicalLink()).href = canonicalUrl(route.path);
}
