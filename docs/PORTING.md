# Porting a design export

The site's content is authored in a design tool that exports one inline-styled HTML file
per page (`MAIN WEBSITE FILES/mnmonzones vN/*.dc.html`), with repeating content in JS
arrays inside a trailing `<script>`. This repo is an Astro site with typed data files and
shared components, so a port is a *translation*, not a copy — one design sentence can live
in a component rendered on four pages, and a job title lives in two data files at once.

The v6 port took hours because most of it was done by hand and the drift had to be
*discovered*. The scripts below exist so the next one doesn't. Following this playbook, a
content-only port should be **~20–30 minutes**, most of it reviewing a diff.

## Two export shapes — both work

A round may ship either the plain `.dc.html` files, a `Website standalone/` folder, or
both (v6 had both; v7 had only standalone). The standalone build wraps the same document
inside a loader page as one escaped JS string, so the files are 10–40× larger and the data
arrays aren't greppable. `readDesign()` in `scripts/lib/design.mjs` detects and unwraps
that, so **every script accepts either shape** — just point them at whichever folder
exists. If a generator ever throws "Could not find the end of the X array" on a file that
clearly contains X, that unwrapping is the first thing to check.

## The recipe

Run from the repo root. The `&` in this repo's absolute path breaks `npm run` on Windows,
so invoke Astro directly.

```bash
# v8+ live in "Website - Main Site/" and suffix every page with -Bold;
# earlier rounds lived in "MAIN WEBSITE FILES/" without the suffix. Only the
# top level of a version folder is current — the nested "Website bold/",
# "Website standalone/" and "mnmonzones-site/" directories are older
# snapshots of the same pages. The scripts take paths, so only D changes.
D="../Website - Main Site/mnmonzones v15"
node scripts/gen-cases.mjs      "$D/Monzones-D-Case-Bold.dc.html"
node scripts/gen-home.mjs       "$D/Monzones-D-Bold.dc.html"
node scripts/gen-about.mjs      "$D/Monzones-D-About-Bold.dc.html"
node scripts/sync-projects.mjs  "$D/Monzones-D-Work-Bold.dc.html"          # report only
node scripts/sync-projects-apply.mjs "$D/Monzones-D-Work-Bold.dc.html"     # then apply
```

**`gen-consulting.mjs` was deleted in v13.** It read the
single-page `Monzones-D-Consulting-Bold` export, which v13 replaced with the
four-file `Monzones-C-*` series. `src/data/consulting.ts` and
`src/data/web-design.ts` are now maintained by hand from the C- and W-series
files; they are the only data files without a generator. Run `check-copy`
rather than trusting a generator to catch drift in them.

**The two service sections are four pages each.** v13's `Monzones-C-*` map to
`/consulting/{,services,process,results}/` and `Monzones-W-*` to
`/web-design/{,work,process,pricing}/`. Each section has one layout owning its
sub-brand (`ConsultingLayout.astro`, `WebDesignLayout.astro`) and shared
classes in an `is:global` block, because scoped styles can't reach markup
passed through a `<slot />`.

1. **Read the export's own `CLAUDE.md`** if it ships one (v6 did, v7 didn't) — it carries
   project facts that aren't in `Website MD Repository/`.
1. **Grep the export for `<dc-import name="...">`.** Those are design components, and they
   are frequently *not* included in the export — v7 referenced `Monzones-D-Nav` and
   `Monzones-D-Cookies`, neither of which shipped. Anything a missing component would have
   rendered cannot be ported faithfully; say so rather than inventing a replacement.
2. Run the six commands above, then **review `git diff`** — that diff *is* the content
   change; read it like a copy review, not like code.
3. **Hand-check the surfaces no generator covers** (list below) against the design pages.
4. Build and verify — words first, then looks:

