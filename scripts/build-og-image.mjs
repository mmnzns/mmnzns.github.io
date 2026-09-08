/**
 * Build the link-preview images: the site card at `public/og-image.png`, and one
 * card per published article at `public/og/<slug>.png`.
 *
 * Run with `node scripts/build-og-image.mjs` after adding an article, changing a
 * title, or changing the portrait. The output is committed, so this is not part
 * of the build — it's a one-off tool, same as build-icons.mjs. Forgetting to run
 * it fails the build rather than shipping a 404 preview: the article template
 * checks its card exists.
 *
 * Why a composed card rather than a cropped photo: Open Graph wants 1200x630
 * (1.91:1) and every portrait we have is 0.67 or square, so cropping one to fit
 * reduces a headshot to a band across the eyes. The card gives a photo a column
 * of its own — a ratio close enough to the source's 0.67 that the crop is nearly
 * native — and spends the remaining width on type.
 *
 * The site card is set in the site's own "Bold" language rather than a generic
 * preview layout: an ink frame, a paper panel, 700-weight display type over a
 * hard ink bar, the four practice areas as colour chips, and the domain along a
 * dark footer band. An unfurl is the first thing most people see of the site, so
 * it shows the design rather than describing it.
 *
 * Why headless Chrome rather than sharp compositing text: the cards are set in
 * General Sans, which ships here as woff2. sharp rasterises SVG through librsvg,
 * whose webfont support is inconsistent, and a preview image that silently falls
 * back to a system font is worse than no preview image. Chrome renders the same
 * font stack the site uses, so what ships matches what a visitor sees. Fonts and
 * images are inlined as data URIs so the render needs no file-access flags.
 *
 * Every string on every card already exists in the site — the site card reads
 * `SITE.title`, `SITE.role`, `SITE.location` and `CONTACT.entity` out of
 * src/config.ts, article cards read their own frontmatter. The only exception is
 * PILLARS, the four chips, which the card declares itself. Every colour is
 * parsed out of global.css rather than restated, so a card cannot show a colour
 * the site doesn't use.
 *
 * The site card's text is deliberately evergreen. LinkedIn and Slack cache
 * preview images hard, so anything time-sensitive — the availability line, a
 * client count — would outlive its accuracy on somebody else's CDN.
 */
import sharp from 'sharp';
import { execFile } from 'node:child_process';
import { readFile, writeFile, readdir, mkdir, mkdtemp, rm, unlink } from 'node:fs/promises';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { findChrome } from './lib/browser.mjs';

const run = promisify(execFile);
const root = new URL('../', import.meta.url);
const path = (rel) => fileURLToPath(new URL(rel, root));

const WIDTH = 1200;
const HEIGHT = 630;
/** Width of the image column on an article card. The rest is copy. */
const SHOT = 452;

/* The site card's own geometry. It sits inside an ink frame, so its photo
   column is both narrower and shorter than an article card's full-bleed slot:
   FRAME is the ink showing around the panel and between the two columns, and
   the footer band takes the bottom of the card. */
const FRAME = 10;
const FOOTER = 82;
const SITE_SHOT = 430;
const PANEL_H = HEIGHT - FOOTER - FRAME;

/**
 * The four practice areas the site card leads with, in the order and the accents
 * the home page's hero uses — SLABS in src/pages/index.astro. Someone who sees
 * the unfurl and then lands on the site meets the same four colours in the same
 * order, so the card reads as the page's own row rather than a second opinion.
 *
 * Deliberately not the category mapping in src/data/site.ts, where sun is Web &
 * Analytics and sky is Leadership & Operations. These are disciplines, not the
 * groups the writing is filed under, and the hero already pairs them this way.
 *
 * Only the last label differs from the hero's: the chip row has 636px of panel
 * to fit four labels into and "WEB OPERATIONS" spends it all, so the card sets
 * the short form. checkPillars keeps the colours honest even though it can't
 * check the wording.
 */
const PILLARS = [
  { label: 'Lifecycle', token: '--coral' },
  { label: 'GTM', token: '--sun' },
  { label: 'Automation', token: '--sky' },
  { label: 'WebOps', token: '--moss' },
];

const CONTENT = 'src/content/thinking/';
const OUT_DIR = 'public/og/';

/**
 * Chrome is the renderer — the installed one, found by lib/browser.mjs on
 * macOS, Windows and Linux. Override with CHROME=/path/to/binary if it lives
 * somewhere else.
 */
