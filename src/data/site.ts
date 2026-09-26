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
  /** The longer framing — read by llms.txt and llms-full.txt. */
  problem: string;
  tags: readonly string[];
  metrics: readonly Metric[];
  category: Category;
  /** The work-index card's one-paragraph read, from the v19 export. */
  summary: string;
  /** The single figure the card leads with, and what it measures. */
  card: { value: string; label: string };
  /** Collage illustration in src/assets/art/, without the extension. */
  art: string;
  /** Full-bleed art is `cover`; cut-out objects sit padded on the paper (`contain`). */
  artFit: 'cover' | 'contain';
}

export type Category = 'Leadership & Operations' | 'Lifecycle' | 'AI & Automation' | 'Web & Analytics';

export const CATEGORY_ORDER: readonly Category[] = [
  'Lifecycle',
  'AI & Automation',
  'Web & Analytics',
  'Leadership & Operations',
];

/**
 * Category → the dot colour on a card, a filter chip and a case header.
 * Declared once so the three always agree. Values are tokens in global.css.
 */
export const CATEGORY_ACCENT: Record<Category, string> = {
  Lifecycle: 'var(--blue)',
  'AI & Automation': 'var(--green)',
  'Web & Analytics': 'var(--amber)',
  'Leadership & Operations': 'var(--red)',
};

/** The shorter name the work index's filter chips use. */
export const CATEGORY_SHORT: Record<Category, string> = {
  Lifecycle: 'Lifecycle',
  'AI & Automation': 'AI & automation',
  'Web & Analytics': 'Web & analytics',
  'Leadership & Operations': 'Leadership',
};

