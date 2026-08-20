/** Shared formatting helpers for article metadata. */

const DATE_FORMAT = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

/** "Feb 24, 2026" — UTC so the date never shifts with the build machine's zone. */
export function formatDate(date: Date): string {
  return DATE_FORMAT.format(date);
}

/** Words in a Markdown body. Also what schema.org's wordCount reports. */
export function wordCount(body: string): number {
  return body.trim().split(/\s+/).length;
}

/** Rounded minutes at 225 wpm, the usual estimate for online long-form. */
export function readingTime(body: string): number {
  return Math.max(1, Math.round(wordCount(body) / 225));
}
