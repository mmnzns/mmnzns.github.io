/**
 * Portfolio content.
 *
 * Kept as typed data rather than prose in the templates so the same project can
 * appear on the home page and the work index without the copy drifting between
 * them. Moves to an Astro content collection once case studies get their own
 * MDX bodies.
 */

export interface Metric {
  from?: string;
  to?: string;
  value?: string;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  problem: string;
  tags: readonly string[];
  metrics: readonly Metric[];
  category: Category;
  featured?: boolean;
}

export type Category = 'Leadership & Operations' | 'Lifecycle' | 'AI Automation' | 'Web Operations';

export const CATEGORY_ORDER: readonly Category[] = [
  'Lifecycle',
  'AI Automation',
  'Web Operations',
  'Leadership & Operations',
];

/**
 * Category → accent colour. Declared once here so the marker on a home page
 * card, a work index group and a case study header always agree. The values
 * are the CSS custom properties defined in src/styles/global.css.
 */
export const CATEGORY_ACCENT: Record<Category, string> = {
  Lifecycle: 'var(--coral)',
  'AI Automation': 'var(--moss)',
  'Web Operations': 'var(--sun)',
  'Leadership & Operations': 'var(--sky)',
};

export const PROJECTS: readonly Project[] = [
  {
    slug: 'mogo-lifecycle',
    title: 'The Mogo lifecycle rebuild',
    problem:
      'Activation was stuck and everyone blamed email. The real problem was a web and lifecycle misalignment nobody had named.',
    tags: ['Lifecycle', 'Email', 'Activation'],
    metrics: [
      { from: '24%', to: '38%', label: 'activation rate' },
      { from: '78%', to: '62%', label: '7-day drop-off' },
      { from: '35%', to: '23%', label: 'first-year churn' },
    ],
    category: 'Lifecycle',
    featured: true,
  },
  {
    slug: 'winback',
    title: 'Winback and cross-sell at scale',
    problem:
      '900K dormant users across two products and one list. I treated it as a multi-iteration system from day one.',
    tags: ['Lifecycle', 'Retention', 'Winback'],
    metrics: [{ value: '~54K', label: 'conversions' }],
    category: 'Lifecycle',
    featured: true,
  },
  {
    slug: 'agentic-ops',
    title: 'Agentic ops infrastructure',
    problem:
      'Leadership mandated automation with no platform and no owner. The real need was ops self-sufficiency.',
    tags: ['AI', 'Automation', 'GTM'],
    metrics: [{ value: '~30%', label: 'close rate' }],
    category: 'AI Automation',
    featured: true,
  },
  {
    slug: 'sportserve-payments-division',
    title: 'Payments Operations Division at Sportserve',
    problem:
      'Payment launches were fragmented across 8 departments with no single owner. I made the case for a dedicated division and built it from zero.',
    tags: ['Leadership', 'Operations', 'Team Building'],
    metrics: [{ value: '0 → 5', label: 'person team, built from zero' }],
    category: 'Leadership & Operations',
    featured: true,
  },
  {
    slug: 'behavioral-trigger-layer',
    title: 'Building the behavioral trigger layer',
    problem:
      'The activation sequence fired on a schedule, never on what users actually did. Nobody had named that as the problem.',
    tags: ['Lifecycle', 'Behavioral', 'Activation'],
    metrics: [{ from: '0%', to: '~24%', label: 'funded-idle to first-trade' }],
    category: 'Lifecycle',
  },
  {
    slug: 'esp-migration',
    title: 'ESP migration and deliverability rescue',
    problem:
      "Sender score in the low 20s, inbox placement eroding, and the cause wasn't content. It was shared IP reputation and a platform that couldn't fix it.",
    tags: ['Infrastructure', 'Deliverability', 'Lifecycle'],
    metrics: [
      { from: '20s', to: '90+', label: 'sender score' },
      { value: '200K+', label: 'subscribers migrated' },
    ],
    category: 'Lifecycle',
  },
  {
    slug: 'dafabet-sfmc',
    title: 'Salesforce lifecycle automation — Dafabet',
    problem:
      'Twelve countries, safer-gambling compliance in every market, and no system connecting user behavior to messaging.',
    tags: ['Lifecycle', 'SFMC', 'Compliance'],
    metrics: [
      { value: '+8–15%', label: 'bet conversion' },
      { value: '+10–20%', label: '7-day reactivation' },
    ],
    category: 'Lifecycle',
  },
  {
    slug: 'lead-enrichment',
    title: 'AI-powered lead enrichment and routing',
    problem:
      "The CFO wanted to enrich leads. The real problem was sales couldn't tell which signups were worth calling as soon as they arrived.",
    tags: ['AI', 'Automation', 'RevOps'],
    metrics: [{ value: '~70%', label: 'lead data pre-populated' }],
    category: 'AI Automation',
  },
  {
    slug: 'compliance-workflow',
    title: 'Email validation and compliance workflow',
    problem:
      "The email validation workflow worked technically. The real problem was that it didn't reflect how Compliance actually reviewed content.",
    tags: ['AI', 'Automation', 'Compliance'],
    metrics: [{ from: '4 rounds', to: '1–2', label: 'review cycles, halved' }],
    category: 'AI Automation',
  },
  {
    slug: 'mogo-web',
    title: 'Mogo web ecosystem rebuild',
    problem:
      'Marketing needed to ship pages in hours. DevOps owned the website. That was the actual problem.',
    tags: ['Web', 'Webflow', 'Conversion'],
    metrics: [
      { value: '+15%', label: 'lifecycle conversion' },
      { value: '+30%', label: 'campaign conversion' },
      { value: '2×', label: 'organic in 90 days' },
    ],
    category: 'Web Operations',
  },
  {
    slug: 'dtc-newsletter',
    title: 'DTC Newsletter web and SEO rebuild',
    problem:
      "The newsletter had a 70% bounce rate. The problem wasn't the audience — it was what they landed on.",
    tags: ['Web', 'Webflow', 'SEO'],
    metrics: [
      { from: '70%', to: '38%', label: 'bounce rate' },
      { value: '+28%', label: 'organic traffic' },
      { value: '+27%', label: 'signups' },
    ],
    category: 'Web Operations',
  },
  {
    slug: 'analytics-rebuild',
    title: 'Analytics and tracking infrastructure rebuild',
    problem:
      "Leadership didn't trust the data. The problem wasn't the campaigns. It was years of undocumented tag debt underneath them.",
    tags: ['Analytics', 'Tracking', 'Martech'],
    metrics: [
      { from: '40%', to: '80%', label: 'data accuracy' },
      { value: '~$18K', label: 'annual stack savings' },
    ],
    category: 'Web Operations',
  },
  {
    slug: 'craftconcepts',
    title: 'Founding and scaling CraftConcepts',
    problem:
      "Local businesses lost their digital presence after the pandemic and couldn't afford an agency to fix it. I built a collective to close that gap, and used it to mentor early-career marketers on real client work.",
    tags: ['Leadership', 'Founder', 'Mentorship'],
    metrics: [
      { from: '3', to: '20+', label: 'contributors' },
      { value: '26', label: 'businesses served' },
    ],
    category: 'Leadership & Operations',
  },
];

