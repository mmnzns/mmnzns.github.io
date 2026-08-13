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
    ],
    category: 'Lifecycle',
  },
  {
    slug: 'winback',
    title: 'The Intelligent Investing winback and cross-sell',
    problem:
      'About 900,000 people had gone quiet on investing or never started, and a large part of them had only ever borrowed from us.',
    tags: ['Lifecycle', 'Retention', 'Cross-sell'],
    metrics: [{ value: '~54K', label: 'activated or returned across two rounds' }],
    category: 'Lifecycle',
  },
  {
    slug: 'behavioral-trigger-layer',
    title: 'Building the behavioral trigger layer',
    problem:
      'The activation sequence fired on a schedule instead of on what people actually did, and nobody had named that as the problem.',
    tags: ['Lifecycle', 'Behavioral', 'Activation'],
    metrics: [
      { value: '~24%', label: 'funded-idle to first trade, where there was no path before' },
    ],
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
    slug: 'agentic-ops',
    title: 'Agentic ops infrastructure',
    problem:
      'Leadership wanted automation but had not named a platform or an owner, and what the Ops teams actually needed was to be able to build things themselves.',
    tags: ['AI', 'Automation', 'GTM'],
    metrics: [
      { value: '~30%', label: 'underwriter close rate' },
      { value: '15+', label: 'workflows in production' },
    ],
    category: 'AI Automation',
  },
  {
    slug: 'lead-enrichment',
    title: 'AI-powered lead enrichment and routing',
    problem:
      'The CFO asked for enriched leads, when what sales needed was to know which signups were worth calling the moment they arrived.',
    tags: ['AI', 'Automation', 'RevOps'],
    metrics: [{ value: '~70%', label: 'lead data pre-populated' }],
    category: 'AI Automation',
  },
  {
    slug: 'compliance-workflow',
    title: 'Email validation and compliance workflow',
    problem:
      'The validation workflow ran fine technically and still nobody leaned on it, because it was not checking what Compliance actually checks.',
    tags: ['AI', 'Automation', 'Compliance'],
    metrics: [{ value: '−50%', label: 'review cycles: 4–5 rounds → 1–2' }],
    category: 'AI Automation',
  },
  {
    slug: 'mogo-web',
    title: 'Mogo web ecosystem rebuild',
    problem:
      'Marketing needed to ship pages in hours, but the website sat with DevOps — which turned out to be the whole problem, not a detail of it.',
    tags: ['Web', 'Webflow', 'Conversion'],
    metrics: [
      { value: '+15%', label: 'lifecycle conversion' },
      { from: '~5%', to: '~14%', label: 'organic traffic share in 90 days' },
    ],
    category: 'Web Operations',
  },
  {
    slug: 'dtc-newsletter',
    title: 'DTC Newsletter web and SEO rebuild',
    problem:
      'The newsletter had a 70% bounce rate, and the right people were arriving — they just were not being given a reason to stay.',
    tags: ['Web', 'Webflow', 'SEO'],
    metrics: [
      { from: '70%', to: '38%', label: 'bounce rate' },
      { value: '+27%', label: 'signups' },
    ],
    category: 'Web Operations',
  },
  {
    slug: 'analytics-rebuild',
    title: 'Analytics and tracking infrastructure rebuild',
    problem:
      'Leadership had stopped trusting the numbers, and the cause was sitting underneath the campaigns: years of undocumented tag debt.',
    tags: ['Analytics', 'Tracking', 'Martech'],
    metrics: [
      { from: '40%', to: '80%', label: 'data accuracy' },
      { value: '~$18K', label: 'annual stack savings' },
    ],
    category: 'Web Operations',
  },
  {
    slug: 'sportserve-payments-division',
    title: 'Payments Operations Division at Sportserve',
    problem:
      'Payment launches were fragmented across 8 departments with no single owner. I made the case for a dedicated division and built it from zero.',
    tags: ['Leadership', 'Operations', 'Team building'],
    metrics: [
      { from: '0', to: '5', label: 'person team, built from scratch' },
      { value: '2x', label: 'campaign throughput' },
    ],
    category: 'Leadership & Operations',
  },
  {
    slug: 'craftconcepts',
    title: 'Founding CraftConcepts',
    problem:
      "Local businesses lost their digital presence after the pandemic and couldn't afford an agency to fix it. I built a collective to close that gap, and mentored early-career marketers on real client work.",
    tags: ['Leadership', 'Founder', 'Mentorship'],
    metrics: [
      { from: '3', to: '20+', label: 'contributors at peak' },
      { value: '26', label: 'businesses served' },
    ],
    category: 'Leadership & Operations',
  },
];
