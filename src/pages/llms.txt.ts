import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, CONTACT, NAV_LINKS, NAV_SERVICES } from '../config';
import { PROJECTS } from '../data/site';

/**
 * A plain-text map of the site for language models, following the llms.txt
 * convention: an H1, a blockquote summary, then link lists with one line of
 * context each.
 *
 * Why bother when the HTML is already static and crawlable: an assistant
 * answering "who works on lifecycle in Vancouver" is working from whatever it
 * can cheaply parse. This puts the whole shape of the site — the work, every
 * article, the contact route — in one request with no markup to wade through.
 *
 * Every string here is copy that already exists elsewhere in the site. Nothing
 * is written specially for this file, so it cannot make a claim the site itself
 * does not make. `/llms-full.txt` carries the articles in full.
 */
export async function GET(context: APIContext) {
  const origin = (context.site ?? new URL(SITE.url)).origin;
  const url = (path: string) => `${origin}${path}`;

  const posts = (await getCollection('thinking', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const iso = (date: Date) => date.toISOString().slice(0, 10);

  const body = [
    `# ${SITE.title} — ${SITE.role}`,
    '',
    `> ${SITE.description}`,
    '',
    /* No trailing full stop after the entity — it already ends in "Ltd." */
    `Based in ${SITE.location}.`,
    `Consulting entity: ${CONTACT.entity}`,
    `Contact: ${CONTACT.email} · ${CONTACT.linkedin}`,
    '',
    '## Pages',
    '',
    ...[...NAV_LINKS, ...NAV_SERVICES].map((link) => `- [${link.label}](${url(link.href)})`),
    '',
    '## Work',
    '',
    ...PROJECTS.map(
      (project) =>
        `- [${project.title}](${url(`/work/${project.slug}/`)}): ${project.problem} (${project.category})`,
    ),
    '',
    '## Writing',
    '',
    ...posts.map(
      (post) =>
        `- [${post.data.title}](${url(`/thinking/${post.id}/`)}): ${post.data.excerpt} (${post.data.tag}, published ${iso(post.data.date)})`,
    ),
    '',
    '## Full text',
    '',
    `- [Every article in one file](${url('/llms-full.txt')})`,
    `- [RSS feed](${url('/rss.xml')})`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
