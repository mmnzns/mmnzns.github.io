import { getCollection, type CollectionEntry } from 'astro:content';
import { readingTime } from './format';

export type Post = CollectionEntry<'thinking'>;

/** Published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('thinking', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const postHref = (post: Post) => `/thinking/${post.id}/`;

/**
 * "Field note No. 12" — numbered in publishing order, so the first post ever
 * written is 01 and a new post takes the next number. Derived from the sorted
 * list, never stored.
 */
export function noteNumber(post: Post, newestFirst: readonly Post[]): string {
  return String(newestFirst.length - newestFirst.indexOf(post)).padStart(2, '0');
}

export const minutes = (post: Post) => readingTime(post.body ?? '');

/** The card blurb: the short dek where one was written, the excerpt otherwise. */
export const dekOf = (post: Post) => post.data.dek ?? post.data.excerpt;
