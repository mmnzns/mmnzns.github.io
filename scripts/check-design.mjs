/*
 * The design verifier: renders each design export next to the built page it
 * was ported to, in the same Chrome at the same widths, and reports where the
 * two look different.
 *
 * check-copy.mjs proves the *words* landed. It cannot see that a heading is
 * the wrong colour, that a band is paper where the design is dark, that body
 * text inherited 17px/1.65 from the main site instead of the export's
 * 16px/normal, or that every section sits flush left above 1320px. Each of
 * those shipped, each passed check-copy, and each was found by a person
 * looking at the live site afterwards. This script is that person.
 *
 * How it works:
 *  - Both folders are served over HTTP (the export's `support.js` fetches its
 *    `<dc-import>` components; `dist/` needs `/about/` → `/about/index.html`).
 *  - Each page loads with `prefers-reduced-motion: reduce` emulated. Both the
 *    export's motion.js and this site's Motion/layout scripts skip every
 *    scroll-reveal under that setting, so the pages are measured in their
 *    finished state instead of mid-animation with half the text at opacity 0.
 *  - Every visible text node is inventoried with its computed typography, its
 *    colour, the first painted background behind it, and its position. Nodes
 *    are paired across the two pages by normalised text (the same rules as
 *    check-copy: quotes, dashes and whitespace don't count), in document order.
 *  - Paired nodes are compared; blocks (the nearest block-level ancestor) are
 *    compared for left edge and width; the built page is also checked for
 *    horizontal overflow and WCAG AA contrast.
 *
 * Findings are grouped by signature — "38 <p> nodes at 17px where the design
 * has 16px" is one line, not thirty-eight — and ranked HIGH / MED / LOW. The
 * exit code is 1 when anything HIGH is left, so this can gate a commit the way
 * check-copy does. Templates the design renders from data (the case and
 * article pages) pick the first slug both sides have.
 *
 * What it does not do: pixel-diff. Two renders of the same design in different
 * markup will never be pixel-identical, and a diff image needs a person to read
 * it. Measuring computed style and geometry gives a finding that names the
 * text, the property, and both values.
 *
 * Usage:
 *   node scripts/check-design.mjs "<design export dir>" dist
 *       [--widths 375,1440] [--pages home,web-design] [--json report.json]
 *       [--examples 3] [--all]
 *
 * Needs Chrome or Edge installed (see lib/browser.mjs) and network access for
 * the export's Google Fonts. The built site's fonts are self-hosted.
 */
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { launch } from './lib/browser.mjs';
import { serve } from './lib/serve.mjs';
import { evalArray, readDesign } from './lib/design.mjs';

// ---------------------------------------------------------------- arguments

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  return args[i + 1];
};
const has = (name) => args.includes(`--${name}`);
const positional = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));

const [designDir, distDir] = positional;
if (!designDir || !distDir) {
  console.error(
    'Usage: node scripts/check-design.mjs <design export dir> <dist dir> [--widths 375,1440] [--pages a,b] [--json out] [--examples N] [--all]',
  );
  process.exit(1);
}
const WIDTHS = String(flag('widths', '375,1440')).split(',').map(Number);
const ONLY = flag('pages', null)?.split(',');
const EXAMPLES = has('all') ? Infinity : Number(flag('examples', 3));
const JSON_OUT = flag('json', null);

// -------------------------------------------------------------------- pages

/**
 * Which export renders which route. File names have changed between rounds
 * (v6 had no -Bold suffix, the web design home carries a version in its name)
 * so each entry matches by pattern against whatever the folder holds.
 * `dynamic` pages are templates driven by `#slug`; the slug is chosen at run
 * time from the ones both the export's data array and dist/ have.
 */
