/**
 * Long-form case study bodies, keyed by the same slug as `PROJECTS` in
 * ./site.ts.
 *
 * The split is deliberate: site.ts owns what a project *is* — title, tags,
 * category, headline metrics — and is read by both the home page and the work
 * index. This file owns only what the detail page adds on top, so a title can
 * never drift between the card and the page it links to.
 *
 * Every case follows the same arc, because that is genuinely how the work went:
 * the read → the decision → the metric I chose → the build. Facts here come
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
  sections: readonly CaseSection[];
  stats: readonly CaseStat[];
  /** The closing read — did the diagnosis hold? */
  outcome: string;
  tech: readonly CaseTech[];
}

export const CASES: Record<string, CaseStudy> = {
  'mogo-lifecycle': {
    meta: 'Mogo · Senior Marketing Operations Manager · 2024 – present',
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
        label: 'The metric I chose',
        paras: [
          'Activation rate at 7 days. Not open rate, not click rate, not revenue — those are downstream. Activation at day 7 was the leading indicator that predicted retention, credit utilization, and LTV. If that number moved, the read was correct.',
          'I tracked 7-day drop-off as the inverse. Both numbers had to move together, or the intervention was noise.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Rebuilt the onboarding web experience. Added behavioral event tracking for real product actions. Rebuilt the lifecycle in Braze around those events instead of time delays. Built segmented journeys for activated vs. not-yet-activated users with distinct messaging and timing logic.',
          'Pulled in Product and Engineering to instrument the activation event properly, and worked with Data on the measurement framework. The build took six months to get right. The signals started moving at month three.',
        ],
      },
    ],
    stats: [
      { value: '24% → 38%', label: 'Activation rate' },
      { value: '78% → 62%', label: '7-day drop-off' },
      { value: '35% → 23%', label: 'First-year churn' },
    ],
    outcome:
      'The read held. Activation moved because the lifecycle was tracking actual product behavior. Drop-off fell because users who weren’t activating got a different experience, not just more emails. Churn followed. The system compounded.',
    tech: [
      { name: 'Braze', use: 'Lifecycle and behavioral messaging' },
      { name: 'Webflow', use: 'Onboarding web experience' },
      { name: 'Segment', use: 'Event tracking and data routing' },
      { name: 'Looker', use: 'Measurement and reporting' },
    ],
  },

  winback: {
    meta: 'Mogo · Senior Marketing Operations Manager · 2024 – present',
    sections: [
      {
        label: 'The read',
        paras: [
          'There was a single suppressed list of about 900K dormant users across two products. Nobody had treated these as distinct audiences with different reactivation logic. The previous approach was one blast, one offer, low conversion, done.',
          'The list had been undertreated. There were multiple winback and cross-sell opportunities depending on which product the user had originally held, what their last interaction was, and what the current offer environment looked like. Running it as a campaign meant leaving most of the value on the table.',
        ],
      },
      {
        label: 'The decision',
        paras: [
          'Segment the list by product, lapse period, and prior engagement signal. Build separate messaging tracks for winback vs. cross-sell. Run iteratively, not as a single send. Test incentive vs. no-incentive. Feed learnings from each wave into the next.',
          'The decision was to treat dormant differently by product and by behavior, not by marketing convenience.',
        ],
      },
      {
        label: 'The metric I chose',
        paras: [
          'Total conversions from the dormant base. Not open rate, not click rate. Did they come back and take an action? I tracked it cumulatively across waves so I could see the compound effect of running it as a system rather than a one-time event.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Built a segmentation model on the dormant base using lapse recency, product type, and last known engagement signal. Set up wave-based deployment in Braze so each send informed the next. Built winback messaging for existing product holders and cross-sell messaging for those who had never tried the second product.',
          'Tested three incentive conditions. Fed suppression logic back after each wave so we weren’t hitting the same users twice without a reason, and iterated the offer based on what each wave showed.',
        ],
      },
    ],
    stats: [
      { value: '~54K', label: 'Conversions from the dormant base' },
      { value: '~900K', label: 'Dormant users in base' },
    ],
    outcome:
      'The system compounded across waves. Segmentation plus wave-based deployment outperformed a single-blast equivalent on both conversion rate and per-contact value. The most recent lapsed users converted best, which validated the recency segmentation.',
    tech: [
      { name: 'Braze', use: 'Segmentation and wave deployment' },
      { name: 'Segment', use: 'Behavioral data and suppression logic' },
      { name: 'Looker', use: 'Wave-by-wave conversion tracking' },
    ],
  },

  'behavioral-trigger-layer': {
    meta: 'Mogo · Senior Marketing Operations Manager · 2024 – present',
    sections: [
      {
        label: 'The read',
        paras: [
          'Funded-idle users were sitting at 0% conversion to first trade. The lifecycle program was running, emails were going out, nobody was trading.',
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
        label: 'The metric I chose',
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
      { value: '0% → ~19%', label: 'Funded-idle to first trade, within two months' },
      { value: '~24%', label: 'By the end-of-year read' },
      { value: '~22%', label: 'First-trade push interaction rate' },
    ],
    outcome:
      'The behavioral layer proved that responding to what users did, rather than how long they’d been in the funnel, was what moved revenue behavior. It also validated the next step: branching the whole Canvas by product intent.',
    tech: [
      { name: 'Braze', use: 'Multi-channel Canvas architecture' },
      { name: 'Product event instrumentation', use: 'Behavioral triggers' },
      { name: 'Push deep-linking', use: 'Suppression and frequency logic' },
    ],
  },

  'esp-migration': {
    meta: 'DTC Newsletter · Senior Website and Email Operations Manager · 2021 – 2024',
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
        label: 'The metric I chose',
        paras: [
          'Sender score. Not open rate, not click rate — those were already broken signals, suppressed by the deliverability problem itself. The underlying reputation score was the leading indicator. If it moved, everything downstream would follow.',
          'Secondary: spam placement rate via GlockApps. Inbox vs. spam across major providers was the real-time read on whether the migration was working.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Built the migration in phases so the newsletter never stopped. Configured DKIM, SPF, and DMARC on the new domain, executed a warming sequence from zero before scaling to full list volume, and rebuilt every automation from scratch.',
          'Segmented the list before the first send into active, inactive, and zombie. Started warming with the most engaged segment only and expanded volume as sender score climbed. Used ZeroBounce to clean the list, GlockApps to monitor placement, and Litmus for rendering checks. Then built deliverability SOPs so the team had a defined response if scores dropped again.',
        ],
      },
    ],
    stats: [
      { value: '20s → 90+', label: 'Sender score' },
      { value: '200K+', label: 'Subscribers migrated' },
      { value: '5x / week', label: 'Send cadence maintained throughout' },
    ],
    outcome:
      'The sender score didn’t just recover, it stabilized above 90 with the SOPs in place. The diagnostic was right: the problem was never the content. It was the infrastructure. Once that was clean, the content had a fair chance to perform.',
    tech: [
      { name: 'Campaign Monitor', use: 'Primary ESP post-migration' },
      { name: 'ZeroBounce', use: 'List hygiene and bounce management' },
      { name: 'GlockApps', use: 'Inbox placement monitoring' },
      { name: 'Litmus', use: 'Rendering and spam filter testing' },
      { name: 'DKIM / SPF / DMARC', use: 'Email authentication' },
    ],
  },

  'dafabet-sfmc': {
    meta: 'Sportserve (Dafabet) · Senior Digital Projects and Marketing Operations Manager · 2014 – 2021',
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
        label: 'The metric I chose',
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
    outcome:
      'Six flows, one connected system, one activation milestone at the center. It proved a principle that carried into every lifecycle system I built after: if the system doesn’t know what the user just did, it can’t send the right message.',
    tech: [
      { name: 'Salesforce Marketing Cloud', use: 'Lifecycle orchestration' },
      { name: 'Journey Builder', use: 'Flow design and execution' },
      { name: 'AMPscript', use: 'Dynamic content and compliance logic' },
      { name: 'Data Extensions', use: 'Behavioral segmentation' },
      { name: 'MobilePush / SMS Studio', use: 'Cross-channel delivery' },
    ],
  },

  'agentic-ops': {
    meta: 'Mogo · Senior Marketing Operations Manager · 2024 – present',
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
          'Pick three high-friction manual processes and build agentic workflows for each: loan routing, compliance review cycles, and email production. These had the clearest input-output logic and the most measurable time cost. Build the infrastructure for the team to run them, not for a central team to manage them.',
          'The selection criteria was: where does a human spend time doing something a model can do more consistently? Not: where does AI sound impressive?',
        ],
      },
      {
        label: 'The metric I chose',
        paras: [
          'Cycle time reduction per process — how long did it take before vs. after — tracked separately per workflow so we could see which interventions worked and which needed adjustment. Secondary metric: underwriter close rate on AI-routed loans.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Built an AI loan routing agent that scored inbound applications and matched them to the right underwriter tier. Built a compliance review workflow that drafted and flagged review items, cutting the manual read cycle. Built an email production system that produced first drafts from a creative brief.',
          'Each workflow was designed so the ops team owned it directly. No central AI team required. The infrastructure was the point.',
        ],
      },
    ],
    stats: [
      { value: '~+30%', label: 'Underwriter close rate on AI-routed loans' },
      { value: '~−50%', label: 'Compliance review cycle time' },
      { value: '~−75%', label: 'Email build time' },
    ],
    outcome:
      'The routing improvement was the most significant — better loan matching meant underwriters spent time on applications with higher close probability. The email and compliance gains were efficiency wins; the routing improvement directly affected revenue.',
    tech: [
      { name: 'OpenAI API', use: 'Loan routing and compliance review agents' },
      { name: 'n8n', use: 'Workflow orchestration' },
      { name: 'Braze', use: 'Email production pipeline' },
      { name: 'Confluence', use: 'Workflow documentation and SOPs' },
    ],
  },

  'lead-enrichment': {
    meta: 'Pilothouse / DTC Newsletter · Senior Website and Email Operations Manager · 2021 – 2024',
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
        label: 'The metric I chose',
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
      { value: '+30%', label: 'Lead quality vs. unenriched baseline' },
    ],
    outcome:
      'The reframe was the whole thing. Enrichment as a goal produces a richer spreadsheet. Speed-to-contact as a goal produces a system sales actually uses. The difference wasn’t in the tools — it was in asking what the data was supposed to solve.',
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
    meta: 'Mogo · Senior Marketing Operations Manager · 2024 – present',
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
        label: 'The metric I chose',
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
    outcome:
      'The lesson wasn’t about the tool. It was about who you design with. The first three versions failed because I was building a compliance workflow without a compliance expert in the room. Subject matter experts aren’t approvers. They’re design inputs.',
    tech: [
      { name: 'n8n', use: 'Workflow orchestration and self-serve QA' },
      { name: 'OpenAI API', use: 'Content validation and flag classification' },
      { name: 'Braze', use: 'Lifecycle email production pipeline' },
      { name: 'Confluence', use: 'Workflow documentation and rule sets' },
    ],
  },

  'mogo-web': {
    meta: 'Mogo · Senior Marketing Operations Manager · 2024 – present',
    sections: [
      {
        label: 'The read',
        paras: [
          'Lifecycle conversion was weak and the assumption in the room was that the emails needed work. I looked upstream. The emails were performing reasonably. What wasn’t performing was where they sent people — campaign traffic landed on generic product pages with nothing to do with the message the user had just read.',
          'The second problem was structural. The website was owned by DevOps. Any change required an engineering ticket, and a campaign landing page took two to three weeks. Marketing had no way to move at campaign speed.',
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
        label: 'The metric I chose',
        paras: [
          'Conversion rate from lifecycle traffic. That was the specific failure the rebuild was meant to address: if lifecycle emails drove traffic to pages that matched the message and the intent, that number would move.',
          'Secondary: time to launch for a new page. The ownership problem was only solved if Marketing could actually ship without waiting on engineering.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'Rebuilt five properties: MogoTrade as the initial proof of the Webflow model, then Moka, Intelligent Investing, mogo.ai, and mogo.ca.',
          'Built a component system rather than individual pages — reusable sections, governed naming, and a CMS structure that let anyone assemble a page from the library in hours. Defined URL structures, content models, and metadata templates before touching layouts, so SEO and tracking were built in rather than retrofitted.',
          'Applied SEO, AEO, and GEO across all five properties: schema markup, canonical structures, internal linking, metadata by page type. Rebuilt GA4 and GTM in parallel, bringing Analytics, DevOps, Product, and Legal into the tracking architecture during the migration rather than after. Every page launched with clean event tracking on day one.',
        ],
      },
    ],
    stats: [
      { value: '+15%', label: 'Conversion from lifecycle traffic' },
      { value: '+30%', label: 'Conversion on campaign-specific landing pages' },
      { value: '2x', label: 'Organic traffic within 90 days' },
    ],
    outcome:
      'The lifecycle conversion problem was never an email problem. It was a destination problem. Once the pages matched the message and Marketing owned the ability to change them, conversion followed — and the component system meant the fix wasn’t one campaign, it was every campaign after.',
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
    meta: 'DTC Newsletter · Senior Website and Email Operations Manager · 2021 – 2024',
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
        label: 'The metric I chose',
        paras: [
          'Bounce rate, as the primary signal of whether the site was working for the reader who arrived. If the architecture and content hierarchy were right, it would fall.',
          'Secondary: organic newsletter signup rate. The site’s job was ultimately to convert organic readers into subscribers. That number had to move or the rebuild hadn’t solved the right problem.',
        ],
      },
      {
        label: 'The build',
        paras: [
          'The first version shipped with a clean content taxonomy, consistent URL structure, schema markup across all content types, and metadata templates matched to search intent by page category. Bounce rate went from 70% to 38%.',
          'The second rebuild expanded the system for growing content volume: new page types for sponsor content, resource sections, and topic cluster hubs, with internal linking built around keyword groupings. Organic traffic grew 28% and organic signup conversion 27%.',
          'The third rebuild was forced by an external contractor deleting the entire Webflow environment. I rebuilt the full site from memory and documentation — every component, CMS collection, automation, and content system — without data loss. Operations never stopped.',
        ],
      },
    ],
    stats: [
      { value: '70% → 38%', label: 'Bounce rate' },
      { value: '+28%', label: 'Organic traffic' },
      { value: '+27%', label: 'Organic newsletter signups' },
    ],
    outcome:
      'Three rebuilds taught the same lesson each time. The bounce rate was always a symptom, not the problem. The problem was whether the page gave the reader a reason to be there. When the architecture matched how readers actually moved through the content, the numbers followed.',
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
    meta: 'Mogo · Senior Marketing Operations Manager · 2024 – present',
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
        label: 'The metric I chose',
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
      { value: '0 → connected', label: 'Braze to Dynamics integration' },
    ],
    outcome:
      'The rebuild didn’t improve campaign performance directly. It made campaign performance legible. When leadership can trust the data, they make decisions with it; when they can’t, they stop looking at it entirely. The real outcome wasn’t better numbers — it was numbers that could be used.',
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
    meta: 'Sportserve · Senior Digital Projects and Marketing Operations Manager · Mar 2014 – Feb 2021',
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
        label: 'The metric I chose',
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
    outcome:
      'The read held. Throughput doubled, errors dropped about 40%, and payment method adoption improved 20–30% by market — because launches were finally running through one system instead of eight. The structure outlasted me.',
    tech: [
      { name: 'Jira', use: 'Sprint planning and backlog management' },
      { name: 'Agile and RACI', use: 'Delivery governance and ownership clarity' },
      { name: 'Confluence', use: 'SOPs and operational documentation' },
      { name: 'Creative production tooling', use: 'Merchant assets and campaign creative' },
    ],
  },

  craftconcepts: {
    meta: 'CraftConcepts · Founder and Growth Strategist · May 2022 – Jan 2025',
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
        label: 'The metric I chose',
        paras: [
          'Number of businesses served, since that was the only way to know whether the model scaled past me personally. And average organic visibility lift, since that proved the work held up after we shipped it — not just that we shipped something.',
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
      { value: '+40%', label: 'Average organic visibility lift' },
    ],
    outcome:
      'The model scaled past what I could do alone — not because I hired in the traditional sense, but because the mentorship structure meant contributors could actually execute client work, not just shadow it. I wound it down deliberately in January 2025, once the gap it was built for had closed.',
    tech: [
      { name: 'Webflow and WordPress', use: 'Client website builds' },
      { name: 'SEO and CRO', use: 'Visibility and conversion work' },
      { name: 'Content and brand playbooks', use: 'Repeatable founder-interview-to-launch process' },
    ],
  },
};
