const longFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});
const shortFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function parse(iso: string): Date {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: "${iso}"`);
  }
  return date;
}

/** "2026-11-13" -> "November 13, 2026" */
export function formatDate(iso: string): string {
  return longFormat.format(parse(iso));
}

/** "2026-11-13" -> "Nov 13" */
export function formatShortDate(iso: string): string {
  return shortFormat.format(parse(iso));
}
