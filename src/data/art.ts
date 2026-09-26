import type { ImageMetadata } from 'astro';

/**
 * The v19 collage illustrations, looked up by filename (no extension).
 *
 * The export references the same piece from several places — a case card, the
 * case header, the next/previous links, a writing card — so data files name the
 * art and pages resolve it here. An unknown name throws at build time rather
 * than shipping an empty frame.
 */
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/art/*.webp', { eager: true });

const ART = new Map(
  Object.entries(files).map(([path, mod]) => [path.replace(/^.*\/(.+)\.webp$/, '$1'), mod.default]),
);

export function art(name: string): ImageMetadata {
  const found = ART.get(name);
  if (!found) throw new Error(`No illustration "${name}" in src/assets/art/.`);
  return found;
}
