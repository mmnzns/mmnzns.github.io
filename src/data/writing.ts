/**
 * Topics for the writing collection.
 *
 * The list is the single source of truth: it drives the frontmatter schema in
 * src/content.config.ts, the filter chips, and the colour on every article
 * card. Adding a topic here is the only edit needed to introduce one.
 */

export const TAGS = ['Lifecycle', 'Search', 'AI & automation', 'Positioning'] as const;

export type Tag = (typeof TAGS)[number];

const ACCENTS: Record<Tag, string> = {
  Lifecycle: 'var(--sun)',
  Search: 'var(--sky)',
  'AI & automation': 'var(--moss)',
  Positioning: 'var(--coral)',
};

export function tagAccent(tag: Tag): string {
  return ACCENTS[tag];
}
