---
title: "Why lifecycle marketing matters before customers see value"
date: 2026-08-18
tag: "Lifecycle"
featured: true
excerpt: "Lifecycle gets deferred hardest in the businesses where value is invisible, because slow-compounding work loses to fast-reading work, and the measurement history lost in the gap cannot be rebuilt."
---
![A customer looking through a translucent wall at the operational work happening behind a delayed-value service](../../assets/thinking/lifecycle-delayed-value-hero.jpg)

When I want to understand how a business grows, I go through its funnel myself. I sign up. I walk the onboarding.

I read what it sends me, look at when it sends it, and try to work out what triggered it. I do this before I form an opinion, because the journey usually tells me more than the company's description of it.

What I did not expect was how often the problem came back to visibility, though not in the same way.

## Two kinds of invisibility

**Before lifecycle marketing can respond well, you need to know whether the customer cannot see the work or the business cannot see the customer's real state.**

One was a subscription credit repair business with a sales-led acquisition model. The problem I found was after enrollment.

Then I looked at what happens after someone enrolls, and after the first few days there is almost nothing. No behavioural triggers. No follow-up tied to what is actually happening on the account.

Think about what credit repair is from the customer's side. You pay every month. The work happens at the bureaus, where you cannot see it. Score movement is slow, and it does not move in a straight line.

You arrived anxious and skeptical, because people who need credit repair have usually already been let down by something financial. For the first several weeks, the only evidence you have that anything is happening at all is your own credit card statement.

That is not a communication gap. The product itself is invisible.

The second was a small business proposal tool. I ran the trial myself. Several of the setup checklist steps come pre-filled with demo content, which means the checklist can show you most of the way through setup while the account still cannot do the one thing it exists to do.

There is a shorter connected setup route as well. It removes some manual work and it does not finish the job either.

| Signal | What the team reads it as | What it actually tells you |
| --- | --- | --- |
| Trial started | Intent to use the product | Someone entered an email address |
| Checklist steps complete | Setup progress | Partly demo content, so progress can be counted that did not happen |
| External account connected | Setup finished | A shortcut was taken. It does not mean the account can produce anything. |
| First real customer-facing output sent | Activation | Activation |

Build an onboarding sequence on any of the first three and you will send a well-done email to someone who is stuck and a nudge to someone who finished yesterday.

These were not the same problem. In one, the customer could not see the work. In the other, the business could not see the customer's real state. Lifecycle was being asked to respond to both, but the system could only act on what was visible.

## What happens to a customer who cannot see the work

**When value is delayed, explaining the wait and showing the work can change how the customer experiences the service before the outcome changes.**

Service operations has been thinking about this for decades. I had not seen much of that work carried into lifecycle.

**Waiting.** David Maister laid out eight propositions about waiting in 1985.¹ Three mapped closely to the customer I had just walked through: unexplained waits feel longer than explained waits, uncertain waits feel longer than known finite waits, and anxiety makes waits feel longer. None of those changes the length of the wait. They change what the person knows while they are in it.

**Visible work.** Buell and Norton went further and found that showing the work changes what the work is worth.² Across five experiments, people rated a service as more valuable when they could watch it operating, even when the result was identical, and in some cases preferred a slower service that showed its work to an instant one that did not. They ran it on travel search and online dating, not credit repair, so I am extending it rather than quoting it.

**Progress.** Kivetz, Urminsky and Zheng found that people accelerate toward a goal as they get closer to it, and, more usefully, that the acceleration also works when the progress is partly artificial.³ A card requiring ten purchases got completed faster when it was presented as a twelve-stamp card with two stamps already filled in.

That third one complicates my read of the proposal tool, and I want to be honest that it cuts against me.

The pre-filled demo steps might genuinely help the user feel momentum. The problem is not that the fake progress is bad for the customer. It is that the same fake progress is what the lifecycle system reads when it decides who is stuck, and the system has no way to tell the difference.

Put those three together and the conclusion I draw is mine, not theirs: in a business where the effort is genuinely invisible, the messaging layer is not describing the service. For long stretches it is the only place the service exists for the customer.

## Why lifecycle gets deferred

**Lifecycle is easiest to defer where it matters most because both product value and lifecycle evidence arrive slowly.**

The obvious conclusion is that both teams should have built the lifecycle layer earlier. I sat with that for a while and I think it is a lazy read, because it treats the decision as an oversight.

