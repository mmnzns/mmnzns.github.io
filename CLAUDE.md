# Working in this repository

Personal portfolio site — Astro 7 (static output) + TypeScript, deployed to GitHub Pages.

## Commands

- `npm run dev` — dev server on port 4321
- `npm run build` — static build into `dist/`
- `npm run check` — Astro/TypeScript diagnostics; this is what CI gates on

**Porting a new design export: follow `docs/PORTING.md`.** It is the playbook — the
script-per-file table, the recipe, the surfaces no script covers, and the verification
baseline. The short version: `scripts/gen-{cases,home,consulting,about}.mjs` regenerate
their data file wholesale from the design (never hand-edit prose in a generated file),
`scripts/sync-projects(-apply).mjs` patch `site.ts`, and `scripts/check-copy.mjs` proves
the port by reporting design sentences missing from `dist/`.

**Diff against the design, not against the previous export.** This repo has drifted from
what was shipped before, so a small vN-1 → vN diff can hide a page's worth of divergence.
`check-copy.mjs` is the tool for this.

Run `npm run check && npm run build` before committing. There is no test suite or linter
beyond that.

## Conventions

- **Site metadata lives in `src/config.ts`.** Title, description, nav, contact details and
  the Formspree endpoint are read from there. Don't hardcode them in pages or components —
  the footer builds its links from `NAV_LINKS` and `CONTACT`.
- **`BaseLayout.astro` owns `<head>`.** Pages pass `title` and `description` as props rather
  than writing their own meta tags. Canonical URL, Open Graph, Twitter tags and the Person
  JSON-LD are derived.
- **Styling is plain CSS with tokens** in `src/styles/global.css` (`--paper`, `--ink`,
  `--coral`, …). When adding a colour, define a token rather than inlining a hex value.
  The design is **light only** — there is deliberately no `prefers-color-scheme: dark`
  block, because a paper palette inverted is a different design rather than the same one
  at night. Don't add one piecemeal.
- **Four accents, each bound to a category** — coral/lifecycle, sky/leadership, moss/AI,
  sun/web. The mapping is declared once in `CATEGORY_ACCENT` (`src/data/site.ts`); read it
  from there rather than picking a colour by eye.
- **A scoped rule beats a global one, so restate what it cancels.** Astro compiles component
  styles with an attribute selector, so `.thing { color }` inside a component scores higher
  than a bare `a:hover { color }` in global.css. Any component that sets its own link colour
  must set its own `:hover` and `:focus-visible` colour, or the link silently stops
  responding. The same trap applies to `display`: a scoped `display: grid` outranks the
  `hidden` attribute's own rule, which is why global.css forces `[hidden] { display: none }`.
  Both of these shipped broken. When a hover or a toggle "does nothing", check specificity
  before anything else.
- **Components are `.astro` by default and no framework is installed.** Interactive pieces
  are progressively enhanced: every state is rendered server-side, and a small vanilla
  `<script>` toggles `aria-pressed` / `hidden`. Don't reach for React or a `client:*`
  directive — nothing here has needed one.
- **Animation must not gate content.** Every scroll-driven effect lives in
  `src/components/Motion.astro`, which BaseLayout renders on every page. Two rules keep it
  from hiding the site:
  - **Never write a hidden starting state in CSS.** `opacity: 0` in a stylesheet applies
    whether or not the script that clears it ever runs. Motion.astro sets those states from
    JavaScript instead, and carries a failsafe (a timer plus a `visibilitychange` listener)
    that clears everything still pending. The worst case is a page that appears without
    animating.
  - **Prefer a transition to a keyframe animation whenever the "from" state is wrong.**
    An animation with `from { width: 0 }` holds zero width for as long as its clock is
    stopped — a background tab, a throttled document — so the bar reads `0%`, which is a
    wrong number rather than a missing effect. A transition rests at the real value and
    only moves if something pushes it off. See `.bars__fill` on the home page.

  Both of these have shipped broken before. If you add an effect that can hide something,
  test it with the page hidden (`document.visibilityState === 'hidden'`), because that is
  the condition under which observers and `requestAnimationFrame` never fire.
- **Routing is file-based** under `src/pages/`; `build.format: 'directory'` means routes end
  in a trailing slash (`/about/`). Keep internal links trailing-slashed to avoid redirects.
