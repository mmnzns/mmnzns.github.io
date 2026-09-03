/**
 * Copy and prices for the web design sub-pages — `/web-design/work/`,
 * `/process/` and `/pricing/`.
 *
 * **Every figure here is transcribed verbatim from the v13 export's
 * `Monzones-W-*` files and must not be adjusted, rounded or inferred.** The
 * export's own CLAUDE.md is explicit: a Notion page ("Offer Architecture &
 * Pricing") is the sole source of truth for offers, prices, inclusions,
 * revision limits and add-ons, and nothing may be filled in from competitor
 * research, industry practice or older copy. If a price looks missing, ask
 * Miguel rather than supplying one.
 *
 * Two presentation rules come from the same place and are not stylistic:
 * public prices use `$` with no currency named, and every offer shows the
 * "Founding client rate" with the "Scheduled standard rate" beneath it —
 * never a strikethrough and never "regular price". Hosting is described as
 * "hand-built, hosted by me" or "free-forever hosting", never "GitHub Pages".
 *
 * The three smaller sites are $100 more when built on a platform, which is
 * why they carry both numbers rather than one.
 */

export interface Tier {
  name: string;
  meta: string;
  blurb: string;
  includes: readonly string[];
  excludes: string;
  /** Hand-built founding rate, and the platform rate where the offer has one. */
  hand?: string;
  platform?: string;
  handStd?: string;
  platformStd?: string;
  /** Single-price offers (the bigger three) use these instead. */
  price?: string;
  standard?: string;
  standardNote?: string;
}

export const PRICING_HERO = {
  place: 'Vancouver & the Lower Mainland',
  badge: 'Founding-client rates, first five projects',
  titleLead: 'Every price,',
  titleAccent: 'out in the open.',
  /* v15 breaks the old single paragraph into a struck-through claim, a coral
     sub-line and the small print. */
  claimLead: 'No',
  claimStruck: '“contact us for a quote”',
  claimTail: 'wall.',
  sub: 'See what it costs first, then decide if it’s worth a conversation.',
  fine: 'Every offer and everything included, right here. Prices show the founding client rate for my first five qualifying projects, given in exchange for an honest testimonial. The scheduled standard rate sits underneath each one.',
} as const;

export const PRICING_JUMPS = [
  { label: 'How the price is decided', href: '#how' },
  { label: 'The six websites', href: '#websites' },
  { label: 'Site Check', href: '#sitecheck' },
  { label: 'Care plans', href: '#care' },
  { label: 'Domain & SSL', href: '#domain' },
  { label: 'Extras', href: '#addons' },
  { label: 'The fine print', href: '#rules' },
] as const;

/* v15 pulls the comparison out of the jump list into its own yellow button. */
export const PRICING_COMPARE_JUMP = { label: 'How it compares', href: '#compare' } as const;

/** The three smaller sites, priced hand-built or on a platform. */
export const SMALL_TIERS: readonly Tier[] = [
  {
    name: 'One-Page Site',
    meta: '1 week · just the page',
    blurb:
      'A lovely entry point for résumé sites, personal pages and simple professional sites. One page, done properly.',
    includes: [
      'One page: mobile-first, fast, accessible',
      'Contact form wired to your email',
      'Foundational SEO: metadata, sitemap, schema',
      'Two revision rounds',
      '30 days of small changes after launch',
      'Everything’s yours at final payment',
    ],
    excludes:
      'Not included: domain registration, Google Business Profile, copywriting, photography.',
    hand: '$305',
    platform: '$405',
    handStd: '$465',
    platformStd: '$565',
  },
  {
    name: 'Get Found',
    meta: '10 days · the page + the plumbing',
    blurb:
      'For a solo professional or micro-business starting from zero web presence. Not just a page, but actually being findable.',
    includes: [
      'Everything in the One-Page Site',
      'Domain registered and configured',
      'Google Business Profile created or claimed, and verified',
      'Contact form tested end to end',
      'Submitted to Search Console, confirmed indexed',
      'Analytics installed',
      'Everything’s yours at final payment',
    ],
    excludes:
      'Not included: extra pages, copywriting, photography, logo. Basic booking setup is an optional extra (see extras); managed domain & SSL is $50/year, billed separately.',
    hand: '$465',
    platform: '$565',
    handStd: '$775',
    platformStd: '$875',
  },
  {
    name: 'Portfolio Site',
    meta: '2 weeks · up to 3 pages',
    blurb:
      'For consultants, therapists, coaches and designers who need a little more room to show the work.',
    includes: [
      'Everything in Get Found',
      'Up to 3 pages',
      'Two revision rounds',
      'Domain and SSL configured, analytics installed',
      '30 days of small changes after launch',
    ],
    excludes:
      'Not included: copywriting, photography, logo. A CMS or blog is included only when the chosen platform and agreed scope provide one.',
    hand: '$670',
    platform: '$770',
    handStd: '$1,235',
    platformStd: '$1,335',
  },
];

