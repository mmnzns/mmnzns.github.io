# mnmonzones.com — content rewrite

**Replaces:** all copy in `Monzones-D-Paper.dc.html`, and §7 of the earlier design direction doc (my copy suggestions there were part of the problem).
**Every fact below is sourced from Professional History and Professional Positioning. Nothing is invented.**

---

## 1. Why it reads pretentious

One pattern, repeated everywhere: **every single line is trying to be quotable.** Not one sentence just says a plain thing.

| Variant D | What it's doing |
|---|---|
| "I get handed a problem, not a spec." | Opens with a challenge instead of a hello |
| "Four problems that arrived without a spec." | Epigram |
| "A lifecycle rebuild that started with cancellation reasons" | Epigram |
| "The winback that wasn't about price" | Epigram |
| "A comms plan that had to wait for a definition" | Epigram |
| "Automating the reconciling, not the reporting" | Epigram |
| "Numbers, and the read behind each one." | Epigram |
| "Notes from arguing with my own assumptions." | Epigram |
| "Picking the metric that can embarrass you" | Epigram |
| "Five steps, and a receipt for each one." | Epigram |
| "Tell me what's broken." | Epigram |

Eleven headings, eleven aphorisms. Nothing to rest on. It reads like someone performing insight rather than someone talking.

Corey's site is doing the opposite. Look at what his headings actually are: *"Yo, I'm Corey." "Builder. Writer. Thinker." "Stuff I like." "Get in touch." "Hey — thanks for taking the time to read this." "Let's talk shop (or tacos)."* Half of them are completely ordinary. The warmth comes from being relaxed and greeting you, not from being clever.

And the structural thing: **your site never says hello.** It opens by asserting something at the reader. That's the whole gap.

### Rules for anything written from here

1. **No line may be a slogan.** If a sentence sounds like it wants to be screenshotted, rewrite it.
2. **Say hello.** Greet before you position.
3. **Contractions everywhere.** Write it the way you'd say it on a call.
4. **Let sentences be boring when the content is interesting.** "A few things I've built" is a better heading than "Four problems that arrived without a spec," because the case studies underneath are already interesting.
5. **No em-dash-and-reversal constructions.** "It wasn't X, it was Y" is fine once. Four times is a tic.
6. **Numbers with their real qualifiers.** "~38%" not "39%". "About 900,000 people" not "$900K".
7. **One number, one story.** Never explain a headline metric with a different initiative's story. This is the error that produced most of the problems in the first pass — a close rate from the loan-routing build explained by the compliance QA workflow, a 7-day drop-off number explained by the first-year churn flows. If a stat and its explanation come from two different pieces of work, they need two different slots.

---

## 2. What variant D invented

Fix these before anything ships. Fabricated metrics on a portfolio are the kind of thing that comes apart in an interview.

| In variant D | Actual |
|---|---|
| "$900K recovered pipeline" | ~900,000 *people* in the dormant/never-invested pool. **~54K activated or returned** across two rounds (2.7%, then ~5%). No dollar figure exists. |
| "0 → 11 markets live" (Sportserve) | Sportserve already operated in 12 countries. Real: **payments division built 0 → 5 people**, MSOps grew 5 → 36, throughput doubled, production errors −40%, payment method adoption +20–30%. |
| "1 day → 40 min per week" | Doesn't exist. |
| "92% less manual time" | Doesn't exist. |
| Activation "24% → 39%" | **~24% → ~38%** |
| "Independent" as the agentic-ops client | That was **Mogo**. |
| Sportserve read: "three teams described the division three different ways, the first deliverable was one shared sentence" | Entirely invented. Real read: payment launches were fragmented across **8 departments** with no owner — the problem was the absence of a system connecting them, not a definition problem. |
| Winback read: "two thirds of the list had stalled mid-application" | Invented. Real: the pool split across two products with different value props, **plus lending customers who'd never invested at all** — a cross-sell, not a winback. |
| Mogo read: framed entirely as a trust/security problem | That's real but it's the *second* piece of work. The primary read was **web–lifecycle misalignment**: email promising one experience, product delivering another, triggers firing on calendar time instead of behaviour. |
| All 12 blog titles | All invented. You have 13 real ones — listed in §3.6. |
| `hello@mnmonzones.com` | **miguel@mnmonzones.com** |
| `+1 604 000 0000` | **+1 778 829 6453** |
| "Craft Concepts" in the client marquee | That's your own company, not a client. Move it or drop it. |

