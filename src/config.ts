/**
 * Single source of truth for site-wide metadata.
 *
 * Everything that would otherwise be hardcoded across layouts, meta tags and
 * the Astro config lives here, so rebranding or moving to a custom domain is a
 * one-file change.
 */

export const SITE = {
  /** Absolute origin the site is served from. No trailing slash. */
  url: 'https://mnmonzones.com',
  title: 'Miguel N. Monzones',
  /** Shown after the page title in the browser tab: "The Work · Miguel N. Monzones" */
  titleSeparator: '·',
  role: 'Lifecycle & GTM Strategist',
  description:
    "Senior lifecycle and GTM strategist with 11 years in fintech, SaaS, and ecommerce. I read what's actually wrong, decide what should exist, then build it.",
  author: 'Miguel N. Monzones',
  location: 'Vancouver, BC',
  /** Shown against a green dot on every contact card. Set to null to hide. */
  availability: 'Consulting now · open to the right senior role',
  /** BCP 47 language tag, used for <html lang>. */
  lang: 'en',
  /**
   * Link-preview image for Open Graph / Twitter cards, relative to the site
   * root. Built by `node scripts/build-og-image.mjs`, which composes the hero
   * portrait with this file's `title` and `role` — so changing either of those
   * means regenerating the image, or the unfurl and the site disagree.
   *
   * Set to null to omit the image meta tags entirely rather than point them at
   * a URL that 404s; BaseLayout also drops `twitter:card` back to `summary`.
   */
  ogImage: '/og-image.png' as string | null,
} as const;

/**
 * Google Analytics 4 measurement ID for the mnmonzones.com data stream.
 *
 * Set to null to switch analytics off site-wide. It is only ever emitted in a
 * production build (see components/Analytics.astro), so `npm run dev` and local
 * previews never register as traffic.
 */
export const GA_MEASUREMENT_ID: string | null = 'G-FPK859XY74';

/**
 * Where the visitor's cookie choice is stored, and the shape it is stored in:
 * `{"analytics": boolean, "date": "<ISO string>"}`.
 *
 * localStorage rather than a cookie or sessionStorage, deliberately — the
 * answer has to outlive the tab and the browser restart, and only disappear
 * when someone clears their site data. Both Analytics.astro (which reads it
 * before GA loads) and ConsentBanner.astro (which writes it) use this
 * constant; the key itself is the contract the v7 design export defined.
 *
 * Bump the `-v1` suffix only to deliberately re-ask everyone — every stored
 * answer stops matching and every visitor sees the banner again.
 */
export const CONSENT_STORAGE_KEY = 'mnm-consent-v1';

export const CONTACT = {
  email: 'miguel@mnmonzones.com',
  phone: '+1 778 829 6453',
  linkedin: 'https://www.linkedin.com/in/mmonzones/',
  entity: 'MNM Alaminos Consulting Ltd.',
  city: 'Vancouver, BC',
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