/** The three larger builds, platform-only and single-priced. */
export const LARGE_TIERS: readonly Tier[] = [
  {
    name: 'Small Business Site',
    meta: '4 weeks · 5–7 pages',
    blurb:
      'For clinics, trades, restaurants, salons, studios: a local business ready for a site that works as hard as they do.',
    includes: [
      'Discovery call + a page-by-page content plan written for you',
      '5–7 pages: mobile design, not just a mobile version',
      'Contact/booking flow routed where it’ll actually be seen',
      'Basic booking-system setup included',
      'Google Business Profile setup or cleanup',
      'Local SEO foundation: metadata, schema, sitemap, Search Console',
      'GA4 installed and reading correctly',
      'Recorded handover session + 30 days of changes',
    ],
    excludes:
      'Not included: copywriting, photography, ecommerce, custom integrations, ongoing SEO work.',
    price: '$2,470',
    standard: '$3,915',
  },
  {
    name: 'Shop',
    meta: '5 weeks · Shopify, Webflow or WooCommerce',
    blurb:
      'For a local maker, boutique or food business selling online for the first time, or upgrading from a theme that’s fighting them.',
    includes: [
      'Everything in Small Business Site',
      'Store setup and theme customization on your chosen platform',
      'Up to 25 products loaded, with variants and images',
      'Checkout, shipping zones, tax config, payments connected',
      'Abandoned-cart email and welcome flow',
      'Training on adding products and fulfilling orders',
    ],
    excludes:
      'Not included: product photography, per-product copy, custom app or plugin development, migrating order history. You cover the platform subscription, theme and paid apps.',
    price: '$4,015',
    standard: '$6,695',
  },
  {
    name: 'Company Site',
    meta: '8–10 weeks · quoted to your scope',
    blurb:
      'For a funded startup or established company that needs a full site: CMS, multiple templates, conversion tracking, a blog with genuine structure.',
    includes: [
      'Discovery: audience, funnel, what the site has to do',
      'Information architecture and wireframes before visual design',
      'Webflow build with CMS collections',
      'Conversion tracking: GA4, GTM, event taxonomy',
      'Technical SEO and AEO built in from the start',
      'Basic booking-system setup when relevant',
      'Staging, cross-browser QA, documented handover',
      '60 days of post-launch support',
    ],
    excludes:
      'Not included: brand identity, ongoing content production, app or product UI, custom backend.',
    price: 'from $8,240',
    standard: 'from $9,785',
    standardNote: 'typically $9,785–20,600 by scope',
  },
];

