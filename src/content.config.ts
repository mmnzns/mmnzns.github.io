import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Astro 7 deprecates re-exporting `z` from astro:content — import it directly.
import { z } from 'zod';

/**
 * Articles live as Markdown files in src/content/thinking/.
 *
 * Publishing a new one means adding a file with these four frontmatter fields —
 * no database, no CMS. The schema below is validated at build time, so a typo
 * in a date or a missing title fails the build rather than shipping broken.
 */
const thinking = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/thinking' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    /** Set true to keep a post out of the index while you work on it. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { thinking };
