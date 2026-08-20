// @ts-check
import { readdirSync, readFileSync } from 'node:fs';

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { SITE } from './src/config.ts';

/**
 * Publish dates for the articles, keyed by their route.
 *
 * Read out of the frontmatter with fs rather than through `getCollection`,
 * because this config is evaluated before the content layer exists. That makes
 * it the one place in the repo that parses frontmatter by hand — if the shape
 * in src/content.config.ts changes, this needs to change with it.
 */
function articleDates() {
  const dir = new URL('./src/content/thinking/', import.meta.url);
  const dates = new Map();

  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const raw = readFileSync(new URL(file, dir), 'utf8');
    /* Drafts are excluded from the build, so they have no URL to date. */
    if (/^draft:\s*true\s*$/m.test(raw)) continue;

    const match = raw.match(/^date:\s*(\S+)/m);
    if (!match) continue;

    const date = new Date(match[1]);
    if (!Number.isNaN(date.valueOf())) {
      dates.set(`/thinking/${file.replace(/\.md$/, '')}/`, date);
    }
  }

  return dates;
}

const ARTICLE_DATES = articleDates();

// https://astro.build/config
export default defineConfig({
  // `site` is what makes sitemap.xml and canonical URLs come out absolute.
  // Swap this for a custom domain by editing src/config.ts (see README).
  site: SITE.url,
  // A user site (mmnzns.github.io) is served from the domain root, so no `base`
  // is needed. A project site (github.com/mmnzns/<repo>) would need
  // `base: '/<repo>'` here.
  integrations: [
    sitemap({
      /**
       * `lastmod` only where a real date exists — the articles. Google acts on
       * it when it is trustworthy and ignores the whole signal when it is not,
       * so a synthetic build-time stamp on every page (which would mark all 32
       * URLs as changed on every deploy) is worse than no stamp at all.
       *
       * Publish date stands in for last-modified, which is exact until a post
       * is edited. Nothing records edits yet; when the frontmatter grows an
       * `updated` field, read it here in preference.
       */
      serialize(item) {
        const { pathname } = new URL(item.url);
        const date = ARTICLE_DATES.get(pathname);
        return date ? { ...item, lastmod: date.toISOString() } : item;
      },
    }),
  ],
  build: {
    // GitHub Pages serves /about/ from /about/index.html, so directory-style
    // output keeps URLs clean and trailing-slash-consistent.
    format: 'directory',
  },
});
