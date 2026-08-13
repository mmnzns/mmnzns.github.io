/**
 * Home page content.
 *
 * These are the home page's own framings — the same projects told as "here's
 * what I was handed / here's what it turned out to be" rather than as full case
 * studies. Wording comes from the approved copy deck; the numbers agree with
 * ./cases.ts because they describe the same work.
 */

import type { Category } from './site';

/** The flip card under the hero: what someone asked for vs. what it actually was. */
export const SYMPTOMS = [
  {
    ask: '“Activation is stuck around 24%. The emails aren’t working.”',
    found:
      'Engagement was actually fine, which was the clue. The emails were promising one experience and the product was delivering another.',
  },
  {
    ask: '“People are dropping off in the first week.”',
    found:
      'The onboarding asked for bank credentials before it had said anything about security or custody. It was a trust problem, not a UX one.',
  },
  {
    ask: '“Open rates are falling. We need better subject lines.”',
    found:
      'The sending infrastructure was on a shared IP with a damaged reputation. Better subject lines weren’t going to fix that.',
  },
  {
    ask: '“Leadership wants us using AI. Go automate something.”',
    found:
      'Nobody could name what to automate. The real gap was that Ops teams couldn’t build anything without waiting on Engineering.',
  },
] as const;

export interface FeaturedCase {
  /** Matches a slug in PROJECTS, so the card can link to the full case. */
  slug: string;
  client: string;
  title: string;
  category: Category;
  ask: string;
  found: string;
  metric: string;
  note: string;
}

/** The four cases shown in the shelf / grid switcher. */
export const FEATURED_CASES: readonly FeaturedCase[] = [
  {
    slug: 'mogo-lifecycle',
    client: 'Mogo',
    title: 'Rebuilding lifecycle',
    category: 'Lifecycle',
    ask: 'Activation is stuck around 24%. The email isn’t working — fix it.',
    found:
      'Email engagement was fine, which is what made it confusing. About three weeks in it was clear the emails were promising one experience and the product was delivering another, and the whole lifecycle was triggering on calendar time instead of what people were actually doing. Nobody owned the seam between web and lifecycle. So I made the case for a bigger scope than I’d been hired for: rebuild the site too, move web ownership from DevOps into Marketing, and rebuild the Braze triggers around real product actions. I picked activation rate and 7-day drop-off as the two numbers that would tell me whether I’d read it right.',
    metric: '24% → 38%',
    note: 'activation; 7-day drop-off 78% → 62%',
  },
  {
    slug: 'winback',
    client: 'Mogo',
    title: 'The Intelligent Investing winback',
    category: 'Lifecycle',
    ask: 'We’ve got about 900,000 people who’ve gone quiet on investing or never started. Get them investing.',
    found:
      'It wasn’t one audience. Some had gone dormant, but a large chunk were lending customers who’d never invested with us at all — that’s a cross-sell, not a winback. And the two products needed completely different pitches: Manage is automated weekly investing, Self-directed is manual trading with research. So I built it as a multi-round program rather than a campaign, and used the first round as both a performance read and a list clean-up, because I genuinely didn’t know what the list quality was and pruning on guesswork would have thrown away good contacts.',
    metric: '~54K',
    note: 'activated or returned, across two rounds',
  },
  {
    slug: 'sportserve-payments-division',
    client: 'Sportserve',
    title: 'Building the payments division',
    category: 'Leadership & Operations',
    ask: 'We’re growing and things are slipping, so we’re splitting into teams that each own one area. Payments is yours — anything and everything related to it.',
    found:
      'The scope was clear but there was nothing underneath it. Payments touched eight departments across twelve countries, and every team only ever saw their own piece — no shared process, no owner for the thread running between them. So the job wasn’t running a division, it was building one first: sprint cycles for launch coordination, RACI so ownership was explicit, standard launch templates, compliance checkpoints, localisation workflows. Then hiring the people to run it.',
    metric: '0 → 5',
    note: 'person division; throughput doubled, errors down ~40%',
  },
  {
    slug: 'agentic-ops',
    client: 'Mogo',
    title: 'Automation infrastructure',
    category: 'AI Automation',
    ask: 'Leadership wants agentic workflows. Go learn AI and automate some things.',
    found:
      'There was no platform, no owner and no roadmap behind the mandate. And the real gap wasn’t tooling — it was that Ops teams couldn’t build anything themselves without creating another dependency on Engineering. So I took a hybrid setup to the COO: Zapier for the messy integrations, self-hosted n8n on our existing AWS for the high-volume operational work, which kept both the cost and the ownership internal. The first build was loan application profiling and routing, which moved underwriter close rate about 30%. Then I trained each Ops lead to build and maintain their own, which was the actual point of the whole thing.',
    metric: '15+',
    note: 'automations in production, run by the Ops teams themselves',
  },
];

/**
 * The five-step method, each illustrated with what that step actually looked
 * like on one project rather than described in the abstract.
 */
