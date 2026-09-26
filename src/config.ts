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
  title: 'Miguel Monzones',
  /** Shown after the page title in the browser tab: "Work · Miguel Monzones" */
  titleSeparator: '·',
  role: 'Senior lifecycle & GTM strategist',
  description:
    "Senior lifecycle and GTM strategist with 12 years in fintech, SaaS, and ecommerce. I read what's actually wrong, decide what should exist, then build it.",
  author: 'Miguel Monzones',
  /** The name as it appears on formal records — emitted as schema alternateName. */
  legalName: 'Miguel N. Monzones',
  location: 'Vancouver, BC',
  /** The green-dot status line under the home hero. */
  availability: 'Open to senior roles and select consulting work.',
  /** BCP 47 language tag, used for <html lang>. */
  lang: 'en',
  /**
   * Link-preview image for every page — articles included, deliberately: the
   * v19 launch handoff asks for one card sitewide. It is the finished export
   * from the design's `Monzones-OG-Share-Card`, committed as-is; nothing in
   * this repo generates or overwrites it.
   */
  ogImage: '/og-image.png',
  ogImageAlt: 'Miguel Monzones at his desk — The problem is usually upstream.',
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
  /** The legal name. Not the public brand (that's STUDIO.name) — the privacy page only. */
  entity: 'MNM Alaminos Consulting Ltd.',
  city: 'Vancouver, BC',
} as const;

/** Primary navigation — the same four links in the header and the mobile menu. */
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work/' },
  { label: 'Writing', href: '/thinking/' },
  { label: 'About', href: '/about/' },
] as const;

/** The header's call to action: the home page's contact section. */
export const NAV_CTA = { label: 'Work with me', href: '/#contact' } as const;

/**
 * Miguel's studio. Web design and consulting moved there in the v19 relaunch;
 * this site is the portfolio and the writing. The old /web-design/ and
 * /consulting/ URLs redirect to it (see SERVICE_REDIRECTS in astro.config.mjs).
 */
export const STUDIO = {
  name: 'Craft Concepts Digital',
  short: 'Craft Concepts',
  url: 'https://craftconceptsdigital.com/',
} as const;

/**
 * Formspree endpoint behind every contact form on the site. Forms POST here
 * directly, so they keep working with JavaScript disabled; the enhancement
 * script only upgrades the response to an inline message.
 */
export const FORM_ENDPOINT = 'https://formspree.io/f/xjybrpnw';
