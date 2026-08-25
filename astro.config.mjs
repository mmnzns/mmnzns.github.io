// @ts-check
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

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

/**
 * URLs from the previous Wix site, which Google still has queued and is
 * crawling into 404s.
 *
 * This map is consumed twice. Astro's `redirects` compiles each entry to a
 * small HTML file carrying a zero-second meta refresh, a canonical and noindex
 * — the best GitHub Pages can do with no server, and something Google does
 * treat as a redirect. `redirectsFile` below turns the same map into a
 * `_redirects` file, which Cloudflare answers with an actual 301. Add an entry
 * once and whichever host is serving the domain picks it up.
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
const LEGACY_URLS = {
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
};

/**
 * Writes `_redirects` alongside the built pages.
 *
 * Cloudflare reads that file and answers with a real 301 before it looks for a
 * file to serve - "redirects are always followed, regardless of whether or not
 * an asset matches the incoming request" - so there these win. GitHub Pages has
 * no idea the file exists, and falls back to the meta-refresh pages Astro
 * generates from this same map. One source of truth, correct on both hosts,
 * which is what lets the domain move without a third state in between.
 *
 * Two details, both established by running the thing rather than reading about
 * it (`wrangler dev`, then curl for the status code):
 *
 * Every path is emitted with and without a trailing slash. Matching is literal,
 * and an unmatched path falls through to the asset - so `/post/x` answered 301
 * while `/post/x/` quietly answered 200, serving the meta-refresh stub and
 * throwing away the reason for being on Cloudflare at all. Google holds both
 * spellings.
 *
 * Sources are percent-encoded, and only percent-encoded. Cloudflare normalises
 * a non-ASCII path before it consults this file, so a rule carrying a literal
 * curly apostrophe never fires - the request has already become `%E2%80%99` by
 * the time matching happens. Search Console displays these raw, which is what
 * makes the encoded form look wrong when it is the only one that works.
 *
 * @param {Record<string, string>} map
 * @returns {import('astro').AstroIntegration}
 */
function redirectsFile(map) {
  return {
    name: 'legacy-redirects-file',
    hooks: {
      'astro:build:done'({ dir, logger }) {
        const lines = [];

        for (const [from, to] of Object.entries(map)) {
          const source = encodeURI(from);
          lines.push(`${source} ${to} 301`);
          lines.push(`${source}/ ${to} 301`);
        }

        writeFileSync(new URL('_redirects', dir), `${lines.join('\n')}\n`, 'utf8');
        logger.info(`_redirects - ${lines.length} rules`);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // `site` is what makes sitemap.xml and canonical URLs come out absolute.
  // Swap this for a custom domain by editing src/config.ts (see README).
  site: SITE.url,
  // A user site (mmnzns.github.io) is served from the domain root, so no `base`
  // is needed. A project site (github.com/mmnzns/<repo>) would need
  // `base: '/<repo>'` here.
  redirects: LEGACY_URLS,

  integrations: [
    redirectsFile(LEGACY_URLS),
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
