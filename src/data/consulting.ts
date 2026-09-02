/**
 * Copy for the consulting section — `/consulting/` and its three sub-pages.
 *
 * The consulting pages are a sub-brand, not part of the main site's design:
 * warm cream instead of paper, Clash Display and Switzer instead of General
 * Sans, terracotta and deep green instead of the four accents. See
 * `src/layouts/ConsultingLayout.astro` for why, and don't restyle these to
 * match global.css.
 *
 * Ported from the v13 export's `Monzones-C-*` files. Facts here come from
 * Website MD Repository and the design's own CLAUDE.md — MNM Alaminos
 * Consulting Ltd. is a real registered company, and 14 markets is the correct
 * figure on Consulting and About even though the Sportserve cases say 12.
 * Don't invent a metric, a tool or a price.
 *
 * There is no generator for this file. `gen-consulting.mjs` read the old
 * single-page `Monzones-D-Consulting-Bold` export, which v13 replaced with the
 * four-page C-series; it no longer runs against anything.
 */

export interface Practice {
  kicker: string;
  name: string;
  blurb: string;
  detail: string;
  tools: string;
}

export interface ProofCase {
  client: string;
  title: string;
  metric: string;
  metricLabel: string;
  metricNote: string;
  line: string;
  href: string;
}

export interface Engagement {
  name: string;
  length: string;
  line: string;
}

export interface Step {
  num: string;
  name: string;
  body: string;
}

export interface Stat {
  num: string;
  label: string;
}

export const HERO = {
  availability: 'Available for new engagements · Vancouver, BC',
  /* The headline breaks across two lines in the design, with "stopped moving."
     carrying the terracotta. Kept as parts so the page doesn't have to parse
     a sentence to colour half of it. */
  titleLead: 'Your numbers',
  titleAccent: 'stopped moving.',
  titleRest: 'Let’s find out why.',
  body: 'I help fintech, SaaS, and ecommerce teams fix the journeys, funnels, and systems behind a stuck metric, then leave them owning the fix. Twelve years in-house, now on your side of the table.',
  primaryCta: 'Book a free 30-min call',
  secondaryCta: 'See the results',
  reassurance:
    'Useful either way. If it’s not a fit, I’ll say so cheerfully on the call and point you somewhere better.',
} as const;

/** The three floating figures beside the hero. Same numbers as STATS. */
export const HERO_STATS: readonly Stat[] = [
  { num: '24 → 38%', label: 'activation' },
  { num: '35 → 23%', label: 'first-year churn' },
  { num: '~54K', label: 'people re-activated' },
];

export const STATS: readonly Stat[] = [
  { num: '24 → 38%', label: 'Activation, two months after the Mogo lifecycle rebuild' },
  { num: '35 → 23%', label: 'First-year churn after the retention journeys launched' },
  {
    num: '~54K',
    label: 'People activated or won back across two Intelligent Investing rounds',
  },
  { num: '~70%', label: 'Of lead data filled in before Sales ever touched the record' },
];

export const PRACTICES: readonly Practice[] = [
  {
    kicker: 'Retention',
    name: 'Lifecycle & retention',
    blurb:
      'People sign up, then drift. The usual fix is more emails on a schedule, which just talks at them.',
    detail:
      'I build journeys that react to what customers actually do, not how many days it’s been, so more of them activate, stick, and come back. At Mogo, that shift took activation from 24% to 38% in two months.',
    tools: 'Braze · Klaviyo · HubSpot · Salesforce Marketing Cloud · Iterable · Segment',
  },
  {
    kicker: 'Conversion',
    name: 'Conversion & web',
    blurb:
      'Your campaign made a promise. Then someone clicked, and the page told a different story.',
    detail:
      'I review the journey from first click to completed action and fix what sits between: the message, the page, the measurement, the handoffs. Then Marketing can keep improving it without filing a ticket.',
    tools: 'Webflow · WordPress · GA4 · Google Tag Manager · Ahrefs · Hotjar',
  },
  {
    kicker: 'Automation',
    name: 'AI & automation',
    blurb: 'The repetitive work eating your team’s week? It’s automatable, safely.',
    detail:
      'I start with the workflow, not the tool. We find where work slows down and where judgement stays human, then I build the integrations, validation, and error handling that keep it reliable, documented so your team owns it.',
    tools: 'n8n · Zapier · LindyAI · Clay · HubSpot · OpenAI API',
  },
];

