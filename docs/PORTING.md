# Porting a design export

The site's content is authored in a design tool that exports one inline-styled HTML file
per page (`MAIN WEBSITE FILES/mnmonzones vN/*.dc.html`), with repeating content in JS
arrays inside a trailing `<script>`. This repo is an Astro site with typed data files and
shared components, so a port is a *translation*, not a copy — one design sentence can live
in a component rendered on four pages, and a job title lives in two data files at once.

The v6 port took hours because most of it was done by hand and the drift had to be
*discovered*. The scripts below exist so the next one doesn't. Following this playbook, a
content-only port should be **~20–30 minutes**, most of it reviewing a diff.

## The recipe

Run from the repo root. The `&` in this repo's absolute path breaks `npm run` on Windows,
so invoke Astro directly.

```bash
D="../MAIN WEBSITE FILES/mnmonzones v7"   # or wherever the new export landed
node scripts/gen-cases.mjs      "$D/Monzones-D-Case.dc.html"
node scripts/gen-home.mjs       "$D/Monzones-D-Paper.dc.html"
node scripts/gen-consulting.mjs "$D/Monzones-D-Consulting.dc.html"
node scripts/gen-about.mjs      "$D/Monzones-D-About.dc.html"
node scripts/sync-projects.mjs  "$D/Monzones-D-Work.dc.html"          # report only
node scripts/sync-projects-apply.mjs "$D/Monzones-D-Work.dc.html"     # then apply
```

1. **Read the export's own `CLAUDE.md`** (the design folder ships one with project facts).
2. Run the six commands above, then **review `git diff`** — that diff *is* the content
   change; read it like a copy review, not like code.
3. **Hand-check the surfaces no generator covers** (list below) against the design pages.
4. Build and verify:

```bash
node ./node_modules/astro/bin/astro.mjs check
node ./node_modules/astro/bin/astro.mjs build
node scripts/check-copy.mjs "../MAIN WEBSITE FILES/mnmonzones v7" dist
```

5. Browser sanity pass (the dev server, or `dist/` served locally): home shelf tabs, the
   consulting practice filter, one case page, about. At 375px and 1440px.
6. Commit and push — `main` deploys the live site.

## What each script owns

| Script | Reads | Writes |
| --- | --- | --- |
| `gen-cases.mjs` | `Monzones-D-Case.dc.html` | `src/data/cases.ts` (wholesale) |
| `gen-home.mjs` | `Monzones-D-Paper.dc.html` | `src/data/home.ts` (wholesale) |
| `gen-consulting.mjs` | `Monzones-D-Consulting.dc.html` | `src/data/consulting.ts` (wholesale) |
| `gen-about.mjs` | `Monzones-D-About.dc.html` | `src/data/about.ts` (wholesale) |
| `sync-projects(-apply).mjs` | `Monzones-D-Work.dc.html` | `title`/`problem`/`tags` in `src/data/site.ts` only |
| `check-copy.mjs` | every `*.dc.html` + `dist/` | nothing — reports design sentences missing from the built site |

Never hand-edit prose in a generated file; edit the design and re-run. Notes worth knowing:

- **Repo-only fields survive regeneration by design.** `category` and the before/after
  metric shape in `site.ts` have no design equivalent (that's why sync-projects patches
  rather than regenerates); `gen-home` reads `category` back out of `site.ts` by slug.
- **Slugs are positional where the design has none.** `gen-cases` and `gen-home` carry an
  `ORDER` list and throw when the design's lineup changes — that throw is the prompt to
  decide deliberately which slug a new or moved entry is.
- **`TITLE_FIXES` in `gen-cases.mjs`** reconciles job titles the design export disagrees
  with itself about, using `Website MD Repository/Professional History` as the record.
  Remove an entry once the design agrees with itself; add one only after checking
  Professional History and flagging it to Miguel — a title is a claim about his
  employment history, not formatting.
- The generators throw rather than write a partial file when an anchor or count goes
  missing. A throw usually means the design's markup shifted — fix the scraper, don't
  hand-port around it.

## Surfaces the generators do NOT cover

One-off prose living in templates. Check these by eye against the design (and trust
`check-copy` to catch what the eye misses):

- `src/pages/index.astro` — hero (eyebrow, headline, tagline, availability line), intro
  paragraphs, section headings/eyebrows, tab and button labels
- `src/pages/consulting.astro` — intro paragraphs, section headings, the fixed-fee note,
  the dark band's headline
- `src/pages/work/index.astro`, `src/pages/thinking/index.astro`, `src/pages/404.astro` —
  headings and ledes
- `src/components/ContactBand.astro` — title, body, availability line (deliberately not
  read from `SITE`; see the comment there)
- `src/components/CaseDiagram.astro` — per-case SVG diagrams and captions; a new or
  re-scoped case needs its diagram ported by hand
- `src/content/thinking/*.md` — article frontmatter (`title`, `excerpt`, `tag`, dates)
- `src/config.ts` — site metadata, nav, contact details

## Verification baseline

`check-copy.mjs` currently reports **2 missing** on a clean port, both intentional:

1. The Case page's "case not found" fallback — unreachable here, because a project
   without a case body fails the build instead of rendering an empty page.
2. "Your SEO content already works. Make AI see it too." — a design-side article title
   the repo's content collection words slightly differently.

More than the expected leftovers means something didn't land — find it before shipping.
If a leftover turns out to be intentional, update this list in the same commit.

## Ground rules that outrank speed

- **Diff against the design, not the previous export.** The repo has drifted before;
  a small vN-1 → vN diff can hide a page's worth of divergence.
- **Never invent a fact** — no metric, date, client name, job title or company detail
  that isn't in `Website MD Repository/`. Keep qualifiers exactly as written (`~38%`
  stays `~38%`).
- **Design copy is authoritative.** Don't rewrite, tighten or "improve" it in transit.
- When the design contradicts itself (it has: job titles, org names, date formats),
  flag it to Miguel rather than silently picking a side.
- `npm run check && npm run build` green before committing (via the direct `node`
  invocations above); pushing `main` publishes.
