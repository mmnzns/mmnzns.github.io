# Porting a design export

The site's content is authored in a design tool that exports one inline-styled HTML file
per page (`Website - Main Site/mnmonzones vN/*.dc.html`), with repeating content in JS
arrays inside a trailing `<script>`. This repo is an Astro site with typed data files and
shared components, so a port is a *translation*, not a copy — one design sentence can live
in a component rendered on every page, and a job title lives in two data files at once.

**v19 (2026-09) was a rebuild, not a port.** It replaced the "Bold" design with the
collage language (`Monzones-D-*-V4`), removed the web design and consulting sections (they
moved to craftconceptsdigital.com), and retired the scrapers that read the old layouts.
The next round starts from v19's files; this playbook describes that state.

## Export shapes

A round may ship the plain `.dc.html` files, a `Website standalone/` folder, or both. The
standalone build wraps the same document inside a loader page as one escaped JS string.
`readDesign()` in `scripts/lib/design.mjs` detects and unwraps that, so **every script
accepts either shape**. If a script throws "Could not find the end of the X array" on a
file that clearly contains X, that unwrapping is the first thing to check.

v19's folder also carries `content/thinking/*.md` — the export's copy of the articles,
rendered by its `md.js`. Diff their bodies against `src/content/thinking/` each round:
v19's had restored bullet lists (and one un-flattened two-column comparison) that the
repo's copies had lost. Keep the repo's frontmatter; it carries fields the export's
doesn't.

A launch round may also come with a **handoff folder** (v19: `design_handoff_site_launch/`)
— a README of numbered tasks, final assets and acceptance checks. It outranks the export
where they differ (it fixed the share image, the consent copy and two copy rules), and it
may ask for a PR rather than a push to `main`.

## The recipe

Run from the repo root. The `&` in this repo's absolute path breaks `npm run` on Windows,
and on the Google Drive checkout `node_modules/.bin` arrives as broken symlinks, so invoke
Astro directly.

```bash
D="../Website - Main Site/mnmonzones v20"
node scripts/gen-cases.mjs "$D/Monzones-D-Case-V4.dc.html"   # rewrites src/data/cases.ts
git diff src/data/cases.ts                                    # empty on a clean v19 tree
```

Everything else is hand-maintained from the export — see the table below.

1. **Read the export's own `CLAUDE.md`** and any handoff README first — they carry project
   facts and rules that aren't in `Website MD Repository/`.
1. **Grep the export for `<dc-import name="...">`.** Those are design components and are
   sometimes *not* included. Anything a missing component would have rendered cannot be
   ported faithfully; say so rather than inventing a replacement. (v19 shipped all of
   them: Nav, Cookies, Privacy.)
2. Run `gen-cases`, then **review `git diff`** — that diff *is* the content change; read it
   like a copy review, not like code.
3. **Hand-port the surfaces no generator covers** (list below) against the design pages.
4. Build and verify — words first, then looks:

```bash
node ./node_modules/astro/bin/astro.mjs check
node ./node_modules/astro/bin/astro.mjs build
node scripts/check-copy.mjs "$D" dist
node scripts/check-design.mjs "$D" dist            # all pages, 375 and 1440
node scripts/check-design.mjs "$D" dist --pages about,article --widths 1440 --all
```

   `check-copy` proves the sentences landed. `check-design` renders each export next to its
   built page in the machine's Chrome and reports where they *look* different — see
   "Reading check-design" below. **A port is not done at check-copy green.**

5. Browser pass, at 375, 320 and 1440: the mobile menu (open, Escape, focus return), the
   consent banner (first visit, accept, decline, reopen from the footer), the sound
   toggle, the home chat's reply chips (without submitting — **never test-submit to the
   live Formspree endpoint**), the Work filters and grid/list switch, the Writing chips and
   search, About's skills tabs, certificate filters and pinned career strip.
   **375px has to be a real 375px layout viewport.** Load each page in a 375px-wide iframe
   and assert `documentElement.scrollWidth === clientWidth`; screenshot through the same
   iframe. Headless Chrome's `--window-size=375` lays the page out wider and crops.
6. Commit and push — `main` deploys the live site. Then **prove it landed**:

