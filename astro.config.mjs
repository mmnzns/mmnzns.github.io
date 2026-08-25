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
  /**
   * URLs from the previous Wix site, which Google still has queued and is
   * crawling into 404s.
   *
   * Static output means these compile to a small HTML file per path carrying a
   * zero-second meta refresh, a canonical pointing at the destination, and
   * noindex — GitHub Pages has no server, so a real 301 is not available. Google
   * treats that as a redirect and passes the signals along; a visitor following
   * an old LinkedIn link lands on the right page instead of a 404.
   *
   * Every mapping below was confirmed by matching the old slug against the
   * article's actual title, not inferred from the URL shape. Wix used three
   * different prefixes over the site's life (/blog/, /post/, /systemscales/) and
   * the same article appears under more than one, which is why there are two
   * entries pointing at build-trust-with-transparent-marketing.
   *
   * The odd punctuation is deliberate and must be preserved: Wix kept full stops
   * inside slugs, turned a straight apostrophe into "-s" ("here-s"), and left a
   * curly one intact ("it’s"). These are the URLs Google actually holds.
   */
  redirects: {
    '/aboutme': '/about/',
    '/writing': '/thinking/',
    '/blog': '/thinking/',

    '/blog/6-strategies-for-leveraging-content-marketing-to-boost-saas-customer-retention':
      '/thinking/content-marketing-saas-retention/',
    '/blog/lifecycle-marketing-is-not-a-traffic-strategy.-it\u2019s-a-revenue-pipeline.':
      '/thinking/lifecycle-is-a-revenue-pipeline/',
    '/blog/your-seo-content-already-works.-here-s-how-to-make-ai-see-it-too.':
      '/thinking/make-ai-see-your-seo-content/',
    '/blog/steal-this-strategy-how-high-trust-saas-companies-practice-transparent-marketing':
      '/thinking/transparent-marketing/',

    '/post/how-ai-rewrote-search-and-what-that-means-for-seo':
      '/thinking/how-ai-rewrote-search/',
    '/post/saas-success-this-is-how-you-can-build-trust-with-transparent-marketing':
      '/thinking/build-trust-with-transparent-marketing/',
    '/post/how-to-write-better-ai-prompts-a-simple-framework-for-powerful-results':
      '/thinking/better-ai-prompts/',

    '/systemscales/saas-success-this-is-how-you-can-build-trust-with-transparent-marketing':
      '/thinking/build-trust-with-transparent-marketing/',
  },

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
