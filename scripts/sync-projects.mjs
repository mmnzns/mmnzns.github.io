/*
 * Reports where src/data/site.ts disagrees with the design's work index.
 *
 * It prints a diff rather than rewriting the file, because PROJECTS carries
 * fields the design has no equivalent for (category, the before/after metric
 * shape) and a regenerated file would quietly drop them. Apply what it lists.
 *
 * Usage: node scripts/sync-projects.mjs "<path to Monzones-D-Work.dc.html>"
 */
import { readFileSync } from 'node:fs';
import { readDesign } from './lib/design.mjs';

const source = process.argv[2];
if (!source) {
  console.error('Usage: node scripts/sync-projects.mjs <Monzones-D-Work.dc.html>');
  process.exit(1);
}

const html = readDesign(source);
const start = html.indexOf('const GROUPS = [');
const end = html.indexOf('\n];', start);
if (start === -1 || end === -1) throw new Error('Could not find the GROUPS array.');

const A = { coral: '#F2603F', sun: '#F5B841', sky: '#3E8FD8', moss: '#3FA981' };
const groups = new Function(
  'A',
  `return [${html.slice(start + 'const GROUPS = ['.length, end)}]`,
)(A);

const design = new Map();
for (const g of groups) {
  for (const item of g.items) design.set(item.slug, { ...item, group: g.name });
}

const site = readFileSync('src/data/site.ts', 'utf8').replace(/\r\n/g, '\n');

/** Pull one project block out of PROJECTS by slug. */
function block(slug) {
  const i = site.indexOf(`slug: '${slug}'`);
  if (i === -1) return null;
  const stop = site.indexOf('\n  },', i);
  return site.slice(i, stop);
}

/*
 * A value containing an apostrophe is written double-quoted in site.ts, so
 * both quote styles have to match — otherwise that entry reads as missing.
 */
const field = (b, name) => {
  const m = b.match(
    new RegExp(`${name}:\\s*\\n?\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)")`),
  );
  if (!m) return null;
  return (m[1] ?? m[2]).replace(/\\(['"])/g, '$1');
};

let diffs = 0;
for (const [slug, d] of design) {
  const b = block(slug);
  if (!b) {
    console.log(`\n!! ${slug} — not in PROJECTS at all`);
    diffs++;
    continue;
  }
  const lines = [];
  const title = field(b, 'title');
  if (title !== d.title) lines.push(`   title    now: ${title}\n            want: ${d.title}`);
  const problem = field(b, 'problem');
  if (problem !== d.summary) {
    lines.push(`   problem  now: ${problem}\n            want: ${d.summary}`);
  }
  const tagsRaw = b.match(/tags:\s*\[([^\]]*)\]/);
  const tags = tagsRaw ? tagsRaw[1].match(/'([^']*)'/g)?.map((t) => t.slice(1, -1)) ?? [] : [];
  const wantTags = d.tags.split('/').map((t) => t.trim());
  if (tags.join(' / ') !== wantTags.join(' / ')) {
    lines.push(`   tags     now: ${tags.join(' / ')}\n            want: ${wantTags.join(' / ')}`);
  }
  if (lines.length) {
    console.log(`\n## ${slug}`);
    console.log(lines.join('\n'));
    diffs += lines.length;
  }
}

for (const slug of [...site.matchAll(/slug: '([^']+)'/g)].map((m) => m[1])) {
  if (!design.has(slug)) console.log(`\n?? ${slug} — in PROJECTS but not in the design`);
}

console.log(`\n${diffs} difference(s).`);
