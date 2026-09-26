/**
 * About page copy, from the v19 export's `Monzones-D-About-V4`.
 *
 * Hand-maintained; scripts/gen-about.mjs read the old layout and was retired
 * with it. One deliberate departure: each role's `title` is the full title as
 * recorded in Professional History, not the shortened form the v19 cards
 * print, because the same employer's title also appears in every case page's
 * meta line (cases.ts) and the two must match — see CLAUDE.md.
 */

/** "The short version." data-count animates the last number in each. */
export const FACTS = [
  { value: '12+', label: 'Years in lifecycle marketing, since 2014' },
  { value: '14', label: 'Markets supported across LATAM, Asia, Europe and North America' },
  { value: '1.5M+', label: 'Customers and subscribers reached' },
  { value: '100+', label: 'Projects brought from idea to launch' },
] as const;

/** Oldest first — the career strip reads left to right. */
export const ROLES = [
  {
    org: 'Rappler',
    years: '2013 – 2014',
    title: 'Editor and Contributor',
    story:
      'Editing and fact-checking in a 24/7 Manila newsroom, trained under Maria Ressa. It taught me to dig past the surface explanation.',
  },
  {
    org: 'Sportserve',
    years: '2014 – 2021',
    title: 'Senior Marketing Projects and Operations Manager',
    story:
      'Started as the director’s assistant. Grew into connecting eight departments across twelve markets, then built and led Payments Operations.',
  },
  {
    org: 'DTC Newsletter · Pilothouse',
    years: '2021 – 2024',
    title: 'Email & Website Operations Manager (MarTech)',
    story:
      'Started as email coordinator. Grew into web, deliverability, martech, lifecycle and AI lead workflows across two companies and their clients.',
  },
  {
    org: 'CraftConcepts',
    years: '2022 – 2025',
    title: 'Founder and Growth Strategist',
    story: 'Built a 20+ person collective that helped 26 small businesses rebuild online after the pandemic.',
  },
  {
    org: 'Mogo',
    years: '2024 – now',
    title: 'Senior Marketing Operations Manager (Lifecycle and MarTech)',
    story:
      'Joined to make lifecycle a connected growth system. Following the customer led into web, analytics, martech and automation across the business.',
  },
] as const;

export const BELIEFS = [
  {
    title: 'Understand before you build.',
    body: 'I grew up on a farm, where problems came without instructions. The first job was always understanding why. I still confirm the problem before picking a solution.',
  },
  {
    title: 'Numbers show you where to look. People tell you why.',
    body: 'Dashboards show where customers hesitate, not why. The answer comes from pairing the data with the people closest to the work.',
  },
  {
    title: 'If it only works when I’m in the room, it isn’t finished.',
    body: 'I document, involve the people who’ll run it, and plan the handoff. I’ve trained a successor in every major role I’ve left.',
  },
  {
    title: 'Be honest about the tradeoffs.',
    body: 'Every good decision costs something: time, money, speed or simplicity. I surface those costs early so everyone decides with clear eyes.',
  },
] as const;

export const LIFE = [
  {
    title: 'I travel for the food',
    body: 'Famous viewpoint or the spot locals love to eat? I’ll pick the food every time. A shared meal tells you more than any landmark.',
  },
  {
    title: 'Comics, games and very long stories',
    body: 'I’ve read all of Tolkien and wandered deep into Warhammer 40,000 lore. I love landing in an unfamiliar world and working out how it fits together.',
  },
  {
    title: 'Jazz and Latin, always on',
    body: 'Jazz for the improvisation, Latin because it’s impossible to sit still. I try to work in a way that leaves room for joy.',
  },
  {
    title: 'Katy, with a K',
    body: 'I live in Vancouver with my girlfriend Alejandra and our fat cat Katy. We take her on adventures. She continues to object.',
  },
] as const;

export interface Cert {
  issuer: string;
  title: string;
  /** YYYY-MM */
  month: string;
  meta: string;
}