It isn't one. When I look at how these calls actually get made, the deferral makes sense.

Lifecycle returns are incremental and they arrive late. You ship an onboarding flow, then wait for enough people to move through it before you can compare what happened. Even then, the movement may be a small change on a retention curve rather than a number that visibly jumps.

Almost everything else competing for the same quarter reports back faster. If you are allocating engineering time, that delay matters. You are choosing between work that produces a visible result quickly and work that needs enough customer history before it can make a case for itself.

Here is the part that took me longer to see, and it is the whole argument.

![The delayed-value loop: value is delayed or invisible, so the customer cannot see progress, which makes lifecycle the visible proof. But lifecycle results also arrive late, so it loses the prioritisation fight, gets deferred, and the behavioural history needed later is lost — then the loop restarts.](../../assets/thinking/lifecycle-delayed-value-loop.png)

> The businesses where the payoff is slowest are the businesses where lifecycle carries the most weight.

If customers need months to feel the product working, the retention work built around that product also takes months to prove itself. The same property that makes lifecycle load-bearing is what makes it lose the fight for the quarter.

## Why the missing history cannot be rebuilt

**You can build journeys later. You cannot reconstruct behaviour that was never captured.**

I wrote a line in a retention plan a while ago that I keep returning to: reporting has to start from day one, because the source systems are siloed and the early signal is lost if tracking starts late.

Churn is recoverable in the sense that you can go win people back, and sometimes it works. The measurement history is not recoverable. You cannot retroactively instrument a behaviour nobody captured.

When lifecycle gets picked up well after launch, the first job is often not building journeys. It is rebuilding the evidence you would need to know whether any journey helped. That work reports back slowly too, which puts lifecycle straight back into the prioritisation problem that deferred it.

## What I would carry into the next launch

**Protect three things at launch: a real activation event, behavioural history from day one, and visible proof of work for the customer.**

I would separate two questions before building anything: what does the customer need to see while value is still forming, and what does the system need to see to know the customer's actual state?

**From there, three things become difficult to defer:**

- Define activation around the first real outcome, not the easiest event to count. A signup, a completed checklist, or a connected account can all happen while the customer is still stuck.
- Capture the behavioural history from day one. The journeys can come later. An event that was never recorded cannot.
- Decide how the customer will see the work before the result arrives. In a delayed-value product or service, silence is part of the experience whether the team intended it or not.

I would still defer polish, breadth, and anything built on a product that is about to change. What I would not defer across a launch is the ability to see the customer's state and show the customer that work has started.

## Where I am still unsure

**I do not have a clean rule for where lifecycle becomes too early or too late.**

I am talking about recurring-revenue products and services where value arrives slowly. I am not trying to make the same claim about ecommerce here.

Product market fit is the boundary people usually name and I am not sure it holds, because plenty of the pre-fit companies I have looked at were already accumulating the exact behavioural history they would need later and throwing it away. The launch is the marker I trust, and that is more of a working position than a principle.

What I keep coming back to is how small the actual unit is. A customer who cannot see the work happening at the bureaus gets told what has started. A trial user who looks mostly set up gets told that the missing step is a real client, not another pass through the checklist.

The bet is that each person stays or finishes because the system gave them the one piece of context they were missing. You do not see that bet pay off all at once. You see it accumulate across a cohort.

---

**Sources**

1. Maister, D. H. (1985). [The Psychology of Waiting Lines](https://www.columbia.edu/~ww2040/4615S13/Psychology_of_Waiting_Lines.pdf). In Czepiel, J. A., Solomon, M. R., & Surprenant, C. F. (Eds.), *The Service Encounter*. Lexington Books.
2. Buell, R. W., & Norton, M. I. (2011). [The Labor Illusion: How Operational Transparency Increases Perceived Value](https://www.hbs.edu/ris/Publication%20Files/Norton_Michael_The%20labor%20illusion%20How%20operational_f4269b70-3732-4fc4-8113-72d0c47533e0.pdf). *Management Science*, 57(9), 1564-1579.
3. Kivetz, R., Urminsky, O., & Zheng, Y. (2006). [The Goal-Gradient Hypothesis Resurrected: Purchase Acceleration, Illusionary Goal Progress, and Customer Retention](https://home.uchicago.edu/ourminsky/Goal-Gradient_Illusionary_Goal_Progress.pdf). *Journal of Marketing Research*, 43(1), 39-58.
