// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { SITE } from './src/config.ts';

// https://astro.build/config
export default defineConfig({
  // `site` is what makes sitemap.xml and canonical URLs come out absolute.
  // Swap this for a custom domain by editing src/config.ts (see README).
  site: SITE.url,
  // A user site (mmnzns.github.io) is served from the domain root, so no `base`
  // is needed. A project site (github.com/mmnzns/<repo>) would need
  // `base: '/<repo>'` here.
  integrations: [sitemap()],
  build: {
    // GitHub Pages serves /about/ from /about/index.html, so directory-style
    // output keeps URLs clean and trailing-slash-consistent.
    format: 'directory',
  },
});