/** Newest first, as issued. An empty `meta` means "Certificate of completion". */
export const CERTS: readonly Cert[] = [
  ['Google', 'Google Prompting Essentials', '2025-09', 'Credential ID GYGUP1D0VRRZ'],
  ['Google', 'Speed Up Data Analysis and Presentation Building', '2025-09', 'Credential ID 05JL3K00ST1I'],
  ['Google', 'Design Prompts for Everyday Work Tasks', '2025-09', 'Credential ID H8K0ZX1LL421'],
  ['Google', 'Start Writing Prompts like a Pro', '2025-09', 'Credential ID DFVUBZDUQRYV'],
  ['UC Davis', 'The Strategy of Content Marketing', '2024-07', 'Credential ID P4WN5N95NY8T'],
  ['UC Davis', 'Advanced Content and Social Tactics to Optimize SEO', '2024-07', 'Credential ID ER9SXVQGFSLU'],
  ['Google', 'From Likes to Leads: Interact with Customers Online', '2024-07', 'Credential ID ZY4H9KVTFHW2'],
  ['Google', 'Attract and Engage Customers with Digital Marketing', '2024-07', 'Credential ID 7RC73QUEFWUN'],
  ['Scrimba', 'Learn CSS Grid', '2024-06', 'Credential ID 7QA3HZHZR2JZ'],
  ['Scrimba', 'Learn CSS Flexbox', '2024-06', 'Credential ID W6GFP23DRLBV'],
  ['Google', 'Foundations of Digital Marketing and E-commerce', '2024-06', 'Credential ID RSPW7QAVZWJ3'],
  ['University of Michigan', 'Advanced Styling with Responsive Design', '2024-06', 'Credential ID EX5FMTMYXY2R'],
  ['UC Davis', 'SQL for Data Science', '2024-06', 'Credential ID 5LPJKYY48CH2'],
  ['HubSpot Academy', 'Social Media Marketing', '2023-08', 'Skill: Social media marketing'],
  ['HubSpot Academy', 'Content Marketing', '2023-08', 'Skill: Content marketing'],
  ['HubSpot Academy', 'Inbound', '2023-08', 'Skill: Inbound marketing'],
  ['HubSpot Academy', 'HubSpot CMS for Marketers', '2023-08', 'Skill: HubSpot'],
  ['Google', 'Project Initiation: Starting a Successful Project', '2023-05', 'Skill: Project management'],
  ['Google', 'Foundations of Project Management', '2023-02', 'Credential ID 42QN33UXAQKL'],
  ['upGrad KnowledgeHut', 'Agile and Scrum', '2017-01', ''],
  ['O&B', 'Core Agile Training with Scrum, Extreme Programming, and Kanban', '2016-01', ''],
].map(([issuer, title, month, meta]) => ({ issuer, title, month, meta }));

/** Issuers with their own filter chip and dot; everyone else is "Other". */
export const CERT_ISSUERS = [
  { name: 'Google', dot: 'var(--blue)' },
  { name: 'HubSpot Academy', dot: 'var(--red)' },
  { name: 'UC Davis', dot: 'var(--amber)' },
  { name: 'Scrimba', dot: 'var(--green)' },
] as const;

export const SKILLS = [
  {
    name: 'Lifecycle marketing & CRM',
    skills:
      'Journey design, segmentation, activation, retention, reactivation, email/SMS/push strategy, deliverability governance, lead scoring.',
    tools: ['Braze', 'Salesforce Marketing Cloud', 'HubSpot', 'Marketo', 'Klaviyo', 'Iterable', 'Intercom', 'ActiveCampaign', 'Campaign Monitor', 'Mailchimp', 'Omnisend', 'SendGrid'],
  },
  {
    name: 'AI & automation',
    skills:
      'AI workflow design, enrichment pipelines, intelligent routing, agent-based workflows, deterministic and generative hybrid design, validation and safeguards.',
    tools: ['n8n', 'Zapier', 'Make', 'LindyAI', 'Clay', 'OpenAI API', 'Claude', 'Gemini', 'Gumloop', 'Voiceflow'],
  },
  {
    name: 'Analytics & experimentation',
    skills: 'Tracking architecture, tagging, attribution modelling, funnel diagnostics, experiment design, reporting.',
    tools: ['GA4', 'Google Tag Manager', 'Looker Studio', 'Amplitude', 'Mixpanel', 'Branch Metrics', 'Snowflake', 'BigQuery', 'VWO', 'Optimizely', 'Hotjar'],
  },
  {
    name: 'Web, UX & CRO',
    skills:
      'Web strategy, information architecture, conversion optimisation, landing-page and funnel systems, web ownership and governance.',
    tools: ['Webflow', 'WordPress', 'Shopify', 'Figma', 'Instapage', 'Unbounce', 'Squarespace', 'Mouseflow'],
  },
  {
    name: 'SEO, AEO & GEO',
    skills:
      'Technical SEO, schema markup, Core Web Vitals, answer- and generative-engine optimisation, entity and knowledge-graph work, internal linking.',
    tools: ['Semrush', 'Ahrefs', 'Moz', 'Google Search Console', 'SurferSEO', 'Schema.org', 'PageSpeed Insights'],
  },
  {
    name: 'Data & scripting',
    skills: 'SQL querying, data modelling basics, data hygiene, ETL logic, measurement frameworks.',
    tools: ['SQL', 'Snowflake', 'BigQuery', 'Python (pandas)', 'Segment', 'Hightouch', 'Airtable'],
  },
  {
    name: 'Marketing ops & delivery',
    skills:
      'PM systems, Agile/Scrum/Kanban, sprint planning, process design, cross-functional alignment, documentation governance, RACI models.',
    tools: ['ClickUp', 'Jira', 'Asana', 'Wrike', 'Monday.com', 'Notion', 'Confluence', 'Trello', 'Airtable'],
  },
  {
    name: 'Acquisition & creative',
    skills:
      'Campaign performance and UTM governance, content production oversight, copywriting, visual direction, template systems.',
    tools: ['Google Ads', 'Meta Business Suite', 'LinkedIn Ads', 'Canva', 'Figma', 'Photoshop', 'Illustrator', 'Hootsuite', 'Buffer', 'Sprout Social'],
  },
] as const;

/** The 20-second intro clip, linked rather than embedded to keep the page light. */
export const INTRO_VIDEO = {
  href: 'https://youtu.be/WegUH6EIXgY',
  label: '20 seconds of me talking',
} as const;
