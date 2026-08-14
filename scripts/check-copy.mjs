/*
 * The port verifier: reports design sentences that appear in no built page.
 *
 * This is the last step of every design port, and the reason the gen-*
 * scripts don't have to be perfect — anything they miss (or anything living
 * in a template rather than a data file) shows up here as a missing sentence.
 *
 * Rather than parsing the design's markup — which has proven unreliable on
 * these files — it pulls quoted JS strings and plain-text runs, keeps only
 * things that read as English sentences, and checks each against the whole
 * built site at once. A page-by-page check would produce false alarms for
 * shared components. Quotes, dashes and whitespace are normalised on both
 * sides, so straight-vs-curly differences don't count as missing.
 *
 * Expected leftovers on a clean port (anything else needs investigating):
 *  - the Case page's "case not found" fallback — this build can't render it,
 *    because a project without a case body fails the build instead
 *  - a design headline the repo intentionally shortens for its context, if
 *    one exists that round (grep the repo for a distinctive phrase to check)
 *
 * Usage: node scripts/check-copy.mjs "<design export dir>" dist
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const [designDir, distDir] = process.argv.slice(2);
if (!designDir || !distDir) {
  console.error('Usage: node scripts/check-copy.mjs <design export dir> <dist dir>');
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

const norm = (s) =>
  s
    .replace(/&nbsp;| /g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—-]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const haystack = norm(walk(distDir).map((f) => readFileSync(f, 'utf8')).join('\n'));

/** A sentence: several words, ending in terminal punctuation. */
const isSentence = (t) =>
  /[.!?]["')\]]?$/.test(t) && t.split(/\s+/).length >= 6 && /^[A-Z"“'‘(]/.test(t);

const missing = new Map();

for (const file of readdirSync(designDir).filter((f) => f.endsWith('.dc.html'))) {
  const raw = readFileSync(join(designDir, file), 'utf8').replace(/\r\n/g, '\n');
  const found = new Set();

  // Quoted strings from the design's own data arrays.
  for (const m of raw.matchAll(/'((?:[^'\\\n]|\\')+)'/g)) {
    found.add(m[1].replace(/\\'/g, "'").replace(/\\u2019/g, '’'));
  }
  // Text between tags.
  for (const m of raw.matchAll(/>([^<>{}]{20,})</g)) found.add(m[1]);

  for (const t of found) {
    const text = t.replace(/\s+/g, ' ').trim();
    if (!isSentence(text)) continue;
    if (text.includes('{{') || text.includes('://')) continue;
    if (haystack.includes(norm(text))) continue;
    if (!missing.has(file)) missing.set(file, []);
    missing.get(file).push(text);
  }
}

let total = 0;
for (const [file, list] of missing) {
  console.log(`\n### ${file} — ${list.length}`);
  for (const t of list) console.log(`  - ${t}`);
  total += list.length;
}
console.log(`\nTOTAL MISSING: ${total}`);
process.exitCode = total === 0 ? 0 : 1;
