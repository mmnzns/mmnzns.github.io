/*
 * Shared plumbing for the gen-* scripts that read a design export.
 *
 * Two facts about the export shape everything here:
 *  - Repeating content lives in plain JS arrays inside the page's trailing
 *    <script>, so it is evaluated rather than scraped.
 *  - One-off content is inline HTML with straight apostrophes, while this
 *    repo's data files use typographic ones — so every string that leaves
 *    this module goes through smart() first.
 */
import { readFileSync } from 'node:fs';

/** The four accents as the design writes them, hex → token name. */
export const ACCENT_TOKEN = {
  '#F2603F': 'coral',
  '#F5B841': 'sun',
  '#3E8FD8': 'sky',
  '#3FA981': 'moss',
};

const ACCENTS = { coral: '#F2603F', sun: '#F5B841', sky: '#3E8FD8', moss: '#3FA981' };

/**
 * The design tool exports two shapes, and a round may ship either one:
 *
 *  - a plain `.dc.html`, which *is* the page document; and
 *  - a "Website standalone" build, which wraps that same document inside a
 *    loader page as a single double-quoted JS string literal — newlines
 *    arrive as the two characters \ and n, and inner double quotes are
 *    escaped, while single quotes are not.
 *
 * That escaping is exactly JSON string syntax, so the literal is parsed
 * rather than unescaped by hand. Returns the inner document for a standalone
 * file and the input unchanged for a plain one, so callers never care which
 * they were handed.
 */
export function unwrapStandalone(raw) {
  const open = raw.indexOf('"<!DOCTYPE html>\\n');
  if (open === -1) return raw;

  let end = -1;
  for (let p = open + 1; p < raw.length; p++) {
    if (raw[p] === '\\') {
      p++;
      continue;
    }
    if (raw[p] === '"') {
      end = p;
      break;
    }
  }
  if (end === -1) {
    throw new Error('Standalone export: the embedded document has no closing quote.');
  }
  try {
    return JSON.parse(raw.slice(open, end + 1));
  } catch (e) {
    throw new Error(`Standalone export: could not parse the embedded document — ${e.message}`);
  }
}

export function readDesign(path) {
  return unwrapStandalone(readFileSync(path, 'utf8')).replace(/\r\n/g, '\n');
}

/**
 * The v9 consulting page paints from four named pastels rather than the four
 * accents. Every reference to one comes back as the literal token string the
 * data file re-exports, so a swatch stays a name end to end.
 */
const PASTELS = new Proxy(
  {},
  { get: (_, key) => (typeof key === 'string' ? `PASTELS.${key}` : undefined) },
);

/**
 * Evaluate a `const NAME = [ ... ];` array out of a design file. The design
 * references its palette as `A`, `ACCENTS` or `PASTELS` depending on the
 * page, so all three names are provided.
 */
export function evalArray(html, name) {
  const marker = `const ${name} = [`;
  const start = html.indexOf(marker);
  if (start === -1) throw new Error(`Could not find \`${marker}\` in the design file.`);
  const end = html.indexOf('\n];', start);
  if (end === -1) throw new Error(`Could not find the end of the ${name} array.`);
  const body = html.slice(start + marker.length, end);
  // eslint-disable-next-line no-new-func
  return new Function('A', 'ACCENTS', 'PASTELS', `return [${body}]`)(ACCENTS, ACCENTS, PASTELS);
}

/**
 * Straight quotes → typographic. The design's JS arrays and inline HTML use
 * straight apostrophes; the data files here use ’ and “ ” throughout. Curly
 * input passes through untouched, so this is safe to apply unconditionally.
 */
export function smart(s) {
  return String(s)
    .replace(/(^|[\s([—–-])"/g, '$1“')
    .replace(/"/g, '”')
    .replace(/'/g, '’');
}

/** Decode the few entities the export actually uses, then strip tags. */
export function text(htmlFragment) {
  return htmlFragment
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Single-quoted TS string literal. */
export function q(s) {
  return `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

/**
 * Read a top-level field out of one PROJECTS block in src/data/site.ts —
 * used to carry repo-only fields (category) into regenerated files without
 * hardcoding them in a generator.
 */
export function siteField(siteSource, slug, field) {
  const i = siteSource.indexOf(`slug: '${slug}'`);
  if (i === -1) throw new Error(`${slug} is not in PROJECTS (src/data/site.ts).`);
  const stop = siteSource.indexOf('\n  },', i);
  const m = siteSource
    .slice(i, stop)
    .match(new RegExp(`${field}:\\s*\\n?\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)")`));
  if (!m) throw new Error(`${slug} has no ${field} in PROJECTS.`);
  return (m[1] ?? m[2]).replace(/\\(['"])/g, '$1');
}
