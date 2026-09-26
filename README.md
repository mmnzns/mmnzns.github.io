# mmnzns.github.io

Personal portfolio and writing site for Miguel Monzones — lifecycle and GTM strategist,
Vancouver. Built with [Astro](https://astro.build), fully static, served by Cloudflare at
**https://mnmonzones.com**.

Services (websites, lifecycle, automation) live on the studio's own site,
[Craft Concepts Digital](https://craftconceptsdigital.com/); this one is the portfolio.

## Requirements

- Node.js 22.12 or newer (`.nvmrc` pins the major version — `nvm use` picks it up)
- npm 9.6.5 or newer

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
```

> **Windows note:** npm's script launcher breaks if the repo lives under a folder whose name
> contains `&` (it truncates the path at the ampersand). Run
> `node ./node_modules/astro/bin/astro.mjs dev` instead, or move the checkout. CI runs on
> Linux and is unaffected.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve `dist/` locally, as it will be served in production |
| `npm run check` | Astro + TypeScript diagnostics across `.astro` and `.ts` files |

`npm run check && npm run build` is what CI gates on. Run it before committing.

## Project structure

```
public/              Served verbatim at the site root (share card, sound loop, favicons)
  fonts/             Self-hosted Instrument Serif, Bricolage Grotesque, Courier Prime
src/
  assets/            Images processed at build time — brand, collage art, client logos
  components/        Site header + mobile menu, footer, consent banner, analytics, motion
  config.ts          Site metadata, nav, contact details, studio link, form endpoint
  content/thinking/  Articles as Markdown; schema in src/content.config.ts
  data/              Typed content: projects, case bodies, page copy
  layouts/           BaseLayout owns <head> and the shared chrome
  pages/             File-based routing: src/pages/about.astro -> /about/
  styles/global.css  Design tokens and shared primitives
astro.config.mjs     Site URL, integrations, legacy and service redirects
wrangler.jsonc       Cloudflare static-assets config — keep it (see CLAUDE.md)
```

Routing is file-based, and `build.format: 'directory'` means URLs end in a trailing slash
(`/about/`). `src/pages/404.astro` becomes the site's 404 page.

## The design

Warm paper and ink, collage-style: torn-paper cards, tape, tilted photos. Instrument Serif
for display, Bricolage Grotesque for text, Courier Prime for labels. Four accents each map
to a work category — blue/lifecycle, green/AI, amber/web, red/leadership — declared once in
`CATEGORY_ACCENT` (`src/data/site.ts`).

The palette is light only, on purpose. No framework ships to the browser: interactive
pieces render every state server-side and small vanilla scripts toggle between them.

See `CLAUDE.md` for the conventions in full, including the content and voice rules, and
`docs/PORTING.md` for bringing in a new design export.

## Publishing an article

Add a Markdown file to `src/content/thinking/` with this frontmatter:

```yaml
---
title: "The headline"
date: 2026-02-24
tag: "Lifecycle"        # Lifecycle | Search | AI & automation | Positioning
excerpt: "One or two sentences — the article's deck and its meta description."
dek: "Optional shorter line for the Writing page cards."
image: "../../assets/art/<name>.webp"   # optional hero illustration
imageAlt: "What the illustration shows"
draft: false            # true keeps it out of the build
---
```

Then write the body in plain Markdown — `##` headings feed the article's contents rail.
Reading time is computed from word count. The Writing page, home page, sitemap, RSS feed and
both `llms` files all pick the new post up by themselves. Commit to `main` and Cloudflare
publishes it.

## Deployment

Cloudflare's git integration builds and deploys every push to `main` as static assets
(`wrangler.jsonc`). `.github/workflows/ci.yml` runs the type-check and build on pull
requests. After a push, `node scripts/check-live.mjs dist --wait 600` confirms the live
site is serving this build.

This is a user site served from the domain root, so it needs no `base` path in
`astro.config.mjs`.

## Discoverability

All generated from the same content, so none of them can drift:

| Route | What it is |
| --- | --- |
| `/sitemap-index.xml` | Every page. Articles carry `lastmod` from their publish date. |
| `/robots.txt` | `src/pages/robots.txt.ts`. Allows everything, then names the AI crawlers explicitly. |
| `/llms.txt` | A plain-text map of the site — pages, work, every article with its excerpt. |
| `/llms-full.txt` | Every published article's full Markdown in one file. |
| `/rss.xml` | The article feed. |
| Old URLs | `astro.config.mjs` maps the old Wix paths onto current pages and sends `/web-design/` and `/consulting/` to craftconceptsdigital.com — real 301s via `dist/_redirects`. |

Every page shares one link-preview image, `public/og-image.png`.

## One-off generator

`node scripts/build-icons.mjs` regenerates `public/favicon.ico`, `favicon-32.png` and
`apple-touch-icon.png` from `src/assets/brand/mark-full.png`. Re-run it when the mark
changes.