- **Interactive elements are real buttons and links** with correct ARIA state, keyboard
  operation and a visible focus ring. Every animation sits behind
  `@media (prefers-reduced-motion: reduce)` and degrades to instant.

## Deployment constraints

- This is a **user site** served from the domain root — never set `base` in
  `astro.config.mjs`.
- Output must stay fully static. GitHub Pages has no server runtime, so SSR adapters,
  API routes and on-demand rendering are not options.
- `main` is the deploy branch: pushing to it publishes the live site.
- **`wrangler.jsonc` must stay, even though nothing in it looks necessary.** Cloudflare's
  git integration ends with `npx wrangler deploy`, and with no config file wrangler
  auto-configures: it detects Astro, answers its own prompts (non-interactively,
  "Proceed with setup?" defaults to *yes*), runs `astro add cloudflare` and rebuilds. The
  adapter it installs is an SSR adapter, so the rebuild renders through miniflare and
  fails — after the plain static build has already succeeded. Deleting the file as
  redundant reintroduces that. It must never gain a `main` entry either; assets-only is
  the point.

## Where content lives

- `src/data/site.ts` — the project record: title, tags, category, headline metrics. Read by
  the home page and the work index.
- `src/data/cases.ts` — the long-form case body for each project, joined to the above by
  slug. A project with no case body fails the build rather than rendering an empty page.
  It also owns the detail page's own `title` and `deck`, which are longer than the card's.
- **Job titles appear in two places** — `ROLES` in `src/data/about.ts` and the `meta` line
  of every case in `cases.ts`. Change one and change the other, or the about page and a
  case page show a recruiter two different job titles for the same employer. The v6 export
  disagreed with itself here (Mogo and CraftConcepts); that was reconciled against
  Professional History via `TITLE_FIXES` in `scripts/gen-cases.mjs`, so regeneration keeps
  the fix. If a future export introduces a *new* conflict, ask before reconciling — picking
  one is a claim about Miguel's employment history, not a formatting decision.
- `src/data/home.ts`, `consulting.ts`, `about.ts` — page-specific copy, kept out of the
  templates so wording stays reviewable in one place.
- `src/content/thinking/*.md` — articles. Frontmatter is `title`, `date`, `tag`, `excerpt`,
  plus optional `featured` and `draft`; the schema in `src/content.config.ts` validates it
  at build time. Reading time is computed from word count, never typed by hand.

Contact forms POST to Formspree (`FORM_ENDPOINT` in `src/config.ts`). The plain HTML POST is
the fallback; a script upgrades it to submit in place. Keep it working without JavaScript.

## Discoverability

- **`robots.txt`, `llms.txt` and `llms-full.txt` are generated routes** under `src/pages/`,
  not files in `public/`. A static one drifted once already: moving to the custom domain
  updated `SITE.url`, the sitemap followed, and the hand-typed `Sitemap:` line kept pointing
  at the old host — which a crawler ignores rather than follows, so the sitemap went unread.
  Never re-add a static copy; read the origin from config.
- **Structured data lives in `BaseLayout` as one `@graph`**, with `@id`s that don't change
  (`#person`, `#website`). Pages opt into extra nodes by passing props — `article={{…}}` adds
  `BlogPosting` and the `article:*` OG tags, `breadcrumbs={[…]}` adds `BreadcrumbList`. Don't
  emit a second `ld+json` script from a page; a crawler reading two disconnected graphs sees
  two different authors.
- **Never add `dateModified`, and don't backfill it.** No frontmatter records when a post was
  edited, and a freshness date search engines act on is exactly the kind of invented fact the
  rules below forbid. If `updated` is ever added to the schema, `astro.config.mjs` and the
  `BlogPosting` node both need to read it.
- **The AI crawlers are allowed on purpose.** `src/pages/robots.txt.ts` names GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended and the rest explicitly even though `*` already
  permits them, as a record that being quotable was chosen over being withheld. Reversing
  that is a decision for Miguel, not a cleanup.