```bash
node scripts/check-live.mjs dist --wait 600
```

   It fetches every page in `dist/` from mnmonzones.com and compares the hashed `/_astro/*`
   asset names each references. Same names, same build. It is the only deploy check to
   trust.

7. Post-deploy QA is still a person looking at the live site. The scripts shrink the list
   of things left to find; they don't empty it.

## What each script owns

| Script | Reads | Writes |
| --- | --- | --- |
| `gen-cases.mjs` | `Monzones-D-Case-V4.dc.html` | `src/data/cases.ts` (wholesale) |
| `check-copy.mjs` | every `*.dc.html` + `dist/` | nothing — reports design sentences missing from the built site |
| `check-design.mjs` | the `Monzones-D-*` pages + `dist/`, rendered in Chrome | nothing — reports visual differences per page and width (`--json` for the full data) |
| `check-live.mjs` | `dist/` + the live origin | nothing — reports pages whose live asset hashes differ from the build |
| `build-icons.mjs` | `src/assets/brand/mark-full.png` | `public/favicon.ico`, `favicon-32.png`, `apple-touch-icon.png` — re-run when the mark changes |

Retired with v19: `gen-home.mjs`, `gen-about.mjs`, `sync-projects(-apply).mjs` (they read
the Bold layouts, which v19 replaced) and `build-og-image.mjs` (the share card is now one
final image from the handoff).

`check-design` drives the Chrome (or Edge) already installed through `puppeteer-core`; set
`CHROME=/path/to/binary` if it isn't found. The export loads its fonts from Google, so it
needs network access. Its page map matches `-V4` (any `-V<n>`) file names.

Notes on `gen-cases`:

- **Slugs are positional.** It carries an `ORDER` list and throws when the design's lineup
  changes — that throw is the prompt to decide deliberately which slug a new entry is.
- **`TITLE_FIXES`** reconciles job titles the design disagrees with itself about, using
  Professional History as the record. **`SPORTSERVE_FIXES`** keeps "the MSOps payments
  division" (commit 4c7f62f) where v19 says "Payments Operations Division". Remove an
  entry once the design agrees; add one only after checking Professional History and
  flagging it to Miguel.
- It throws rather than write a partial file when an anchor or count goes missing. A throw
  usually means the design's markup shifted — fix the scraper, don't hand-port around it.

## Surfaces no generator covers

Everything outside `cases.ts`. Port these by hand and trust `check-copy` to catch what the
eye misses:

| Design file | Lives in |
| --- | --- |
| `Monzones-D-Home-V4` | `src/pages/index.astro` (templates), `src/data/home.ts` (ledger, teams, notes, cases, steps) |
| `Monzones-D-Work-V4` | `src/data/site.ts` (card title, summary, figure, tags, art), `src/pages/work/index.astro` |
| `Monzones-D-Case-V4` | `cases.ts` (generated) + `src/pages/work/[slug].astro` for chrome and labels |
| `Monzones-D-Writing-V4` | `src/pages/thinking/index.astro`; the post list itself comes from the collection, never from the export's (stale) array |
| `Monzones-D-Article-V4` | `src/pages/thinking/[...slug].astro`; its `POSTS[].dek` is the article's `excerpt` |
| `Monzones-D-About-V4` | `src/pages/about.astro`, `src/data/about.ts` |
| `Monzones-D-Privacy-V4` | `src/pages/privacy.astro` (§03 rewritten for Formspree — see below) |
| `Monzones-D-404-V4` | `src/pages/404.astro` |
| `Monzones-D-Nav-V4` | `src/components/SiteHeader.astro` (header, mobile menu, sound toggle) |
| `Monzones-D-Cookies-V4` | `src/components/ConsentBanner.astro` — its storage contract (`mnm-consent-v1`, `{ analytics, v, ts }`) is shared with `Analytics.astro` and must keep matching |
| footer (every page) | `src/components/SiteFooter.astro` |
| — | `src/config.ts` (site metadata, nav, contact, studio link), `src/content/thinking/*.md` frontmatter |

## Reading check-design

