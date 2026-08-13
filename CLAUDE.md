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
- **Interactive elements are real buttons and links** with correct ARIA state, keyboard
  operation and a visible focus ring. Every animation sits behind
  `@media (prefers-reduced-motion: reduce)` and degrades to instant.

## Deployment constraints

- This is a **user site** served from the domain root — never set `base` in
  `astro.config.mjs`.
- Output must stay fully static. GitHub Pages has no server runtime, so SSR adapters,
  API routes and on-demand rendering are not options.
- `main` is the deploy branch: pushing to it publishes the live site.

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