export const METHOD = [
  {
    name: 'Read',
    source: 'Mogo, first three weeks',
    example:
      'I pulled on the email data, the onboarding flow and the web journey at the same time. Engagement was healthy, which was the confusing part. What kept turning up was that email was describing one thing and the product was doing another.',
  },
  {
    name: 'Decide',
    source: 'Mogo, making the case',
    example:
      'Fixing email alone wasn’t going to move it. That meant asking for a scope well beyond what I’d been hired for — rebuild the website too, and move web ownership out of DevOps into Marketing. I took that to leadership.',
  },
  {
    name: 'Metric',
    source: 'Mogo, picking the number',
    example:
      'Open rate would have told me nothing, it was already fine. I went with activation rate and 7-day drop-off, because that’s where a gap between the email and the product would actually show up.',
  },
  {
    name: 'Build',
    source: 'Mogo, six weeks',
    example:
      'Rebuilt the Braze lifecycle around real product actions instead of calendar time, ran the Webflow rebuild alongside it, and pulled in Product, Creative and Analytics to get it done.',
  },
  {
    name: 'Result',
    source: 'Mogo, two months in',
    example:
      'Activation 24% → 38%, 7-day drop-off 78% → 62%. The bigger change was that people stopped treating lifecycle as email support.',
  },
] as const;

export interface Receipt {
  name: string;
  /** Headline figure shown opposite the chart. */
  headline: string;
  window: string;
  read: string;
  /** Before/after bars. Omitted for figures that exist only as a delta. */
  bars?: { before: number; after: number; beforeLabel: string; afterLabel: string };
  /** Caption for a relative-only figure rendered as a single stat. */
  single?: string;
}

/**
 * The numbers section. A relative-only figure — "+30% underwriter close rate"
 * — gets `single` rather than `bars`, because a before/after chart would invent
 * a baseline that doesn't exist in the data.
 */
export const RECEIPTS: readonly Receipt[] = [
  {
    name: 'Activation',
    headline: '24% → 38%',
    window: 'First 2 months, Mogo lifecycle rebuild',
    bars: { before: 24, after: 38, beforeLabel: '24%', afterLabel: '38%' },
    read: 'It moved once the emails stopped describing something the product wasn’t doing, and the triggers fired on what people actually did instead of how many days had passed. The 7-day drop-off came down from 78% to 62% over the same stretch — same rebuild, same cause.',
  },
  {
    name: 'Retention',
    headline: '35% → 23%',
    window: 'First-year churn, after the longer-term flows went in',
    bars: { before: 35, after: 23, beforeLabel: '35% churn', afterLabel: '23% churn' },
    read: 'Different work from the onboarding rebuild. This was scheduled flows that kept reinforcing the unexciting fundamentals — compounding, staying invested through a dip, no FX fees on trades. People who understood why they were holding held longer.',
  },
  {
    name: 'Reactivation',
    headline: '~54K activated',
    window: 'Two rounds, Feb 2025 – Jan 2026',
    bars: { before: 96, after: 6, beforeLabel: '~900K reached', afterLabel: '~54K activated' },
    read: 'Round one converted ~2.7% and doubled as a list clean-up. Round two hit ~5% on the cleaned list, because by then I knew which segment wanted which product.',
  },
  {
    name: 'Deliverability',
    headline: 'Low 20s → 90+',
    window: 'Sender score, ESP migration at DTC',
    bars: { before: 22, after: 92, beforeLabel: 'low 20s', afterLabel: '90+' },
    read: 'Everyone was looking at content quality. The problem was shared-IP reputation, and no amount of better writing was going to fix the infrastructure.',
  },
  {
    name: 'Automation',
    headline: '+30%',
    single: 'underwriter close rate',
    window: 'Loan application routing, Mogo',
    read: 'Loan Ops were manually sorting and prioritising applications, and that sorting was where the delay actually sat. I sat with them to work out how they were making those calls, mapped the criteria into scoring logic, and automated the routing. Underwriters stopped sorting and spent the time closing.',
  },
  {
    name: 'Review cycles',
    headline: '4–5 → 1–2',
    window: 'Content QA workflow, Mogo',
    bars: { before: 90, after: 30, beforeLabel: '4–5 rounds', afterLabel: '1–2 rounds' },
    read: 'Compliance’s judgement criteria weren’t written down anywhere, so every review started from scratch. The first three versions of the workflow checked the wrong things. It worked once I brought Compliance in and encoded how they actually reviewed.',
  },
];

/**
 * Companies whose logos run in the marquee. The name maps to a file in
 * src/assets/logos/ — see LogoMarquee.astro, which resolves them at build time
 * so a missing file fails the build instead of shipping a broken image.
 */
export const LOGOS = [
  'Mogo',
  'Sportserve',
  'Dafabet',
  'Rappler',
  'Pilothouse',
  'DTC Newsletter',
  'Carta Worldwide',
  'Axis',
  'Sunlife',
  'Intelligent Investing',
  'WheelWiz',
  'Hulkmeal',
  'Vintage Frames',
  'G&B Pro',
  'Upearance',
] as const;