export const BUILD_TABLE = [
  {
    on: 'Hand-built, hosted by me',
    edit: 'No editor; changes come through me',
    monthly: '$0 hosting fee. Managed domain & SSL is $50/year, separate',
    build: 'Lowest',
  },
  { on: 'Squarespace / Wix', edit: 'Yes, easily', monthly: '$25–40 to the platform', build: 'Standard' },
  {
    on: 'WordPress',
    edit: 'Yes, with some hand-holding',
    monthly: 'Hosting, roughly $15+',
    build: 'Standard',
  },
  { on: 'Webflow', edit: 'Yes, with a full CMS', monthly: '$23–49 to the platform', build: 'Premium' },
  { on: 'Shopify', edit: 'Yes', monthly: '$39+, plus transaction fees', build: 'Premium' },
] as const;

export const NOT_HAND_BUILT = [
  'You’re <strong>selling online</strong>, which deserves a real ecommerce platform',
  'You <strong>publish regularly</strong> and want to do it without me, which needs a CMS',
  'You need <strong>accounts, member areas, or a booking system</strong> beyond a simple embed',
  'You’ve told me <strong>you want to edit it yourself</strong>, and I’ll believe you the first time',
] as const;

export const SITE_CHECK = {
  price: '$405',
  standard: '$670',
  turnaround: '5 business days',
  credit: 'Fully credited toward any build booked within 60 days',
  gets: [
    'A recorded walkthrough of your site, 15–20 minutes, me talking through what I see',
    'Written findings: technical, structure, conversion path, SEO + AEO readiness',
    'A prioritized fix list, split into “you can do this yourself” and “this needs a build”',
    'A 30-minute call to go through it together',
  ],
  excludes:
    'Not included: implementing the fixes, content writing, deep competitor research. If you’d like the SEO/AEO recommendations implemented, that’s a separate service we scope together afterward.',
} as const;

export const CARE_PLANS = [
  {
    name: 'Care',
    price: '$50',
    per: '/mo',
    items: [
      'Uptime monitoring and backups',
      'Platform and plugin updates, security patches',
      'Live traffic, performance and SEO dashboard',
      '30 minutes of small changes a month',
    ],
    note: 'Dashboard only, no prepared report. Work beyond the allowance is billed separately.',
  },
  {
    name: 'Managed',
    price: '$205',
    per: '/mo',
    items: [
      'Everything in Care',
      'Monthly health, traffic, performance and SEO review',
      'Broken-link and form testing',
      'Monthly report, reviewed before it reaches you',
      'Up to 2 hours of fixes or content changes',
    ],
    note: 'A comfortable default for a business site that has to keep earning.',
  },
  {
    name: 'Growth',
    price: '$515',
    per: '/mo',
    items: [
      'Everything in Managed, reviewed weekly',
      'Proactive SEO/AEO, traffic and performance monitoring',
      'Weekly stats report; anomalies reviewed for action',
      'Issues worked on within 5 included hours a month',
    ],
    note: 'Anything outside scope is quoted before extra work starts, so no surprises.',
  },
] as const;

export const CARE_TERMS = [
  'Minimum term 3 months, then month to month',
  'Annual paid upfront gets 2 months free',
  'Hand-built site? Care is the easiest way to keep changes flowing, and we’ll chat at handover',
] as const;

export const DOMAIN_ITEMS = [
  'Registration or renewal',
  'DNS administration',
  'Standard SSL setup, monitoring and renewals',
  'Renewal management and responsibility',
  'Transfer support, any time, no fee',
] as const;

export const DOMAIN_WAYS = [
  '<strong>I register and manage it</strong>: $50 a year covers domain, DNS and SSL, and you stay the registered owner',
  '<strong>You register it yourself</strong>: connecting it and configuring standard SSL is included in the build; renewals stay with you',
  '<strong>You already have one</strong>: pointing it and configuring standard SSL for the new build is included',
] as const;

export const ADDONS = [
  {
    what: 'Logo / basic brand kit',
    price: '$410',
    note: 'When the site needs one and you don’t have one yet.',
  },
  {
    what: 'Basic booking-system setup',
    price: 'Included',
    note: 'Already part of the Small Business Site, Shop, and Company Site packages.',
  },
  {
    what: 'Basic booking-system setup (smaller sites)',
    price: '$80 / $50',
    note: '$80 on a hand-built site I host; $50 on your own platform, when it supports the booking tool.',
  },
  {
    what: 'Rush delivery',
    price: '+35%',
    note: 'Offered when I genuinely have the capacity to do it well.',
  },
] as const;