- **Old URLs live in `LEGACY_URLS` in `astro.config.mjs`, and that map feeds two outputs.**
  The previous Wix site used `/blog/`, `/post/` and `/systemscales/` prefixes, and Google
  still crawls them. Astro's `redirects` compiles each to an HTML file with a zero-second
  meta refresh, a canonical and noindex, which is all GitHub Pages can do without a server;
  the `redirectsFile` integration writes the same map to `dist/_redirects`, which Cloudflare
  answers with a real 301. Add an entry once — whichever host holds the domain picks it up.
  **This is also the only way to rename an article slug without losing it**: change the
  filename and add the old path here, or every existing link to that piece dies. Confirm a
  mapping against the article's title rather than inferring it from the URL; the old slugs
  kept full stops and turned apostrophes into `-s` inconsistently.
- **Don't hand-edit `_redirects`, and don't trust it by reading it.** Two of its rules are
  non-obvious and both were found by running `wrangler dev` and curling for the status code,
  not by reasoning: every path needs a trailing-slash twin (an unmatched path falls through
  to the asset, so `/post/x/` was answering 200 and serving the meta-refresh stub), and
  sources must be percent-encoded, because Cloudflare normalises the path before it consults
  the file — a rule containing a literal `’` never fires. If you change the generator, verify
  the same way; `curl -o /dev/null -w '%{http_code}'` is the whole test.
- **Publishing an article requires one manual step.** The sitemap, both `llms` files and the
  RSS feed all read the `thinking` collection, so a new Markdown file appears in all of them
  by itself — if you find yourself hand-listing an article somewhere, that's a bug. The
  exception is its link-preview card: run `node scripts/build-og-image.mjs` and commit
  `public/og/<slug>.png`. The article template throws when a card is missing, so this cannot
  ship broken, but the build does stop until you run it.
- **Every article has its own preview card, so don't point one at the site card.** The card
  carries the headline and the topic accent, which is why `og:image:alt` differs on an article
  from everywhere else. Titles longer than about 95 characters drop to the smallest headline
  size in the generator; past roughly 120 they will start to crowd the card, which is a reason
  to shorten the title rather than to change the layout.

## Content and facts

Source material lives in `Website MD Repository/`:

- **`mnmonzones-copy-deck.md`** — the approved wording. Use it verbatim; don't rewrite,
  tighten or improve copy that already exists there.
- **`Professional History …md`** — the underlying record. Use it for anything the copy deck
  doesn't cover, especially the work detail pages.
- **`Tone Guide …md`** — governs voice.

**Never invent a fact.** No metric, date, client name, job title, article title or company
detail that isn't in those files. If a slot needs a fact that isn't there, leave it visibly
empty and say what's missing. An invented number on a portfolio is worse than a gap — it
gets asked about in interviews.

**Keep qualifiers exactly as written.** `~38%` stays `~38%`. "about 900,000 people" does not
become "$900K". Don't round, average or tidy a figure into a cleaner-looking one.

**One number, one story.** A headline metric must be explained by the initiative it came
from. Don't pair a stat from one project with the explanation from another — if two figures
come from two pieces of work, they get two separate slots.

**Don't chart a relative-only figure.** Some metrics exist as a delta with no baseline (for
example "+30% underwriter close rate"). Render those as a single stat; a before/after bar
invents a comparison that isn't in the data.

**Employment dates are checkable** against LinkedIn by anyone who cares. Take them from
Professional History; never infer or approximate them.

## Voice

First person, as Miguel. Conversational, specific and warm — the reference point is
corey.co, which addresses the reader, hedges occasionally, and undercuts itself now and
then. Plain, but not clipped.

- **No line should read as a slogan.** If a sentence sounds like it wants to be
  screenshotted, rewrite it. Let headings be ordinary when the content under them is
  already interesting.
- Use contractions. Vary sentence length. Don't end every sentence on a hard full stop.
- **Show, don't self-label.** Not "I'm strategic" but the reasoning that makes it obvious.
  No "part X, part Y" constructions.
- Don't use the "it wasn't X, it was Y" shape more than once on a page.
- **Never**: at the intersection of, data-driven, results-driven, passionate about, thrive
  in, leverage, unlock, seamless, holistic, best-in-class, world-class, move the needle,
  thought leadership, end-to-end, robust, scalable solutions, future-proof, north star.

Case studies follow one order: what I saw → what I decided → the metric I picked → what I
built → what changed. The read leading is the whole point; the build is the proof.