Each page is rendered at each width with `prefers-reduced-motion: reduce` emulated, so
pages are measured finished rather than half-faded. Every visible text node is paired with
its counterpart by normalised text and compared. Findings are grouped by signature and
ranked:

- **HIGH** — a different font family; a size off by 4px or more; a weight off by 200; a
  colour or background far off; a heading or paragraph starting 40px+ from where the
  design puts it; text at opacity 0; horizontal overflow; contrast under 3:1. The exit code
  is 1 while any HIGH remains.
- **MED** — smaller versions of the above; line-height off by 0.1+; text-transform; a long
  design sentence with no visible counterpart; contrast between 3:1 and AA.
- **LOW** — letter-spacing, block widths, spacing rhythm, page height, and anything the
  export itself does.

Read HIGH top to bottom. Two known sources of noise: **pairing** (short strings such as
"01" or "12" pair with a different element — the home method rotator's step numbers are
caught mid-rotation, "12" markets pairs with a mono index) and **the site having newer
content than the export** (the Writing and home lists lead with a post the export
doesn't have, so the lead titles pair across different posts). The many MED
`line-height 1.08 → 1.5` findings on inline `<span>`s are the export leaving
`line-height: normal` where the site's body sets 1.5; they don't move anything. It cannot
see images or anything behind an interaction.

### check-design baseline (v19 + fluid type, 2026-09-25)

| Page | 375 | 1440 | Notes |
| --- | --- | --- | --- |
| home | 13 | 14 | all pairing: the method steps' "01–03" circles caught at different rotation states, and the pill's email (split by `<wbr>`) pairing with the footer's |
| about | 2 | 2 | pairing: the coffee note's email (split by `<wbr>`) pairs with the footer's |
| work | 0 | 0 | — |
| thinking | 2 | 4 | the lead slot is a newer post than the export's; chip colour pairs with a different button |
| privacy | 0 | 0 | — |
| 404 | 0 | 0 | — |
| case | 3 | 3 | "12" (markets, serif stat) pairs with the export's mono "12" |
| article | 0 | 0 | — |

Numbers are HIGH counts. Anything above the baseline on a page you touched is something
that didn't land. When a page is re-ported, bring its row down and update this table in
the same commit.

## Verification baseline

`check-copy.mjs` reports **6 missing** on a clean v20 tree, all intentional (v20 adopted the
MSOps name, so only one Sportserve sentence is left):

1. `Monzones Logos` — the design's own note about the logo sheet, not site copy.
2. The Sportserve case deck — the export says "a dedicated division"; the repo says
   "a dedicated payments division inside MSOps" (`SPORTSERVE_FIXES`).
3. The Case page's "That case study isn't here" fallback — unreachable, because a project
   without a case body fails the build.
4. The home chat's sent reply — the export says an email app opens (`mailto:`); the site
   POSTs to Formspree, so it says the message arrived.
5. Privacy §03's "doesn't store anything … opens your own email app" — same reason; it
   now names Formspree and says submissions may be stored in the United States.
6. The share card's tagline — it's baked into `public/og-image.png`, not page text.

More than these means something didn't land — find it before shipping. If a leftover turns
out to be intentional, update this list in the same commit.

## Ground rules that outrank speed

- **Diff against the design, not the previous export.** The repo has drifted before; a
  small vN-1 → vN diff can hide a page's worth of divergence.
- **Never invent a fact** — no metric, date, client name, job title or company detail that
  isn't in `Website MD Repository/`. Keep qualifiers exactly as written.
- **Design copy is authoritative.** Don't rewrite, tighten or "improve" it in transit. The
  exceptions are the ones recorded here (Formspree, MSOps, full job titles) — each was a
  factual correction, flagged to Miguel.
- When the design contradicts itself or the record (job titles, org names), flag it to
  Miguel rather than silently picking a side.
- **Port the design's intent, not its CSS bugs.** Every round has shipped at least one.
  v19's: client names breaking mid-word in the two-column logo grid at 375, and the email
  address splitting inside its pill on home and About. Port what the rule was clearly for,
  note the departure in a comment beside the fix, and tell Miguel.
- `npm run check && npm run build` green before committing (via the direct `node`
  invocations above); pushing `main` publishes.
