/**
 * About page content.
 *
 * Prose lives here rather than in the template so the page file stays a layout
 * and the wording stays reviewable in one place. Dates are taken from
 * Website MD Repository/Professional History — they're checkable against
 * LinkedIn, so they're never approximated.
 */

export const INTRO = [
  'Hey — thanks for taking the time to read this.',
  'I’m Miguel. I work on lifecycle and GTM — the systems that move someone from a first click to actually sticking around. Eleven years of it now, across ecommerce, SaaS and fintech, and lately a lot of the automation sitting underneath all of it.',
  'If you like people who’d rather work out what’s actually broken than jump straight to fixing something, you’ll probably get along with me fine.',
] as const;

export const WHAT_I_DO = [
  'Most of what I do starts before anything gets built. Someone comes to me with a number moving the wrong way — activation’s flat, people are churning in week one, nobody’s opening anything — and the first job is working out what’s actually causing it. In my experience it’s hardly ever the thing everyone’s staring at.',
  'I’ve spent most of my career doing that inside companies, across ecommerce, SaaS and fintech. Right now I’m consulting on lifecycle, conversion and automation, and open to the right senior role. Either way — if something isn’t working the way you think it should, I’d love to hear about it.',
] as const;

export const SCOPE_PROOF = [
  'Hired at Mogo to turn lifecycle into a real system instead of just email and push. Ended up owning the website and the AI automation architecture too.',
  'Hired as an email coordinator at DTC. Ended up owning web, martech and automation across two companies and a dozen client accounts.',
  'Started at Sportserve as assistant to the director. Left owning the payments division and working with the developers as the SME on the B2B product.',
] as const;

/**
 * Career totals. `countTo` opts a figure into the count-up animation — only
 * plain integers qualify, since "1.5M+" can't be counted to sensibly.
 */
export const TOTALS = [
  { value: '11+', label: 'Years building marketing systems', countTo: 11, suffix: '+' },
  { value: '14', label: 'Markets worked in', countTo: 14 },
  { value: '1.5M+', label: 'Audience managed' },
  { value: '100+', label: 'Projects shipped', countTo: 100, suffix: '+' },
] as const;

/**
 * The beliefs list. Each entry is a claim and the reason it's held — the reason
 * is what stops it reading as a slogan. The last one carries the Adinkra name,
 * which is why its body is split around an italicised phrase.
 */
export const BELIEFS = [
  {
    claim:
      'Most teams don’t have a strategy problem. They have a problem they haven’t diagnosed properly.',
    body: 'Which is why I’ll usually push on a brief before agreeing to it. Not to be difficult — the fastest way to lose a quarter is to build the right thing for the wrong problem.',
  },
  {
    claim: 'The metric points at the problem. People cause it.',
    body: 'Dashboards are good at telling you where something’s going wrong and almost useless at telling you why. That part comes from working out what someone actually felt at the moment they left.',
  },
  {
    claim: 'If a system only works when I’m in the room, it isn’t a system.',
    body: 'So I document everything, and I’ve trained a successor in every role I’ve had. The test isn’t whether something runs. It’s whether it’s still running a year after I’ve gone.',
  },
  {
    claim: 'I’d rather give you the tradeoff than the pitch.',
    body: 'Everything worth building costs something somewhere else. I’d sooner name that early than have you find it on your own later.',
  },
  {
    claim: 'And one I keep on my wrist.',
    /** Split so the Adinkra name can be set in italics without markup in data. */
    body: {
      phrase: 'Nea Onnim No Sua A, Ohu',
      after:
        ' — he who does not know can know from learning. I don’t really believe in “I can’t do this.” I believe in “I haven’t learned it yet.”',
    },
  },
] as const;

export const OUTSIDE_WORK = [
  'I travel for the food, not the view. Give me the choice between a landmark and a place where the locals actually eat, and I’ll take the second one every time. Sitting down to eat with people tells me more about them than anything I’d see from a viewpoint, and it puts me somewhere I’d never have got to on my own.',
  'Otherwise: comics, games, and adventure books. I’ve read all of Tolkien. I once went a very long way into Warhammer 40,000 lore for no practical reason whatsoever. I think it’s the same itch as the travelling — I like being dropped somewhere I don’t know yet and working out where I am.',
  'Jazz or Latin music while I work, always. Jazz for the soul in it, Latin because it’s hard to sit still. Joy is the thing that actually drives me, and I’d rather work in a way that shows it.',
  'I live in Vancouver with my girlfriend Alejandra and our fat cat Katy — with a K. We take her on adventures. She has registered her objections.',
] as const;

export const TO_WORK_WITH = [
  'More open than people expect from someone senior. I say what I’m thinking, I get attached to problems, and I’d rather be honest than composed.',
  'The reason I do this work is that it’s the closest thing to a puzzle I get paid for. Something’s moving the wrong way, nobody’s sure why, and I get to find out. Eleven years in, that hasn’t got old.',
] as const;

/**
 * Job titles here are the ones that appear on LinkedIn, and the same strings
 * are used in the `meta` line of every case study in ./cases.ts. If one changes
 * it has to change in both places, or a recruiter reading a case page and a
 * recruiter reading this list see two different job titles.
 */
export const ROLES = [
  {
    org: 'Mogo',
    title: 'Senior Marketing Operations & Lifecycle Manager (MarTech)',
    what: 'Lifecycle, martech, web and automation infrastructure',
    years: '2024 — now',
  },
  {
    org: 'CraftConcepts',
    title: 'Founder, Growth Marketing Strategist',
    what: 'A collective helping local businesses rebuild their digital presence',
    years: '2022 — 2025',
  },
  {
    org: 'DTC Newsletter · Pilothouse',
    title: 'Email & Website Operations Manager (MarTech)',
    what: 'Web, SEO and email for ecommerce brands',
    years: '2021 — 2024',
  },
  {
    org: 'Sportserve',
    title: 'Senior Marketing Projects and Operations Manager',
    what: 'Web, lifecycle and payments operations; built the payments division',
    years: '2014 — 2021',
  },
  {
    org: 'Rappler',
    title: 'Editor & Contributor',
    what: 'First job out of school — editing in a 24/7 newsroom in Manila',
    years: '2013 — 2014',
  },
] as const;

/** The 20-second intro clip, linked rather than embedded to keep the page light. */
export const INTRO_VIDEO = {
  href: 'https://youtu.be/WegUH6EIXgY',
  label: '20 seconds of me talking',
} as const;
