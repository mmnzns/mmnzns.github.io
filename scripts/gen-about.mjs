/*
 * Regenerates src/data/about.ts from the design's about page.
 *
 * Unlike the other design pages, About keeps almost everything inline in its
 * HTML — only ROLES is a JS structure (inside renderVals). So this scrapes,
 * anchored on the section labels and the data-reveal-group markers, and it
 * throws whenever an anchor or an expected count goes missing rather than
 * writing a partial file.
 *
 * Usage: node scripts/gen-about.mjs "<path to Monzones-D-About.dc.html>"
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readDesign, smart, text, q } from './lib/design.mjs';

const source = process.argv[2];
if (!source) {
  console.error('Usage: node scripts/gen-about.mjs <Monzones-D-About.dc.html>');
  process.exit(1);
}

const html = readDesign(source);

/** Slice from an anchor string to the next closing </section>. */
function section(anchor) {
  const i = html.indexOf(anchor);
  if (i === -1) throw new Error(`Anchor not found: ${anchor}`);
  return html.slice(i, html.indexOf('</section>', i));
}

/** All <p> bodies inside a fragment, as plain smart-quoted text. */
function paras(fragment, expected) {
  const out = [...fragment.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => smart(text(m[1])));
  if (expected && out.length !== expected) {
    throw new Error(`Expected ${expected} paragraphs, found ${out.length}.`);
  }
  return out;
}

const INTRO = paras(section('id="top"'), 3);
const WHAT_I_DO = paras(section('>What I do<'), 3);

const quoteM = html.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/);
if (!quoteM) throw new Error('No blockquote (scope quote) found.');
const SCOPE_QUOTE = smart(text(quoteM[1]));
const afterQuote = html.slice(html.indexOf('</blockquote>'));
const SCOPE_INTRO = smart(text(afterQuote.match(/<p[^>]*>([\s\S]*?)<\/p>/)[1]));

const SCOPE_PROOF = paras(
  afterQuote.slice(afterQuote.indexOf('class="proof"'), afterQuote.indexOf('"totals"')),
  3,
);

/*
 * Career totals: a value div (optionally carrying data-count / data-suffix for
 * the count-up animation) followed by its label div.
 */
const totalsBlock = section('class="totals"');
const TOTALS = [...totalsBlock.matchAll(
  /<div(?:\s+data-count="(\d+)")?(?:\s+data-suffix="([^"]*)")?\s+style="font-size:clamp\(30px[^>]*>([^<]+)<\/div>\s*<div[^>]*>([^<]+)<\/div>/g,
)].map((m) => ({
  value: m[3].trim(),
  label: m[4].trim(),
  countTo: m[1] ? Number(m[1]) : undefined,
  suffix: m[2] || undefined,
}));
if (TOTALS.length !== 4) throw new Error(`Expected 4 totals, found ${TOTALS.length}.`);

/*
 * Beliefs: claim div + body paragraph pairs. The last body opens with an <em>
 * (the Adinkra phrase), which about.ts keeps split so the page can italicise
 * it without markup living in data.
 */
const beliefsBlock = section('>What I believe<');
const BELIEFS = [...beliefsBlock.matchAll(
  /<div style="font-size:clamp\(22px[^>]*>([\s\S]*?)<\/div>\s*<p[^>]*>([\s\S]*?)<\/p>/g,
)].map(([, claim, body]) => {
  const em = body.trim().match(/^<em>([\s\S]*?)<\/em>([\s\S]*)$/);
  return {
    claim: smart(text(claim)),
    body: em ? { phrase: smart(text(em[1])), after: smart(text(em[2])) } : smart(text(body)),
  };
});
if (BELIEFS.length !== 5) throw new Error(`Expected 5 beliefs, found ${BELIEFS.length}.`);
if (typeof BELIEFS[BELIEFS.length - 1].body === 'string') {
  throw new Error('The last belief lost its <em> phrase — check the design markup.');
}

const OUTSIDE_WORK = paras(section('data-reveal-group="4"'), 4);
const TO_WORK_WITH = paras(section('data-reveal-group="5"'), 2);

// ROLES is the one JS structure on the page, inside renderVals().
const rolesStart = html.indexOf('roles: [');
if (rolesStart === -1) throw new Error('Could not find `roles: [` in the design file.');
// eslint-disable-next-line no-new-func
const ROLES = new Function(
  `return [${html.slice(rolesStart + 'roles: ['.length, html.indexOf(']', rolesStart))}]`,
)();
if (ROLES.length !== 5) throw new Error(`Expected 5 roles, found ${ROLES.length}.`);

/*
 * v8 adds a skills grid ("What I do, and what I do it in"), declared as a
 * SKILLS array inside the design's renderVals. Multi-line, so the end anchor
 * is the closing `];` on its own indentation rather than the first `]`.
 */
const skillsStart = html.indexOf('const SKILLS = [');
if (skillsStart === -1) throw new Error('Could not find `const SKILLS = [` in the design file.');
const skillsEnd = html.indexOf('\n    ];', skillsStart);
if (skillsEnd === -1) throw new Error('Could not find the end of the SKILLS array.');
// eslint-disable-next-line no-new-func
const SKILLS = new Function(
  `return [${html.slice(skillsStart + 'const SKILLS = ['.length, skillsEnd)}]`,
)();
if (SKILLS.length !== 8) throw new Error(`Expected 8 skill groups, found ${SKILLS.length}.`);

const videoHref = html.match(/href="(https:\/\/youtu\.be\/[^"]+)"/);
const videoLabel = html.match(/▶<\/span>\s*([^<]+?)\s*<\/a>/);
if (!videoHref || !videoLabel) throw new Error('Could not find the intro video link.');

