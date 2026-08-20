# mmnzns.github.io

Personal portfolio site for Miguel Monzones — lifecycle and GTM strategist, Vancouver. Built
with [Astro](https://astro.build), fully static, deployed to GitHub Pages and served at
**https://mnmonzones.com**.

## Requirements

- Node.js 22.12 or newer (`.nvmrc` pins the major version — `nvm use` picks it up)
- npm 9.6.5 or newer

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
```

> **Windows note:** npm's script launcher breaks if the repo lives under a folder whose name
> contains `&` (it truncates the path at the ampersand). If `npm run dev` fails with
> `Cannot find module ...astro\bin\astro.mjs`, move the checkout somewhere like
> `C:\Users\<you>\projects\mmnzns.github.io`. CI runs on Linux and is unaffected.

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
public/              Served verbatim at the site root
  fonts/             Self-hosted General Sans (400/500/600)
src/
  assets/            Images processed at build time (portrait, client logos)
  components/        Header, footer, contact form, logo marquee, case diagrams
  config.ts          Site metadata, nav, contact details, form endpoint — edit here first
  content/thinking/  Articles as Markdown; schema in src/content.config.ts
  data/              Typed content: projects, case bodies, page copy
  layouts/           BaseLayout owns <head> and wraps every page
  pages/             File-based routing: src/pages/about.astro -> /about/
  styles/global.css  Design tokens and shared primitives
astro.config.mjs     Astro config (site URL, integrations, build format)
```

Routing is file-based, and `build.format: 'directory'` means URLs end in a trailing slash
(`/about/`). `src/pages/404.astro` becomes the site's 404 page, which GitHub Pages serves
automatically for unmatched paths.

## The design

One typeface (General Sans) does the interface work; Newsreader is reserved for article body
copy so long-form reads as a different surface. Four accent colours each map to a work
category — coral/lifecycle, sky/leadership, moss/AI, sun/web — declared once in
`CATEGORY_ACCENT` (`src/data/site.ts`).

The palette is light only, on purpose. No framework ships to the browser: interactive pieces
render every state server-side and small vanilla scripts toggle between them.

See `CLAUDE.md` for the conventions in full, including the content and voice rules.

## Publishing an article

Add a Markdown file to `src/content/thinking/` with this frontmatter:

```yaml
---
title: "The headline, in sentence or title case"
date: 2026-02-24
tag: "Lifecycle"        # Lifecycle | Search | AI & automation | Positioning
excerpt: "One or two sentences, used on cards and as the meta description."
featured: false         # true promotes it to the big card on /thinking/
draft: false            # true keeps it out of the build
---
```

Then write the body in plain Markdown — `##` headings feed the article's contents rail
automatically. Reading time is computed from word count, so don't type it. Commit to `main`
and the Actions workflow publishes in about two minutes. Images go in `public/images/` and
are referenced as `/images/name.jpg`.

## Deployment

`.github/workflows/deploy.yml` builds and publishes on every push to `main`, using GitHub's
official Pages actions (no `gh-pages` branch involved). `.github/workflows/ci.yml` runs the
same type-check and build on pull requests without deploying.

### One-time setup on GitHub

The workflow can't publish until Pages is switched to the Actions source:

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment → Source**, select **GitHub Actions**.

Runs are visible under the **Actions** tab, and the live URL appears on the `github-pages`
environment.

This is a *user site* (`<username>.github.io`), so it is always served from the domain root
and needs no `base` path in `astro.config.mjs`. It also must be a public repository for Pages
to serve it on a free account.

## The custom domain

Already in place — `public/CNAME` holds `mnmonzones.com`, and `SITE.url` points at it. The
steps below are the record of how it is wired, for the next time it moves.

1. Add a `public/CNAME` file containing just the domain, e.g. `mnmonzones.com`.
2. Update `SITE.url` in `src/config.ts` and the `Sitemap:` line in `public/robots.txt`.
3. At your DNS provider, point the apex domain at GitHub's Pages IPs with four `A` records
   (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), and point
   `www` at `mmnzns.github.io` with a `CNAME` record.
4. In **Settings → Pages**, set the custom domain and enable **Enforce HTTPS** once the
   certificate is issued.

## To do

- [ ] Add a 1200x630 link-preview image at `public/og-image.png` and set `SITE.ogImage` —
      until then, links shared to LinkedIn or Slack unfurl without an image