export const FINE_PRINT = [
  {
    title: '50% deposit, 50% at launch',
    body: 'The deposit reserves your project and becomes non-refundable once work starts. The balance is due at launch, before handover. Company Sites split into three payments.',
  },
  {
    title: 'Timelines start when the project is ready',
    body: 'The clock starts once the deposit is in and your content is in hand, not at signing. You get 21 days from kickoff to supply content; after that we pause and pick back up at the next opening.',
  },
  {
    title: 'Revisions, plainly',
    body: 'The three smaller sites include two revision rounds (a third is $310). The bigger builds include one full-site revision after your review. And if my work doesn’t match what we agreed, I fix it free, and it never uses your revision.',
  },
  {
    title: 'Scope changes in writing',
    body: 'Even small ones. A one-line change order keeps us both comfortable and the project on track.',
  },
  {
    title: 'I recommend, you decide',
    body: 'The platform recommendation and the reasoning go in the proposal, in writing. You’re the one living with it, so the call is always yours.',
  },
  {
    title: 'One build at a time',
    body: 'You get a real start date before you pay anything, and my full attention once we begin. Site Checks and Care plans run alongside; builds never overlap.',
  },
] as const;

export const PAY_METHODS = [
  'Credit card',
  'Cash',
  'Bank deposit',
  'Bank transfer',
  'E-transfer',
] as const;

/* The comparison table. Competitor figures are the design's own research,
   checked August 2026 against each provider's public pricing page — don't
   refresh or "correct" them without re-checking the sources named below. */
export const COMPARISON = [
  {
    need: 'Site Check',
    detail: 'recorded walkthrough, written findings, prioritized fixes',
    mine: '$405',
    mineNote: 'standard $670 · credited toward a build',
    taylor: 'Not published',
    angarum: 'Not published',
    brixwork: 'Not published',
  },
  {
    need: 'One-page website',
    detail: 'hand-built with free-forever hosting, or on a platform you can edit',
    mine: '$305 hand-built · $405 platform',
    mineNote: 'standard $465 / $565',
    taylor: 'Closest: 1–2 page site from $2,500',
    angarum: 'Website projects run $3,500–12,000',
    brixwork: 'Setup fee + $85/mo subscription',
  },
  {
    need: 'Get Found',
    detail: 'page + domain, Google Business Profile verified, indexed, analytics, contact setup',
    mine: '$465 hand-built · $565 platform',
    mineNote: 'standard $775 / $875',
    taylor: 'Not published',
    angarum: 'Not published',
    brixwork: 'Not published',
  },
  {
    need: 'Portfolio site',
    detail: 'up to 3 pages, free-forever hosting available',
    mine: '$670 hand-built · $770 platform',
    mineNote: 'standard $1,235 / $1,335',
    taylor: 'Packages begin at $2,500',
    angarum: 'Website work begins at $3,500',
    brixwork: 'Setup fee + monthly subscription',
  },
  {
    need: 'Small business site',
    detail: '5–7 pages on a platform you can edit yourself',
    mine: '$2,470',
    mineNote: 'standard $3,915',
    taylor: 'Full website from $5,000',
    angarum: '$3,500–12,000',
    brixwork: '$4,000 setup + $85/mo',
  },
  {
    need: 'Online store',
    detail: 'Shopify, Webflow Ecommerce or WooCommerce',
    mine: '$4,015',
    mineNote: 'standard $6,695',
    taylor: 'Available (price not published)',
    angarum: 'Not published',
    brixwork: 'No comparable package',
  },
  {
    need: 'Company site',
    detail: 'CMS, tracking, integrations, quoted',
    mine: 'from $8,240',
    mineNote: 'standard $9,785–20,600',
    taylor: 'Not published',
    angarum: 'Projects extend to $12,000',
    brixwork: '$7,500–12,500+ setup + $85/mo',
  },
  {
    need: 'Ongoing care',
    detail: 'monitoring, updates, dashboard, included change time',
    mine: '$50 / $205 / $515 a month',
    mineNote: '',
    taylor: 'Offered (price not published)',
    angarum: 'Not published',
    brixwork: '$85/mo incl. hosting & support',
  },
  {
    need: 'Managed domain & SSL',
    detail: 'registered in your name, so you stay the legal owner',
    mine: '$50 a year',
    mineNote: '',
    taylor: 'Not published',
    angarum: 'Not published',
    brixwork: 'Not published separately',
  },
] as const;