/* hrefs point at this repo's case routes. The design links to
   `Monzones-D-Case-Bold.dc.html#slug`, which is the same case by the same
   slug — the anchor is how the design's single-page case viewer switches. */
export const PROOF: readonly ProofCase[] = [
  {
    client: 'Lifecycle & retention',
    title: 'Rebuilding lifecycle at Mogo',
    metric: '24 → 38%',
    metricLabel: 'Activation',
    metricNote: 'in two months',
    line: 'Activation was stuck at 24% and every obvious fix pointed at email. Rebuilding web, lifecycle, and measurement as one journey took it to 38%.',
    href: '/work/mogo-lifecycle/',
  },
  {
    client: 'Reactivation & cross-sell',
    title: 'The Intelligent Investing winback',
    metric: '~54K',
    metricLabel: 'People re-activated',
    metricNote: 'across two rounds',
    line: 'A dormant base of 900,000 sat untouched because nobody knew what it was worth. Two rounds turned it into activations and a cleaned, workable list.',
    href: '/work/winback/',
  },
  {
    client: 'AI automation',
    title: 'AI-powered lead enrichment and routing',
    metric: '~70%',
    metricLabel: 'Lead data pre-filled',
    metricNote: 'at ~300 signups a day',
    line: 'Sales was hand-researching every newsletter signup. The workflow now hands them sales-ready records with most of the data already in place.',
    href: '/work/lead-enrichment/',
  },
];

export const ENGAGEMENTS: readonly Engagement[] = [
  {
    name: 'Teardown',
    length: '1 week',
    line: 'One sharp question, one focused week. Findings handed over in order of impact.',
  },
  {
    name: 'Full audit',
    length: '2–3 weeks',
    line: 'The wide-angle version: journey, data, tools, and how your teams actually work.',
  },
  {
    name: 'Build',
    length: '6–12 weeks',
    line: 'I build it alongside your team, then hand it over properly. Owned is done.',
  },
  {
    name: 'Advisory retainer',
    length: 'Monthly',
    line: 'A second brain on call for priorities, reviews, and expensive decisions.',
  },
  {
    name: 'Fractional',
    length: '1–2 days / week',
    line: 'I sit inside the team and own the function while you find its permanent owner.',
  },
  {
    name: 'Something else',
    length: 'Depends',
    line: 'Tell me what you need. You’ll get an honest recommendation either way.',
  },
];

export const START_STEPS: readonly Step[] = [
  {
    num: '01',
    name: 'Send a note',
    body: 'Two paragraphs: what’s happening, which number you’re watching, what you’ve tried. That’s plenty.',
  },
  {
    num: '02',
    name: 'A 30-minute call',
    body: 'Free, and useful either way. We talk through the problem, what it’s costing you, and whether I’m the right person for it.',
  },
  {
    num: '03',
    name: 'A fixed-fee proposal',
    body: 'What I recommend, what you get, the exact cost, and how we’ll measure success. Nothing starts until you say go.',
  },
];

export const CONTACT_SECTION = {
  availability: 'Available · Vancouver, BC',
  title: 'Tell me what’s stuck. I’ll tell you what I’d do first.',
  body: 'What’s happening, what you’re seeing, what you suspect. I’ll be straight about whether I can help, and if I’m not the right person, I’ll happily point you to someone who is.',
  local: 'Based in Vancouver, and happy to meet in person if you’re local.',
} as const;

export const FOOTER_LINE = 'MNM Alaminos Consulting Ltd. — lifecycle and GTM, Vancouver.';

/* ------------------------------------------------------------------ services */

export interface PracticeDetail extends Practice {
  /** What's included — the bullet list beside the panel. */
  items: readonly string[];
}

export interface EngagementDetail extends Engagement {
  body: string;
  leave: string;
}

export const SERVICES_HERO = {
  kicker: 'Services',
  title: 'What I can do for you.',
  body: 'Three practice areas and six ways to engage, every one a fixed fee quoted before anything starts. Start wherever your problem lives.',
} as const;

export const SERVICES_JUMPS = [
  { name: 'Practice areas', meta: 'Three', href: '#practices' },
  { name: 'Ways to work together', meta: 'Six shapes', href: '#engage' },
  { name: 'The stack', meta: 'Tools I know', href: '#systems' },
] as const;

