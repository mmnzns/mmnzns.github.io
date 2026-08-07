# Working in this repository

Personal portfolio site — Astro 7 (static output) + TypeScript, deployed to GitHub Pages.

## Commands

- `npm run dev` — dev server on port 4321
- `npm run build` — static build into `dist/`
- `npm run check` — Astro/TypeScript diagnostics; this is what CI gates on

Run `npm run check && npm run build` before committing. There is no test suite or linter
beyond that.

## Conventions

- **Site metadata lives in `src/config.ts`.** Title, description, nav and social links are
  read from there by `BaseLayout`. Don't hardcode them in pages or components.
- **`BaseLayout.astro` owns `<head>`.** Pages pass `title` and `description` as props rather
  than writing their own meta tags. Canonical URL, Open Graph and Twitter tags are derived.
- **Styling is plain CSS with tokens** in `src/styles/global.css` (`--bg`, `--text`,
  `--accent`, …), with a `prefers-color-scheme: dark` override block. When adding colors,
  define a token in both blocks rather than inlining a hex value.
- **Components are `.astro` by default.** Astro ships zero client JS unless a framework
  component is hydrated, which is the point of the stack choice — reach for a `client:*`
  directive only when something genuinely needs interactivity.
- **Routing is file-based** under `src/pages/`; `build.format: 'directory'` means routes end
  in a trailing slash (`/about/`). Keep internal links trailing-slashed to avoid redirects.

## Deployment constraints

- This is a **user site** served from the domain root — never set `base` in
  `astro.config.mjs`.
- Output must stay fully static. GitHub Pages has no server runtime, so SSR adapters,
  API routes and on-demand rendering are not options.
- `main` is the deploy branch: pushing to it publishes the live site.