/* ------------------------------------------------------------------- process */

export interface Step {
  num: string;
  gate?: string;
  title: string;
  paras: readonly string[];
  listLabel?: string;
  items?: readonly string[];
  /** Paragraphs that come after the list rather than before it. */
  after?: readonly string[];
}

export const PROCESS_HERO = {
  tags: ['Ten steps, two gates', 'Design first, build second'],
  titleLead: 'You approve the design',
  titleAccent: 'before I build.',
  body: 'Here’s the whole thing, start to launch, so you always know where we are and what’s next. The short version: we talk until the scope is genuinely clear. You hand me the facts, the material, the assets and the access. I turn that into a direction and show you a design draft. Development starts after you approve that draft, and not before.',
} as const;

export const PROCESS_JUMPS = [
  { label: 'The two gates ↓', href: '#gates' },
  { label: 'All ten steps', href: '#steps' },
  { label: 'What I need from you', href: '#inputs' },
  { label: 'What moves the timeline', href: '#pause' },
  { label: 'Prices ↗', href: '/web-design/pricing/' },
] as const;

export const GATES = [
  {
    label: 'Gate 1 · the start date',
    title: 'Discovery is not the project start.',
    body: 'Signing, paying the deposit, or having a first meeting doesn’t start the quoted timeline on its own. The clock starts when the agreement is signed, the deposit is in, and the content, assets and access are complete enough for design work to genuinely begin.',
    note: 'so your timeline is real, not decorative',
  },
  {
    label: 'Gate 2 · the build',
    title: 'Design approval is the development gate.',
    body: 'Every website gets a design draft before development, sized to the project. Approval in writing means I can build the agreed direction. A new direction, replacement content, or a structural change after that may use a revision round or need a written change order first.',
    note: 'no surprises on either side',
  },
] as const;