export const FEATURED_WORK = PROJECTS.filter((p) => p.featured);

export const CAPABILITIES = [
  {
    title: 'Lifecycle and behavioral systems',
    body: 'I build the growth engine that moves a customer from first touch through activation, retention, and revenue. Not campaigns running in parallel. One system that responds to real behavior and compounds over time.',
  },
  {
    title: 'GTM and marketing infrastructure',
    body: 'I own web, tracking, martech, and data as one system, because lifecycle only performs when what’s underneath it is built right. Most teams run these separately. I run them as one.',
  },
  {
    title: 'AI automation and marketing infrastructure',
    body: 'I’m rebuilding lifecycle and behavioral triggers as intelligent systems that operate and improve on their own, without adding headcount. That’s the direction this is all heading.',
  },
] as const;

export const PROCESS = [
  { title: 'Read', body: 'I find the real problem, not the surface symptom.' },
  { title: 'Decide', body: 'I decide what should exist, even with no spec.' },
  { title: 'Metric', body: 'I pick the number that proves the call.' },
  { title: 'Build', body: 'I build the system and pull in the right people.' },
  { title: 'Prove', body: 'I tie the result back to the original read.' },
] as const;

export const HEADLINE_STATS = [
  { value: '11+', label: 'years building marketing systems' },
  { value: '14', label: 'markets operated across' },
  { value: '1.5m+', label: 'managed audience' },
  { value: '100+', label: 'projects shipped and scaled' },
] as const;

export const RECENT_THINKING = [
  {
    date: 'Feb 24, 2026',
    title: 'Lifecycle Marketing Is Not a Traffic Strategy. It’s a Revenue Pipeline.',
    excerpt:
      'Stop measuring lifecycle by open rates and start treating it as revenue pipeline. How to map customer journeys to revenue events, build attribution through UTM governance and event tracking, and report in revenue language.',
  },
  {
    date: 'Feb 14, 2026',
    title: "Your SEO Content Already Works. Here's How to Make AI See It Too.",
    excerpt:
      'Why does AI ignore high-ranking content? Because it’s not structured for extraction. A breakdown of zero-click search, LLM behavior, and a 6-step retrofit framework to make pages citation-worthy.',
  },
  {
    date: 'Oct 9, 2025',
    title: 'Steal This Strategy: How High-Trust SaaS Companies Practice Transparent Marketing',
    excerpt:
      'Transparency is a growth strategy. Five proven moves top SaaS teams use: pricing clarity, honest comparisons, public roadmaps, “we’re not for you” filters, and privacy that passes the Grandma Test.',
  },
] as const;
