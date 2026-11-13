import { preferredScrollBehavior } from "@/composables/useHashNavigation";

export type ScrollAxis = "x" | "y";

const EDGES = {
  x: { start: "left", end: "right" },
  y: { start: "top", end: "bottom" },
} as const;

/**
 * Scrolls only the container, never the page, so the item is visible with `margin` space,
 * like `scrollIntoView({ block: "nearest" })` limited to one ancestor.
 */
export function revealInContainer(
  container: HTMLElement,
  item: HTMLElement,
  axis: ScrollAxis,
  margin = 0
): void {
  const { start, end } = EDGES[axis];
  const box = container.getBoundingClientRect();
  const target = item.getBoundingClientRect();
  let delta = 0;
  if (target[start] < box[start] + margin) {
    delta = target[start] - box[start] - margin;
  } else if (target[end] > box[end] - margin) {
    delta = target[end] - box[end] + margin;
  }
  if (delta !== 0) {
    container.scrollBy({ [start]: delta, behavior: preferredScrollBehavior() });
  }
}