---

## 3. The copy

Use this verbatim. Every number is sourced.

### 3.1 Hero

**Headline**

> Hi, I'm Miguel.

**Right column**

> I work on lifecycle and GTM — mostly fintech, some SaaS and ecommerce. Eleven years of it. Right now I'm at Mogo in Vancouver, running lifecycle and martech along with the web and automation underneath it.
>
> Most of my work happens before anything gets built. Someone hands me a number that's moving the wrong way, and the first job is working out what's actually causing it. It's usually not the thing everyone's looking at.
>
> Lately more of that has turned into automation — rebuilding the lifecycle system so it runs and improves without someone watching it.

**Meta line**

> Vancouver, BC · Open to senior lifecycle and GTM roles

### 3.2 The hero widget

Keep the click-through, but introduce it like a person would.

**Label above the card**

> Here's what I mean

**Card labels**

> The ask → What I found

**Buttons**

> `What I found` · `Show me another` · `2 of 4`

**The four pairs** (all real):

| The ask | What I found |
|---|---|
| "Activation is stuck around 24%. The emails aren't working." | Engagement was actually fine, which was the clue. The emails were promising one experience and the product was delivering another. |
| "People are dropping off in the first week." | The onboarding asked for bank credentials before it had said anything about security or custody. It was a trust problem, not a UX one. |
| "Open rates are falling. We need better subject lines." | The sending infrastructure was on a shared IP with a damaged reputation. Better subject lines weren't going to fix that. |
| "Leadership wants us using AI. Go automate something." | Nobody could name what to automate. The real gap was that Ops teams couldn't build anything without waiting on Engineering. |

### 3.3 Work

**Kicker** `WORK`
**Heading** `A few things I've built.`
**Sub** `The ask is what I was handed. What I found is where it actually went.`

**Toggle labels:** `The ask` / `What I found`

---

**1 · Mogo — Rebuilding lifecycle** *(coral)*

> **The ask**
> Activation is stuck around 24%. The email isn't working — fix it.
>
> **What I found**
> Email engagement was fine, which is what made it confusing. About three weeks in it was clear the emails were promising one experience and the product was delivering another, and the whole lifecycle was triggering on calendar time instead of what people were actually doing. Nobody owned the seam between web and lifecycle. So I made the case for a bigger scope than I'd been hired for: rebuild the site too, move web ownership from DevOps into Marketing, and rebuild the Braze triggers around real product actions. I picked activation rate and 7-day drop-off as the two numbers that would tell me whether I'd read it right.

> **Metric** `24% → 38%` — activation. 7-day drop-off went 78% → 62% in the first two months.

---

**2 · Mogo — The Intelligent Investing winback** *(sun)*

> **The ask**
> We've got about 900,000 people who've gone quiet on investing or never started. Get them investing.
>
> **What I found**
> It wasn't one audience. Some had gone dormant, but a large chunk were lending customers who'd never invested with us at all — that's a cross-sell, not a winback. And the two products needed completely different pitches: Manage is automated weekly investing, Self-directed is manual trading with research. So I built it as a multi-round program rather than a campaign, and used the first round as both a performance read and a list clean-up, because I genuinely didn't know what the list quality was and pruning on guesswork would have thrown away good contacts.

> **Metric** `~54K` — activated or returned, across two rounds (2.7%, then ~5%).

---

**3 · Sportserve — Building the payments division** *(sky)*

