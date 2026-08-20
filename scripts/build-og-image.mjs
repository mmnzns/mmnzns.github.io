/**
 * Build the link-preview image at `public/og-image.png`.
 *
 * Run with `node scripts/build-og-image.mjs` after changing the portrait or the
 * role line. The output is committed, so this is not part of the build — it's a
 * one-off tool, same as build-icons.mjs.
 *
 * Why a composed card rather than a cropped photo: Open Graph wants 1200x630
 * (1.91:1) and every portrait we have is 0.67 or square, so cropping one to fit
 * reduces a headshot to a band across the eyes. The card gives the photo a
 * 452x630 slot — a 0.72 ratio, close enough to the source's 0.67 that the crop
 * is nearly native — and spends the remaining width on the name and role.
 *
 * Why headless Chrome rather than sharp compositing text: the card is set in
 * General Sans, which ships here as woff2. sharp rasterises SVG through librsvg,
 * whose webfont support is inconsistent, and a preview image that silently falls
 * back to a system font is worse than no preview image. Chrome renders the same
 * font stack the site uses, so what ships matches what a visitor sees. Fonts and
 * portrait are inlined as data URIs so the render needs no file-access flags.
 *
 * The text is deliberately evergreen. LinkedIn and Slack cache preview images
 * hard, so anything time-sensitive — the availability line, a client count —
 * would outlive its accuracy on somebody else's CDN. Name, role, domain only.
 */
import sharp from 'sharp';
import { execFile } from 'node:child_process';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const run = promisify(execFile);
const root = new URL('../', import.meta.url);
const path = (rel) => fileURLToPath(new URL(rel, root));

const OUT = path('public/og-image.png');
const PORTRAIT = path('src/assets/miguel.png');
const WIDTH = 1200;
const HEIGHT = 630;
/** Width of the portrait column. The rest is copy. */
const SHOT = 452;

/**
 * Chrome is the renderer. Override with CHROME=/path/to/binary if it lives
 * somewhere other than the macOS default.
 */
const CHROME =
  process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/**
 * Pull the strings out of src/config.ts rather than restating them, so the card
 * can't drift from the site's own title and role. Parsed as text because this
 * script runs on bare node with no TypeScript loader — the same approach the
 * gen-*.mjs scripts take in the other direction.
 */
async function copyFromConfig() {
  const src = await readFile(path('src/config.ts'), 'utf8');
  const read = (key) => {
    const m = src.match(new RegExp(`\\n\\s*${key}:\\s*'([^']+)'`));
    if (!m) throw new Error(`Could not find SITE.${key} in src/config.ts`);
    return m[1];
  };
  return { title: read('title'), role: read('role') };
}

/** Split "Miguel N. Monzones" so the surname gets its own line. */
function twoLines(name) {
  const i = name.lastIndexOf(' ');
  return i === -1 ? [name, ''] : [name.slice(0, i), name.slice(i + 1)];
}

async function dataUri(file, mime) {
  return `data:${mime};base64,${(await readFile(file)).toString('base64')}`;
}

async function buildHtml() {
  const { title, role } = await copyFromConfig();
  const [first, last] = twoLines(title);

  // 2x the slot, so the portrait is still sharp on a retina unfurl.
  const shot = await sharp(PORTRAIT)
    .resize({ width: SHOT * 2, height: HEIGHT * 2, fit: 'cover', position: 'top' })
    .jpeg({ quality: 92 })
    .toBuffer();

  const font = async (weight) =>
    dataUri(path(`public/fonts/general-sans-${weight}.woff2`), 'font/woff2');
  const [w400, w500, w600] = await Promise.all([font(400), font(500), font(600)]);

  // Tokens are copied from src/styles/global.css: --paper, --ink, --ink-deck,
  // --ink-3, --rule-2 and --coral.
  return `<!doctype html><meta charset="utf-8"><style>
  @font-face{font-family:'General Sans';src:url('${w400}') format('woff2');font-weight:400}
  @font-face{font-family:'General Sans';src:url('${w500}') format('woff2');font-weight:500}
  @font-face{font-family:'General Sans';src:url('${w600}') format('woff2');font-weight:600}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden}
  .card{width:${WIDTH}px;height:${HEIGHT}px;background:#fbf9f6;display:flex;
        font-family:'General Sans',sans-serif;-webkit-font-smoothing:antialiased}
  .copy{flex:1;padding-left:76px;display:flex;flex-direction:column;justify-content:center}
  .name{font-weight:600;font-size:76px;line-height:1.04;letter-spacing:-.025em;color:#1f1c19}
  .rule{width:68px;height:4px;background:#f2603f;border-radius:2px;margin:34px 0 30px}
  .role{font-weight:400;font-size:33px;line-height:1.28;color:#3d3833;white-space:nowrap}
  .site{margin-top:44px;font-weight:500;font-size:21px;letter-spacing:.05em;color:#9a938b}
  .shot{width:${SHOT}px;height:${HEIGHT}px;flex:none;border-left:1px solid #d9d1c6}
  .shot img{width:100%;height:100%;object-fit:cover;object-position:50% 12%;display:block}
  </style><div class="card"><div class="copy">
  <div class="name">${first}<br>${last}</div><div class="rule"></div>
  <div class="role">${role.replace(/&/g, '&amp;')}</div>
  <div class="site">MNMONZONES.COM</div></div>
  <div class="shot"><img src="data:image/jpeg;base64,${shot.toString('base64')}"></div></div>`;
}

const work = await mkdtemp(join(tmpdir(), 'og-'));
try {
  const page = join(work, 'card.html');
  await writeFile(page, await buildHtml());
  await run(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${WIDTH},${HEIGHT}`,
    `--screenshot=${OUT}`,
    `file://${page}`,
  ]);

  // Chrome's own PNG is already smaller than anything sharp re-encodes it to,
  // so this only verifies the geometry rather than touching the pixels.
  const meta = await sharp(OUT).metadata();
  if (meta.width !== WIDTH || meta.height !== HEIGHT) {
    throw new Error(`Expected ${WIDTH}x${HEIGHT}, got ${meta.width}x${meta.height}`);
  }
  console.log(`public/og-image.png — ${meta.width}x${meta.height}`);
} finally {
  await rm(work, { recursive: true, force: true });
}