export const PROCESS_STEPS: readonly Step[] = [
  {
    num: '01',
    title: 'Discovery',
    paras: [
      'We start with the business, the audience, the one job the website has to do, and what success looks like. This takes as many conversations as the project honestly needs, and I don’t cap it at a number of calls or count it against your timeline.',
    ],
    listLabel: 'What we’ll clarify together',
    items: [
      'What the business offers, and who it serves',
      'The one primary action a visitor should take',
      'The pages and functionality you need',
      'Who will look after the site after launch',
      'Existing brand material, content, systems and access',
      'Timing constraints and any real launch deadline',
      'Websites, layouts and visual styles you like',
      'What you like about each reference, and what you’d hate to see copied',
    ],
    after: [
      'If the project isn’t clear enough for me to quote it responsibly, we keep talking. Nothing gets treated as started while it’s still fuzzy.',
    ],
  },
  {
    num: '02',
    title: 'Recommendation, scope and a fixed quote',
    paras: [
      'I recommend the offer, the delivery method and the platform that suit the project and whoever will maintain it. Then you get it in writing: the scope, a fixed project price, an assessed timeline, your included revision allowance, and any third-party costs I know about.',
      'Website builds are priced by project and scope, never by the hour.',
      'The agreement and deposit reserve the work. They don’t make an unready project ready to start, and I’d rather say that up front than pretend otherwise.',
    ],
  },
  {
    num: '03',
    title: 'Content and design inputs',
    paras: [
      'I won’t invent your business from a blank page, so this is the part where you hand me the raw material. I’ll send a structured content brief to make it easy.',
    ],
    listLabel: 'What you provide',
    items: [
      'Accurate business facts: services, products, prices, policies',
      'Existing text, notes, brochures, decks or other source material',
      'Approved photographs, testimonials, logos and brand assets',
      'Any required legal, regulatory or professional wording',
      'Access to the domain, current site, analytics, booking tools and other accounts',
      'Design pegs: sites you like, and sites you don’t',
    ],
    after: [
      'I take that material and organize it into pages, hierarchy, calls to action and website-ready presentation. I’ll edit and shape what you send me within the agreed scope, happily. What I won’t do is invent facts or promise full copywriting from nothing.',
      'You stay responsible for the accuracy of the source material, and for approving the content that goes on the site.',
    ],
  },
  {
    num: '04',
    gate: 'Gate 1',
    title: 'The project start gate',
    paras: ['When these are all done, I confirm your official start date and the active timeline begins:'],
    items: [
      'Signed agreement',
      'Deposit received',
      'Scope and page count approved',
      'Content foundation supplied and confirmed sufficient',
      'Images, brand assets and account access received',
      'Delivery method and platform decision recorded',
    ],
    after: [
      'Discovery, quoting, waiting on content and half-finished handoffs aren’t active build time. If something’s outstanding I’ll tell you exactly what it is, and the project won’t quietly start while we wait for it.',
    ],
  },
  {
    num: '05',
    gate: 'Gate 2',
    title: 'Design draft and approval',
    paras: [
      'Every website gets a design draft appropriate to its scope before any development happens. The draft settles the layout, the visual direction, the content hierarchy and the interactions that matter. Bigger or more complex sites may need more design detail, or more than one screen, to establish the system.',
      'I won’t make an uncertain design decision on my own. If I need clarification I’ll ask, and if there’s a meaningful choice I’ll lay it out and get your call.',
      'You review the draft and send one consolidated response. Development begins once the design is approved in writing.',
    ],
  },
  {
    num: '06',
    title: 'Development',
    paras: [
      'I build the approved design, with the approved content, inside the agreed scope. Because the project is fixed-price, you’re never billed for the hours I spend thinking, testing or improving the agreed work. The price stays tied to the result.',
      'I’ll follow the assessed timeline, send updates at meaningful milestones, and ask questions rather than guess. If a delay, a missing approval, a new requirement or a third-party hiccup affects the schedule, I’ll explain the effect and give you a revised date.',
    ],
  },
  {
    num: '07',
    title: 'My own quality pass',
    paras: ['Before I ask you to review anything, I test it myself. Depending on the build, that covers:'],
    items: [
      'Mobile and the major browsers',
      'Navigation, links, buttons, forms and booking flows',
      'Content placement and factual consistency',
      'Accessibility basics and readable contrast',
      'Performance and image sizing',
      'Foundational SEO and AEO implementation',
      'Analytics, indexing, domain and standard SSL setup where included',
    ],
    after: ['you shouldn’t be the first person to find a broken link'],
  },
  {
    num: '08',
    title: 'Your review and revisions',
    paras: [
      'You look over the finished website and send one consolidated set of feedback per revision round.',
    ],
    items: [
      'One-Page Site, Get Found and Portfolio Site include two client-requested revision rounds',
      'Small Business Site, Shop and Company Site include one client-requested full-site revision',
      'If my work doesn’t match the approved brief or design, I fix it free and it never touches your revision allowance',
      'Extra rounds, replacement content, a new direction or anything outside the agreed scope gets a written price before it begins',
    ],
  },
  {
    num: '09',
    title: 'Final approval, payment and launch',
    paras: ['Once the site is approved, here’s the launch sequence:'],
    items: [
      'I run the final quality check',
      'The remaining project balance is paid',
      'The site goes live on the agreed domain',
      'Forms, analytics, indexing, domain and SSL are verified in the live environment',
      'Ownership and the agreed files or account access are handed over to you',
    ],
    after: [
      'Launch happens once the final payment clears, so it’s worth having that ready if you’re aiming at a date.',
    ],
  },
  {
    num: '10',
    title: 'After launch',
    paras: [
      'For 30 days after launch I correct faults in the delivered work at no charge. Just tell me and it’s handled.',
    ],
  },
];

