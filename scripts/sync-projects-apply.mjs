/*
 * Applies the design's work-index copy to src/data/site.ts.
 *
 * Only `title`, `problem` and `tags` are touched — category and the
 * before/after metric shape have no design equivalent and are left alone.
 * Run scripts/sync-projects.mjs first to see what will change.
 *
 * Usage: node scripts/sync-projects-apply.mjs "<path to Monzones-D-Work.dc.html>"
 */
import { readFileSync, writeFileSync } from 'node:fs';

const source = process.argv[2];
if (!source) {
  console.error('Usage: node scripts/sync-projects-apply.mjs <Monzones-D-Work.dc.html>');
  process.exit(1);
}

const html = readFileSync(source, 'utf8').replace(/\r\n/g, '\n');
const start = html.indexOf('const GROUPS = [');
const end = html.indexOf('\n];', start);
const A = { coral: '#F2603F', sun: '#F5B841', sky: '#3E8FD8', moss: '#3FA981' };
const groups = new Function(
  'A',
  `return [${html.slice(start + 'const GROUPS = ['.length, end)}]`,
)(A);

const design = new Map();
for (const g of groups) for (const item of g.items) design.set(item.slug, item);

let site = readFileSync('src/data/site.ts', 'utf8').replace(/\r\n/g, '\n');
const q = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

let changed = 0;
for (const [slug, d] of design) {
  const i = site.indexOf(`slug: '${slug}'`);
  if (i === -1) throw new Error(`${slug} is not in PROJECTS`);
  const stop = site.indexOf('\n  },', i);
  let b = site.slice(i, stop);
  const before = b;

  /*
   * Strings may sit on the key's line or wrap onto the next one, and a value
   * containing an apostrophe is written double-quoted — so both quote styles
   * have to match or that entry is silently skipped.
   */
  const str = `(?:'(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*")`;
  b = b.replace(new RegExp(`title:\\s*\\n?\\s*${str}`), `title: ${q(d.title)}`);
  b = b.replace(new RegExp(`problem:\\s*\\n?\\s*${str}`), `problem:\n      ${q(d.summary)}`);
  const tags = d.tags
    .split('/')
    .map((t) => q(t.trim()))
    .join(', ');
  b = b.replace(/tags:\s*\[[^\]]*\]/, `tags: [${tags}]`);

  if (b !== before) {
    site = site.slice(0, i) + b + site.slice(stop);
    changed++;
  }
}

writeFileSync('src/data/site.ts', site, 'utf8');
console.log(`Updated ${changed} project(s) in src/data/site.ts.`);
