/*
 * Is the live site serving this build?
 *
 * Pushing `main` publishes through Cloudflare's git integration, which takes
 * a minute or two and gives no signal back here. Every ad-hoc way of checking
 * that has produced a false answer at least once — grepping one CSS bundle
 * when the rule lived in another, reading the wrong bundle's palette — so
 * this does the one comparison that cannot be fooled: for every page in
 * `dist/`, fetch the same route from the live origin and compare the hashed
 * asset filenames both reference. Astro content-hashes every bundle, so the
 * same filenames mean the same CSS and JS, and different ones mean the live
 * page is still the previous build. The HTML itself is compared as well and
 * reported separately, since it can differ for reasons that aren't a stale
 * deploy (a build-time date, say).
 *
 * `--wait N` keeps checking every 15 seconds for up to N seconds and returns
 * as soon as everything matches — the thing to run right after `git push`.
 *
 * Usage: node scripts/check-live.mjs [dist] [--origin https://mnmonzones.com] [--wait 600]
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const distDir = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--')) ?? 'dist';
const ORIGIN = String(flag('origin', 'https://mnmonzones.com')).replace(/\/$/, '');
const WAIT = Number(flag('wait', 0));

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

/** `dist/about/index.html` → `/about/`; `dist/404.html` → `/404.html`. */
const routeOf = (file) => {
  const rel = relative(distDir, file).split(sep).join('/');
  return rel === 'index.html' ? '/' : rel.endsWith('/index.html') ? `/${rel.slice(0, -'index.html'.length)}` : `/${rel}`;
};

const assetsOf = (html) => [...html.matchAll(/\/_astro\/[\w.-]+\.(?:css|js|mjs)/g)].map((m) => m[0]).sort().filter((v, i, a) => a[i - 1] !== v);
const squash = (html) => html.replace(/\s+/g, ' ').trim();

// Say up front if dist/ can't be what was pushed.
try {
  const dirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  const ahead = execSync('git rev-list --count @{upstream}..HEAD', { encoding: 'utf8' }).trim();
  const head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  console.log(`local HEAD ${head}${ahead !== '0' ? ` — ${ahead} commit(s) not pushed` : ''}${dirty ? ' — working tree has uncommitted changes' : ''}`);
} catch {
  /* not a git checkout, or no upstream; the comparison below still stands on its own */
}

// The old blog's URLs are kept alive as meta-refresh stubs with no assets of
// their own; the live host answers them with a redirect that fetch() follows
// to the destination page. There is nothing there to compare.
const isRedirectStub = (html) => /http-equiv=["']?refresh/i.test(html) && !/\/_astro\//.test(html);

const all = walk(distDir).map((file) => ({ file, route: routeOf(file), html: readFileSync(file, 'utf8') }));
const pages = all.filter((p) => !isRedirectStub(p.html));
if (pages.length < all.length) console.log(`${all.length - pages.length} redirect stubs skipped`);

async function checkOnce() {
  const stale = [];
  const htmlDiff = [];
  await Promise.all(
    pages.map(async (p) => {
      let live;
      try {
        const res = await fetch(ORIGIN + p.route, { headers: { 'cache-control': 'no-cache', pragma: 'no-cache' } });
        live = await res.text();
        if (!res.ok && p.route !== '/404.html') {
          stale.push(`${p.route} → HTTP ${res.status}`);
          return;
        }
      } catch (e) {
        stale.push(`${p.route} → ${e.message}`);
        return;
      }
      const a = assetsOf(p.html).join(',');
      const b = assetsOf(live).join(',');
      if (a !== b) stale.push(`${p.route} → assets differ\n      dist: ${a || '(none)'}\n      live: ${b || '(none)'}`);
      else if (squash(live) !== squash(p.html)) htmlDiff.push(p.route);
    }),
  );
  return { stale, htmlDiff };
}

const started = Date.now();
for (;;) {
  const { stale, htmlDiff } = await checkOnce();
  const elapsed = Math.round((Date.now() - started) / 1000);
  if (stale.length === 0) {
    console.log(`LIVE matches dist — ${pages.length} pages, same asset hashes${WAIT ? ` (after ${elapsed}s)` : ''}`);
    if (htmlDiff.length) {
      console.log(`HTML differs on ${htmlDiff.length} page(s) despite identical assets — usually a build-time value, worth a look:`);
      for (const r of htmlDiff) console.log(`  - ${r}`);
    }
    process.exit(0);
  }
  if (elapsed >= WAIT) {
    console.log(`${stale.length} of ${pages.length} pages on ${ORIGIN} do not match dist${WAIT ? ` after ${elapsed}s` : ''}:`);
    for (const s of stale) console.log(`  - ${s}`);
    process.exit(1);
  }
  process.stdout.write(`  ${stale.length} page(s) still stale at ${elapsed}s…\n`);
  await new Promise((r) => setTimeout(r, 15_000));
}
