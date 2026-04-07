---
name: concept-critique
phase: 03 — Ideate
description: Systematically evaluate promising concept directions before committing to prototyping — surfacing weaknesses, hidden assumptions, and user risks that enthusiasm obscures. Use after idea clustering when 2–3 concept directions have been identified as candidates for prototyping. Distinct from design critique (which evaluates a finished design) — concept critique evaluates a direction before any design work begins. Depends on outputs from idea-clustering.md. Outputs feed into storyboarding.md.
ai_leverage: high
claude_surface: chat
---

# Concept Critique

Surface what's wrong with your best ideas — before you've invested time designing them.

## When to Use

- You have 2–3 concept directions from idea clustering and need to decide which to prototype
- The team has fallen in love with one concept and stopped questioning it
- Stakeholders are pushing to build before the concept has been stress-tested
- You need to identify which concept has the least hidden risk — not which one sounds best
- You want to make a prototype decision you can defend with evidence

---

## Why Critique Before Prototyping

The most expensive place to discover a concept is broken is during usability testing — after weeks of design work. The least expensive place is in a conversation before a single wireframe exists.

Concept critique is not about killing ideas. It's about:
- **Surfacing hidden assumptions** before they become design decisions
- **Identifying user risks** before they become prototype failures
- **Strengthening the chosen concept** before it goes into prototyping
- **Documenting why alternatives were rejected** so those decisions don't get re-litigated later

A concept that survives rigorous critique is a better starting point for prototyping than one that everyone agreed on because no one challenged it.

---

## What Claude Needs to Start

1. **Concept cluster(s) to critique** — name, strategic bet, core mechanism, key assumption
2. **Problem statement** — the locked framing from Define
3. **Primary persona** — who the concept must work for
4. **Success criteria** — how you'll know the concept solved the problem
5. **Key constraints** — technical, business, and user constraints from Define

---

## Before the Lenses: Proof-Informed Critique

If Figma Make concept proofs were generated in `concept-proof.md`, start here before running the formal critique lenses. Proofs surface interaction problems that text descriptions never reveal — spend 5 minutes clicking each proof before critiquing on paper.

**Claude prompt:**
> "We have Figma Make proofs for these concepts. Before I run the five critique lenses, help me do a quick proof-informed review.
>
> For each concept and its prototype URL, identify:
> 1. **The interaction that surprised you** — what did clicking reveal that the written concept card didn't communicate?
> 2. **The first friction point** — where does the interaction feel unclear or forced?
> 3. **The moment of highest value** — which interaction most clearly delivers the concept's core mechanism?
> 4. **What the proof can't show** — what aspect of the concept still needs written critique to evaluate?
>
> Concepts + prototype URLs: [paste from concept-proof.md handoff]
> Persona: [paste]"

Use this output to focus the formal critique lenses — prioritize the risks the proof surfaced rather than running all five lenses at equal depth.

---

## The Five Critique Lenses

Run all five lenses on each concept. Each surfaces a different category of risk.

---

### Lens 1 — User Reality Check

Does this concept actually fit how users think and behave — or does it require them to change?

**Claude prompt:**
> "Critique this concept through the lens of user reality. Act as [persona name] — someone who has [their specific context and constraints].
>
> Challenge the concept on:
> 1. **Mental model fit** — does this match how [persona] currently thinks about this problem, or does it require them to adopt a new model? How steep is that learning curve?
> 2. **Workflow integration** — where does this fit in [persona]'s actual day? What do they have to stop doing, start doing, or change?
> 3. **Trust and adoption** — what would make [persona] skeptical of this? What would they need to see before trusting it?
> 4. **Edge cases** — describe a realistic scenario where this concept breaks for [persona]. Not a corner case — a situation that happens regularly.
>
> Be specific. Use the persona's actual context and pain points, not generic user concerns.
>
> Concept: [name + one-liner + core mechanism]
> Persona: [paste]
> Research context: [paste]"

---

### Lens 2 — Assumption Audit

Every concept bets on a set of beliefs about users, technology, and the market. Surface them.

**Claude prompt:**
> "Identify every assumption embedded in this concept — including ones so obvious the team hasn't thought to question them.
>
> Categorize each assumption:
> - **Desirability assumption** — about what users want or need
> - **Feasibility assumption** — about what can be built
> - **Viability assumption** — about what the business can support
> - **Usability assumption** — about what users can learn and do
>
> For each assumption:
> - State it explicitly
> - Rate the risk if wrong: Critical (concept fails) / Major (significant rework) / Minor (recoverable)
> - Identify what evidence we have — Validated / Partial / None
>
> Then: rank the top 3 assumptions by risk. If any of these are wrong, what does the concept become?
>
> Concept: [name + one-liner + core mechanism + key assumption]
> Research context: [paste]
> Constraints: [paste]"

---

### Lens 3 — Adversarial Review

Argue against the concept from three stakeholder perspectives that will push back on it.

