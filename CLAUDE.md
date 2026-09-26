# Working in this repository

Personal portfolio and writing site — Astro 7 (static output) + TypeScript, served by a
Cloudflare Worker as static assets. Cloudflare's git integration builds and deploys every
push to `main`; there is no deploy workflow in this repo (GitHub Pages was retired
2026-08-26).

**What the site is, since v19 (2026-09):** Miguel's personal portfolio and a home for his
writing — Home, Work (13 case studies), Writing, About, Privacy. It sells nothing. The web
design and consulting services moved to his studio, **Craft Concepts Digital**
(craftconceptsdigital.com), and the site points there from one chip in the header and menu
and one card on the home page (`STUDIO` in `src/config.ts`). The old `/web-design/` and
`/consulting/` URLs 301 to the studio (see Discoverability). Don't re-add service pages,
pricing or a service nav here; that work belongs on the studio's site.

## Commands

- `npm run dev` — dev server on port 4321
- `npm run build` — static build into `dist/`
- `npm run check` — Astro/TypeScript diagnostics; this is what CI gates on

**Porting a new design export: follow `docs/PORTING.md`.** It is the playbook — what each
script owns, the recipe, the surfaces no script covers, and the verification baselines.
The short version: `scripts/gen-cases.mjs` regenerates `src/data/cases.ts` from the design
(never hand-edit prose in that file); everything else is hand-maintained from the export;
and two verifiers prove the port: `scripts/check-copy.mjs` reports design sentences missing
from `dist/`, and `scripts/check-design.mjs` renders each export beside its built page in
Chrome and reports where they *look* different — type, colour, background, alignment,
overflow, contrast. **Words matching is not the port being done.** Every visual regression
that has shipped passed check-copy; check-design is what would have caught them.

**Diff against the design, not against the previous export.** This repo has drifted from
what was shipped before, so a small vN-1 → vN diff can hide a page's worth of divergence.
The two check scripts are the tool for this.

**After pushing, run `node scripts/check-live.mjs dist --wait 600`** and believe nothing
else about whether a deploy landed. It compares the hashed asset names every live page
references with the ones in `dist/`. Ad-hoc checks (grepping one CSS bundle, eyeballing
a screenshot) have reported both false "not live" and false "live" before.

Run `npm run check && npm run build` before committing. There is no test suite or linter
beyond that. (On the Google Drive checkout, `node_modules/.bin` symlinks arrive broken —
invoke `node ./node_modules/astro/bin/astro.mjs check|build` directly.)

## Conventions

- **Site metadata lives in `src/config.ts`.** Title, description, role, availability line,
  nav, contact details, the studio link and the Formspree endpoint are read from there.
  Don't hardcode them in pages or components. `NAV_LINKS` is the four site links and
  `NAV_CTA` the "Work with me" button; llms.txt reads both.
- **`BaseLayout.astro` owns `<head>`.** Pages pass `title` and `description` (plus
  `current`, `overlay`, `progress`, `article`, `breadcrumbs` where relevant) rather than
  writing their own meta tags. Canonical URL, Open Graph, Twitter tags and the Person
  JSON-LD are derived. It also renders the chrome every page shares — `SiteHeader`,
  `SiteFooter`, `Motion`, `ConsentBanner` — so no page ships its own nav or footer.