const PAGES = [
  { id: 'home', file: /^Monzones-D(-Paper|-Bold)?\.dc\.html$/, route: '/' },
  { id: 'about', file: /^Monzones-D-About(-Bold)?\.dc\.html$/, route: '/about/' },
  { id: 'work', file: /^Monzones-D-Work(-Bold)?\.dc\.html$/, route: '/work/' },
  { id: 'thinking', file: /^Monzones-D-Thinking(-Bold)?\.dc\.html$/, route: '/thinking/' },
  { id: '404', file: /^Monzones-D-404(-Bold)?\.dc\.html$/, route: '/404.html' },
  {
    id: 'case',
    file: /^Monzones-D-Case(-Bold)?\.dc\.html$/,
    route: '/work/{slug}/',
    dynamic: { array: 'CASES', dir: 'work' },
  },
  {
    id: 'article',
    file: /^Monzones-D-Article(-Bold)?\.dc\.html$/,
    route: '/thinking/{slug}/',
    dynamic: { array: 'POSTS', dir: 'thinking' },
  },
  { id: 'consulting', file: /^Monzones-C-Home\.dc\.html$/, route: '/consulting/' },
  { id: 'consulting-services', file: /^Monzones-C-Services\.dc\.html$/, route: '/consulting/services/' },
  { id: 'consulting-process', file: /^Monzones-C-Process\.dc\.html$/, route: '/consulting/process/' },
  { id: 'consulting-results', file: /^Monzones-C-Results\.dc\.html$/, route: '/consulting/results/' },
  { id: 'web-design', file: /^Monzones-W-Web-Design.*\.dc\.html$/, route: '/web-design/' },
  { id: 'web-design-work', file: /^Monzones-W-Work\.dc\.html$/, route: '/web-design/work/' },
  { id: 'web-design-process', file: /^Monzones-W-Process\.dc\.html$/, route: '/web-design/process/' },
  { id: 'web-design-pricing', file: /^Monzones-W-Pricing\.dc\.html$/, route: '/web-design/pricing/' },
];

const designFiles = readdirSync(designDir).filter((f) => f.endsWith('.dc.html'));

function resolvePage(p) {
  const file = designFiles.find((f) => p.file.test(f));
  if (!file) return { ...p, skip: `no export matching ${p.file}` };
  let route = p.route;
  let hash = '';
  if (p.dynamic) {
    let slugs;
    try {
      slugs = evalArray(readDesign(join(designDir, file)), p.dynamic.array)
        .map((e) => e.slug)
        .filter(Boolean);
    } catch (e) {
      return { ...p, file, skip: `could not read ${p.dynamic.array}: ${e.message}` };
    }
    const builtDir = join(distDir, p.dynamic.dir);
    const built = existsSync(builtDir)
      ? readdirSync(builtDir).filter((d) => statSync(join(builtDir, d)).isDirectory())
      : [];
    const slug = slugs.find((s) => built.includes(s));
    if (!slug) return { ...p, file, skip: `no slug shared by ${p.dynamic.array} and dist/${p.dynamic.dir}` };
    route = route.replace('{slug}', slug);
    hash = `#${slug}`;
  }
  const distPath = route.endsWith('/') ? join(distDir, route, 'index.html') : join(distDir, route);
  if (!existsSync(distPath)) return { ...p, file, skip: `dist has no ${route}` };
  return { ...p, file, route, hash };
}

// --------------------------------------------------------------- in-browser

/** Neutralise things that differ between two otherwise-equal renders. */
const FREEZE_CSS = `
  html { scrollbar-gutter: auto !important; }
  *, *::before, *::after { animation-play-state: paused !important; transition: none !important; caret-color: transparent !important; }
`;

/**
 * Runs inside the page. Returns every visible text node with the computed
 * facts the comparison needs, plus the block each belongs to and page-level
 * measurements. Kept dependency-free and ES2019-ish so it also runs against
 * the export's own runtime without interference.
 */
