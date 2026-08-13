import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config';

/** Generated from the same collection the writing index reads, so it can't drift. */
export async function GET(context: APIContext) {
  const posts = (await getCollection('thinking', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: `${SITE.title} — The Thinking`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      categories: [post.data.tag],
      link: `/thinking/${post.id}/`,
    })),
  });
}
