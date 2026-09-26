/**
 * Home page copy, from the v19 export's `Monzones-D-Home-V4`.
 *
 * Hand-maintained: v19 rebuilt the page from scratch, and scripts/gen-home.mjs
 * read the old layout's arrays, so it was retired with it. Every figure here
 * already appears in site.ts, cases.ts or about.ts — this file repeats those
 * numbers, it never introduces one.
 */
import type { ImageMetadata } from 'astro';
import mogo from '../assets/teams/mogo.jpg';
import sportserve from '../assets/teams/sportserve.jpg';
import dafabet from '../assets/teams/dafabet.jpg';
import pilothouse from '../assets/teams/pilothouse.jpg';
import dtcNewsletter from '../assets/teams/dtc-newsletter.jpg';
import rappler from '../assets/teams/rappler.jpg';
import sunLife from '../assets/teams/sun-life.jpg';
import carta from '../assets/teams/carta-worldwide.jpg';
import axis from '../assets/teams/axis.jpg';
import intelligentInvesting from '../assets/teams/intelligent-investing.jpg';
import wheelwiz from '../assets/teams/wheelwiz.jpg';
import craftConcepts from '../assets/teams/craft-concepts.jpg';

/** "The record, in four figures." Each links to the work behind it. */
export const LEDGER = [
  {
    value: '14',
    fig: 'Fig. A — Sportserve + Mogo',
    label: 'Markets delivered in: 12 across LATAM, Asia and Europe, plus Canada and the US',
    href: '/work/sportserve-payments-division/',
    cta: 'The MSOps payments division',
  },
  {
    value: '1.5M+',
    fig: 'Fig. B — Mogo',
    label: 'Customers across the lifecycle programs I’ve run',
    href: '/work/mogo-lifecycle/',
    cta: 'The lifecycle rebuild',
  },
  {
    value: '90+',
    fig: 'Fig. C — DTC Newsletter',
    label: 'Sender score, recovered from the low 20s',
    href: '/work/',
    cta: 'See the work',
  },
  {
    value: '15+',
    fig: 'Fig. D — Mogo',
    label: 'Production automations, owned by the teams that use them',
    href: '/work/',
    cta: 'See the work',
  },
] as const;

export interface Team {
  name: string;
  kind: string;
  logo: ImageMetadata;
}

export const TEAMS: readonly Team[] = [
  { name: 'Mogo', kind: 'Fintech', logo: mogo },
  { name: 'Sportserve', kind: 'Gaming', logo: sportserve },
  { name: 'Dafabet', kind: 'Gaming', logo: dafabet },
  { name: 'Pilothouse', kind: 'Agency', logo: pilothouse },
  { name: 'DTC Newsletter', kind: 'Media · B2B', logo: dtcNewsletter },
  { name: 'Rappler', kind: 'Newsroom', logo: rappler },
  { name: 'Sun Life', kind: 'Insurance', logo: sunLife },
  { name: 'Carta Worldwide', kind: 'Payments', logo: carta },
  { name: 'Axis', kind: 'Brand', logo: axis },
  { name: 'Intelligent Investing', kind: 'Fintech', logo: intelligentInvesting },
  { name: 'WheelWiz', kind: 'Ecommerce', logo: wheelwiz },
  { name: 'Craft Concepts', kind: 'Studio', logo: craftConcepts },
];

/** "What I heard" on the front of each note, what was underneath on the back. */
export const SYMPTOMS = [
  {
    heard: '“Activation is stuck at 24%.”',
    under: 'Emails promised one thing; the product delivered another. We fixed the promise first.',
  },
  {
    heard: '“People drop off in their first week.”',
    under: 'A trust problem, not a UX one. The journey had to earn the connected account.',
  },
  {
    heard: '“Open rates are falling.”',
    under: 'A damaged sender reputation, not bad subject lines. Sender score went from the low 20s to 90+.',
  },
  {
    heard: '“Where should we start with AI?”',
    under: 'Teams needed to own automations, not buy another tool. Fifteen workflows later, they do.',
  },
] as const;

/** The draggable "Selected work" track. Slugs join to PROJECTS for the art. */
export const HOME_CASES = [
  {
    slug: 'mogo-lifecycle',
    client: 'Mogo · Lifecycle',
    metric: '24% → 38%',
    title: 'Rebuilding lifecycle around behaviour, not days elapsed',
    note: 'Activation. Seven-day drop-off fell from 78% to 62%.',
  },
  {
    slug: 'winback',
    client: 'Mogo · Intelligent Investing',
    metric: '~54K',
    title: 'A winback that treated three audiences as three problems',
    note: 'Activated or returned from a 900K dormant base.',
  },
  {
    slug: 'sportserve-payments-division',
    client: 'Sportserve · MSOps',
    metric: '0 → 5',
    title: 'Building the MSOps payments division from a blank brief',
    note: 'Person division across 12 markets. Throughput doubled; errors down ~40%.',
  },
  {
    slug: 'lead-enrichment',
    client: 'Pilothouse · DTC Newsletter',
    metric: '~70%',
    title: 'From newsletter signup to sales-ready lead',
    note: 'Of lead data ready before Sales opens it. 1K–2K qualified leads a month.',
  },
] as const;

/** "Read. Decide. Own it." — each step swaps the framed illustration. */
export const STEPS = [
  {
    name: 'Read the whole journey',
    line: 'Talk to the people closest to the problem, then follow the customer end to end. The real break is rarely where the ticket says.',
    art: '06-hidden-value-roots',
    alt: 'A plant whose roots run far deeper than what shows above ground',
    caption: 'Most of it is underground',
  },
  {
    name: 'Decide what should exist',
    line: 'Name the problem, agree on the metric, and pick tradeoffs honestly. Fewer things, chosen on purpose.',
    art: '12-custom-build',
    alt: 'Two hands fitting puzzle pieces together',
    caption: 'Finding the piece that fits',
  },
  {
    name: 'Own it to the number',
    line: 'Bring the right teams in, build what’s missing, and leave a system that runs without me.',
    art: '04-automation-foundation',
    alt: 'Gears set on a stone pedestal',
    caption: 'Built to run without me',
  },
] as const;

/**
 * The chat's suggested replies. Each fills in the form below it; `subject`
 * becomes the email subject in the Formspree submission.
 */
export const TOPICS = [
  {
    id: 'hire',
    label: 'I’m hiring',
    reply: 'Love that! Tell me about the role and team, and I’ll share how I’d approach the first 90 days.',
    placeholder: 'The role, the team, and what success looks like in year one…',
    subject: 'A role you might like',
  },
  {
    id: 'growth',
    label: 'We have a growth problem',
    reply: 'My favourite kind of message. What’s happening, and where do you think it’s breaking?',
    placeholder: 'What you’re seeing, and what you’ve tried so far…',
    subject: 'A growth problem',
  },
  {
    id: 'hi',
    label: 'Just saying hi',
    reply: 'Hi back! Always happy to meet people who care about lifecycle and GTM.',
    placeholder: 'Say hello…',
    subject: 'Just saying hi',
  },
] as const;