const lines = [];
const w = (s = '') => lines.push(s);
const kv = (indent, key, value, width = 100) => {
  const one = `${indent}${key}: ${q(value)},`;
  if (one.length <= width) w(one);
  else {
    w(`${indent}${key}:`);
    w(`${indent}  ${q(value)},`);
  }
};

w('/**');
w(' * About page content.');
w(' *');
w(' * Prose lives here rather than in the template so the page file stays a layout');
w(' * and the wording stays reviewable in one place. Dates are taken from');
w(" * Website MD Repository/Professional History — they're checkable against");
w(" * LinkedIn, so they're never approximated.");
w(' *');
w(' * Generated by scripts/gen-about.mjs from the design export. Edit the design');
w(' * file and re-run rather than hand-editing the prose here.');
w(' */');
w('');
w('export const INTRO = [');
for (const p of INTRO) w(`  ${q(p)},`);
w('] as const;');
w('');
w('export const WHAT_I_DO = [');
for (const p of WHAT_I_DO) w(`  ${q(p)},`);
w('] as const;');
w('');
w('/** The pull quote above the three scope examples. */');
w(`export const SCOPE_QUOTE = ${q(SCOPE_QUOTE)};`);
w('');
w('export const SCOPE_INTRO =');
w(`  ${q(SCOPE_INTRO)};`);
w('');
w('export const SCOPE_PROOF = [');
for (const p of SCOPE_PROOF) w(`  ${q(p)},`);
w('] as const;');
w('');
w('/**');
w(' * Career totals. `countTo` opts a figure into the count-up animation — only');
w(' * plain integers qualify, since "1.5M+" can\'t be counted to sensibly.');
w(' */');
w('export const TOTALS = [');
for (const t of TOTALS) {
  const parts = [`value: ${q(t.value)}`, `label: ${q(smart(t.label))}`];
  if (t.countTo !== undefined) parts.push(`countTo: ${t.countTo}`);
  if (t.suffix !== undefined) parts.push(`suffix: ${q(t.suffix)}`);
  const one = `  { ${parts.join(', ')} },`;
  if (one.length <= 100) w(one);
  else {
    w('  {');
    for (const part of parts) w(`    ${part},`);
    w('  },');
  }
}
w('] as const;');
w('');
w('/**');
w(" * The beliefs list. Each entry is a claim and the reason it's held — the reason");
w(' * is what stops it reading as a slogan. The last one carries the Adinkra name,');
w(' * which is why its body is split around an italicised phrase.');
w(' */');
w('export const BELIEFS = [');
for (const b of BELIEFS) {
  w('  {');
  kv('    ', 'claim', b.claim);
  if (typeof b.body === 'string') kv('    ', 'body', b.body);
  else {
    w('    /** Split so the Adinkra name can be set in italics without markup in data. */');
    w('    body: {');
    kv('      ', 'phrase', b.body.phrase);
    kv('      ', 'after', b.body.after);
    w('    },');
  }
  w('  },');
}
w('] as const;');
w('');
w('export const OUTSIDE_WORK = [');
for (const p of OUTSIDE_WORK) w(`  ${q(p)},`);
w('] as const;');
w('');
w('export const TO_WORK_WITH = [');
for (const p of TO_WORK_WITH) w(`  ${q(p)},`);
w('] as const;');
w('');
w('/**');
w(' * Job titles here are the ones that appear on LinkedIn, and the same strings');
w(' * are used in the `meta` line of every case study in ./cases.ts. If one changes');
w(' * it has to change in both places, or a recruiter reading a case page and a');
w(' * recruiter reading this list see two different job titles.');
w(' */');
w('/**');
w(' * The skills grid: eight groups, each with a one-line summary and the tools');
w(" * behind it. Accents reuse the site's category tokens.");
w(' */');
w('export const SKILLS = [');
const ACCENT_TOKEN = {
  '#F2603F': 'var(--coral)',
  '#F5B841': 'var(--sun)',
  '#3E8FD8': 'var(--sky)',
  '#3FA981': 'var(--moss)',
};
for (const g of SKILLS) {
  const token = ACCENT_TOKEN[g.accent];
  if (!token) throw new Error(`Unmapped skill accent ${g.accent}`);
  w('  {');
  kv('    ', 'name', smart(g.name));
  w(`    accent: '${token}',`);
  kv('    ', 'skills', smart(g.skills));
  w(`    tools: [${g.tools.map((t) => q(smart(t))).join(', ')}],`);
  w('  },');
}
w('] as const;');
w('');
w('export const ROLES = [');
for (const r of ROLES) {
  w('  {');
  kv('    ', 'org', smart(r.org));
  kv('    ', 'title', smart(r.title));
  kv('    ', 'what', smart(r.what));
  kv('    ', 'years', smart(r.years));
  w('  },');
}
w('] as const;');
w('');
w('/** The 20-second intro clip, linked rather than embedded to keep the page light. */');
w('export const INTRO_VIDEO = {');
w(`  href: ${q(videoHref[1])},`);
w(`  label: ${q(smart(videoLabel[1]))},`);
w('} as const;');
w('');

const out = resolve('src/data/about.ts');
writeFileSync(out, lines.join('\n'), 'utf8');
console.log(
  `Wrote ${out}: ${INTRO.length}+${WHAT_I_DO.length} intro paras, ${SCOPE_PROOF.length} scope proofs, ` +
    `${TOTALS.length} totals, ${BELIEFS.length} beliefs, ${ROLES.length} roles.`,
);