function inventory() {
  const norm = (s) =>
    s
      .replace(/ /g, ' ')
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[–—]/g, '-')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  const rgb = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c || '');
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };

  const bgCache = new Map();
  const effectiveBg = (el) => {
    for (let e = el; e; e = e.parentElement) {
      if (bgCache.has(e)) return bgCache.get(e);
      const cs = getComputedStyle(e);
      // A gradient sized to 0 wide is the animated-underline trick both
      // sides use on links, not a painted background.
      if (cs.backgroundImage && cs.backgroundImage !== 'none' && !/^0(px|%)?(\s|$)/.test(cs.backgroundSize)) {
        const v = { kind: 'image' };
        bgCache.set(e, v);
        return v;
      }
      const c = rgb(cs.backgroundColor);
      if (c && c.a >= 0.5) {
        const v = { kind: 'color', r: c.r, g: c.g, b: c.b };
        bgCache.set(e, v);
        return v;
      }
    }
    const root = rgb(getComputedStyle(document.documentElement).backgroundColor);
    return root && root.a > 0 ? { kind: 'color', r: root.r, g: root.g, b: root.b } : { kind: 'color', r: 255, g: 255, b: 255 };
  };

  const opacityOf = (el) => {
    let o = 1;
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      o *= parseFloat(getComputedStyle(e).opacity);
    }
    return o;
  };

  const animatedAncestor = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.animationName && cs.animationName !== 'none') return true;
    }
    return false;
  };

  /**
   * Is the node's box cut off by an overflow-clipping element (carousel,
   * marquee, the 1px visually-hidden pattern)? Starts at the element itself:
   * `.visually-hidden` clips its own text, and the text's range rect is still
   * full size because overflow doesn't shrink layout.
   */
  const clipped = (el, r) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (/(hidden|clip|auto|scroll)/.test(cs.overflowX + cs.overflowY)) {
        const b = e.getBoundingClientRect();
        if (r.right <= b.left + 1 || r.left >= b.right - 1 || r.bottom <= b.top + 1 || r.top >= b.bottom - 1) {
          return true;
        }
      }
    }
    return false;
  };

  // "line-height: normal" resolves per font; measure what it actually is so it
  // can be compared with an explicit value on the other side.
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;line-height:normal';
  probe.textContent = 'Hg';
  document.body.appendChild(probe);
  const normalCache = new Map();
  const normalLineHeight = (cs) => {
    const key = [cs.fontFamily, cs.fontSize, cs.fontWeight, cs.fontStyle, cs.fontStretch].join('|');
    if (!normalCache.has(key)) {
      probe.style.fontFamily = cs.fontFamily;
      probe.style.fontSize = cs.fontSize;
      probe.style.fontWeight = cs.fontWeight;
      probe.style.fontStyle = cs.fontStyle;
      probe.style.fontStretch = cs.fontStretch;
      normalCache.set(key, probe.getBoundingClientRect().height / parseFloat(cs.fontSize));
    }
    return normalCache.get(key);
  };

  const BLOCKISH = /^(block|flex|grid|list-item|table|table-cell|table-row|flow-root|inline-block|inline-flex|inline-grid)$/;
  const blockOf = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      if (BLOCKISH.test(getComputedStyle(e).display)) return e;
    }
    return document.body;
  };

  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'TITLE', 'HELMET', 'IFRAME', 'TEXTAREA']);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentElement;
      if (!p || SKIP.has(p.tagName) || p.closest('svg')) return NodeFilter.FILTER_REJECT;
      if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes = [];
  const blocks = [];
  const blockIndex = new Map();
  const range = document.createRange();
  const docW = document.documentElement.scrollWidth;

  while (walker.nextNode()) {
    const n = walker.currentNode;
    const p = n.parentElement;
    range.selectNodeContents(n);
    const r = range.getBoundingClientRect();
    // Zero-sized boxes are display:none or collapsed; 1px boxes are the
    // visually-hidden pattern. Neither is something a visitor sees.
    if (r.width < 2 || r.height < 2) continue;
    if (r.right <= 0 || r.left >= docW) continue;
    const cs = getComputedStyle(p);
    if (cs.visibility === 'hidden') continue;
    if (clipped(p, r)) continue;

    const blockEl = blockOf(p);
    if (!blockIndex.has(blockEl)) {
      const b = blockEl.getBoundingClientRect();
      blockIndex.set(blockEl, blocks.length);
      blocks.push({
        x: Math.round(b.left + scrollX),
        y: Math.round(b.top + scrollY),
        w: Math.round(b.width),
        h: Math.round(b.height),
        // The left edge is where the text starts, not the box: a flex item
        // wrapping the label directly and one wrapping it in a span put the
        // same glyphs at the same x with different block boxes.
        tx: Math.round(r.left + scrollX),
        tag: blockEl.tagName.toLowerCase(),
        cls: (blockEl.getAttribute('class') || '').split(/\s+/)[0] || '',
        anim: animatedAncestor(blockEl),
        parts: [],
      });
    }
    const bi = blockIndex.get(blockEl);
    const text = norm(n.nodeValue);
    blocks[bi].parts.push(text);

    const lhNum = cs.lineHeight === 'normal' ? normalLineHeight(cs) : parseFloat(cs.lineHeight) / parseFloat(cs.fontSize);
    nodes.push({
      t: text,
      raw: n.nodeValue.replace(/\s+/g, ' ').trim().slice(0, 70),
      tag: p.tagName.toLowerCase(),
      x: Math.round(r.left + scrollX),
      y: Math.round(r.top + scrollY),
      w: Math.round(r.width),
      h: Math.round(r.height),
      fs: parseFloat(cs.fontSize),
      fw: Number(cs.fontWeight),
      fst: cs.fontStyle,
      ff: cs.fontFamily.split(',')[0].replace(/["']/g, '').replace(/\s*variable$/i, '').trim().toLowerCase(),
      lh: Math.round(lhNum * 100) / 100,
      ls: cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing),
      tt: cs.textTransform,
      col: rgb(cs.color),
      bg: effectiveBg(p),
      op: Math.round(opacityOf(p) * 100) / 100,
      anim: animatedAncestor(p),
      blk: bi,
    });
  }
  probe.remove();

  for (const b of blocks) {
    b.t = b.parts.join(' ').replace(/\s+/g, ' ').trim();
    delete b.parts;
  }

  return {
    nodes,
    blocks,
    scrollW: document.documentElement.scrollWidth,
    innerW: innerWidth,
    height: document.documentElement.scrollHeight,
  };
}

