import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

/**
 * Distance from the viewport top at which a section counts as reached. Anchor jumps place
 * headings 80px below the top (64px navbar plus margin); the rest absorbs late layout shifts.
 */
const DEFAULT_OFFSET = 140;

/**
 * The last section in `ids` (document order) whose top is at or above `offset`.
 * At the bottom of the page the last section wins, as short final sections never reach the offset.
 */
export function activeSectionId(
  ids: readonly string[],
  topOf: (id: string) => number | null,
  offset: number,
  atBottom: boolean
): string | null {
  const sections = ids.flatMap((id) => {
    const top = topOf(id);
    return top === null ? [] : [{ id, top }];
  });
  if (atBottom) {
    return sections.at(-1)?.id ?? null;
  }
  let active: string | null = null;
  for (const section of sections) {
    if (section.top > offset) {
      break;
    }
    active = section.id;
  }
  return active;
}

// Hidden sections, e.g. inside a closed <details>, have no box and are skipped.
function viewportTopOf(id: string): number | null {
  const element = document.getElementById(id);
  if (!element || element.getClientRects().length === 0) {
    return null;
  }
  return element.getBoundingClientRect().top;
}

function isAtPageBottom(): boolean {
  const root = document.documentElement;
  return window.scrollY > 0 && window.innerHeight + window.scrollY >= root.scrollHeight - 2;
}

/** Id of the section currently read, updated on scroll and resize. */
export function useScrollSpy(ids: readonly string[], offset = DEFAULT_OFFSET): Ref<string | null> {
  const activeId = ref<string | null>(null);
  let frame = 0;

  function update() {
    frame = 0;
    activeId.value = activeSectionId(ids, viewportTopOf, offset, isAtPageBottom());
  }

  function scheduleUpdate() {
    if (frame === 0) {
      frame = requestAnimationFrame(update);
    }
  }

  onMounted(() => {
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    update();
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", scheduleUpdate);
    cancelAnimationFrame(frame);
  });

  return activeId;
}
