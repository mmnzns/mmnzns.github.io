import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, CONTACT } from '../config';

/**
 * Every published article's full text in one plain-text file.
 *
 * The point is retrieval. An assistant that has already found the site still
 * has to fetch and strip a page per article to quote any of it; this is the
 * whole corpus in one request, with each piece labelled by title, date, tag and
 * its canonical URL so a citation can point back at the real page.
 *
 * The bodies are the Markdown sources, not the rendered HTML, because Markdown
 * is what a model reads most cleanly. Nothing is summarised or rewritten on the
 * way out — `entry.body` is the same text the page renders from.
 */

/**
 * Markdown image syntax carries a relative source path that means nothing
 * outside the build, but the alt text is real description — several of these
 * articles explain a diagram in their alt attribute. Keep the words, drop the
 * dead path.
 */
function flattenImages(markdown: string) {
  return markdown.replace(/!\[([^\]]*)\]\([^)]*\)/g, (_match, alt) =>
    alt ? `[Image: ${alt}]` : '[Image]',
  );
}

export async function GET(context: APIContext) {
  const origin = (context.site ?? new URL(SITE.url)).origin;

  const posts = (await getCollection('thinking', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const head = [
    `# ${SITE.title} — ${SITE.role}`,
    '',
    `> Every published article from ${origin}, in full.`,
    '',
    `Author: ${SITE.author}. Contact: ${CONTACT.email} · ${CONTACT.linkedin}`,
    `Site map for models: ${origin}/llms.txt`,
    '',
    `${posts.length} articles, newest first.`,
    '',
  ];

  const articles = posts.map((post) =>
    [
      '---',
      '',
      `# ${post.data.title}`,
      '',
      `- URL: ${origin}/thinking/${post.id}/`,
      `- Published: ${post.data.date.toISOString().slice(0, 10)}`,
      `- Topic: ${post.data.tag}`,
      `- Author: ${SITE.author}`,
      '',
      `> ${post.data.excerpt}`,
      '',
      flattenImages(post.body ?? '').trim(),
      '',
    ].join('\n'),
  );

  return new Response([...head, ...articles].join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