/** PRACTICES plus the per-area inclusions the services page adds. */
export const PRACTICE_DETAILS: readonly PracticeDetail[] = [
  {
    ...PRACTICES[0],
    items: [
      'Lifecycle and CRM audit',
      'Onboarding and activation journeys',
      'Retention and habit-building programs',
      'Winback and cross-sell strategy',
      'Segmentation and event architecture',
      'Deliverability and sending infrastructure',
    ],
  },
  {
    ...PRACTICES[1],
    items: [
      'Customer journey and conversion teardown',
      'Website rebuild and information architecture',
      'Landing-page and funnel systems',
      'Analytics and tracking implementation',
      'SEO and AI-search visibility',
      'Web ownership and governance',
    ],
  },
  {
    ...PRACTICES[2],
    items: [
      'Automation audit and opportunity roadmap',
      'Lead enrichment, scoring, and real-time routing',
      'CRM and lifecycle workflow integration',
      'AI-assisted content, QA, and compliance validation',
      'Structured outputs, safeguards, and error handling',
      'Team training, documentation, and handoff',
    ],
  },
];

export const ENGAGEMENT_DETAILS: readonly EngagementDetail[] = [
  {
    ...ENGAGEMENTS[0],
    body: 'One sharp question, one focused week. I dig into the journey, data, and systems behind it and hand you the findings in order of impact.',
    leave: 'A written assessment and your next three moves.',
  },
  {
    ...ENGAGEMENTS[1],
    body: 'The wide-angle version. Journey, data, triggers, tools, and how work actually moves between your teams, including talking to the people who run it, so the plan matches reality.',
    leave: 'A prioritised plan: owner, success measure, and next action for every item.',
  },
  {
    ...ENGAGEMENTS[2],
    body: 'We’ve agreed what needs to exist. Now I build it alongside your team: tested, documented, and handed over properly. Live isn’t done; owned is done.',
    leave: 'A working system your team understands, can measure, and can keep improving.',
  },
  {
    ...ENGAGEMENTS[3],
    body: 'You have the hands; you want a second brain. I help set priorities, review work in flight, and pressure-test decisions before they get expensive.',
    leave: 'A strategic partner on call as decisions come up.',
  },
  {
    ...ENGAGEMENTS[4],
    body: 'I sit inside the team and own the function (roadmap, decisions, coordination) while you develop or hire the people who’ll keep it long term.',
    leave: 'The function runs properly while you find its permanent owner.',
  },
  {
    ...ENGAGEMENTS[5],
    body: 'An interim stretch while you hire, a second opinion on a plan, a one-off build, a weird one. Tell me what you need, and if I’m not the right person, I’ll point you somewhere better.',
    leave: 'An honest recommendation either way.',
  },
];

export const SYSTEMS = [
  {
    name: 'Lifecycle & CRM',
    toolLine: 'Braze · Klaviyo · Salesforce Marketing Cloud · HubSpot · Iterable',
  },
  { name: 'Automation & AI', toolLine: 'n8n · Zapier · Make · LindyAI · Clay · OpenAI API' },
  {
    name: 'Analytics & experimentation',
    toolLine: 'GA4 · Google Tag Manager · Looker Studio · Amplitude · Mixpanel',
  },
  { name: 'Web & conversion', toolLine: 'Webflow · WordPress · Shopify · Figma' },
  {
    name: 'Search & visibility',
    toolLine: 'Semrush · Ahrefs · Google Search Console · Schema.org',
  },
  { name: 'Data & delivery', toolLine: 'SQL · Snowflake · Segment · Hightouch · Airtable' },
] as const;

/* ------------------------------------------------------------------- process */

export const PROCESS_HERO = {
  kicker: 'Process',
  title: 'Starting is zero-risk. By design.',
  body: 'Three steps to start, a clear rhythm once we’re going, and an honest read on fit before anyone spends a dollar. You can bail at every step along the way.',
} as const;

export const PROCESS_JUMPS = [
  { name: 'How it starts', meta: 'Three steps', href: '#start' },
  { name: 'Once we’re going', meta: 'Four principles', href: '#running' },
  { name: 'Real talk about fit', meta: 'Both sides', href: '#fit' },
] as const;

