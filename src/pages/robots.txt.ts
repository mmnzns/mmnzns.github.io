import type { APIContext } from 'astro';
import { SITE } from '../config';

/**
 * Generated rather than parked in `public/`, because the `Sitemap:` line has to
 * carry an absolute URL and a hand-typed one drifts.
 *
 * It did drift: moving to mnmonzones.com updated `SITE.url`, so the sitemap
 * itself followed, but the static robots.txt kept pointing crawlers at
 * mmnzns.github.io — a host that only redirects. A cross-host sitemap directive
 * is ignored rather than followed, so the sitemap went unread for as long as
 * that mismatch stood. Reading the origin from config means the two cannot
 * disagree again.
 */

/**
 * Crawlers that feed AI answers, listed explicitly.
 *
 * `User-agent: *` already permits all of them, so these groups change nothing
 * technically — a crawler obeys the most specific group that matches it, and
 * each of these says exactly what the wildcard says. They are here as a record
 * of intent: this site wants to be quotable by assistants, and the default is
 * one flipped wildcard away from silently reversing that.
 *
 * The trade-off is real and deliberate. Allowing these means the writing can be
 * used as training data with no attribution guarantee. For a portfolio that
 * exists to get its author quoted, cited and hired, being findable is worth
 * more than being withheld.
 */
const AI_AGENTS = [
  // OpenAI: training, search index, and on-demand fetches for a user's prompt.
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  // Anthropic.
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  // Perplexity.
  'PerplexityBot',
  'Perplexity-User',
  // Google and Apple gate AI use behind a separate token from their search
  // crawlers, so staying out of Gemini or Apple Intelligence answers is opt-out
  // only. Naming them keeps that choice visible rather than implicit.
  'Google-Extended',
  'Applebot-Extended',
  // Common Crawl, which a large number of models train from downstream.
  'CCBot',
  'meta-externalagent',
  'Amazonbot',
  'DuckAssistBot',
];

export function GET(context: APIContext) {
  const origin = (context.site ?? new URL(SITE.url)).origin;

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Assistants and AI search are welcome here — see the note in',
    '# src/pages/robots.txt.ts for why this is spelled out.',
    ...AI_AGENTS.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    `# A plain-text map of the site for language models, and every article's`,
    '# full text in one file.',
    `# ${origin}/llms.txt`,
    `# ${origin}/llms-full.txt`,
    '',
    `Sitemap: ${origin}/sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