export const PROJECTS: readonly Project[] = [
  {
    slug: 'mogo-lifecycle',
    title: 'The Mogo lifecycle rebuild',
    problem:
      'Email engagement was healthy, but customers were meeting a different experience after the click. I worked with Product, Creative, and Analytics to bring lifecycle, web, and measurement into one connected journey.',
    tags: ['Lifecycle', 'Web', 'Activation'],
    metrics: [
      { from: '24%', to: '38%', label: 'activation rate' },
      { from: '78%', to: '62%', label: '7-day drop-off' },
    ],
    category: 'Lifecycle',
    summary:
      'Emails performed; the post-click experience didn’t. I joined lifecycle, web and measurement into one journey with Product, Creative and Analytics.',
    card: { value: '24% → 38%', label: 'Activation; 7-day drop-off 78% → 62%' },
    art: '02-lifecycle-connected-journey',
    artFit: 'cover',
  },
  {
    slug: 'winback',
    title: 'The Intelligent Investing winback and cross-sell',
    problem:
      'Around 900,000 people had either gone quiet on investing or never started. Separating dormant investors from lending customers, and Manage from Self-directed, turned one broad campaign into four more relevant conversations.',
    tags: ['Lifecycle', 'Retention', 'Cross-sell'],
    metrics: [{ value: '~54K', label: 'activated or returned across two rounds' }],
    category: 'Lifecycle',
    summary:
      '~900K people had gone quiet on investing or never started. Splitting them by audience turned one campaign into four conversations.',
    card: { value: '~54K', label: 'People activated or returned' },
    art: '03-winback-four-paths',
    artFit: 'cover',
  },
  {
    slug: 'behavioral-trigger-layer',
    title: 'Building the behavioural trigger layer',
    problem:
      'The existing lifecycle responded to how many days had passed rather than what customers had done. I rebuilt the journey around meaningful actions such as connecting a bank, making a deposit, and completing a first trade.',
    tags: ['Lifecycle', 'Behavioural', 'Activation'],
    metrics: [
      { value: '~24%', label: 'funded-idle to first trade, where there was no path before' },
    ],
    category: 'Lifecycle',
    summary:
      'The lifecycle ran on days elapsed. I rebuilt it around real actions: connecting a bank, depositing, making a first trade.',
    card: { value: '~24%', label: 'Funded, idle customers making a first trade' },
    art: '08-never-miss-inquiry',
    artFit: 'contain',
  },
  {
    slug: 'esp-migration',
    title: 'ESP migration and deliverability recovery',
    problem:
      'Open rates were falling and inbox placement was becoming less reliable. Testing traced the issue to damaged shared-IP reputation, so I led the migration of more than 200,000 subscribers to healthier sending infrastructure.',
    tags: ['Lifecycle', 'Deliverability', 'Infrastructure'],
    metrics: [
      { from: '20s', to: '90+', label: 'sender score' },
      { value: '200K+', label: 'subscribers migrated' },
    ],
    category: 'Lifecycle',
    summary:
      'Falling opens traced back to a damaged shared IP. I moved 200K+ subscribers to healthier sending infrastructure.',
    card: { value: '20s → 90+', label: 'Sender score; 200K+ subscribers migrated' },
    art: '09-inbox-under-control',
    artFit: 'contain',
  },
  {
    slug: 'dafabet-sfmc',
    title: 'Salesforce lifecycle automation at Dafabet',
    problem:
      'Dafabet operated across twelve countries with different regulatory requirements, but no connected lifecycle system built around customer behaviour. I designed six cross-channel journeys around first bet, dormancy, trust, safer gambling, and deeper product use.',
    tags: ['Lifecycle', 'Salesforce', 'Compliance'],
    metrics: [
      { value: '+8–15%', label: 'bet conversion' },
      { value: '+10–20%', label: '7-day reactivation' },
    ],
    category: 'Lifecycle',
    summary:
      'Twelve regulated markets, no connected lifecycle. I built six cross-channel journeys, from first bet to safer gambling.',
    card: { value: '+8–15%', label: 'First-bet conversion; +10–20% 7-day reactivation' },
    art: '10-social-on-autopilot',
    artFit: 'contain',
  },
  {
    slug: 'agentic-ops',
    title: 'Building Mogo’s automation infrastructure',
    problem:
      'Leadership wanted to move towards agentic workflows, but the teams still needed a platform, practical use cases, and a way to own what was built. I worked with DevOps and the Ops leads to establish the infrastructure, ship the first workflows, and help teams maintain and extend them.',
    tags: ['AI', 'Automation', 'Operations'],
    metrics: [
      { value: '~30%', label: 'underwriter close rate' },
      { value: '15+', label: 'workflows in production' },
    ],
    category: 'AI & Automation',
    summary:
      'Leadership wanted AI; teams needed a platform they could own. I set it up with DevOps, shipped the first workflows, and handed them to Ops.',
    card: { value: '15+', label: 'Production workflows; ~30% better underwriter close rate' },
    art: '05-self-hosted-n8n',
    artFit: 'contain',
  },
  {
    slug: 'lead-enrichment',
    title: 'AI-powered lead enrichment and routing',
    problem:
      'DTC Newsletter signups were reaching HubSpot without enough context for Sales to know which ones needed immediate attention. I built a workflow that researched each company and contact, classified and validated the information, populated the CRM, and alerted Sales when a high-value lead appeared.',
    tags: ['AI', 'RevOps', 'Lead enrichment'],
    metrics: [{ value: '~70%', label: 'lead data pre-populated' }],
    category: 'AI & Automation',
    summary:
      'Signups hit HubSpot with no context. My workflow researches each lead, fills the CRM, and alerts Sales to high-value ones.',
    card: { value: '~70%', label: 'Of lead data ready before Sales opens it' },
    art: '04-lead-enrichment',
    artFit: 'cover',
  },
  {
    slug: 'compliance-workflow',
    title: 'Email validation and compliance workflow',
    problem:
      'The early workflow functioned technically, but it didn’t yet reflect how Compliance evaluated content. I brought the reviewers into the design process, documented their criteria, and translated that judgement into a validation system Marketing could use while drafting.',
    tags: ['AI', 'Quality assurance', 'Compliance'],
    metrics: [{ value: '−50%', label: 'review cycles: 4–5 rounds → 1–2' }],
    category: 'AI & Automation',
    summary:
      'The first validator missed what Compliance actually checks. I rebuilt it with the reviewers, so Marketing can check drafts themselves.',
    card: { value: '4–5 → 1–2', label: 'Compliance review rounds per email' },
    art: '11-client-intake-onboarding',
    artFit: 'contain',
  },
  {
    slug: 'mogo-web',
    title: 'The Mogo web ecosystem rebuild',
    problem:
      'Marketing depended on DevOps whenever it needed to launch or improve a page. I led the Webflow rebuild and moved web ownership into Marketing, giving the team a faster way to support campaigns, lifecycle journeys, and conversion work.',
    tags: ['Web', 'Webflow', 'Conversion'],
    metrics: [
      { value: '+15%', label: 'lifecycle conversion' },
      { from: '~5%', to: '~14%', label: 'organic traffic share in 90 days' },
    ],
    category: 'Web & Analytics',
    summary:
      'Every page needed DevOps. I led the Webflow rebuild and moved web ownership into Marketing.',
    card: { value: '+15%', label: 'Conversion from lifecycle traffic' },
    art: '04-agencies',
    artFit: 'contain',
  },
  {
    slug: 'dtc-newsletter',
    title: 'DTC Newsletter web and SEO rebuild',
    problem:
      'DTC had a growing audience and strong editorial content, but the website wasn’t turning enough organic visitors into readers and subscribers. Across three major rebuilds, I reworked the CMS, information architecture, SEO, and conversion journey.',
    tags: ['Web', 'Webflow', 'SEO'],
    metrics: [
      { from: '70%', to: '38%', label: 'bounce rate' },
      { value: '+27%', label: 'signups' },
    ],
    category: 'Web & Analytics',
    summary:
      'Great editorial, weak conversion. Three rebuilds reworked the CMS, site structure, SEO and signup journey.',
    card: { value: '70% → 38%', label: 'Bounce rate; +27% organic newsletter signups' },
    art: '01-automation-audit',
    artFit: 'contain',
  },
  {
    slug: 'analytics-rebuild',
    title: 'Analytics and tracking infrastructure rebuild',
    problem:
      'Years of undocumented tags and disconnected tools had made performance reporting difficult to trust. I used the Webflow rebuild as an opportunity to rebuild GA4 and GTM cleanly, map the martech ecosystem, and establish clearer ownership and governance.',
    tags: ['Analytics', 'Tracking', 'Martech'],
    metrics: [
      { from: '40%', to: '80%', label: 'data accuracy' },
      { value: '~$18K', label: 'annual stack savings' },
    ],
    category: 'Web & Analytics',
    summary:
      'Years of undocumented tags made reports hard to trust. I rebuilt GA4 and GTM and set clear ownership.',
    card: { value: '40% → 80%', label: 'Data accuracy; ~$18K/yr martech savings found' },
    art: '06-automation-care',
    artFit: 'contain',
  },
  {
    slug: 'sportserve-payments-division',
    title: 'Building Sportserve’s MSOps payments division',
    problem:
      'Payment launches crossed eight departments, twelve markets, and a growing set of regulatory and provider requirements. I built the shared operating model, clarified ownership between teams, and hired and trained a dedicated five-person division to keep the work moving.',
    tags: ['Leadership', 'Operations', 'Team building'],
    metrics: [
      { from: '0', to: '5', label: 'person team, built from scratch' },
      { value: '2x', label: 'campaign throughput' },
    ],
    category: 'Leadership & Operations',
    summary:
      'Payment launches crossed eight departments and twelve markets. I built the operating model and hired a five-person division to run it.',
    card: { value: '0 → 5', label: 'Person team built; 2× launch throughput' },
    art: '05-operations-launch-board',
    artFit: 'cover',
  },
  {
    slug: 'craftconcepts',
    title: 'Founding CraftConcepts',
    problem:
      'Small businesses were trying to rebuild their digital presence after the pandemic, while many early-career marketers needed meaningful work to build their experience. I created a collective that brought those two groups together.',
    tags: ['Leadership', 'Community', 'Mentorship'],
    metrics: [
      { from: '3', to: '20+', label: 'contributors at peak' },
      { value: '26', label: 'businesses served' },
    ],
    category: 'Leadership & Operations',
    summary:
      'Small businesses needed to rebuild online after the pandemic; new marketers needed real work. I brought them together.',
    card: { value: '26', label: 'Businesses supported; 3 → 20+ contributors at peak' },
    art: '01-local-small-businesses',
    artFit: 'contain',
  },
];