/** START_STEPS plus the "bail here" line the process page adds to each. */
export const PROCESS_STEPS: readonly (Step & { bail: string })[] = [
  { ...START_STEPS[0], bail: 'Bail here: you’ve lost five minutes.' },
  { ...START_STEPS[1], bail: 'Bail here: you’ve gained a second opinion.' },
  { ...START_STEPS[2], bail: 'Bail here: you keep the proposal.' },
];

export const PRINCIPLES = [
  {
    tag: 'Money',
    name: 'Fixed fee, always',
    body: 'Quoted before anything starts. No hourly meter, no surprise invoices, and I’m happy to show you the math.',
  },
  {
    tag: 'Cadence',
    name: 'You see work early',
    body: 'No long silences ending in a big reveal. You see findings and work in progress as they take shape, and feedback is a conversation.',
  },
  {
    tag: 'People',
    name: 'Built with your team',
    body: 'I work alongside the people who’ll run the system, talking to them rather than around them, so the plan matches how work actually moves.',
  },
  {
    tag: 'Ending',
    name: 'Owned is done',
    body: 'Live isn’t the finish line. Everything is tested, documented, and handed over so your team can measure it and keep improving it without me.',
  },
] as const;

export const FIT_YES = [
  'A metric that matters is heading the wrong way, and nobody’s sure why yet.',
  'The problem crosses lifecycle, product, web, and data, and nobody owns the space between them.',
  'You want your assumptions tested, not validated.',
  'You’re in fintech, SaaS, or ecommerce, with enough customer signal to learn from.',
  'You want to own the system when I leave, not rent me forever.',
] as const;

export const FIT_NO = [
  'You need extra hands for a campaign plan that’s already locked.',
  'The solution is fixed, and evidence pointing elsewhere wouldn’t be welcome.',
  'You need a full agency running five workstreams in parallel. It’s just me; that’s the point.',
  'The product is too early to have real customer behaviour to learn from.',
  'The deadline doesn’t leave room to understand the problem. Fast, yes. Reckless, no.',
] as const;

/* ------------------------------------------------------------------- results */

export interface ResultStory {
  id: string;
  client: string;
  title: string;
  metric: string;
  metricLabel: string;
  metricNote: string;
  second: string;
  stuck: string;
  did: string;
  href: string;
}

export const RESULTS_HERO = {
  kicker: 'Results',
  title: 'What moved, and why.',
  body: 'The headline numbers and the stories behind them: what was stuck, what we changed, and what moved. Every figure comes from a real engagement.',
} as const;

export const RESULT_STORIES: readonly ResultStory[] = [
  {
    id: 'story-mogo-lifecycle',
    client: 'Lifecycle & retention',
    title: 'Rebuilding lifecycle at Mogo',
    metric: '24 → 38%',
    metricLabel: 'Activation',
    metricNote: 'Two months after the rebuild went live.',
    second: 'churn 35 → 23%',
    stuck: 'Email looked healthy (opens fine, clicks fine) but activation sat at 24% and first-year churn at 35%. The after-click experience told a different story from the campaigns.',
    did: 'Lifecycle, web, product, and measurement became one connected journey: behaviour-triggered sends instead of calendar sends, and the pages after the click rebuilt to keep the promise the email made.',
    href: '/work/mogo-lifecycle/',
  },
  {
    id: 'story-winback',
    client: 'Reactivation & cross-sell',
    title: 'The Intelligent Investing winback',
    metric: '~54K',
    metricLabel: 'People re-activated',
    metricNote: 'Across two rounds, from a base of ~900,000.',
    second: '4 segments, 2 rounds',
    stuck: 'Around 900,000 people had gone quiet. The instinct was one broad winback blast: cheap to send, easy to ignore.',
    did: 'Understanding who those people were turned one blast into four different conversations, each matched to why that group had drifted. Two rounds later, ~54K people had activated or come back.',
    href: '/work/winback/',
  },
  {
    id: 'story-lead-enrichment',
    client: 'AI automation',
    title: 'AI-powered lead enrichment and routing',
    metric: '~70%',
    metricLabel: 'Lead data pre-filled',
    metricNote: 'Before Sales ever opens the record.',
    second: '1–2K sales-ready leads / month',
    stuck: 'Sales was spending its first touch on research, copying details into the CRM instead of talking to people.',
    did: 'A newsletter signup became a sales-ready HubSpot record: research, AI classification, validation, and routing, all before Sales touched it. About 70% of the record arrives pre-filled.',
    href: '/work/lead-enrichment/',
  },
];
