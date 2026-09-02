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
 * reduces a headshot to a band across the eyes. The card gives a photo a 452x630
 * slot — a 0.72 ratio, close enough to the source's 0.67 that the crop is nearly
 * native — and spends the remaining width on type.
 *
 * Why headless Chrome rather than sharp compositing text: the cards are set in
 * General Sans, which ships here as woff2. sharp rasterises SVG through librsvg,
 * whose webfont support is inconsistent, and a preview image that silently falls
 * back to a system font is worse than no preview image. Chrome renders the same
 * font stack the site uses, so what ships matches what a visitor sees. Fonts and
 * images are inlined as data URIs so the render needs no file-access flags.
 *
 * Every string on every card already exists in the site — the site card reads
 * `SITE.title` and `SITE.role`, article cards read their own frontmatter. The
 * accent colours are parsed out of src/data/writing.ts and global.css rather
 * than restated, so a card cannot show a colour the site doesn't use.
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
/** Width of the image column on cards that have one. The rest is copy. */
const SHOT = 452;

const CONTENT = 'src/content/thinking/';
const OUT_DIR = 'public/og/';

/**
 * Chrome is the renderer — the installed one, found by lib/browser.mjs on
 * macOS, Windows and Linux. Override with CHROME=/path/to/binary if it lives
 * somewhere else.
 */
const CHROME = findChrome();

const PAPER = '#fbf9f6';
const INK = '#1f1c19';
const INK_DECK = '#3d3833';
const INK_3 = '#9a938b';
const RULE_2 = '#d9d1c6';

/** Strings the cards set, read from src/config.ts. */
async function siteCopy() {
  const src = await readFile(path('src/config.ts'), 'utf8');
  const read = (key) => {
    const m = src.match(new RegExp(`\\n\\s*${key}:\\s*'([^']+)'`));
    if (!m) throw new Error(`Could not find SITE.${key} in src/config.ts`);
    return m[1];
  };
  return { title: read('title'), role: read('role') };
}

/**
 * Topic → hex, by joining the tag/token map in src/data/writing.ts to the token
 * values in global.css. Parsed rather than restated so the chip on a card is the
 * same colour as the chip on the article.
 */
async function tagColours() {
  const [writing, css] = await Promise.all([
    readFile(path('src/data/writing.ts'), 'utf8'),
    readFile(path('src/styles/global.css'), 'utf8'),
  ]);

  const tokens = new Map();
  for (const [, name, value] of css.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{3,8});/g)) {
    tokens.set(name, value);
  }

  const colours = new Map();
  const block = writing.match(/const ACCENTS[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!block) throw new Error('Could not find the ACCENTS map in src/data/writing.ts');

  for (const [, tag, token] of block[1].matchAll(/'?([^':\n]+?)'?:\s*'var\((--[\w-]+)\)'/g)) {
    const hex = tokens.get(token);
    if (!hex) throw new Error(`${token} has no hex value in global.css`);
    colours.set(tag.trim(), hex);
  }

  return colours;
}

/**
 * Published articles, read straight from frontmatter. fs rather than
 * getCollection because this runs on bare node with no content layer — the same
 * trade-off astro.config.mjs makes for sitemap dates.
 */
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

/** An image cropped to the card's photo slot, at 2x for a retina unfurl. */
async function slotImage(file) {
  const buf = await sharp(file)
    .resize({ width: SHOT * 2, height: HEIGHT * 2, fit: 'cover', position: 'top' })
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
  const [w400, w500, w600] = await Promise.all([font(400), font(500), font(600)]);

  return `<!doctype html><meta charset="utf-8"><style>
  @font-face{font-family:'General Sans';src:url('${w400}') format('woff2');font-weight:400}
  @font-face{font-family:'General Sans';src:url('${w500}') format('woff2');font-weight:500}
  @font-face{font-family:'General Sans';src:url('${w600}') format('woff2');font-weight:600}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden}
  .card{width:${WIDTH}px;height:${HEIGHT}px;background:${PAPER};display:flex;
        font-family:'General Sans',sans-serif;-webkit-font-smoothing:antialiased}
  .copy{flex:1;padding-left:76px;padding-right:64px;display:flex;flex-direction:column;justify-content:center}
  .rule{width:68px;height:4px;border-radius:2px;margin:34px 0 30px;background:#f2603f}
  .site{font-weight:500;font-size:21px;letter-spacing:.05em;color:${INK_3}}
  .shot{width:${SHOT}px;height:${HEIGHT}px;flex:none;border-left:1px solid ${RULE_2}}
  .shot img{width:100%;height:100%;object-fit:cover;object-position:50% 12%;display:block}
  ${extraCss}
  </style><div class="card">${body}</div>`;
}

/** The site card: portrait beside the name and role. */
async function siteCard() {
  const { title, role } = await siteCopy();
  const i = title.lastIndexOf(' ');
  const [first, last] = i === -1 ? [title, ''] : [title.slice(0, i), title.slice(i + 1)];

  return shell(
    `<div class="copy">
      <div class="name">${escape(first)}<br>${escape(last)}</div>
      <div class="rule"></div>
      <div class="role">${escape(role)}</div>
      <div class="site" style="margin-top:44px">MNMONZONES.COM</div>
    </div>
    <div class="shot"><img src="${await slotImage(path('src/assets/miguel.png'))}"></div>`,
    `.name{font-weight:600;font-size:76px;line-height:1.04;letter-spacing:-.025em;color:${INK}}
     .role{font-weight:400;font-size:33px;line-height:1.28;color:${INK_DECK};white-space:nowrap}`,
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
    `.copy{justify-content:space-between;padding-top:64px;padding-bottom:60px}
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
  const [{ title: siteTitle }, colours, posts] = await Promise.all([
    siteCopy(),
    tagColours(),
    articles(),
  ]);

  await mkdir(path(OUT_DIR), { recursive: true });

  await render(await siteCard(), path('public/og-image.png'), work);
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