**Claude prompt:**
> "Act as three different stakeholders who would resist this concept. For each:
> - State their objection as specifically and forcefully as possible
> - Identify the legitimate concern underneath the objection
> - Suggest what would need to change for this stakeholder to support the concept
>
> Stakeholders to simulate:
> 1. **Skeptical engineer** — focused on technical feasibility, integration complexity, and maintenance cost
> 2. **Risk-averse product manager** — focused on scope creep, timeline, and what happens when it doesn't work
> 3. **Resistant user** — the version of [persona] who is busiest, most change-averse, and has been burned by tools that promised to help before
>
> Be genuinely adversarial — not strawman objections. Make the strongest possible case against the concept.
>
> Concept: [name + one-liner + core mechanism]
> Persona: [paste]
> Constraints: [paste]"

---

### Lens 4 — Competitive Displacement

Why would a user switch from what they currently do to this?

**Claude prompt:**
> "Analyze this concept against the user's current solution — including workarounds, manual processes, and competitor products they use today.
>
> For each current alternative [persona] uses:
> 1. What does this concept do better?
> 2. What does the current solution do better?
> 3. What's the switching cost — time, habit change, data migration, retraining?
> 4. At what point does the value of switching outweigh the switching cost?
>
> Then: what's the minimum version of this concept that would cause [persona] to switch from their current solution?
>
> Concept: [name + one-liner + core mechanism]
> Persona: [paste — include their current tools and workarounds]
> Research context: [paste]"

---

### Lens 5 — Failure Mode Analysis

What goes wrong — not in edge cases, but in normal use?

**Claude prompt:**
> "Generate a failure mode analysis for this concept. For each failure mode:
> - Describe what goes wrong
> - Identify what causes it (user behavior, technical failure, missing context, wrong assumption)
> - Rate likelihood: High / Medium / Low
> - Rate impact on user: Critical / Significant / Minor
> - Suggest a design hedge — what could reduce the probability or severity?
>
> Focus on:
> - What happens when the input data is poor quality
> - What happens when the user is in a hurry or under stress
> - What happens when the concept works as designed but the user still doesn't get value
> - What happens when the user tries to do something the concept wasn't designed for
>
> Concept: [name + one-liner + core mechanism]
> Persona: [paste]"

---

## Parallel Concept Proofs for Finalists

Before running the comparative ranking, generate a Figma Make proof for each concept finalist. This turns the selection decision from an abstract comparison into a side-by-side interaction review — the team clicks through each option instead of debating written descriptions.

**When to run this:**
- You have 2–3 concepts that survived individual critique and are genuinely competitive
- The team is split and needs something tangible to break the tie
- Stakeholders will be involved in the selection decision

**Step 1 — Generate a proof for each finalist**

Use `concept-proof.md` to generate a Figma Make prompt for each concept. Focus the prompt on the primary interaction pattern — the moment that best demonstrates the concept's core mechanism. Run all proofs before reviewing any of them.

**Step 2 — Run a structured proof comparison**

Once all proofs are generated and published, use this prompt:

**Claude prompt:**
> "We have Figma Make proofs for [N] concept finalists. Help us compare them through a structured interaction review.
>
> For each concept and its prototype URL:
> 1. **Core mechanism clarity** — does the primary interaction make the concept's mechanism immediately legible, or does it require explanation?
> 2. **First friction point** — where does a first-time user stall or hesitate?
> 3. **Value moment visibility** — is the moment of highest value obvious within the first 2 clicks?
> 4. **Interaction risk** — which interaction pattern is most likely to confuse [persona] in real conditions?
>
> Then: based on the proofs alone, which concept has the most legible core interaction? Which has the most hidden friction?
>
> Concepts + prototype URLs:
> - [Concept A name] — [URL]
> - [Concept B name] — [URL]
> - [Concept C name — if applicable] — [URL]
> Persona: [paste]"

**Step 3 — Record finalist proof URLs**

Before moving to the comparative ranking, capture the proof results:

```
### Finalist Proofs

| Concept | Prototype URL | Core mechanism legible? | Primary friction point |
|---|---|---|---|
| [Name] | [URL] | Yes / No / Partial | [1 sentence] |
| [Name] | [URL] | Yes / No / Partial | [1 sentence] |
| [Name] | [URL] | Yes / No / Partial | [1 sentence] |

**Interaction winner:** [Concept name] — [why the proof was most legible]
**Hidden friction found:** [Concept name] — [what the proof revealed]
```

Feed this table into the comparative ranking below alongside the written critique findings.

---

## Comparing Multiple Concepts

When critiquing 2–3 concepts against each other, use this comparative prompt after running individual critiques and parallel proofs.