```bash
node ./node_modules/astro/bin/astro.mjs check
node ./node_modules/astro/bin/astro.mjs build
node scripts/check-copy.mjs "$D" dist
node scripts/check-design.mjs "$D" dist            # all pages, 375 and 1440
node scripts/check-design.mjs "$D" dist --pages web-design,web-design-pricing --widths 1440 --all
```

   `check-copy` proves the sentences landed. `check-design` renders each export next
   to its built page in the machine's Chrome and reports where they *look* different
   — see "Reading check-design" below. **A port is not done at check-copy green.**
   Every visual regression this site has shipped (the old nav on the web design page,
   body text inheriting 17px/1.65, coral headings rendering ink, the homepage sitting
   flush left) passed check-copy and would have been a HIGH finding in check-design.

5. Browser sanity pass (the dev server, or `dist/` served locally): home shelf tabs and
   method tabs, the case page's brief/read toggle, the consulting practice tabs, the
   pricing picker and its hand-built/platform switch, one case page, about. At 375px and
   1440px. **Click between the pages of a service section and watch the header** — the two
   web design navs used to differ in padding, width and height, and the shift was only
   visible in motion. `WebDesignNav.astro` is now the single nav for all four.
   **375px has to be a real 375px layout viewport.** Load each page in a 375px-wide
   iframe and assert `documentElement.scrollWidth === innerWidth`; screenshot through the
   same iframe. Headless Chrome's `--window-size=375` lays the page out wider and crops,
   so it reports overflow on pages that are fine and hides the real thing.
6. Commit and push — `main` deploys the live site. Then **prove it landed**:

```bash
node scripts/check-live.mjs dist --wait 600
```

   It fetches every page in `dist/` from mnmonzones.com and compares the hashed
   `/_astro/*` asset names each references. Same names, same build. It polls every
   15 s until they match or the wait runs out, and it is the only deploy check to
   trust — one-off greps of a single CSS bundle have said "not live" about a change
   that was live, and "live" about one that wasn't.

7. Post-deploy QA is still a person looking at the live site. The scripts shrink the
   list of things left to find; they don't empty it.

## What each script owns

| Script | Reads | Writes |
| --- | --- | --- |
| `gen-cases.mjs` | `Monzones-D-Case.dc.html` | `src/data/cases.ts` (wholesale) |
| `gen-home.mjs` | `Monzones-D-Paper.dc.html` | `src/data/home.ts` (wholesale) |
| `gen-about.mjs` | `Monzones-D-About.dc.html` | `src/data/about.ts` (wholesale) |
| `sync-projects(-apply).mjs` | `Monzones-D-Work.dc.html` | `title`/`problem`/`tags` in `src/data/site.ts` only |
| `check-copy.mjs` | every `*.dc.html` + `dist/` | nothing — reports design sentences missing from the built site |
| `check-design.mjs` | every `*.dc.html` + `dist/`, rendered in Chrome | nothing — reports visual differences per page and width (`--json` for the full data) |
| `check-live.mjs` | `dist/` + the live origin | nothing — reports pages whose live asset hashes differ from the build |

