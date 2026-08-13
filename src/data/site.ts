/**
 * The project record: what each piece of work *is*.
 *
 * Kept as typed data rather than prose in the templates so the same project can
 * appear on the home page and the work index without the copy drifting between
 * them. The long-form case body for each slug lives in ./cases.ts, joined by
 * slug — this file stays the one place a title or a headline metric is written.
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
  },
  {
    slug: 'winback',
    title: 'Winback and cross-sell at scale',
    problem:
      '900K dormant users across two products and one list. I treated it as a multi-iteration system from day one.',
    tags: ['Lifecycle', 'Retention', 'Winback'],
    metrics: [{ value: '~54K', label: 'conversions' }],
    category: 'Lifecycle',
  },
  {
    slug: 'agentic-ops',
    title: 'Agentic ops infrastructure',
    problem:
      'Leadership mandated automation with no platform and no owner. The real need was ops self-sufficiency.',
    tags: ['AI', 'Automation', 'GTM'],
    metrics: [{ value: '~30%', label: 'close rate' }],
    category: 'AI Automation',
  },
  {
    slug: 'sportserve-payments-division',
    title: 'Payments Operations Division at Sportserve',
    problem:
      'Payment launches were fragmented across 8 departments with no single owner. I made the case for a dedicated division and built it from zero.',
    tags: ['Leadership', 'Operations', 'Team Building'],
    metrics: [{ value: '0 → 5', label: 'person team, built from zero' }],
    category: 'Leadership & Operations',
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