export const TIMELINE_MOVERS = [
  'Required material or access is missing',
  'Content is replaced after approval',
  'Feedback doesn’t arrive by the agreed deadline',
  'The approved direction or scope changes',
  'A third-party service creates a delay neither of us controls',
  'Whatever it is, you’ll hear about it from me first, with a revised date attached.',
] as const;

export const PROMISE = {
  kicker: 'the promise',
  headline: 'I will not build your website blindly.',
  body: 'You’ll see and approve the design before development. I’ll consult you whenever a decision is unclear, explain the tradeoffs that actually matter, and keep the project tied to the agreed scope, price and result. That’s the whole deal, and it’s a nice way to work.',
} as const;

/* ---------------------------------------------------------------------- work */

export interface Build {
  /** Matches the filename in src/assets/webdesign/. */
  slug: 'intelligent-investing' | 'dtc-newsletter' | 'kattyco' | 'east-van-slp';
  meta: string;
  titleLead: string;
  titleAccent: string;
  situation: string;
  built: string;
  happened: string;
  href: string;
  linkLabel: string;
  alt: string;
}

export const WORK_HERO = {
  tags: ['Four builds, all live', 'Every link opens the real thing'],
  titleLead: 'Four builds,',
  titleAccent: 'not forty.',
  body: 'I could pad this page. Plenty of people do. Instead here are the four websites I’d genuinely put my name on, written up with what was going on, what I built, and what happened next. Every one is live, so please poke at them on your phone.',
  bodyStrong: 'That’s the only proof that counts.',
} as const;

export const WORK_JUMPS = [
  { label: 'The four builds ↓', href: '#cases' },
  { label: 'Where the instincts came from', href: '#background' },
  { label: 'How to judge them yourself', href: '#judge' },
  { label: 'The testimonial wall', href: '#testimonials' },
] as const;

export const BUILDS: readonly Build[] = [
  {
    slug: 'intelligent-investing',
    meta: 'Fintech platform · Webflow · five sites',
    titleLead: 'Intelligent',
    titleAccent: 'Investing.',
    situation:
      'A publicly traded fintech with five product websites, each pulling in a slightly different direction, and search and tracking treated as something to bolt on later.',
    built:
      'All five rebuilt in Webflow, with SEO and conversion tracking designed into the structure rather than added afterwards. One system, five front doors.',
    happened: 'Qualified organic traffic doubled within 90 days.',
    href: 'https://www.intelligentinvesting.ai/',
    linkLabel: 'intelligentinvesting.ai ↗',
    alt: 'Intelligent Investing website',
  },
  {
    slug: 'dtc-newsletter',
    meta: 'Daily publication · Webflow CMS · three rebuilds',
    titleLead: 'DTC',
    titleAccent: 'Newsletter.',
    situation:
      'A media brand publishing five times a week, with a website being used as a place to put articles instead of a place to win subscribers.',
    built:
      'Three rebuilds over time, each one treating the site as a conversion system: what a first-time reader sees, how quickly they understand the value, and how few steps stand between interest and signup.',
    happened: 'Bounce rate went from 70% to 38%. Organic signups rose 27%.',
    href: 'https://www.directtoconsumer.co/',
    linkLabel: 'directtoconsumer.co ↗',
    alt: 'DTC Newsletter website',
  },
  {
    slug: 'kattyco',
    meta: 'Pet care, Vancouver · hand-built',
    titleLead: 'Katty',
    titleAccent: '& Co.',
    situation:
      'A small local business with genuine personality, and nothing online carrying it. Pet owners choose with their gut, and there was nothing for their gut to go on.',
    built:
      'A hand-built site with the warmth turned up and one destination: every route on the page leads to a free meet and greet, because that’s the moment the business wins.',
    happened:
      'Mobile-first, quick to load, and no platform subscription to pay for as long as it exists.',
    href: 'https://kattyco.ca/',
    linkLabel: 'kattyco.ca ↗',
    alt: 'Katty & Co website',
  },
  {
    slug: 'east-van-slp',
    meta: 'Speech-language pathology · hand-built · 5 pages',
    titleLead: 'East Van',
    titleAccent: 'SLP.',
    situation:
      'A private practice twenty years in the making, with seven distinct service areas and a very particular audience: parents who are worried and looking for a straight answer.',
    built:
      'Five hand-built pages that structure all seven service areas plainly, so a parent can find their situation, understand the work, and know what to do next without decoding clinical language.',
    happened: 'It’s the $0-a-month option, live in the wild. Hosted free, and it will stay that way.',
    href: 'https://east-van-slp.github.io/',
    linkLabel: 'east-van-slp.github.io ↗',
    alt: 'East Van SLP website',
  },
];

