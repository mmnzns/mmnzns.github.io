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
  title: 'Miguel N. Monzones',
  /** Shown after the page title in the browser tab: "The Work · Miguel N. Monzones" */
  titleSeparator: '·',
  role: 'Lifecycle & GTM Strategist',
  description:
    "Senior lifecycle and GTM strategist with 11 years in fintech, SaaS, and ecommerce. I read what's actually wrong, decide what should exist, then build it.",
  author: 'Miguel N. Monzones',
  location: 'Vancouver, BC',
  /** Rendered as the availability pill in the header and hero. Set to null to hide. */
  availability: 'Open to senior lifecycle, GTM & automation roles',
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

export const CONTACT = {
  email: 'miguel@mnmonzones.com',
  phone: '+1 778 829 6453',
  linkedin: 'https://www.linkedin.com/in/mmonzones/',
  entity: 'MNM Alaminos Consulting Ltd.',
} as const;

/**
 * Primary navigation. Order here is the order rendered in the header, and
 * Consulting sits ahead of Work deliberately: the site now leads with what
 * Miguel is available for rather than with the archive of what he has done.
 */
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Consulting', href: '/consulting/' },
  { label: 'Work', href: '/work/' },
  { label: 'Writing', href: '/thinking/' },
  { label: 'About', href: '/about/' },
] as const;

/**
 * The header's single call to action, kept out of NAV_LINKS so it can be
 * styled and positioned separately.
 */
export const NAV_CTA = { label: 'Work with me', href: '/consulting/#contact' } as const;

/**
 * Formspree endpoint behind every contact form on the site. Forms POST here
 * directly, so they keep working with JavaScript disabled; the enhancement
 * script only upgrades the response to an inline message.
 */
export const FORM_ENDPOINT = 'https://formspree.io/f/xjybrpnw';