// --------------------------------------------------------------- comparison

const hex = (c) => (c ? '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('') : 'none');
const dist = (a, b) => (a && b ? Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b) : Infinity);
const bgLabel = (bg) => (bg.kind === 'image' ? 'image' : hex(bg));
const bgDist = (a, b) => (a.kind !== b.kind ? (a.kind === 'image' || b.kind === 'image' ? 60 : Infinity) : dist(a, b));

const luminance = ({ r, g, b }) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (fg, bg) => {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const isLarge = (n) => n.fs >= 24 || (n.fs >= 18.66 && n.fw >= 700);

/** Pair nodes across the two inventories by normalised text, in document order. */
function pair(design, site, key = (n) => n.t) {
  const bySite = new Map();
  for (const n of site) {
    const k = key(n);
    if (!bySite.has(k)) bySite.set(k, []);
    bySite.get(k).push(n);
  }
  const pairs = [];
  const designOnly = [];
  for (const d of design) {
    const list = bySite.get(key(d));
    if (list && list.length) pairs.push([d, list.shift()]);
    else designOnly.push(d);
  }
  const siteOnly = [...bySite.values()].flat();
  return { pairs, designOnly, siteOnly };
}

const meaningful = (t) => t.replace(/[^a-z0-9]/g, '').length >= 2;

function compare(design, site, width) {
  const findings = [];
  const add = (sev, cat, sig, example, detail) => findings.push({ sev, cat, sig, example, detail });

  const { pairs, designOnly } = pair(
    design.nodes.filter((n) => meaningful(n.t)),
    site.nodes.filter((n) => meaningful(n.t)),
  );

  for (const [d, s] of pairs) {
    const where = `<${s.tag}>`;
    if (s.op < 0.1 && d.op >= 0.5) {
      add('HIGH', 'invisible', `${where} opacity ${s.op}`, s.raw, 'visible in the design, opacity 0 on the site');
      continue;
    }
    if (d.ff !== s.ff) {
      // A UA default on the design side (a <button> that never inherited the
      // page font) is the export's CSS bug, not the site's — port the intent.
      const uaFallback = /^(arial|times new roman|helvetica|system-ui|-apple-system|segoe ui)$/.test(d.ff);
      add(uaFallback ? 'LOW' : 'HIGH', 'font-family', `${where} ${d.ff} → ${s.ff}${uaFallback ? ' — design fell back to a UA font' : ''}`, s.raw);
    }
    const dfs = Math.abs(d.fs - s.fs);
    if (dfs > Math.max(1, d.fs * 0.05)) {
      add(dfs >= 4 ? 'HIGH' : 'MED', 'font-size', `${where} ${r1(d.fs)}px → ${r1(s.fs)}px`, s.raw);
    }
    if (d.fw !== s.fw) add(Math.abs(d.fw - s.fw) >= 200 ? 'HIGH' : 'MED', 'font-weight', `${where} ${d.fw} → ${s.fw}`, s.raw);
    if (d.fst !== s.fst) add('MED', 'font-style', `${where} ${d.fst} → ${s.fst}`, s.raw);
    if (d.tt !== s.tt) add('MED', 'text-transform', `${where} ${d.tt} → ${s.tt}`, s.raw);
    if (Math.abs(d.lh - s.lh) > 0.1) add('MED', 'line-height', `${where} ${d.lh} → ${s.lh}`, s.raw);
    if (Math.abs(d.ls - s.ls) > 0.6) add('LOW', 'letter-spacing', `${where} ${r1(d.ls)}px → ${r1(s.ls)}px`, s.raw);
    // Transparent text with a stroke (the outlined numerals) has no fill
    // colour to compare; its stroke is not in the computed style.
    const outlined = (d.col?.a ?? 1) < 0.1 || (s.col?.a ?? 1) < 0.1;
    const dc = outlined ? 0 : dist(d.col, s.col);
    if (dc > 30) add(dc > 80 ? 'HIGH' : 'MED', 'color', `${where} ${hex(d.col)} → ${hex(s.col)}`, s.raw);
    const db = bgDist(d.bg, s.bg);
    if (db > 30) add(db > 80 ? 'HIGH' : 'MED', 'background', `${where} ${bgLabel(d.bg)} → ${bgLabel(s.bg)}`, s.raw);
  }

  // Text the design shows that never paired. Node splitting differs between
  // the two markups (an <em> in one, a <span> in the other), so this is
  // advisory unless the run is long enough to be a real sentence — check-copy
  // is the authority on missing words.
  for (const d of designOnly) {
    if (d.t.length >= 40) add('MED', 'design-only', 'visible in design, not found visible on site', d.raw);
  }

  // Geometry, at block level.
  const bp = pair(
    design.blocks.filter((b) => meaningful(b.t) && !b.anim),
    site.blocks.filter((b) => meaningful(b.t) && !b.anim),
  );
  let prev = null;
  for (const [d, s] of bp.pairs) {
    const where = `<${s.tag}${s.cls ? '.' + s.cls : ''}>`;
    // A heading or paragraph starting somewhere else is the section-level
    // misalignment this exists to catch. A card label at another x is more
    // often the card in another slot — the site has a newer article, say —
    // so it stays MED.
    const dx = Math.abs(d.tx - s.tx);
    if (dx > 8) {
      const structural = /^(h[1-6]|p)$/.test(s.tag);
      add(dx > 40 && structural ? 'HIGH' : 'MED', 'left-edge', `${where} x ${d.tx} → ${s.tx} (Δ${s.tx - d.tx})`, s.t.slice(0, 70));
    }
    const dw = Math.abs(d.w - s.w);
    if (dw > Math.max(12, width * 0.04)) add('LOW', 'width', `${where} ${d.w} → ${s.w}px`, s.t.slice(0, 70));
    if (prev) {
      const gapD = d.y - (prev[0].y + prev[0].h);
      const gapS = s.y - (prev[1].y + prev[1].h);
      const dg = Math.abs(gapD - gapS);
      if (dg > 24) add(dg > 64 ? 'MED' : 'LOW', 'spacing', `${where} gap above ${gapD} → ${gapS}px`, s.t.slice(0, 70));
    }
    prev = [d, s];
  }

  // Page-level.
  if (site.scrollW > site.innerW) {
    add('HIGH', 'overflow', `site scrolls horizontally: ${site.scrollW} > ${site.innerW}`, '', 'design: ' + (design.scrollW > design.innerW ? 'also overflows' : 'fits'));
  }
  const dh = Math.abs(design.height - site.height) / design.height;
  if (dh > 0.15) add('LOW', 'page-height', `design ${design.height}px → site ${site.height}px`, '');

  // Contrast on what ships. A failure the design itself has is still reported,
  // but ranked LOW: it is the export's decision, not a porting error.
  const designFails = new Set(
    design.nodes.filter((n) => n.bg.kind === 'color' && n.op >= 0.5 && contrast(n.col, n.bg) < (isLarge(n) ? 3 : 4.5)).map((n) => n.t),
  );
  for (const n of site.nodes) {
    if (n.bg.kind !== 'color' || n.op < 0.5 || !meaningful(n.t) || (n.col?.a ?? 1) < 0.1) continue;
    const c = contrast(n.col, n.bg);
    const need = isLarge(n) ? 3 : 4.5;
    if (c >= need) continue;
    const sev = designFails.has(n.t) ? 'LOW' : c < 3 ? 'HIGH' : 'MED';
    add(sev, 'contrast', `<${n.tag}> ${hex(n.col)} on ${hex(n.bg)} = ${c.toFixed(2)}:1 (needs ${need})${designFails.has(n.t) ? ' — design too' : ''}`, n.raw);
  }

  return { findings, matched: pairs.length, designNodes: design.nodes.length, siteNodes: site.nodes.length };
}

const r1 = (n) => Math.round(n * 10) / 10;

// ------------------------------------------------------------------- report

const RANK = { HIGH: 0, MED: 1, LOW: 2 };

function group(findings) {
  const bySig = new Map();
  for (const f of findings) {
    const k = `${f.sev}|${f.cat}|${f.sig}`;
    if (!bySig.has(k)) bySig.set(k, { ...f, count: 0, examples: [] });
    const g = bySig.get(k);
    g.count++;
    if (f.example && g.examples.length < EXAMPLES && !g.examples.includes(f.example)) g.examples.push(f.example);
  }
  return [...bySig.values()].sort((a, b) => RANK[a.sev] - RANK[b.sev] || a.cat.localeCompare(b.cat) || b.count - a.count);
}

// --------------------------------------------------------------------- main

const pages = PAGES.map(resolvePage).filter((p) => !ONLY || ONLY.includes(p.id));
const designServer = await serve(designDir);
const siteServer = await serve(distDir);
const browser = await launch();

async function render(url, width) {
  const page = await browser.newPage();
  try {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.setViewport({ width, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 90_000 });
    await page.addStyleTag({ content: FREEZE_CSS });
    await page.evaluate(() => document.fonts.ready);
    // The export expands `{{ }}` client-side; give it until it has.
    await page.waitForFunction(() => !/\{\{/.test(document.body.innerText), { timeout: 10_000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 250));
    return await page.evaluate(inventory);
  } finally {
    await page.close();
  }
}

const report = [];
const totals = { HIGH: 0, MED: 0, LOW: 0 };

for (const p of pages) {
  if (p.skip) {
    console.log(`\n## ${p.id} — skipped: ${p.skip}`);
    report.push({ page: p.id, skipped: p.skip });
    continue;
  }
  for (const width of WIDTHS) {
    const designUrl = `${designServer.origin}/${encodeURIComponent(p.file)}${p.hash ?? ''}`;
    const siteUrl = `${siteServer.origin}${p.route}`;
    let design;
    let site;
    try {
      design = await render(designUrl, width);
      site = await render(siteUrl, width);
    } catch (e) {
      console.log(`\n## ${p.id} @${width} — failed to render: ${e.message}`);
      report.push({ page: p.id, width, error: e.message });
      continue;
    }
    const result = compare(design, site, width);
    const groups = group(result.findings);
    const counts = { HIGH: 0, MED: 0, LOW: 0 };
    for (const f of result.findings) counts[f.sev]++;
    for (const k of Object.keys(totals)) totals[k] += counts[k];

    console.log(
      `\n## ${p.id} @${width}  (${p.file} → ${p.route}; design ${result.designNodes} nodes, site ${result.siteNodes}, paired ${result.matched})`,
    );
    console.log(`   HIGH ${counts.HIGH} · MED ${counts.MED} · LOW ${counts.LOW}`);
    for (const g of groups) {
      console.log(`   ${g.sev.padEnd(4)} ${g.cat.padEnd(14)} ×${String(g.count).padStart(3)}  ${g.sig}${g.detail ? ' — ' + g.detail : ''}`);
      for (const ex of g.examples) console.log(`        · "${ex}"`);
    }
    report.push({ page: p.id, width, counts, findings: groups, matched: result.matched });
  }
}

await browser.close();
await designServer.close();
await siteServer.close();

console.log('\n==================================================================');
console.log(`TOTAL  HIGH ${totals.HIGH} · MED ${totals.MED} · LOW ${totals.LOW}`);
if (JSON_OUT) {
  writeFileSync(resolve(JSON_OUT), JSON.stringify(report, null, 2));
  console.log(`report written to ${JSON_OUT}`);
}
process.exitCode = totals.HIGH === 0 ? 0 : 1;
