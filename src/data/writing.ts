/**
 * Topics for the writing collection.
 *
 * The list is the single source of truth: it drives the frontmatter schema in
 * src/content.config.ts, the filter chips, and the colour on every article
 * card. Adding a topic here is the only edit needed to introduce one.
 */

/** In the order the v19 filter chips show them. */
export const TAGS = ['Lifecycle', 'AI & automation', 'Search', 'Positioning'] as const;

export type Tag = (typeof TAGS)[number];

const ACCENTS: Record<Tag, string> = {
  Lifecycle: 'var(--blue)',
  'AI & automation': 'var(--green)',
  Search: 'var(--amber)',
  Positioning: 'var(--red)',
};

export function tagAccent(tag: Tag): string {
  return ACCENTS[tag];
}
