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
  'I’ve spent most of my career doing that inside companies, across ecommerce, SaaS and fintech. Right now I’m taking on consulting work in lifecycle, conversion and automation, and I’m open to the right senior role if one comes along. Either way — if something isn’t working the way you think it should, I’d love to hear about it.',
] as const;

export const HOW_I_GOT_HERE = [
  'I grew up in Canada until I was thirteen, then moved to the Philippines, where my parents were building a farm as their retirement business. I’ve been back in Canada since 2021.',
  'That farm is where most of how I work comes from. They started with land and not much else, so you either worked with what you had or built what you needed. I learned carpentry, how to fix broken tools, and how to spot a problem before it turned into a real one — if a storm was coming and the roof looked weak, you dealt with the roof. It was the first thing I ever watched get built from nothing, and I was the labour.',
  'My first job out of school was at Rappler in Manila, editing in a 24/7 newsroom under Maria Ressa. Everything had to be precise and sourced, and you didn’t get to accept the first explanation for anything. I still can’t, really.',
  'Then seven years at Sportserve, working somewhere between web, lifecycle, payments and operations rather than inside any one of them. When something broke, the cause was almost always somewhere else entirely, so I got into the habit of following it until I found where it actually started. That habit never left.',
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

export const BELIEF = {
  headline: 'If a system only works when I’m in the room, it isn’t a system.',
  paras: [
    'So I document everything, and I’ve trained a successor in every role I’ve had. The real test isn’t whether something works while you’re there. It’s whether it’s still running a year after you’ve gone.',
  ],
  /** Kept separate because it carries the italicised Adinkra name. */
  tattoo: {
    before: 'I’ve also got ',
    phrase: 'Nea Onnim No Sua A, Ohu',
    after:
      ' tattooed on my right wrist. It’s an Adinkra symbol, and it means something like: he who does not know can know from learning. I don’t really believe in “I can’t do this.” I believe in “I haven’t learned it yet.” That one’s kept me employable for eleven years.',
  },
} as const;

export const OUTSIDE_WORK = [
  'I travel for the food, not the view. Give me the choice between a landmark and a place where the locals actually eat, and I’ll take the second one every time. Sitting down to eat with people tells me more about them than anything I’d see from a viewpoint, and it puts me somewhere I’d never have got to on my own.',
  'Otherwise: comics, games, and adventure books. I’ve read all of Tolkien. I once went a very long way into Warhammer 40,000 lore for no practical reason whatsoever. I think it’s the same itch as the travelling — I like being dropped somewhere I don’t know yet and working out where I am.',
  'Jazz or Latin music while I work, always. Jazz for the soul in it, Latin because it’s hard to sit still. Joy is the thing that actually drives me, and I’d rather work in a way that shows it.',
  'I live in Vancouver with my girlfriend Alejandra and our fat cat Katy — with a K. We take her on adventures. She has registered her objections.',
] as const;

export const TO_WORK_WITH = [
  'More open than people expect from someone senior. I say what I’m thinking, I get attached to problems, and I’d rather be honest than composed. It’s cost me a few interviews.',
  'The reason I do this work is that it’s the closest thing to a puzzle I get paid for. Something’s moving the wrong way, nobody’s sure why, and I get to find out. Eleven years in, that hasn’t got old.',
] as const;

export const ROLES = [
  {
    org: 'Mogo',
    what: 'Lifecycle, martech, web and automation infrastructure',
    years: '2024 — now',
  },
  {
    org: 'CraftConcepts',
    what: 'Founder — a collective helping local businesses rebuild their digital presence',
    years: '2022 — 2025',
  },
  {
    org: 'DTC Newsletter · Pilothouse',
    what: 'Web, SEO and email for ecommerce brands',
    years: '2021 — 2024',
  },
  {
    org: 'Sportserve',
    what: 'Web, lifecycle and payments operations; built the payments division',
    years: '2014 — 2021',
  },
  {
    org: 'Rappler',
    what: 'First job out of school — editing in a 24/7 newsroom in Manila',
    years: '2013 — 2014',
  },
] as const;

/** The 20-second intro clip, linked rather than embedded to keep the page light. */
export const INTRO_VIDEO = {
  href: 'https://youtu.be/WegUH6EIXgY',
  label: '20 seconds of me talking',
} as const;