- **The v19 design language** ("Monzones-D-*-V4"): warm paper `--paper` #F8F4EC and ink
  `--ink` #1F1D2B, cards on `--card`, four accents (`--blue`, `--green`, `--amber`,
  `--red`); Instrument Serif for display, Bricolage Grotesque for text, Courier Prime for
  mono labels — all three self-hosted from `public/fonts/` (no Google Fonts request, which
  also keeps the privacy page's "nothing else loads" claim true). The look is collage:
  torn-paper edges (`--torn-*` clip-paths in global.css), tape strips, tilted taped photos,
  soft drop-shadows, pill buttons. Colours are tokens in `src/styles/global.css`; when
  adding one, define a token rather than inlining a hex. The design is **light only** —
  there is deliberately no `prefers-color-scheme: dark` block; the palette inverted is a
  different design, not the same one at night.
- **Type is fluid, and every size is in `rem`.** Never write a `font-size` in `px`
  (media-query breakpoints stay in px; content `max-width`s are in rem too). One rule on
  `html` in global.css does the scaling: up to 1440px the root is the visitor's own
  default (16px unless they've changed it), so phones, tablets and laptops get exactly
  the design's sizes and headings scale through their own `clamp(…rem, …vw, …rem)`; past
  1440px the root grows with the window to 19px at 2560, and `--max` is in rem, so the
  column widens with the text and line lengths hold. Because it's all relative to the
  browser's setting, someone who has asked for larger text gets it. Two floors: nothing
  meaningful under 12px (0.75rem), and form fields at 16px on touch screens, or iOS
  zooms the page when one is tapped. Test at 375, 768, 1024, 1440 and 2560, and once
  with `html { font-size: 125% }` forced, which is what a larger browser setting does.
- **Four accents, each bound to a category** — blue/Lifecycle, green/AI & Automation,
  amber/Web & Analytics, red/Leadership & Operations. Declared once in `CATEGORY_ACCENT`
  (`src/data/site.ts`); the Writing tags have their own map in `src/data/writing.ts`
  (blue/Lifecycle, green/AI & automation, amber/Search, red/Positioning). Read colours
  from those maps rather than picking one by eye. The category strings are display copy,
  so renaming one is a design decision, not a refactor.
- **Public copy never names a currency and never says "GitHub Pages"** — hosting is
  described as "hosted by me". Both rules come from the v19 launch handoff.
- **The public brand is Craft Concepts Digital** (`STUDIO.name`); the legal name, MNM
  Alaminos Consulting Ltd. (`CONTACT.entity`), is not used publicly. The footer reads
  "Craft Concepts Digital — lifecycle and GTM, Vancouver." (Miguel, 2026-09-26), and the
  Person JSON-LD's `worksFor` and llms.txt name the studio with its URL. The one
  exception is the privacy page's §01, which names the legal entity as the organisation
  accountable for personal information.
- **A scoped rule beats a global one, so restate what it cancels.** Astro compiles component
  styles with an attribute selector, so `.thing { color }` inside a component scores higher
  than a bare `a:hover { color }` in global.css. Any component that sets its own link colour
  must set its own `:hover` and `:focus-visible` colour, or the link silently stops
  responding. The same trap applies to `display`: a scoped `display: grid` outranks the
  `hidden` attribute's own rule, which is why global.css forces `[hidden] { display: none }`.
  And **scoped styles cannot reach Markdown output** — article prose is styled through
  `.post-body :global(...)` in the article template. When a hover or a toggle "does
  nothing", check specificity before anything else.
- **A column flexbox shrink-wraps `.mz-wrap`.** The wrap centres itself with auto side
  margins, and in a `flex-direction: column` parent auto margins beat `stretch`, so the
  wrap collapses to its content and centres. Give it `width: 100%` there (see
  `.career__head` on About). `.mz-wrap` is `box-sizing: border-box`: its 1400px includes
  the gutters, which is what puts content 76px in at 1440, as the design has it.
- **The header and mobile menu are designed** (`Monzones-D-Nav-V4`). Below 900px the MENU
  pill opens a full-screen menu: `aria-expanded` on the toggle, the label swaps to
  "Close ×", scroll locks, Escape and any link close it and focus returns to the toggle.
  The header hides on scroll down past 220px; on `overlay` pages (home) it sits over the
  hero and turns solid past 30px.
- **The sound toggle is opt-out.** A looping ambient track (`public/websound.mp3`, at
  **8% volume** — Miguel's setting, the same as on the Craft Concepts Digital site) starts on the visitor's first tap or click anywhere, unless they've turned it off —
  the choice is remembered in `localStorage` (`mnm-sound`). Browsers forbid audio before a
  gesture, so there is no autoplay on load. The level is applied through a Web Audio
  gain node, not `audio.volume` alone, because iOS ignores `volume` and plays media at
  full loudness. The toggle is a real button with `aria-pressed`.
- **The résumé is `public/Miguel-Monzones-Resume.pdf`**, served from the site itself and
  linked from the About hero's "Download my résumé" clipping (v20). To update it,
  replace that file under the same name. The button only renders when the file exists
  at build time, so deleting it removes the button rather than shipping a broken link.
- **Check a phone before shipping, and don't trust headless for it.** Every export so far
  has shipped its own mobile bugs — v19's were client names breaking mid-word in the
  two-column logo grid and the email address splitting inside its pill (home and About);
  both are fixed here, not copied (the address breaks after the `@` via `<wbr>`, never
  mid-word). Desktop Chrome paints over `overflow-x: clip`; a phone
  widens the layout viewport instead. Measure with a 375px-wide **iframe**
  (`documentElement.scrollWidth` should equal the viewport) and screenshot through one
  too — headless Chrome's `--window-size` does *not* give a 375px layout viewport. Check
  320px as well.
- **Components are `.astro` by default and no framework is installed.** Interactive pieces
  are progressively enhanced: every state is rendered server-side (the Work grid *and*
  list views, every skills panel, every certificate), and a small vanilla `<script>`
  toggles `hidden` / `aria-*`. Don't reach for React or a `client:*` directive.
- **Animation must not gate content.** Every scroll-driven effect goes through
  `src/components/Motion.astro` (`data-hero`, `data-rv`, `data-split`, `data-clip`,
  `data-count`, `data-magnetic`), which BaseLayout renders on every page. The rules that
  keep it from hiding the site:
  - **Never write a hidden starting state in CSS.** `opacity: 0` in a stylesheet applies
    whether or not the script that clears it ever runs. Motion.astro sets those states from
    JavaScript, and a failsafe (2600ms, plus a `visibilitychange` listener) reveals
    anything still pending at or above the viewport. The worst case is a page that appears
    without animating.
  - **Reveals animate `translate` / `rotate`, never `transform`,** so an element's own
    tilt (set with `transform: rotate(...)` in CSS) survives the reveal. A component with
    its own `transition` must list `translate` in it, or `data-magnetic` stops easing.
  - **A page that inserts new elements after load must dispatch `mz:scan`** on `document`
    so Motion arms them. None does today — the Work filters, Writing search and About
    certificates only toggle `hidden` on server-rendered markup, which the observers
    already track.
  - **Prefer a transition to a keyframe animation whenever the "from" state is wrong** — an
    animation's `from` holds for as long as its clock is stopped (a background tab), so a
    bar reads `0%`.

  Test any effect that can hide something with the page hidden
  (`document.visibilityState === 'hidden'`) — the condition under which observers and
  `requestAnimationFrame` never fire. Everything sits behind
  `@media (prefers-reduced-motion: reduce)` and degrades to instant; About's pinned career
  strip isn't pinned at all under reduced motion or below 900px.
- **Routing is file-based** under `src/pages/`; `build.format: 'directory'` means routes end
  in a trailing slash (`/about/`). Keep internal links trailing-slashed to avoid redirects.
- **Interactive elements are real buttons and links** with correct ARIA state, keyboard
  operation and a visible focus ring.

## Consent and analytics

- **Consent Mode defaults run before gtag loads** (`Analytics.astro`): everything denied,
  `wait_for_update: 500`. The banner (`ConsentBanner.astro`, `Monzones-D-Cookies-V4`) shows
  450ms after load on a first visit, stores `{ analytics, v: 1, ts }` under
  `mnm-consent-v1`, and sends a consent `update` that grants `analytics_storage` only —
  every `ad_*` signal stays denied. Declining also clears `_ga`, `_gid` and `_gat`. Any
  element with `data-cookie-settings` reopens it (the footer link, the privacy page
  button). The storage key and shape are shared with `Analytics.astro`; change one and
  change the other, or GA stops respecting the visitor's answer.
- **The contact form is Formspree** (`FORM_ENDPOINT`). The home page's chat UI is a skin
  over one real `<form>` that POSTs there: it's visible and works without JavaScript; the
  script hides it until a reply is picked and submits in place. It sends `_subject`
  ("{topic} · from {name}"), `topic` and a `_gotcha` honeypot. The design's own chat and
  privacy copy described a `mailto:` form — that's wrong for this site, and both were
  rewritten to say Formspree. **Never test-submit to the live endpoint.**

## Deployment constraints

- This is a **user site** served from the domain root — never set `base` in
  `astro.config.mjs`.
- Output must stay fully static. The Worker is assets-only (see `wrangler.jsonc`), so SSR
  adapters, API routes and on-demand rendering are not options.
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

- `src/data/site.ts` — the project record: title, summary, card figure, category, tags,
  headline metrics, the illustration each card uses. Read by the home page and the work
  index.
- `src/data/cases.ts` — the long-form case body for each project, joined to the above by
  slug, **generated by `scripts/gen-cases.mjs`**. A project with no case body fails the
  build rather than rendering an empty page. It also owns the detail page's `title`,
  `deck` and the `meta` line (Where · Role · When).
- **The Sportserve division is "the MSOps payments division," everywhere.** Commit
  4c7f62f named it that, matching Professional History (the division sat inside MSOps,
  the Marketing Services Operations department), and Miguel confirmed it on 2026-09-25
  when v19's export went back to "payments division" / "Payments Operations Division".
  That covers the case page, the home ledger and case card, and the About role story.
  `SPORTSERVE_FIXES` in `gen-cases.mjs` keeps it through regeneration. Don't "sync" it
  back to the design.
- **Job titles appear in two places** — `ROLES` in `src/data/about.ts` and the `meta` line
  of every case in `cases.ts`. Change one and change the other, or the about page and a
  case page show a recruiter two different job titles for the same employer. About uses
  the full recorded titles (e.g. "Senior Marketing Operations Manager (Lifecycle and
  MarTech)") where v19's About shortened them; `TITLE_FIXES` in `gen-cases.mjs` reconciles
  the case pages against Professional History. If a future export introduces a *new*
  conflict, ask before reconciling — picking one is a claim about Miguel's employment
  history, not a formatting decision.
- `src/data/home.ts`, `about.ts`, `writing.ts` — page-specific copy and lists,
  **hand-maintained** from the v19 exports (v19 rebuilt both pages from scratch, and the
  old `gen-home` / `gen-about` scrapers were retired with the layouts they read).
- `src/data/art.ts` — the collage illustrations in `src/assets/art/*.webp`, looked up by
  name; an unknown name throws at build time rather than rendering a broken image.
- `src/content/thinking/*.md` — articles. Frontmatter is `title`, `date`, `tag`,
  `excerpt`, plus optional `dek`, `image`, `imageAlt`, `shortTitle`, `featured` and
  `draft`; the schema in `src/content.config.ts` validates it at build time. `excerpt` is
  the article page's deck and the meta description; `dek` is the shorter line the Writing
  cards use (falls back to `excerpt`); `image` is the hero illustration
  (`../../assets/art/<name>.webp`); `shortTitle` is the home page row's headline. The
  Writing page's lead slot is the **newest** post, and the home page lists the newest
  three — both read the collection, so a new post appears without touching a template.
  Reading time is computed from word count, never typed by hand. Watch for bold written
  as `**Label: **text` — CommonMark won't close a `**` that follows a space, so the
  asterisks render literally; write `**Label:** text`.

## Discoverability

- **`robots.txt`, `llms.txt` and `llms-full.txt` are generated routes** under `src/pages/`,
  not files in `public/`. A static one drifted once already: moving to the custom domain
  updated `SITE.url`, the sitemap followed, and the hand-typed `Sitemap:` line kept pointing
  at the old host. Never re-add a static copy; read the origin from config.
- **Structured data lives in `BaseLayout` as one `@graph`**, with `@id`s that don't change
  (`#person`, `#website`). Pages opt into extra nodes by passing props — `article={{…}}` adds
  `BlogPosting` and the `article:*` OG tags, `breadcrumbs={[…]}` adds `BreadcrumbList`. Don't
  emit a second `ld+json` script from a page; a crawler reading two disconnected graphs sees
  two different authors.
- **Never add `dateModified`, and don't backfill it.** No frontmatter records when a post was
  edited, and a freshness date search engines act on is exactly the kind of invented fact the
  rules below forbid.
- **The AI crawlers are allowed on purpose.** `src/pages/robots.txt.ts` names GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended and the rest explicitly even though `*` already
  permits them, as a record that being quotable was chosen over being withheld. Reversing
  that is a decision for Miguel, not a cleanup.
- **One share card for every page.** `public/og-image.png` is the final 1200×630 card from
  the v19 launch handoff (Miguel at his desk, "The problem is usually upstream."). Don't
  regenerate or crop it. BaseLayout emits exactly one absolute `og:image` per page; the old
  per-article cards and their generator were retired with v19. After changing it, re-scrape
  with LinkedIn's Post Inspector and Facebook's Sharing Debugger — both cache the old image.
- **Old URLs live in `astro.config.mjs`, and one map feeds two outputs.** `LEGACY_URLS`
  holds the previous Wix site's `/blog/`, `/post/` and `/systemscales/` paths;
  `SERVICE_REDIRECTS` sends `/web-design/…` to `craftconceptsdigital.com/build` and
  `/consulting/…` to `craftconceptsdigital.com/`. Both are merged into `REDIRECTS`, which
  Astro's `redirects` compiles to meta-refresh stubs and the `redirectsFile` integration
  writes to `dist/_redirects`, which Cloudflare answers with a real 301. Add an entry once.
  **This is also the only way to rename an article slug without losing it**: change the
  filename and add the old path here. Confirm a mapping against the article's title rather
  than inferring it from the URL.
- **Don't hand-edit `_redirects`, and don't trust it by reading it.** Two of its rules are
  non-obvious and both were found by running `wrangler dev` and curling for the status code:
  every path needs a trailing-slash twin (an unmatched path falls through to the asset, so
  `/post/x/` was answering 200 and serving the meta-refresh stub), and sources must be
  percent-encoded, because Cloudflare normalises the path before it consults the file — a
  rule containing a literal `’` never fires. If you change the generator, verify the same
  way; `curl -o /dev/null -w '%{http_code}'` is the whole test.
- **Publishing an article is one Markdown file.** The sitemap, both `llms` files, the RSS
  feed, the Writing page and the home page all read the `thinking` collection — if you find
  yourself hand-listing an article somewhere, that's a bug.

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