> **The ask**
> We're growing and things are slipping, so we're splitting into teams that each own one area. Payments is yours — anything and everything related to it.
>
> **What I found**
> The scope was clear but there was nothing underneath it. Payments touched eight departments across twelve countries, and every team only ever saw their own piece — no shared process, no owner for the thread running between them. So the job wasn't running a division, it was building one first: sprint cycles for launch coordination, RACI so ownership was explicit, standard launch templates, compliance checkpoints, localisation workflows. Then hiring the people to run it.

> **Metric** `0 → 5` — person division. Launch throughput doubled, production errors down ~40%.

---

**4 · Mogo — Automation infrastructure** *(moss)*

> **The ask**
> Leadership wants agentic workflows. Go learn AI and automate some things.
>
> **What I found**
> There was no platform, no owner and no roadmap behind the mandate. And the real gap wasn't tooling — it was that Ops teams couldn't build anything themselves without creating another dependency on Engineering. So I took a hybrid setup to the COO: Zapier for the messy integrations, self-hosted n8n on our existing AWS for the high-volume operational work, which kept both the cost and the ownership internal. The first build was loan application profiling and routing, which moved underwriter close rate about 30%. Then I trained each Ops lead to build and maintain their own, which was the actual point of the whole thing.

> **Metric** `15+` — automations in production, built and maintained by the Ops teams themselves.

*Note: the previous version put `+30%` in the headline slot on this card. That's a downstream result of the first workflow, not a measure of the infrastructure — it read oddly as the summary of a card about building a platform. The +30% now sits inside the story where it belongs.*

### 3.4 Method

**Kicker** `HOW I WORK`
**Heading** `Read, decide, pick the metric, build, check.`
**Sub** `Same five steps most of the time. Here's what each one looked like on one project.`

*(Renaming step five from "Prove" to "Result" — "prove" is a little chest-out for what is just the last step.)*

| Step | Source label | Copy |
|---|---|---|
| **Read** | Mogo, first three weeks | I pulled on the email data, the onboarding flow and the web journey at the same time. Engagement was healthy, which was the confusing part. What kept turning up was that email was describing one thing and the product was doing another. |
| **Decide** | Mogo, making the case | Fixing email alone wasn't going to move it. That meant asking for a scope well beyond what I'd been hired for — rebuild the website too, and move web ownership out of DevOps into Marketing. I took that to leadership. |
| **Metric** | Mogo, picking the number | Open rate would have told me nothing, it was already fine. I went with activation rate and 7-day drop-off, because that's where a gap between the email and the product would actually show up. |
| **Build** | Mogo, six weeks | Rebuilt the Braze lifecycle around real product actions instead of calendar time, ran the Webflow rebuild alongside it, and pulled in Product, Creative and Analytics to get it done. |
| **Result** | Mogo, two months in | Activation 24% → 38%, 7-day drop-off 78% → 62%. The bigger change was that people stopped treating lifecycle as email support. |

### 3.5 Numbers

**Kicker** `NUMBERS`
**Heading** `Some numbers, and what was behind them.`

Five real tabs — use four if the layout is tight.

Each tab is **one initiative**. The explanation has to explain the number above it — nothing else.

| Tab | Before → After | Window | What was behind it |
|---|---|---|---|
| **Activation** | 24% → 38% | First 2 months, Mogo lifecycle rebuild | It moved once the emails stopped describing something the product wasn't doing, and the triggers fired on what people actually did instead of how many days had passed. The 7-day drop-off came down from 78% to 62% over the same stretch — same rebuild, same cause. |
| **Retention** | 35% → 23% first-year churn | New signups, after the longer-term flows went in | Different work from the onboarding rebuild. This was scheduled flows that kept reinforcing the unexciting fundamentals — compounding, staying invested through a dip, no FX fees on trades. People who understood why they were holding held longer. |
| **Reactivation** | ~900K → ~54K activated | Two rounds, Feb 2025 – Jan 2026 | Round one converted ~2.7% and doubled as a list clean-up. Round two hit ~5% on the cleaned list, because by then I knew which segment wanted which product. |
| **Deliverability** | Sender score low 20s → 90+ | ESP migration at DTC | Everyone was looking at content quality. The problem was shared-IP reputation. No amount of better writing was going to fix the infrastructure. |
| **Automation** | +30% underwriter close rate | Loan application routing, Mogo | Loan Ops were manually sorting and prioritising applications, and that sorting was where the delay actually sat. I sat with them to work out how they were making those calls, mapped the criteria into scoring logic, and automated the routing. Underwriters stopped sorting and spent the time closing. |
| **Review cycles** | 4–5 rounds → 1–2 | Content QA workflow, Mogo | Compliance's judgement criteria weren't written down anywhere, so every review started from scratch. The first three versions of the workflow checked the wrong things. It worked once I brought Compliance in and encoded how they actually reviewed. |