const CHROME = findChrome();

const PAPER = '#fbf9f6';
const ON_DARK = '#fbf9f6';
const INK = '#1f1c19';
const INK_DECK = '#3d3833';
const INK_3 = '#9a938b';
const RULE_2 = '#d9d1c6';

/** Strings the cards set, read from src/config.ts. */
async function siteCopy() {
  const src = await readFile(path('src/config.ts'), 'utf8');
  const read = (key) => {
    const m = src.match(new RegExp(`\\n\\s*${key}:\\s*'([^']+)'`));
    if (!m) throw new Error(`Could not find ${key} in src/config.ts`);
    return m[1];
  };
  return {
    title: read('title'),
    role: read('role'),
    location: read('location'),
    entity: read('entity'),
  };
}

/**
 * Every `--token: #hex` declared in global.css. Read once and passed down, so a
 * card names a colour the way the site does instead of restating the hex.
 */
async function cssTokens() {
  const css = await readFile(path('src/styles/global.css'), 'utf8');
  const tokens = new Map();
  for (const [, name, value] of css.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{3,8});/g)) {
    tokens.set(name, value);
  }
  return tokens;
}

function token(tokens, name) {
  const hex = tokens.get(name);
  if (!hex) throw new Error(`${name} has no hex value in global.css`);
  return hex;
}

/**
 * Topic → hex, by joining the tag/token map in src/data/writing.ts to the token
 * values in global.css. Parsed rather than restated so the chip on a card is the
 * same colour as the chip on the article.
 */
async function tagColours(tokens) {
  const writing = await readFile(path('src/data/writing.ts'), 'utf8');

  const colours = new Map();
  const block = writing.match(/const ACCENTS[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!block) throw new Error('Could not find the ACCENTS map in src/data/writing.ts');

  for (const [, tag, name] of block[1].matchAll(/'?([^':\n]+?)'?:\s*'var\((--[\w-]+)\)'/g)) {
    colours.set(tag.trim(), token(tokens, name));
  }

  return colours;
}

/**
 * Published articles, read straight from frontmatter. fs rather than
 * getCollection because this runs on bare node with no content layer — the same
 * trade-off astro.config.mjs makes for sitemap dates.
 */
/**
 * Fail if the home page's slabs no longer carry the same four accents in the
 * same order as PILLARS. Worth a hard stop rather than a warning: the card is
 * generated once and then cached hard by LinkedIn and Slack, so a drift here
 * outlives by weeks the deploy that introduced it.
 */
async function checkPillars() {
  const src = await readFile(path('src/pages/index.astro'), 'utf8');
  const block = src.match(/const SLABS = \[([\s\S]*?)\n\] as const;/);
  if (!block) throw new Error('Could not find the SLABS array in src/pages/index.astro');

  const slabs = [...block[1].matchAll(/accent:\s*'var\((--[\w-]+)\)'/g)].map((m) => m[1]);
  const mine = PILLARS.map((pillar) => pillar.token);

  if (slabs.join() !== mine.join()) {
    throw new Error(
      `The site card's accents (${mine.join(', ')}) no longer match the home page's ` +
        `slabs (${slabs.join(', ')}). Update PILLARS in this file to follow the hero, ` +
        `or the unfurl and the page it links to show two different colour orders.`,
    );
  }
}

async function articles() {
  const files = (await readdir(path(CONTENT))).filter((f) => f.endsWith('.md')).sort();
  const found = [];

  for (const file of files) {
    const raw = await readFile(path(CONTENT + file), 'utf8');
    if (/^draft:\s*true\s*$/m.test(raw)) continue;

    const field = (key) => raw.match(new RegExp(`^${key}:\\s*"?([^"\\n]+?)"?\\s*$`, 'm'))?.[1];
    const title = field('title');
    const tag = field('tag');
    if (!title || !tag) throw new Error(`${file} is missing a title or tag`);

    /* The first Markdown image, if the piece opens with one. Its path is
       relative to the article file. */
    const hero = raw.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1];

    found.push({
      slug: file.replace(/\.md$/, ''),
      title,
      tag,
      hero: hero ? fileURLToPath(new URL(hero, new URL(CONTENT + file, root))) : null,
    });
  }

  return found;
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function dataUri(file, mime) {
  return `data:${mime};base64,${(await readFile(file)).toString('base64')}`;
}

