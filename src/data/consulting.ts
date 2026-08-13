/**
 * Consulting page content.
 *
 * Engagements declare which practice areas they apply to. Rather than hiding
 * the ones that don't fit, the page dims them and says so — "not for this area"
 * is more useful to a prospective client than a shorter list.
 */

export type PracticeKey = 'lifecycle' | 'web' | 'ai';

export interface Practice {
  key: PracticeKey;
  name: string;
  accent: string;
  blurb: string;
  detail: string;
  items: readonly string[];
  tools: string;
}

export const PRACTICES: readonly Practice[] = [
  {
    key: 'lifecycle',
    name: 'Lifecycle & retention',
    accent: 'var(--coral)',
    blurb:
      'Onboarding, activation, winback and the flows in between — triggered on what people do, not how many days have passed.',
    detail:
      'Most lifecycle programs are a set of campaigns that were never designed as a system. I read the whole path — product events, onboarding, web, the ESP — find where the promise and the experience come apart, and rebuild the triggers around real behaviour.',
    items: [
      'Lifecycle and CRM audit',
      'Onboarding and activation rebuild',
      'Winback and cross-sell programs',
      'Braze, Klaviyo and ESP implementation',
      'Deliverability and sending infrastructure',
      'Segmentation and event architecture',
    ],
    tools: 'Braze · Klaviyo · Iterable · Segment · Amplitude',
  },
  {
    key: 'web',
    name: 'Conversion & web',
    accent: 'var(--sky)',
    blurb: 'The page the lifecycle sends people to. Usually where the drop-off actually is.',
    detail:
      'Lifecycle work keeps ending at a page that undoes it. This is the read on the journey from the click to the completed action — what the page promises, what it asks for and when, and who owns it internally, which is often the real problem.',
    items: [
      'Conversion and journey teardown',
      'Website rebuild and IA',
      'Landing page and funnel systems',
      'Martech stack and tracking setup',
      'SEO and AI search visibility (GEO)',
      'Ownership model between marketing and engineering',
    ],
    tools: 'Webflow · WordPress · GA4 · GTM · Ahrefs · Hotjar',
  },
  {
    key: 'ai',
    name: 'AI & automation',
    accent: 'var(--moss)',
    blurb:
      'Infrastructure your ops team can run themselves, instead of another dependency on engineering.',
    detail:
      'The mandate is usually "go use AI" with no platform, owner or roadmap behind it. The work is deciding what should be automated and what should stay human, building the connective tissue, then training the people who own the process to maintain it without me.',
    items: [
      'Automation audit and opportunity map',
      'Self-hosted n8n and Zapier architecture',
      'Routing, scoring and triage workflows',
      'Content and QA workflows with compliance',
      'Internal AI tooling and prompt systems',
      'Training ops leads to build their own',
    ],
    tools: 'n8n · Zapier · AWS · OpenAI and Anthropic APIs · Make',
  },
];

export interface Engagement {
  name: string;
  length: string;
  /** Practice areas this shape actually fits. */
  fits: readonly PracticeKey[];
  body: string;
  leave: string;
  /**
   * The catch-all at the end of the list. It fits everything by definition, so
   * it's styled as an invitation to write rather than as another priced shape.
   */
  other?: true;
}