**Note on the Automation bar chart.** You only have a relative figure (+30%), not a baseline and a new absolute. The current before/after bar renders a grey bar labelled "baseline close rate" against an orange one labelled "+30%", which invents a visual comparison that isn't in the data. Render this tab as a single large stat with no bar. Same applies to any tab where you only have a delta.

Other real numbers if any of these need swapping: email build time −75% (modular Braze rebuild) · bounce rate 70% → 38% (DTC site) · organic traffic +28% · tracking data accuracy ~40% → ~80% · B2B onboarding 2 weeks → 1 week · support load −50% · ~$18K/year saved from the martech audit · 90-day retention among withdrawing users 58% → 68% · 30-day re-deposit 12% → 22%.

### 3.6 Writing

**Kicker** `WRITING`
**Heading** `Things I've written.`
**Sub** `Mostly lifecycle, AI, and how search is changing. I write to work out what I actually think.`

**Filter chips:** All · Lifecycle · AI & automation · Search · Positioning

**Real posts** (from your Blog folder — swap in true dates and read times):

| Tag | Title |
|---|---|
| Lifecycle | Lifecycle marketing is not a traffic strategy |
| Search | Your SEO content already works. Make AI see it too. |
| Search | The New SEO Playbook: Thriving in the Age of AI |
| Search | SEO vs GEO |
| Search | How AI Rewrote Search |
| Positioning | How high-trust SaaS teams market transparently |
| Positioning | Building Trust: The Key to SaaS Success with Transparent Marketing |
| Positioning | Conveying Your Value |
| Positioning | Your Buyer's Brain Has Changed |
| AI & automation | How to Write Better AI Prompts: A Simple Framework for Powerful Results |
| AI & automation | Revolutionizing Marketing with AI |
| Lifecycle | 6 Content Strategies to Boost SaaS Retention |
| Lifecycle | Marketing Trends for 2024 |

You also have the AcuityMD Quickwins Breakdown and the Degreed Audit as slide decks — those are better as a small "teardowns" strip than as blog posts, and they're strong proof.

### 3.7 About

**Kicker** `ABOUT`
**Heading** `A bit more about me.`

This is your warmest material and none of it is currently on the site.

> I grew up on a farm, and I think that's where most of how I work comes from. You either work with what you have or you build what you need. I learned carpentry, how to fix broken tools, and how to notice a problem before it became a real one — if a storm was coming and the roof was weak, you dealt with the roof.
>
> My first job out of school was at Rappler in Manila, editing in a 24/7 newsroom under Maria Ressa. That's where I picked up the habit of not accepting the first explanation for anything.
>
> Then seven years at Sportserve, sitting between web, lifecycle, payments, integrations and vendor coordination. Not inside one specialty — between them. When something broke, the cause was almost always somewhere else, so I got used to following it wherever it went. That's still how I work.
>
> I have *Nea Onnim No Sua A, Ohu* tattooed on my right wrist. It's an Adinkra symbol, and it means roughly: he who does not know can know from learning. I don't really believe in "I can't do this." I believe in "I haven't learned it yet."

Put the video here — you have `Miguel About Me.mp4` sitting unused, and it'll do more for warmth than any sentence on this page.

