import { nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

export function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

/**
 * Navigates to an in-page anchor through the router, so its scrollBehavior applies.
 * The query stays, and the DOM updates first, so a target the caller just revealed is found.
 */
export function useHashNavigation(): (hash: string) => Promise<void> {
  const router = useRouter();
  const route = useRoute();

  return async (hash: string) => {
    // The router ignores a push to the current location, so scroll to the target again directly.
    if (route.hash === hash) {
      await nextTick();
      const id = hash.slice(1);
      const target = document.getElementById(id);
      if (!target) {
        throw new Error(`No element with id "${id}" to scroll to`);
      }
      target.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
      return;
    }
    const failure = await router.push({ query: route.query, hash });
    if (failure) {
      throw new Error(`Navigation to "${hash}" failed: ${failure.message}`);
    }
  };
}
