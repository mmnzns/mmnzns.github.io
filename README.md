# mmnzns.github.io

Personal portfolio site, built with [Astro](https://astro.build) and deployed to GitHub Pages
at **https://mmnzns.github.io**.

This is currently a scaffold: the build, deploy pipeline, layout and metadata plumbing are in
place, with placeholder content in the pages.

## Requirements

- Node.js 22.12 or newer (`.nvmrc` pins the major version — `nvm use` picks it up)
- npm 9.6.5 or newer

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve `dist/` locally, as it will be served in production |
| `npm run check` | Astro + TypeScript diagnostics across `.astro` and `.ts` files |

## Project structure

```
public/              Served verbatim at the site root (favicon, robots.txt, images)
src/
  config.ts          Site title, description, nav and social links — edit here first
  layouts/           Page shells; BaseLayout owns <head>, header and footer
  pages/             File-based routing: src/pages/about.astro -> /about/
  styles/global.css  Design tokens and baseline styles
astro.config.mjs     Astro config (site URL, integrations, build format)
```

Routing is file-based: adding `src/pages/uses.astro` publishes `/uses/`. `src/pages/404.astro`
becomes the site's 404 page, which GitHub Pages serves automatically for unmatched paths.

## Deployment

`.github/workflows/deploy.yml` builds and publishes on every push to `main`, using GitHub's
official Pages actions (no `gh-pages` branch involved). `.github/workflows/ci.yml` runs the
same type-check and build on pull requests without deploying.

### One-time setup on GitHub

The workflow can't publish until Pages is switched to the Actions source:

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment → Source**, select **GitHub Actions**.

That's it — the next push to `main` deploys. Runs are visible under the **Actions** tab, and
the live URL appears on the `github-pages` environment.

Note that this is a *user site* (`<username>.github.io`), so it is always served from the domain
root and needs no `base` path in `astro.config.mjs`. It also must be a public repository for
Pages to serve it on a free account.

## Moving to a custom domain

1. Add a `public/CNAME` file containing just the domain, e.g. `miguelmonzones.com`.
2. Update `SITE.url` in `src/config.ts` and the `Sitemap:` line in `public/robots.txt`.
3. At your DNS provider, point the apex domain at GitHub's Pages IPs with four `A` records
   (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), and point
   `www` at `mmnzns.github.io` with a `CNAME` record.
4. In **Settings → Pages**, set the custom domain and enable **Enforce HTTPS** once the
   certificate is issued.

## To do

- [ ] Add a 1200x630 link-preview image at `public/og-image.png` and set `SITE.ogImage`
- [ ] Replace the placeholder favicon in `public/favicon.svg`
- [ ] Fill in real content and design
