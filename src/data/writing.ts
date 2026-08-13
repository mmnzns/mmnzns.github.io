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

/**
 * Written, but not yet published here. They appear in the archive list greyed
 * out and labelled, which is more honest than a gap — the pieces exist, they
 * just aren't posted. Delete an entry the moment its Markdown file lands in
 * src/content/thinking/, or the same title will show up twice.
 */
export const PENDING: readonly { title: string; tag: Tag; year: string }[] = [
  { title: 'The New SEO Playbook: Thriving in the Age of AI', tag: 'Search', year: '2025' },
  { title: 'SEO vs GEO', tag: 'Search', year: '2025' },
];