export const JUDGE_TESTS = [
  {
    q: 'Does it load before you get bored?',
    a: 'On mobile data, not office wifi. This is where most pretty sites quietly lose people.',
  },
  {
    q: 'Can you tell what they do in five seconds?',
    a: 'Not the mission statement. The actual service, and who it’s for.',
  },
  {
    q: 'Is the next step obvious everywhere?',
    a: 'Book, call, subscribe, enquire. Scroll anywhere and it should be within reach.',
  },
  {
    q: 'Does the form actually go somewhere?',
    a: 'You’d be amazed. Tap it, fill it, see whether it behaves like something someone maintains.',
  },
] as const;

export const BACKGROUND_LOGOS = [
  'Mogo',
  'Sportserve',
  'Pilothouse Digital',
  'Sun Life',
  'Rappler',
  'Carta Worldwide',
] as const;

export const TESTIMONIAL_SLOTS = [
  { num: '01', line: 'Reserved for founding client one.', note: 'could be you' },
  { num: '02', line: 'Reserved for founding client two.', note: 'unedited, whatever it says' },
  { num: '03', line: 'Reserved for founding client three.', note: 'three spots after this one' },
] as const;

/* ------------------------------------------- the main page's pricing summary */

/**
 * The condensed price list on `/web-design/` itself. These are "from" figures
 * pointing at the full pricing page — the same numbers as SMALL_TIERS and
 * LARGE_TIERS above, and subject to the same rule: verbatim from the design,
 * never recomputed. The three smaller sites quote the hand-built rate, which
 * is why they read "from".
 */
export const SUMMARY_TIERS = [
  { name: 'One-Page Site', sub: 'just the page, done properly · 1 week', price: 'from $305' },
  {
    name: 'Get Found',
    sub: 'page + domain, Google profile, indexed · 10 days',
    price: 'from $465',
    tag: 'Recommended',
  },
  {
    name: 'Portfolio Site',
    sub: 'up to 3 pages, free-forever hosting available · 2 weeks',
    price: 'from $670',
  },
  { name: 'Small Business Site', sub: '5–7 pages you edit yourself · 4 weeks', price: '$2,470' },
  { name: 'Shop', sub: 'online store, up to 25 products · 5 weeks', price: '$4,015' },
  {
    name: 'Company Site',
    sub: 'CMS, tracking, integrations · quoted · 8–10 weeks',
    price: 'from $8,240',
  },
] as const;

export const SUMMARY_EXTRAS = [
  {
    name: 'Site Check',
    sub: 'paid diagnostic, credited toward a build within 60 days',
    price: '$405',
  },
  {
    name: 'Website Care',
    sub: 'monitoring, updates, changes · monthly, after any build',
    price: 'from $50/mo',
  },
] as const;