**Claude prompt:**
> "Compare these [N] concepts on five dimensions. For each dimension, rank the concepts from strongest to weakest and explain the ranking.
>
> Dimensions:
> 1. **User risk** — which has the lowest risk of failing for [persona] in realistic conditions?
> 2. **Assumption risk** — which makes the fewest unvalidated bets?
> 3. **Switching cost** — which is easiest for [persona] to adopt given their current behavior?
> 4. **Recoverable if wrong** — which is easiest to pivot from if the core assumption fails?
> 5. **Interaction legibility** — based on the Figma Make proofs, which concept's core mechanism was most immediately clear? [include proof findings if generated]
>
> Then: which concept would you recommend prototyping first, and why? Consider: the goal of prototyping is to validate the riskiest assumption as quickly as possible — not to build the most polished version.
>
> Concepts: [paste all critiqued concepts]
> Proof comparison results: [paste finalist proof table — if generated]
> Problem statement: [paste]
> Persona: [paste]"

---

## Strengthening the Chosen Concept

Critique isn't the end of the process — it's the input to improvement. After identifying weaknesses, use Claude to strengthen the concept before handing off to prototyping.

**Claude prompt:**
> "Based on the critique of [concept name], suggest specific modifications to address the top 3 risks identified.
>
> For each modification:
> - Describe the change
> - Explain which risk it mitigates
> - Identify any new risks it introduces
> - Confirm it doesn't change the core mechanism — if it does, we have a new concept, not a refined one
>
> Then: generate a revised concept brief that incorporates the modifications.
>
> Original concept: [paste]
> Top risks from critique: [paste]"

---

## Documenting Rejected Concepts

One of the most valuable outputs of concept critique is a clear record of why alternatives were rejected. This prevents the same debates from resurfacing when stakeholders see the prototype.

**Claude prompt:**
> "For each concept that was critiqued but not selected for prototyping, generate a one-paragraph rejection rationale:
> - What made it promising
> - What risk or weakness ruled it out
> - What conditions would need to change for it to become viable
> - Whether it should be revisited in a future cycle
>
> This will be used to brief stakeholders who ask why we didn't pursue these directions.
>
> Rejected concepts: [paste]
> Critique findings: [paste]"

---

## Quality Checklist

Before moving to Storyboarding:
- [ ] All five critique lenses run on the selected concept — not just the ones that felt relevant
- [ ] Top 3 critical assumptions identified and documented
- [ ] At least one adversarial stakeholder perspective genuinely surprised the team
- [ ] Failure modes analyzed — including "works as designed but user still fails" scenario
- [ ] Figma Make proofs generated for all finalists (2–3) — team has clicked all proofs, not just read critique summaries
- [ ] Parallel proof comparison completed — interaction legibility and friction points documented
- [ ] Comparative ranking completed across all five dimensions (including interaction legibility from proofs)
- [ ] Selected concept has been strengthened based on critique findings — not just chosen as-is
- [ ] Rejected concepts have documented rationale — ready to share with stakeholders

---

## Phase Handoff Block

Generate this block at the close of Concept Critique. Paste it when opening Storyboarding.

```
## Handoff: Ideate — Concept Critique
### Project: [PROJECT NAME]
### Date: [DATE]

---

### What we completed
- Concepts critiqued: [N]
- Critique lenses applied: [list — user reality / assumption audit / adversarial / competitive / failure modes]
- Finalist proofs generated: [N — or "none"]
- Concept selected for prototyping: [name]

### Finalist proofs (Figma Make)
| Concept | Prototype URL | Core mechanism legible? | Primary friction |
|---|---|---|---|
| [Name] | [URL] | Yes / No / Partial | [1 sentence] |
| [Name] | [URL] | Yes / No / Partial | [1 sentence] |

### Selected concept
**Name:** [concept name]
**One-liner:** [what it does from the user's perspective]
**Core mechanism:** [what makes it work]
**Strategic bet:** [what must be true for this to succeed]
**Concept proof URL:** [Figma Make prototype URL — or "not generated"]

### Why this concept (not the alternatives)
[2–3 sentences — what the critique revealed that made this the right choice]

### Rejected concepts and rationale
- **[Concept name]** — [one sentence: what ruled it out]
- **[Concept name]** — [one sentence: what ruled it out]

### Top 3 risks to validate in prototyping
1. [Risk] — [what a prototype test should reveal about this]
2. [Risk] — [what a prototype test should reveal about this]
3. [Risk] — [what a prototype test should reveal about this]

### Modifications made after critique
- [Change] — [which risk it mitigates]
- [Change] — [which risk it mitigates]

### Open questions for prototyping
- [What the critique surfaced but couldn't resolve without user testing]
- [Design decisions that remain open]

### What storyboarding should focus on
[Which aspect of the concept needs to be visualized first — the moment of highest value, the moment of highest risk, or the core interaction that defines the concept]

### What the proof revealed (if generated)
[1–2 sentences — what clicking the Figma Make proof surfaced that the written critique didn't catch, and how it shaped the concept selection or modifications]

---
*Paste this block when opening Storyboarding.*
*The top 3 risks should shape what the storyboard tests — design the scenario around validating the riskiest assumption.*
```
