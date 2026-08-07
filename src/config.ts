/**
 * Single source of truth for site-wide metadata.
 *
 * Everything that would otherwise be hardcoded across layouts, meta tags and
 * the Astro config lives here, so rebranding or moving to a custom domain is a
 * one-file change.
 */

export const SITE = {
  /** Absolute origin the site is served from. No trailing slash. */
  url: 'https://mmnzns.github.io',
  title: 'Miguel Monzones',
  /** Shown after the page title in the browser tab: "Projects · Miguel Monzones" */
  titleSeparator: '·',
  description: 'Portfolio, projects and writing by Miguel Monzones.',
  author: 'Miguel Monzones',
  /** BCP 47 language tag, used for <html lang>. */
  lang: 'en',
  /**
   * Link-preview image for Open Graph / Twitter cards, relative to the site
   * root. Drop a 1200x630 PNG in `public/` and point this at it — until then
   * it stays null and the image meta tags are omitted rather than pointing at
   * a URL that 404s.
   */
  ogImage: null as string | null,
} as const;

/** Primary navigation. Order here is the order rendered in the header. */
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
] as const;

/** Profile links rendered in the footer. Add or remove freely. */
export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/mmnzns' },
  // { label: 'LinkedIn', href: 'https://www.linkedin.com/in/…' },
  // { label: 'Email', href: 'mailto:…' },
] as const;