`check-design` and `build-og-image` drive the Chrome (or Edge) already installed on
the machine through `puppeteer-core`; set `CHROME=/path/to/binary` if it isn't found.
The design export loads its fonts from Google, so `check-design` needs network access.

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
- `src/components/ConsentBanner.astro` — the cookie banner's own copy. Its wording is
  *not* from the design (v7's `Monzones-D-Cookies` component never shipped), so replace it
  if a later export includes one. The storage contract it shares with `Analytics.astro`
  — `CONSENT_STORAGE_KEY`, `{ analytics: boolean }` — does come from the design and must
  keep matching, or GA stops respecting the visitor's answer.
- `src/components/CaseDiagram.astro` — per-case SVG diagrams and captions; a new or
  re-scoped case needs its diagram ported by hand
- `src/content/thinking/*.md` — article frontmatter (`title`, `excerpt`, `tag`, dates)
- `src/config.ts` — site metadata, nav, contact details

## Reading check-design

Each page is rendered at each width with `prefers-reduced-motion: reduce` emulated —
both the export's `motion.js` and this site's reveal scripts skip every scroll
animation under it, so pages are measured finished rather than half-faded. Every
visible text node is paired with its counterpart by normalised text (the same rules
as check-copy) and compared. Findings are grouped by signature, so "38 `<p>` at 17px
where the design has 16px" is one line, and ranked:

- **HIGH** — a different font family; a size off by 4px or more; a weight off by 200;
  a colour or background more than ~80 RGB-distance away (paper vs dark band, ink vs
  coral); a heading or paragraph starting 40px+ from where the design puts it; text
  at opacity 0; horizontal overflow; contrast under 3:1. The exit code is 1 while any
  HIGH remains, so it can gate a commit.
- **MED** — smaller versions of the above; line-height off by 0.1+; text-transform or
  style differences; a long design sentence with no visible counterpart; contrast
  between 3:1 and AA.
- **LOW** — letter-spacing, block widths, spacing rhythm, page height, and anything
  the export itself does (a sub-AA pair the design also has, a `<button>` the design
  left in the UA font) — those are its decisions, not porting errors.

Read HIGH top to bottom; it is the list of things a visitor would notice. Reordered
cards (the site has an article the export doesn't) show up as MED `left-edge` on
spans — that's the pairing, not a layout bug. Two things it cannot see: images, and
anything behind an interaction (a tab panel that isn't the default, a hover state).

### check-design baseline (v14)

| Page | 375 | 1440 | Notes |
| --- | --- | --- | --- |
| home | 0 | 0 | ported to v14 2026-09-02 |
| about | 13 | 17 | the roles/years column, Switzer vs Clash Display on one label |
| work | 2 | 40 | card grid columns 59px right of the design's |
| thinking | 16 | 20 | — |
| 404 | 3 | 2 | — |
| case | 2 | 18 | tech table columns |
| article | 24 | 30 | author block, TOC |
| consulting (4 pages) | 0 | 0–1 | ported to v14 2026-09-02; the 1 is the nav's current-page label kept ink (the export's terracotta measures 3.68:1) |
| web-design | 0 | 0 | ported; the two design-only MEDs are the Formspree note (deliberate) and the pricing intro's added link |
| web-design work | 0 | 1 | ported; the 1 is the nav's current item (ink + coral rule, not coral text — contrast) |
| web-design process | 0 | 1 | ported; the 1 is the nav's current item |
| web-design pricing | 13 | 12 | ported; the residue is pairing noise (the split "Scheduled standard rate:" node, "$465" matching a different price, the "Extras" jump link) plus the nav item |

Numbers are HIGH counts. Anything above the baseline on a page you touched is
something that didn't land. When a page is re-ported, bring its row down and update
this table in the same commit.

## Verification baseline

`check-copy.mjs` currently reports **3 missing** on a clean port (v9), all intentional:

1. The Case page's "case not found" fallback — unreachable here, because a project
   without a case body fails the build instead of rendering an empty page.
2. "… Twelve pieces so far." on the 404 — the count is computed from the collection
   (and was already thirteen by the time v8 shipped), so the sentence renders with
   the live number instead of the design's stale one.
3. "Opens as an email from your own address …" on the Web Design page — its form was
   redesigned to POST to Formspree like every other form on the site instead of
   assembling a mailto: link, so the line under the button says that instead.

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
- **Port the design's intent, not its CSS bugs.** Each round has shipped at least one:
  v8 had no mobile nav and two elements that widened the viewport; v9's home page has a
  media query that closes one rule early, so the step-tab overrides meant for phones land
  at every width, and its consulting hero pins a heading with `white-space: nowrap` that
  can't fit a phone. Port what the rule was clearly for, note the departure in the page's
  header comment, and tell Miguel.
- `npm run check && npm run build` green before committing (via the direct `node`
  invocations above); pushing `main` publishes.