/** An image cropped to a card's photo slot, at 2x for a retina unfurl. */
async function slotImage(file, width = SHOT, height = HEIGHT) {
  const buf = await sharp(file)
    .resize({ width: width * 2, height: height * 2, fit: 'cover', position: 'top' })
    .jpeg({ quality: 92 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

/**
 * Headline size by length. A title card carries anything from six words to
 * fifteen, and one size cannot hold both without either wrapping to five lines
 * or leaving half the card empty.
 */
function titleSize(title, narrow) {
  const budget = narrow ? title.length * 1.5 : title.length;
  if (budget <= 45) return 74;
  if (budget <= 70) return 62;
  if (budget <= 95) return 52;
  return 44;
}

async function shell(body, extraCss = '') {
  const font = async (weight) =>
    dataUri(path(`public/fonts/general-sans-${weight}.woff2`), 'font/woff2');
  const [w400, w500, w600, w700] = await Promise.all([
    font(400),
    font(500),
    font(600),
    font(700),
  ]);

  return `<!doctype html><meta charset="utf-8"><style>
  @font-face{font-family:'General Sans';src:url('${w400}') format('woff2');font-weight:400}
  @font-face{font-family:'General Sans';src:url('${w500}') format('woff2');font-weight:500}
  @font-face{font-family:'General Sans';src:url('${w600}') format('woff2');font-weight:600}
  @font-face{font-family:'General Sans';src:url('${w700}') format('woff2');font-weight:700}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden}
  .card{width:${WIDTH}px;height:${HEIGHT}px;background:${PAPER};display:flex;
        font-family:'General Sans',sans-serif;-webkit-font-smoothing:antialiased}
  ${extraCss}
  </style><div class="card">${body}</div>`;
}

/**
 * The site card: the entity line and portrait framed in ink, the name in
 * display type, the four practice areas, and the domain along the footer band.
 *
 * The name breaks on its last space rather than wrapping, so "Miguel N." and
 * "Monzones" always sit on their own lines however wide the panel is.
 */
async function siteCard(tokens) {
  const { title, role, location, entity } = await siteCopy();
  const i = title.lastIndexOf(' ');
  const [first, last] = i === -1 ? [title, ''] : [title.slice(0, i), title.slice(i + 1)];

  const pillars = PILLARS.map(
    (pillar) =>
      `<div class="pillar"><span class="sq" style="background:${token(tokens, pillar.token)}"></span>${escape(
        pillar.label,
      ).toUpperCase()}</div>`,
  ).join('');

  return shell(
    `<div class="top">
      <div class="panel">
        <div class="head">
          <div class="entity"><span class="sq" style="background:${token(tokens, '--moss')}"></span>${escape(
            entity,
          ).toUpperCase()}</div>
          <div class="head__rule"></div>
        </div>
        <div class="mid">
          <div class="name">${escape(first)}<br>${escape(last)}</div>
          <div class="bar"></div>
          <div class="role">${escape(role)}</div>
        </div>
        <div class="pillars">${pillars}</div>
      </div>
      <div class="shot">
        <img src="${await slotImage(path('src/assets/miguel.png'), SITE_SHOT, PANEL_H)}">
        <span class="shot__mark" style="background:${token(tokens, '--coral')}"></span>
      </div>
    </div>
    <div class="foot">
      <span class="sq" style="background:${token(tokens, '--coral')}"></span>
      <span class="foot__site">MNMONZONES.COM</span>
      <span class="foot__city">${escape(location).toUpperCase()}</span>
    </div>`,
    `.card{flex-direction:column;background:${token(tokens, '--dark')};padding:${FRAME}px ${FRAME}px 0}
     .top{flex:1;display:flex;gap:${FRAME}px;min-height:0}
     .panel{flex:1;background:${PAPER};display:flex;flex-direction:column;
            justify-content:space-between;padding:56px 52px 52px}
     .sq{width:17px;height:17px;flex:none}
     .head{display:flex;align-items:center;gap:24px}
     .entity{display:flex;align-items:center;gap:15px;font-weight:700;font-size:17px;
             letter-spacing:.13em;color:${INK}}
     .head__rule{flex:1;height:5px;background:${INK}}
     .name{font-weight:700;font-size:94px;line-height:.97;letter-spacing:-.032em;color:${INK}}
     .bar{height:9px;background:${INK};margin:30px 0 26px}
     .role{font-weight:600;font-size:30px;line-height:1.2;letter-spacing:-.012em;color:${INK}}
     .pillars{display:flex;align-items:center;gap:28px}
     .pillar{display:flex;align-items:center;gap:11px;font-weight:700;font-size:16px;
             letter-spacing:.11em;color:${INK}}
     .shot{width:${SITE_SHOT}px;flex:none;position:relative}
     .shot img{width:100%;height:100%;object-fit:cover;object-position:50% 12%;display:block}
     .shot__mark{position:absolute;left:0;bottom:0;width:128px;height:23px}
     .foot{height:${FOOTER}px;flex:none;display:flex;align-items:center;gap:17px;padding:0 52px}
     .foot__site,.foot__city{font-weight:700;font-size:18px;letter-spacing:.13em}
     .foot__site{color:${ON_DARK}}
     .foot__city{margin-left:auto;color:${token(tokens, '--sun')}}`,
  );
}

/**
 * An article card: topic chip, the headline, and the byline along the bottom.
 * When the piece opens with an image it takes the photo slot and the headline
 * sets narrower; otherwise the type runs the full width.
 */
async function articleCard(article, colours, siteTitle) {
  const accent = colours.get(article.tag);
  if (!accent) throw new Error(`No accent colour for the topic "${article.tag}"`);

  const hero = article.hero ? await slotImage(article.hero) : null;
  const size = titleSize(article.title, Boolean(hero));

  return shell(
    `<div class="copy">
      <div class="chip"><span class="chip__bar"></span>${escape(article.tag).toUpperCase()}</div>
      <h1 class="headline">${escape(article.title)}</h1>
      <div class="byline"><span class="byline__name">${escape(siteTitle)}</span><span class="site">MNMONZONES.COM</span></div>
    </div>
    ${hero ? `<div class="shot"><img src="${hero}"></div>` : ''}`,
    `.copy{flex:1;display:flex;flex-direction:column;justify-content:space-between;
            padding:64px 64px 60px 76px}
     .site{font-weight:500;font-size:21px;letter-spacing:.05em;color:${INK_3}}
     .shot{width:${SHOT}px;height:${HEIGHT}px;flex:none;border-left:1px solid ${RULE_2}}
     .shot img{width:100%;height:100%;object-fit:cover;object-position:50% 12%;display:block}
     .chip{display:flex;align-items:center;gap:14px;font-weight:500;font-size:19px;
           letter-spacing:.09em;color:${INK_DECK}}
     .chip__bar{width:40px;height:4px;border-radius:2px;background:${accent}}
     .headline{font-weight:600;font-size:${size}px;line-height:1.1;letter-spacing:-.02em;
               color:${INK};margin:28px 0}
     .byline{display:flex;align-items:baseline;gap:18px}
     .byline__name{font-weight:500;font-size:21px;color:${INK}}`,
  );
}

/** Render one HTML string to one PNG, and hold Chrome to the exact geometry. */
async function render(html, out, work) {
  const page = join(work, 'card.html');
  await writeFile(page, html);
  await run(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${WIDTH},${HEIGHT}`,
    `--screenshot=${out}`,
    `file://${page}`,
  ]);

  const meta = await sharp(out).metadata();
  if (meta.width !== WIDTH || meta.height !== HEIGHT) {
    throw new Error(`${out}: expected ${WIDTH}x${HEIGHT}, got ${meta.width}x${meta.height}`);
  }
}

const work = await mkdtemp(join(tmpdir(), 'og-'));
try {
  await checkPillars();
  const tokens = await cssTokens();
  const [{ title: siteTitle }, colours, posts] = await Promise.all([
    siteCopy(),
    tagColours(tokens),
    articles(),
  ]);

  await mkdir(path(OUT_DIR), { recursive: true });

  await render(await siteCard(tokens), path('public/og-image.png'), work);
  console.log('public/og-image.png');

  for (const post of posts) {
    const out = path(`${OUT_DIR}${post.slug}.png`);
    await render(await articleCard(post, colours, siteTitle), out, work);
    console.log(`${OUT_DIR}${post.slug}.png`);
  }

  /* Drop cards for articles that no longer exist, so a renamed or unpublished
     piece doesn't leave a stale preview being served. */
  const keep = new Set(posts.map((post) => `${post.slug}.png`));
  for (const file of await readdir(path(OUT_DIR))) {
    if (file.endsWith('.png') && !keep.has(file)) {
      await unlink(path(OUT_DIR + file));
      console.log(`removed stale ${OUT_DIR}${file}`);
    }
  }

  console.log(`\n${posts.length} article cards, 1 site card.`);
} finally {
  await rm(work, { recursive: true, force: true });
}
