/**
 * Long-form case study bodies, keyed by the same slug as `PROJECTS` in
 * ./site.ts.
 *
 * The split is deliberate: site.ts owns what a project *is* — the card title,
 * tags, category and headline metrics read by the home page and the work index.
 * This file owns what the detail page adds on top, including its own `title`,
 * because the full write-up wants a longer headline than a card can carry.
 *
 * Every case follows the same arc, because that is genuinely how the work went:
 * the read → the decision → the number I picked → the build. Facts here come
 * from Website MD Repository/Professional History and the approved copy deck.
 * Do not invent a number, a date or a tool that isn't in those files.
 */

export interface CaseSection {
  label: string;
  paras: readonly string[];
}

export interface CaseStat {
  value: string;
  label: string;
}

export interface CaseTech {
  name: string;
  use: string;
}

export interface CaseStudy {
  /** Org · role · dates, exactly as recorded in Professional History. */
  meta: string;
  /** Headline for the detail page. */
  title: string;
  /** The one-line framing under the headline. */
  deck: string;
  sections: readonly CaseSection[];
  stats: readonly CaseStat[];
  /** The closing read — did the diagnosis hold? */
  outcome: string;
  tech: readonly CaseTech[];
}

export const CASES: Record<string, CaseStudy> = {
  'mogo-lifecycle': {
    meta: 'Mogo · Senior Marketing Operations & Lifecycle Manager (MarTech) · 2024 – present',
    title: 'The Mogo lifecycle rebuild',
    deck: 'Activation was stuck and everyone blamed email. The real problem was a web and lifecycle misalignment nobody had named.',
    sections: [
      {
        label: 'The read',
        paras: [
          'Activation was 24%. Everyone in the room said the same thing: the emails aren’t working, fix the emails.',
          'I looked at the actual customer path. The problem was not the email. The product web experience and the lifecycle program were running as two separate tracks. Users were dropping in the product before the emails had any chance to land. The lifecycle was timed to a behavior that wasn’t happening.',
          'Nobody had named that. The activation problem was a web and lifecycle misalignment problem. That’s the read that changed everything downstream.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'Rebuild the lifecycle around the actual product activation event, not a time-based email sequence. That meant rebuilding the web experience in parallel, instrumenting the real behavioral triggers, and making lifecycle an extension of the product rather than a marketing layer on top of it.',
          'This was not a campaign brief. It was an architectural decision about how lifecycle and product should relate to each other.',
        ],
      },
      {
        label: 'The number I picked',
        paras: [
          'Activation rate — bank-connection rate, specifically. Not open rate and not click rate, because those were already healthy, which was the confusing part. If activation moved, the read was right.',
          'I tracked 7-day drop-off as the inverse. Both numbers had to move together, or the intervention was noise.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Rebuilt the onboarding web experience. Added behavioral event tracking for real product actions. Rebuilt the lifecycle in Braze around those events instead of time delays. Built segmented journeys for activated vs. not-yet-activated users with distinct messaging and timing logic.',
          'Pulled in Product and Engineering to instrument the activation event properly, and worked with Data on the measurement framework. The Braze rebuild took six weeks, and the numbers moved inside two months of launch.',
        ],
      },
    ],
    stats: [
      { value: '24% → 38%', label: 'Activation rate' },
      { value: '78% → 62%', label: '7-day drop-off' },
    ],
    outcome: 'The read held. Activation moved because the lifecycle was tracking actual product behavior. Drop-off fell because users who weren’t activating got a different experience, not just more emails.',
    tech: [
      { name: 'Braze', use: 'Lifecycle and behavioral messaging' },
      { name: 'Webflow', use: 'Onboarding web experience' },
      { name: 'Segment', use: 'Event tracking and data routing' },
      { name: 'Looker', use: 'Measurement and reporting' },
    ],
  },
  'winback': {
    meta: 'Mogo · Senior Marketing Operations & Lifecycle Manager (MarTech) · 2024 – present',
    title: 'The Intelligent Investing winback and cross-sell',
    deck: 'About 900,000 people had either gone quiet on investing or never started. It was not one audience, and it was never going to be one campaign.',
    sections: [
      {
        label: 'The read',
        paras: [
          'Leadership wanted investing activations out of a dormant base of roughly 900,000 people. The first thing that mattered was that it was not one audience. Some had gone quiet on Intelligent Investing, but a large part of the pool were lending customers who had never invested with us at all — which is a cross-sell, not a winback.',
          'The two products needed different pitches on top of that. Manage is automated weekly investing into an S&P 500 strategy. Self-directed is manual trading with research alongside it. One list, four different conversations.',
          'And I genuinely did not know what the list quality was. Pruning it on guesswork would have thrown away contacts that were still worth something, so the quality question had to be answered under real campaign conditions rather than assumed.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'Build it as a multi-iteration program rather than a campaign. Iteration 1 would do two jobs at once: give a real read on conversion, and act as the list clean-up, since engagement under live conditions is the only honest signal of who is still reachable.',
          'Two behavioural hooks anchored the whole thing. For the Manage path, an investment calculator where someone could model what a small weekly contribution grows into by 75. For Self-directed, Fiscal.ai — a research tool already included in every Mogo membership, so the pitch was about something they already had.',
          'Messaging split by relationship rather than by segment name. Lending customers got progression: you have borrowed with us, here is how to start building. Dormant investors got resumption without judgment: you paused, you are still an investor as far as we are concerned.',
        ],
      },
      {
        label: 'The number I picked',
        paras: [
          'Conversion rate, with one condition attached: Iteration 1 was also the decision gate for how to treat the list afterwards — who to keep, who to cull, and what to do with the segment that never engaged at all.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Iteration 1 ran February to June 2025 across the full pool. Re-introduction in month one with a subject-line resend to non-openers, product-specific tracks through months two and three, then objection handling in months three and four using a one-click survey where people named their own barrier — too risky, cash flow, confused about the products, or already investing somewhere else. Each answer got its own response: risk mapped to long-term dollar-cost-averaging education and the calculator, cash flow to micro-contribution framing at ten or twenty dollars a week, confusion to plain product explainers, and other platforms repositioned as complementary rather than competitive. Months four and five tapered off for the coldest segments.',
          'That round converted about 2.7%. Afterwards I culled hard bounces, spam complaints, and anything with three or more soft bounces, which brought the reachable audience to roughly 600,000.',
          'Iteration 2 ran July 2025 to January 2026 on the cleaned list and converted about 5% — around 30,000 people who either activated for the first time or came back to real activity. The structural call in that round was what to do with people who had never interacted at all. Going dark on them risks a reputation spike whenever you eventually return, and normal cadence just burns them, so I ran a low-frequency monthly drip instead: one educational email a month, alternating between calculator content and Fiscal.ai research concepts.',
        ],
      },
    ],
    stats: [
      { value: '~54K', label: 'Activated or returned across two rounds' },
      { value: '~2.7% → ~5%', label: 'Conversion, Iteration 1 to Iteration 2' },
      { value: '~900K', label: 'People in the original pool' },
    ],
    outcome: 'Iteration 3 is running now against the remaining ~300K, with a sunset program planned for whatever is left after it. The numbers matter less than what the program left behind: a repeatable winback and cross-sell architecture — the two-hook model, cleaning the list as you convert it, and the low-frequency drip for the coldest segments — plus proof that lending-to-investing cross-sell works if you frame it as progression and give it more than one pass.',
    tech: [
      { name: 'Braze', use: 'Segmentation, iteration waves and cross-channel delivery' },
      { name: 'Investment calculator', use: 'Behavioural hook for the Manage path' },
      { name: 'Fiscal.ai', use: 'Research hook for the Self-directed path' },
      { name: 'One-click survey', use: 'Objection capture and routing' },
    ],
  },
  'behavioral-trigger-layer': {
    meta: 'Mogo · Senior Marketing Operations & Lifecycle Manager (MarTech) · 2024 – present',
    title: 'Building the behavioral trigger layer',
    deck: 'The activation sequence fired on a schedule instead of on what people actually did, and nobody had named that as the problem.',
    sections: [
      {
        label: 'The read',
        paras: [
          'Funded users were stopping there, and nothing in the lifecycle spoke to them once they had. There was no path at all from a funded account to a first trade.',
          'Users were funding their accounts and stopping. The lifecycle was sending scheduled emails about why to trade. They had already decided to fund — they were stuck on the next step, not the first one. The messaging was solving the wrong problem.',
          'The read: the lifecycle was timed, not triggered. A user who funded yesterday and a user who funded six weeks ago were getting the same email at the same time.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'Rebuild the trigger layer around real product events. Funded-idle is a specific signal. It needed its own journey, its own timing, and its own messaging logic, separate from the general activation sequence.',
          'Treat funded-idle as a distinct lifecycle stage, not a variation of onboarding.',
        ],
      },
      {
        label: 'The number I picked',
        paras: [
          'Funded-idle to first-trade conversion. Not activation broadly, not engagement. The specific transition from funded and dormant to first real product action. That was the number that proved whether the trigger layer was working.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Instrumented the funded-idle event in Braze as a behavioral trigger and built a dedicated journey that fired on account funding, not on a schedule. Designed messaging around the specific barrier a funded user faces — not why to trade, but how to make your first trade right now.',
          'Built separate branches for users who funded and did nothing, users who viewed the trading interface but didn’t execute, and users who started a trade and dropped off. Each branch had different logic and timing. Pulled in Product to confirm the event instrumentation was clean before scaling.',
        ],
      },
    ],
    stats: [
      { value: '~19%', label: 'Funded-idle to first trade at two months, where there had been no path before' },
      { value: '~24%', label: 'The same rate on the longer-term read' },
    ],
    outcome: 'The behavioral layer proved that responding to what users did, rather than how long they’d been in the funnel, was what moved revenue behavior. It also validated the next step: branching the whole Canvas by product intent.',
    tech: [
      { name: 'Braze', use: 'Multi-channel Canvas architecture' },
      { name: 'Product event instrumentation', use: 'Behavioral triggers' },
      { name: 'Push deep-linking', use: 'Suppression and frequency logic' },
    ],
  },
  'esp-migration': {
    meta: 'DTC Newsletter · Email & Website Operations Manager (MarTech) · 2021 – 2024',
    title: 'ESP migration and deliverability rescue',
    deck: 'Sender score in the low 20s, inbox placement collapsing, and the cause was not the content.',
    sections: [
      {
        label: 'The read',
        paras: [
          'Open rates were falling and spam placement was rising. The instinct in the room was to fix the content — cleaner subject lines, better segmentation, fresher copy.',
          'I looked at the infrastructure instead. The problem wasn’t what we were sending, it was how. DTC was on a shared IP inside ActiveCampaign. Other senders on that IP were damaging the shared reputation and there was nothing we could do about it from our end. A dedicated IP would have solved it, but it wasn’t in the budget.',
          'The read: the deliverability problem was not fixable within the current platform. The only real fix was a migration.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'Move to Campaign Monitor, where we could get a clean sending environment, warm a new domain properly, and own our reputation from the ground up.',
          'This was not just an ESP swap. It meant migrating 200K+ subscribers, rebuilding every automation, reconfiguring authentication, and warming the new domain before a single campaign could go out. The newsletter ran 5x a week. There was no pause button.',
        ],
      },
      {
        label: 'The number I picked',
        paras: [
          'Sender score. Not open rate, not click rate — those were already broken signals, suppressed by the deliverability problem itself. The underlying reputation score was the leading indicator. If it moved, everything downstream would follow.',
          'Secondary: spam placement rate via GlockApps. Inbox vs. spam across major providers was the real-time read on whether the migration was working.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Built the migration in phases so the newsletter never stopped. Configured DKIM, SPF, and DMARC on the new domain, executed a warming sequence from zero before scaling to full list volume, and rebuilt every automation from scratch.',
          'Segmented the list before the first send into active, inactive, and zero-engagement. Started warming with the most engaged segment only and expanded volume as sender score climbed. Used ZeroBounce to clean the list, GlockApps to monitor placement, and Litmus for rendering checks. Then built deliverability SOPs so the team had a defined response if scores dropped again.',
        ],
      },
    ],
    stats: [
      { value: '20s → 90+', label: 'Sender score' },
      { value: '200K+', label: 'Subscribers migrated' },
      { value: '5x / week', label: 'Send cadence maintained throughout' },
    ],
    outcome: 'The sender score didn’t just recover, it stabilized above 90 with the SOPs in place. The diagnostic was right: the problem was never the content. It was the infrastructure. Once that was clean, the content had a fair chance to perform.',
    tech: [
      { name: 'Campaign Monitor', use: 'Primary ESP post-migration' },
      { name: 'ZeroBounce', use: 'List hygiene and bounce management' },
      { name: 'GlockApps', use: 'Inbox placement monitoring' },
      { name: 'Litmus', use: 'Rendering and spam filter testing' },
      { name: 'DKIM / SPF / DMARC', use: 'Email authentication' },
    ],
  },
  'dafabet-sfmc': {
    meta: 'Sportserve (Dafabet) · Senior Marketing Projects and Operations Manager · 2014 – 2021',
    title: 'Salesforce lifecycle automation — Dafabet',
    deck: 'Twelve countries, safer-gambling compliance in every market, and no system connecting user behavior to messaging.',
    sections: [
      {
        label: 'The read',
        paras: [
          'Dafabet had users, products, and markets across APAC, EU, and LATAM. What it did not have was a lifecycle system that responded to what users actually did.',
          'New users were registering and not placing a first bet. Existing users were going dormant with no triggered re-engagement. High-value users weren’t being identified or treated differently. And every message had to comply with safer-gambling requirements that varied by jurisdiction.',
          'The read: the lifecycle wasn’t a lifecycle. It was occasional batch campaigns with no behavioral logic connecting them. The product had a clear activation event — the first bet — and nothing in the system was built around it.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'Build six interconnected behavioral flows in Salesforce Marketing Cloud with the first bet as the central activation milestone. Design the compliance layer into the architecture from the start, not as a review step at the end.',
          'The compliance-first decision was the one that changed how the team worked. When compliance is architecture, campaigns ship faster. When it’s a review step, every send creates a back-and-forth cycle.',
        ],
      },
      {
        label: 'The number I picked',
        paras: [
          'First-bet conversion rate. In a gaming product the first bet is the activation event — retention, LTV, and cross-sport engagement all depended on whether the user crossed that threshold.',
          'Secondary: 7-day reactivation rate. If the re-engagement flows were working, that number would move independently of acquisition volume.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Six flows, each triggered by a specific behavioral event. First-bet activation fired on registration with no bet inside 24 hours: email immediately, push at one hour, second email at 24 hours. Dormant re-engagement fired at 7+ days with no bet, pulling upcoming matches by geo and sport preference, then an AMPscript-driven promo respecting regional caps, then an in-play push or SMS.',
          'High-value nurturing identified power users at 3+ bets a week or top-20% average stake and routed them to account managers. A first-withdrawal trust flow fired off a withdrawal event pushed in via API. Churn-risk signals triggered jurisdiction-approved responsible gambling copy. A sport-usage matrix flagged single-sport bettors for cross-sport expansion.',
          'AMPscript handled regional cap enforcement, jurisdiction-specific copy variants, and promo eligibility at the send level. Compliance was not a final review step. It was in the architecture.',
        ],
      },
    ],
    stats: [
      { value: '+8–15%', label: 'First-bet conversion rate' },
      { value: '+10–20%', label: '7-day dormant reactivation' },
      { value: '+20–40%', label: 'CTR on triggered vs. batch campaigns' },
    ],
    outcome: 'Six flows, one connected system, one activation milestone at the center. It proved a principle that carried into every lifecycle system I built after: if the system doesn’t know what the user just did, it can’t send the right message.',
    tech: [
      { name: 'Salesforce Marketing Cloud', use: 'Lifecycle orchestration' },
      { name: 'Journey Builder', use: 'Flow design and execution' },
      { name: 'AMPscript', use: 'Dynamic content and compliance logic' },
      { name: 'Data Extensions', use: 'Behavioral segmentation' },
      { name: 'MobilePush / SMS Studio', use: 'Cross-channel delivery' },
    ],
  },
  'agentic-ops': {
    meta: 'Mogo · Senior Marketing Operations & Lifecycle Manager (MarTech) · 2024 – present',
    title: 'Agentic ops infrastructure',
    deck: 'Leadership wanted automation but had not named a platform or an owner, and what the Ops teams actually needed was to be able to build things themselves.',
    sections: [
      {
        label: 'The read',
        paras: [
          'The directive came down: we are automating. No tool selected, no owner named, no scope defined. The ops team was executing manually on loan routing, compliance review, and email production. Leadership wanted AI involved. The team wanted to keep working.',
          'The read: the request wasn’t really about AI. It was about reducing the manual bottlenecks slowing everything down. The team needed to do more without adding headcount. The tool was the vehicle, not the point.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'I took a hybrid architecture to the COO: Zapier for the messy integrations with existing systems, and self-hosted n8n on the AWS infrastructure we already had for the high-volume operational work. Zapier per-task pricing breaks at operational scale, so self-hosting kept both the cost and the ownership internal as volume grew.',
          'The other half of the decision was who it was for. This had to be infrastructure the Ops teams could build on themselves, not a service a central team ran for them, or I would just be moving the dependency from Engineering onto me.',
        ],
      },
      {
        label: 'The number I picked',
        paras: [
          'Underwriter close rate on the applications the system routed. It was the most direct measure of whether the automation was freeing up the right capacity for the right work, and if it did not move, the infrastructure was not earning its place.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'DevOps handled the infrastructure setup; I owned the operational use cases, the workflow architecture and the rollout. The first production build was loan application profiling and routing. Loan Ops were sorting and prioritising applications by hand, and that sorting was where the delay actually sat, so I sat with them to work out how they were making those calls, mapped the criteria into scoring logic, and automated the routing into the right queues.',
          'After that I went looking for the next ones rather than waiting to be asked, and the infrastructure grew to more than fifteen production automations. Then I wrote the documentation, put the SOPs in Confluence, and ran sessions with each Ops lead so their team could build and maintain their own.',
        ],
      },
    ],
    stats: [
      { value: '~+30%', label: 'Underwriter close rate on the applications the system routed' },
      { value: '15+', label: 'Automations in production, run by the Ops teams themselves' },
    ],
    outcome: 'Underwriters stopped sorting and spent the time closing, which is where the close rate came from. The part that mattered more was the one the original read pointed at: Ops teams now build and extend their own workflows, so what started as one automation project became a capability the business owns without me.',
    tech: [
      { name: 'n8n', use: 'Self-hosted on existing AWS for high-volume workflows' },
      { name: 'Zapier', use: 'Integrations with existing systems' },
      { name: 'OpenAI API', use: 'Application profiling and scoring logic' },
      { name: 'Confluence', use: 'SOPs, documentation and training material' },
    ],
  },
  'lead-enrichment': {
    meta: 'Pilothouse / DTC Newsletter · Email & Website Operations Manager (MarTech) · 2021 – 2024',
    title: 'AI-powered lead enrichment and routing',
    deck: 'The CFO asked for enriched leads, when what sales needed was to know which signups were worth calling the moment they arrived.',
    sections: [
      {
        label: 'The read',
        paras: [
          'Newsletter signups were flowing into HubSpot as raw contact records — a company name and an email address. No company context, no qualification signal, no urgency indicator for sales.',
          'The request was simple: enrich leads automatically when they sign up. On the surface it looked like a data problem. I sat with the CFO and the sales team to understand what they actually needed. The real problem wasn’t missing data. It was that by the time sales manually researched a lead and decided whether to reach out, the moment had passed.',
          'The read: this was a speed-to-contact problem, not an enrichment problem. The system needed to tell sales who was worth calling, in real time, not after a manual research pass.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'Reframe the goal from lead enrichment to speed-to-contact infrastructure. That changed everything downstream — the tools selected, the routing logic, the definition of done.',
          'The system needed to filter, enrich, qualify, and surface high-value leads to sales the moment they signed up. Not in a daily batch. The moment they came in.',
        ],
      },
      {
        label: 'The number I picked',
        paras: [
          'Lead data pre-population rate. What percentage of fields did sales have before they touched a record? If the system was working, a salesperson should be able to open a new lead and already know who they were looking at.',
          'Secondary: enriched lead volume per month. The system had to perform at scale, not just in demo conditions.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Mapped the full workflow before selecting any tools. Defined exactly what a sales-ready record needed to contain, then built backward from that output.',
          'The workflow ran in sequence: Zapier caught the new signup, filtered out personal email domains, pulled company-level data through StoreLeads, enriched contact data using LindyAI and LinkedIn, passed both to ChatGPT for company fit classification and persona identification, structured the output into a CRM-ready record, wrote it to HubSpot, and routed a Slack alert to sales and leadership when a high-value company came through.',
          'Early versions produced inconsistent classification on edge cases. I added structured output requirements between steps and a validation layer to catch unreliable data before it reached CRM fields. The system only became reliable once outputs were forced into a defined schema rather than freeform text. Then I extended the same workflow logic to Pilothouse B2B client accounts.',
        ],
      },
    ],
    stats: [
      { value: '~70%', label: 'Lead data pre-populated before sales contact' },
      { value: '1K–2K', label: 'Enriched leads per month' },
      { value: '+30%', label: 'Lead quality' },
    ],
    outcome: 'The reframe was the whole thing. Enrichment as a goal produces a richer spreadsheet. Speed-to-contact as a goal produces a system sales actually uses. The difference wasn’t in the tools — it was in asking what the data was supposed to solve.',
    tech: [
      { name: 'Zapier', use: 'Workflow orchestration and trigger logic' },
      { name: 'LindyAI', use: 'Individual contact enrichment' },
      { name: 'ChatGPT API', use: 'Company classification and fit scoring' },
      { name: 'StoreLeads', use: 'Company-level data by domain' },
      { name: 'HubSpot', use: 'CRM destination and pipeline management' },
      { name: 'Slack', use: 'Real-time high-value lead routing' },
    ],
  },
  'compliance-workflow': {
    meta: 'Mogo · Senior Marketing Operations & Lifecycle Manager (MarTech) · 2024 – present',
    title: 'Email validation and compliance workflow',
    deck: 'The validation workflow ran fine technically and still nobody leaned on it, because it was not checking what Compliance actually checks.',
    sections: [
      {
        label: 'The read',
        paras: [
          'Every lifecycle email required four to five rounds of review between the lifecycle team and Compliance before it could send. No self-serve QA existed, so every send was a back-and-forth that added days to production.',
          'The original request was a spam checker — something to flag obvious deliverability risks before content went to Compliance. I built the first version. It worked technically. The output was inconsistent.',
          'I looked at why. The workflow was checking for spam signals. Compliance wasn’t reviewing for spam signals — they were reviewing for specific regulatory language, prohibited claims, and jurisdiction-specific disclosure rules. The tool was solving the wrong problem because I hadn’t brought the actual subject matter expert into the design.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'Stop iterating on the technical layer and redesign the workflow from the compliance review process outward. Bring Compliance in as a design partner, not a downstream approver.',
          'Rebuilding from scratch rather than patching the existing workflow cost time upfront, but it was the only path to something the team would actually rely on.',
        ],
      },
      {
        label: 'The number I picked',
        paras: [
          'Compliance review cycles per email. How many rounds of back-and-forth before sign-off? That was the friction the tool was supposed to remove. If the number didn’t drop, the tool wasn’t working regardless of what it produced technically.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Sat with Compliance before touching the workflow. Documented exactly how they reviewed content: what they looked for, what triggered a flag, what the rules were per content category, what varied by jurisdiction. Built that logic into the prompt architecture and validation layer.',
          'It took four versions. V1 checked spam signals — functional, wrong problem. V2 added compliance flag categories: better output, still inconsistent, because the model was interpreting rules rather than applying them. V3 brought Compliance in and replaced interpretation with explicit rule sets — reliable, but too verbose to use. V4 restructured the output so results were actionable in seconds.',
          'Built in n8n so the lifecycle team could run validation themselves while drafting. Compliance reviews the output, not the email. The compliance question was answered before the email ever reached Compliance.',
        ],
      },
    ],
    stats: [
      { value: '4–5 → 1–2', label: 'Compliance review cycles per email' },
      { value: '−50%', label: 'Review cycle time' },
      { value: '4', label: 'Versions to get it right' },
    ],
    outcome: 'The lesson wasn’t about the tool. It was about who you design with. The first three versions failed because I was building a compliance workflow without a compliance expert in the room. Subject matter experts aren’t approvers. They’re design inputs.',
    tech: [
      { name: 'n8n', use: 'Workflow orchestration and self-serve QA' },
      { name: 'OpenAI API', use: 'Content validation and flag classification' },
      { name: 'Braze', use: 'Lifecycle email production pipeline' },
      { name: 'Confluence', use: 'Workflow documentation and rule sets' },
    ],
  },
  'mogo-web': {
    meta: 'Mogo · Senior Marketing Operations & Lifecycle Manager (MarTech) · 2024 – present',
    title: 'Mogo web ecosystem rebuild',
    deck: 'Marketing needed to ship pages in hours, but the website sat with DevOps — which turned out to be the whole problem, not a detail of it.',
    sections: [
      {
        label: 'The read',
        paras: [
          'Lifecycle conversion was weak and the assumption in the room was that the emails needed work. I looked upstream. The emails were performing reasonably. What wasn’t performing was where they sent people — campaign traffic landed on generic product pages with nothing to do with the message the user had just read.',
          'The second problem was structural. The website was owned by DevOps. Any change required an engineering ticket, and a campaign landing page took weeks. Marketing had no way to move at campaign speed.',
          'The read: two problems at once. A conversion problem caused by lifecycle-web misalignment, and an ownership problem caused by the wrong team controlling the tool.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'Rebuild the web ecosystem in Webflow and migrate ownership to Marketing. Build a component system that lets any team member launch a page without engineering involvement. Design every page with lifecycle alignment and conversion intent from the start.',
          'Use the migration as the forcing function to fix the tracking layer at the same time. GA4 and GTM had years of undocumented tag debt — rebuilding the site without fixing tracking would just create a faster version of the same broken attribution problem.',
        ],
      },
      {
        label: 'The number I picked',
        paras: [
          'Conversion rate from lifecycle traffic. That was the specific failure the rebuild was meant to address: if lifecycle emails drove traffic to pages that matched the message and the intent, that number would move.',
          'Secondary: time to launch for a new page. The ownership problem was only solved if Marketing could actually ship without waiting on engineering.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Rebuilt five properties: MogoTrade as the initial proof of the Webflow model, then Moka, Intelligent Investing, orion-digital.com, and mogo.ca.',
          'Built a component system rather than individual pages — reusable sections, governed naming, and a CMS structure that let anyone assemble a page from the library in hours. Defined URL structures, content models, and metadata templates before touching layouts, so SEO and tracking were built in rather than retrofitted.',
          'Applied SEO, AEO, and GEO across all five properties: schema markup, canonical structures, internal linking, metadata by page type. Rebuilt GA4 and GTM in parallel, bringing Analytics, DevOps, Product, and Legal into the tracking architecture during the migration rather than after. Every page launched with clean event tracking on day one.',
        ],
      },
    ],
    stats: [
      { value: '+15%', label: 'Conversion from lifecycle traffic' },
      { value: '+30%', label: 'Conversion on campaign-specific landing pages' },
      { value: '~5% → ~14%', label: 'MogoTrade organic traffic share, within 90 days' },
    ],
    outcome: 'The lifecycle conversion problem was never an email problem. It was a destination problem. Once the pages matched the message and Marketing owned the ability to change them, conversion followed — and the component system meant the fix wasn’t one campaign, it was every campaign after.',
    tech: [
      { name: 'Webflow', use: 'Full web ecosystem and component system' },
      { name: 'GA4 + GTM', use: 'Rebuilt tracking infrastructure' },
      { name: 'Braze', use: 'Lifecycle-to-web traffic coordination' },
      { name: 'Semrush / Ahrefs', use: 'SEO audit and organic performance' },
      { name: 'Schema.org', use: 'Structured data and AEO implementation' },
      { name: 'Branch Metrics', use: 'App deep-link attribution' },
    ],
  },
  'dtc-newsletter': {
    meta: 'DTC Newsletter · Email & Website Operations Manager (MarTech) · 2021 – 2024',
    title: 'DTC Newsletter web and SEO rebuild',
    deck: 'The newsletter had a 70% bounce rate, and the right people were arriving — they just were not being given a reason to stay.',
    sections: [
      {
        label: 'The read',
        paras: [
          'DTC Newsletter had strong email engagement and a growing subscriber base. The website told a different story: bounce rate at 70%, organic traffic underperforming relative to content volume, and low signup conversion from organic visitors who were, by definition, high intent.',
          'I looked at what was actually on the site. The information architecture had no coherent structure — content had been added over time with no taxonomy or hierarchy, and there was no clear path from a search result to a signup. The site had been built as a content container, not a conversion system.',
          'The read: the bounce rate wasn’t an audience quality problem. The right people were landing and immediately leaving, because the page gave them no reason to stay.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'Rebuild the architecture from the information model outward: taxonomy first, then URL structure, then page hierarchy, then layouts. Treat the site as a conversion system where every page had a job — capture a subscriber, build credibility with a sponsor, or rank for a term that brought in the next reader.',
          'I owned all of it. No separate web team, no design handoff, no engineering queue. Three full rebuilds over the tenure.',
        ],
      },
      {
        label: 'The number I picked',
        paras: [
          'Bounce rate, as the primary signal of whether the site was working for the reader who arrived. If the architecture and content hierarchy were right, it would fall.',
          'Secondary: organic newsletter signup rate. The site’s job was ultimately to convert organic readers into subscribers. That number had to move or the rebuild hadn’t solved the right problem.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'The first version shipped with a clean content taxonomy, consistent URL structure, schema markup across all content types, and metadata templates matched to search intent by page category.',
          'The second rebuild expanded the system for growing content volume: new page types for sponsor content, resource sections, and topic cluster hubs, with internal linking built around keyword groupings.',
          'The third rebuild was forced by an external contractor deleting the entire Webflow environment. I rebuilt the full site from memory and documentation — every component, CMS collection, automation, and content system — without data loss. Operations never stopped.',
        ],
      },
    ],
    stats: [
      { value: '70% → 38%', label: 'Bounce rate' },
      { value: '+28%', label: 'Organic traffic' },
      { value: '+27%', label: 'Organic newsletter signups' },
    ],
    outcome: 'Three rebuilds taught the same lesson each time. The bounce rate was always a symptom, not the problem. The problem was whether the page gave the reader a reason to be there. When the architecture matched how readers actually moved through the content, the numbers followed.',
    tech: [
      { name: 'Webflow', use: 'Full site development and CMS' },
      { name: 'Semrush / Ahrefs', use: 'SEO audit and keyword research' },
      { name: 'Google Search Console', use: 'Indexation and ranking data' },
      { name: 'Schema.org', use: 'Structured data implementation' },
      { name: 'GA4', use: 'Traffic and conversion tracking' },
      { name: 'Campaign Monitor', use: 'Newsletter signup integration' },
    ],
  },
  'analytics-rebuild': {
    meta: 'Mogo · Senior Marketing Operations & Lifecycle Manager (MarTech) · 2024 – present',
    title: 'Analytics and tracking infrastructure rebuild',
    deck: 'Leadership had stopped trusting the numbers, and the cause was sitting underneath the campaigns: years of undocumented tag debt.',
    sections: [
      {
        label: 'The read',
        paras: [
          'Performance reports were landing with a disclaimer: these numbers might not be accurate. Leadership had stopped making decisions on marketing data because it had been unreliable long enough that nobody trusted it.',
          'GA4 was partially configured. GTM had years of tags added without documentation, naming conventions, or governance. Attribution across web, app, and lifecycle was inconsistent. Nobody had a complete picture of what was firing, what was double-counting, and what wasn’t firing at all.',
          'The martech stack had grown tool by tool with no central owner. Braze, Intercom, and Microsoft Dynamics were operating as silos — Braze wasn’t connected to Dynamics at all, so behavioral segmentation was running blind to customer status, loan history, and account events.',
          'The read: two problems compounding each other. A broken tracking layer making reporting unreliable, and a disconnected stack making lifecycle strategy less effective than it should have been.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'Use the Webflow ecosystem rebuild as the forcing function to fix the tracking layer at the same time. That was the decision that made the rebuild possible without a separate project cycle — every page launching in Webflow could launch with clean tagging from day one instead of a retrofit afterward.',
          'Run the martech audit in parallel: map every tool, integration, and data flow, and surface what was missing, what was underused, and what was costing money without delivering value.',
        ],
      },
      {
        label: 'The number I picked',
        paras: [
          'Data accuracy rate. The specific question leadership needed answered was whether they could trust what the reports showed. Accuracy at the event level was the only metric that answered it.',
          'Secondary: cost savings from the martech audit. If the audit surfaced unused tools or redundant subscriptions, that was a direct business outcome from the diagnostic work.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Created a new GA4 property from scratch with a full event taxonomy supporting lifecycle, acquisition, and retention measurement simultaneously — standardized naming, custom dimensions, and conversion event configuration.',
          'Rebuilt GTM completely in parallel with the Webflow migration, clearing years of tag debt and consolidating pixel management for Meta, LinkedIn, and other channels under GTM governance. Brought Analytics, DevOps, Product, and Legal into the process during the migration rather than after. Integrated Branch Metrics for mobile attribution, which had been essentially unmeasured.',
          'Ran the martech audit across the full stack, mapping data flows between Braze, Intercom, Dynamics, and supporting tools. Surfaced the Braze–Dynamics integration gap, escalated it to the COO, and got it onto the product roadmap. Identified about $18K in annual savings from unused features and redundant subscriptions, and delivered a tech roadmap for future scaling.',
        ],
      },
    ],
    stats: [
      { value: '40% → 80%', label: 'Data accuracy rate' },
      { value: '~$18K', label: 'Annual martech savings identified' },
    ],
    outcome: 'The rebuild didn’t improve campaign performance directly. It made campaign performance legible. When leadership can trust the data, they make decisions with it; when they can’t, they stop looking at it entirely. The real outcome wasn’t better numbers — it was numbers that could be used.',
    tech: [
      { name: 'GA4', use: 'Analytics property rebuilt from scratch' },
      { name: 'Google Tag Manager', use: 'Full implementation and governance' },
      { name: 'Branch Metrics', use: 'Mobile attribution and deep-link tracking' },
      { name: 'Microsoft Dynamics CRM', use: 'Martech audit and integration mapping' },
      { name: 'Braze', use: 'Lifecycle platform and integration assessment' },
      { name: 'Looker', use: 'Measurement and reporting' },
    ],
  },
  'sportserve-payments-division': {
    meta: 'Sportserve · Senior Marketing Projects and Operations Manager · Mar 2014 – Feb 2021',
    title: 'Building the Payments Operations Division',
    deck: 'Payment launches were fragmented across 8 departments with no single owner. I made the case for a dedicated division and built it from scratch.',
    sections: [
      {
        label: 'The read',
        paras: [
          'Sportserve operated payment launches across 12 countries, and every launch touched Product, Engineering, Compliance, Creative, Customer Support, and external payment providers. None of that was coordinated. Each team only saw their own piece of the work.',
          'Launches kept slipping and the instinct around me was to fix each launch as it came up. I looked past the individual launches and saw the same failure pattern repeating every time. The problem was never any single launch. It was that no system existed to connect the people who had to work together to ship one.',
          'Nobody had named that gap, because from inside any one department it just looked like a slow launch.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'Fixing one launch at a time would have meant doing this forever. I decided the business needed a dedicated function, not another workaround, and made the case to leadership for a standalone Payments Operations Division built from zero.',
          'I designed it as an internal agency model: one team owning project management, B2C campaign execution, B2B onboarding coordination, creative production, vendor management, and customer issue resolution for everything payments-related, across all 12 markets.',
        ],
      },
      {
        label: 'The number I picked',
        paras: [
          'Launch throughput and production error rate across the full portfolio of launches, not any single one. If the system was working, every launch would get faster and cleaner, not just the ones I personally touched. That was the only way to prove the diagnosis was right: that the problem was systemic, not isolated.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'I hired the initial team of 5 from scratch and defined the operating model myself: Agile sprint cycles, RACI models for ownership clarity, centralized project tracking, and a data-driven prioritization framework that sequenced launches by market impact instead of whoever asked loudest.',
          'I built the SOPs, the QA processes, and the standardized launch templates so the team could execute consistently without me in every decision. Then I traveled to new regional offices to train local teams in person, since the model only worked if it held up the same way in every market.',
          'The division sat inside the broader MSOps department, which grew from 5 to 36 over the same stretch as four other leads built out their own divisions in parallel. That wider growth wasn’t my build. The 5-person division was.',
        ],
      },
    ],
    stats: [
      { value: '0 → 5', label: 'Team built from zero' },
      { value: '2x', label: 'Campaign throughput' },
      { value: '~40%', label: 'Production errors reduced' },
    ],
    outcome: 'That turned out to be the right call. Throughput doubled, errors dropped about 40%, and payment method adoption improved 20–30% by market — because launches were finally running through one system instead of eight. The structure outlasted me.',
    tech: [
      { name: 'Jira', use: 'Sprint planning and backlog management' },
      { name: 'Agile and RACI', use: 'Delivery governance and ownership clarity' },
      { name: 'Confluence', use: 'SOPs and operational documentation' },
      { name: 'Creative production tooling', use: 'Merchant assets and campaign creative' },
    ],
  },
  'craftconcepts': {
    meta: 'CraftConcepts · Founder, Growth Marketing Strategist · May 2022 – Jan 2025',
    title: 'Founding and scaling CraftConcepts',
    deck: 'Local businesses lost their digital presence after the pandemic and couldn’t afford an agency to fix it. I built a collective to close that gap, and used it to mentor early-career marketers on real client work.',
    sections: [
      {
        label: 'The read',
        paras: [
          'I was running lifecycle and web systems full-time at DTC/Pilothouse, with employer permission to take on local SMB work outside of that, and I kept running into the same problem. Business owners had lost whatever digital presence they’d built before the pandemic, and standard agency pricing put real help out of reach for most of them.',
          'The gap wasn’t expertise. It was access. Nobody was building a structure that could deliver actual strategy and execution to businesses that couldn’t pay agency rates, and freelancing solo wasn’t going to fix that for more than one business at a time.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'The only way to serve more than one client properly was to build a team, not take clients one at a time. I founded CraftConcepts with two co-founders, one on sales and one on creative, with one rule that never moved: nothing went out the door without me reviewing the strategy first, regardless of who built it.',
          'There was no capital to hire, so I built the team through referrals and treated every contributor relationship as mentorship, not labor. People learned how to diagnose a client’s actual problem and build the system that fixed it, then walked away with real client work for their own portfolios.',
        ],
      },
      {
        label: 'The number I picked',
        paras: [
          'Number of businesses served, since that was the only way to know whether the model scaled past me personally. And organic visibility, since that proved the work held up after we shipped it — not just that we shipped something.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'I built a commission-based compensation model scaled to each client’s budget, paired with volunteer effort from contributors who wanted the portfolio experience more than the pay. I personally ran founder interviews with every client to extract their actual positioning before any build started, then built repeatable website and content playbooks so the team wasn’t starting from zero on every engagement.',
          'The team grew from 3 co-founders to 8 within the first year, then to a rotating collective of 20+ at peak in year two, including early-career marketers in both Vancouver and the Philippines. No formal hierarchy, no full-time staff — just people rotating through real client work under my review.',
        ],
      },
    ],
    stats: [
      { value: '3 → 20+', label: 'Contributors at peak' },
      { value: '26', label: 'Businesses served' },
      { value: '~40%', label: 'Organic visibility lift' },
    ],
    outcome: 'The model scaled past what I could do alone — not because I hired in the traditional sense, but because the mentorship structure meant contributors could actually execute client work, not just shadow it. I wound it down deliberately in January 2025, once the gap it was built for had closed.',
    tech: [
      { name: 'Webflow and WordPress', use: 'Client website builds' },
      { name: 'SEO and CRO', use: 'Visibility and conversion work' },
      { name: 'Content and brand playbooks', use: 'Repeatable founder-interview-to-launch process' },
    ],
  },
};
