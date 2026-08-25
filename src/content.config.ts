import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Astro 7 deprecates re-exporting `z` from astro:content — import it directly.
import { z } from 'zod';
import { TAGS } from './data/writing';

/**
 * Articles live as Markdown files in src/content/thinking/.
 *
 * Publishing a new one means adding a file with this frontmatter — no database,
 * no CMS. The schema is validated at build time, so a typo in a date or an
 * unknown tag fails the build rather than shipping a broken page.
 */
const thinking = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/thinking' }),
  schema: z.object({
    title: z.string(),
    /**
     * Shorter headline for the home page's card grid, where the full title
     * would wrap into a wall. Falls back to `title` when absent; the article
     * page and the writing index always use the full title.
     */
    shortTitle: z.string().optional(),
    date: z.coerce.date(),
    excerpt: z.string(),
    /** Drives the filter chips and the card's accent colour. */
    tag: z.enum(TAGS),
    /** Promotes a post to the large card at the top of the writing index. */
    featured: z.boolean().default(false),
    /** Set true to keep a post out of the index while you work on it. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { thinking };