### 3.8 Contact

**Heading** `Get in touch.`
**Sub** `If you've got something you're trying to figure out, or a role you think might fit, I'd like to hear about it.`

**Form:** `Your name` · `Email` · `What's on your mind?` · button `Send`

**Details**

> miguel@mnmonzones.com
> +1 778 829 6453
> linkedin.com/in/mmonzones

**Coffee line**

> If you're in Vancouver, coffee's on me. I'd rather hear it out loud anyway.

### 3.9 Nav & footer

**Nav:** Work · How I work · Numbers · Writing · About · `Get in touch`
**Footer:** `Miguel Monzones — lifecycle and GTM, Vancouver.`
**Giant outline word:** `MONZONES` (keep — it's the one flourish that isn't verbal)

### 3.10 Client marquee

Use the real logos from `Companies Worked With/Companies 2026/`: Mogo · Sportserve · Dafabet · Rappler · Pilothouse · DTC Newsletter · Carta Worldwide · Axis · Sunlife · Intelligent Investing · WheelWiz · HulkMeal · Vintage Frames · G&B Pro · Upearance

Drop Craft Concepts (your own company). Greyscale, colour on hover, pause on hover.

---

## 4. Paste this into Claude design

> Rewrite all the copy on the site. The current version is trying too hard to be clever — every single heading is an aphorism and it reads as pretentious. Fix the voice, keep the structure.
>
> **Reference the tone of corey.co.** His headings are ordinary and friendly: "Yo, I'm Corey", "Builder. Writer. Thinker.", "Stuff I like", "Get in touch", "Hey — thanks for taking the time to read this." The personality comes from being relaxed and greeting the reader, not from being clever. My current site never says hello — it opens by asserting something at you. That's the main problem.
>
> **Rules:** No line may be a slogan — if a sentence sounds like it wants to be screenshotted, rewrite it. Use contractions. Let headings be plain when the content underneath is already interesting. Don't repeat the "it wasn't X, it was Y" construction more than once on the page. Never use marketing language, and never these: at the intersection of, data-driven, results-driven, passionate about, thrive in, leverage, unlock, seamless, holistic, best-in-class, move the needle, thought leadership.
>
> **Critically: do not invent any facts, metrics, client names, or article titles.** The last version made up "$900K recovered pipeline", "0 → 11 markets live", "1 day → 40 min", "92% less manual time", an activation figure of 39%, a client called "Independent", and all twelve blog post titles. Use only the copy supplied in the content document — every number in it is sourced. Where a number needs a qualifier like "~" or "about", keep it.
>
> **One number, one story.** Every stat must be explained by the initiative it came from. Do not explain a headline metric with a different project's story — the last version put a loan-routing close rate next to a compliance-QA explanation, and a 7-day drop-off number next to a first-year-churn explanation. If a stat and its explanation come from two different pieces of work, give them two separate slots.
>
> **Don't render a before/after bar chart when the source data is only a relative change.** The Automation tab has "+30%" with no baseline; showing a grey "before" bar against an orange "after" bar fabricates a comparison. Use a single large stat instead.
>
> **Structural changes:** the hero now opens with "Hi, I'm Miguel." as the large headline, with plain explanatory paragraphs beside it. The hero widget is introduced with "Here's what I mean" rather than "Try it". Case study toggle labels are "The ask" / "What I found". The fifth method step is "Result", not "Prove". The Automation infrastructure card's headline metric is "15+ automations in production", not "+30%". Add an About section with the farm/Rappler/Sportserve/tattoo story and an autoloop muted video. Everything else about the layout, palette, spacing and interaction stays as it is — the design is working, only the words are wrong.

---

## 5. One thing to watch

The case-study "What I found" panels run long — 60 to 90 words each. That's the right length for the content, but it means the card needs a generous minimum height or the layout will jump when someone toggles. Set the panel height from the *longer* of the two states so nothing reflows on click. Small thing, but a jumping card undoes the calm.