export const ENGAGEMENTS: readonly Engagement[] = [
  {
    name: 'Teardown',
    length: '1 week',
    fits: ['lifecycle', 'web', 'ai'],
    body: 'One narrow question, one fast read. I go through the system myself, then write up what I found and what I’d change, in order.',
    leave: 'Written findings, no slides.',
  },
  {
    name: 'Full audit',
    length: '2–3 weeks',
    fits: ['lifecycle', 'web', 'ai'],
    body: 'The whole system — data, triggers, journeys, tooling, and the ownership between teams. Includes talking to the people who run it, because the org chart is usually part of the diagnosis.',
    leave: 'Prioritised plan with an owner and a metric per item.',
  },
  {
    name: 'Build',
    length: '6–12 weeks',
    fits: ['lifecycle', 'web', 'ai'],
    body: 'I do the work. Rebuild the flows, the site or the automation infrastructure, alongside your team, and leave it documented enough that they can keep going.',
    leave: 'Shipped, handed over, measured.',
  },
  {
    name: 'Advisory retainer',
    length: 'Monthly',
    fits: ['lifecycle', 'ai'],
    body: 'A standing second read for a team that already has hands. Strategy, prioritisation, reviewing what your people build. No execution from me.',
    leave: 'You get a standing second opinion.',
  },
  {
    name: 'Fractional',
    length: '1–2 days a week',
    fits: ['lifecycle', 'ai'],
    body: 'Inside the team, owning the function — running the roadmap, making the calls, hiring the person who eventually replaces me.',
    leave: 'You get someone accountable for the function, not just advice.',
  },
  {
    name: 'Something else',
    length: 'Depends',
    fits: ['lifecycle', 'web', 'ai'],
    other: true,
    body: 'Advisory, a one-off build, an interim stretch while you hire, a second opinion on someone else’s plan. Tell me the shape and I’ll tell you honestly whether I’m the right person.',
    leave: 'An honest answer either way.',
  },
];

export const FIT_YES = [
  'You have a number that’s moving the wrong way and you’re not sure why.',
  'There’s a team who can execute, but nobody owning the thread between marketing, product and engineering.',
  'You want someone to tell you what’s actually wrong, including when it isn’t the thing you asked about.',
  'Fintech, SaaS or ecommerce with real volume and real data behind the question.',
  'You’d rather have a plan your team can run than a dependency on me.',
] as const;

export const FIT_NO = [
  'You need extra hands to ship a campaign calendar someone else already decided on.',
  'You have already settled on the diagnosis and you would like someone to agree with it.',
  'You need a whole team. I’m one person, and I’d rather say that now than three weeks in.',
  'Pre-product or pre-traffic. There isn’t enough signal yet for this to be worth your money.',
  'You need the answer next week. The read usually takes longer than that, and rushing it defeats the point of it.',
] as const;

export const START_STEPS = [
  {
    num: '01',
    name: 'Email me',
    body: 'The number, the theory, and what you’ve already tried. Two paragraphs is plenty.',
  },
  {
    num: '02',
    name: 'A 30-minute intro call',
    body: 'Free, and the point of it is working out whether this is something I can actually help with — not advice on the call itself. Sometimes it ends with me pointing you somewhere else.',
  },
  {
    num: '03',
    name: 'A written scope',
    body: 'What I’d do, what it costs as a fixed number, when it’s done, and the metric we’ll judge it on. Nothing starts before you’ve seen that.',
  },
] as const;

/** Three cases surfaced as proof on the dark band, linked to the full write-ups. */
export const PROOF = [
  {
    slug: 'mogo-lifecycle',
    client: 'Mogo',
    accent: 'var(--coral)',
    title: 'Rebuilding lifecycle',
    line: 'Hired to fix the email. The email was fine — the product was contradicting it.',
  },
  {
    slug: 'winback',
    client: 'Mogo',
    accent: 'var(--sun)',
    title: 'The Intelligent Investing winback and cross-sell',
    line: 'About 900,000 quiet customers who turned out to be two audiences and four different conversations.',
  },
  {
    slug: 'agentic-ops',
    client: 'Mogo',
    accent: 'var(--moss)',
    title: 'Automation infrastructure',
    line: 'A hybrid n8n and Zapier setup the ops teams now build on themselves.',
  },
] as const;

/** Headline numbers on the consulting page's dark band. */
export const CONSULTING_NUMBERS = [
  { value: '24% → 38%', label: 'Activation, two months into the Mogo lifecycle rebuild' },
  { value: '35% → 23%', label: 'First-year churn, after the longer-term flows went in' },
  { value: '~54K', label: 'Dormant customers activated or returned across two rounds' },
  { value: '15+', label: 'Automations in production, run by the Ops teams themselves' },
] as const;

export const WORTH_KNOWING = [
  {
    accent: 'var(--coral)',
    text: 'It’s me doing the work — no agency, no team behind me, nobody managing the account.',
  },
  {
    accent: 'var(--moss)',
    text: 'Vancouver, BC. Remote across North America and Europe; I’ve worked in 14 markets.',
  },
] as const;
