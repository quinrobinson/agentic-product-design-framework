---
name: prototype-scoping
phase: 04 — Prototype
description: Define exactly what to build — and what to leave out — before prototyping begins. Use to translate a selected concept and validated user flow into a precise prototype brief: which screens, which paths, which fidelity, and which questions it must answer. The most skipped and most expensive-when-skipped step in the Prototype phase. Depends on outputs from concept-critique.md, storyboarding.md, and user-flow-mapping.md. Outputs feed directly into wireframing.
ai_leverage: high
claude_surface: chat
---

# Prototype Scoping

Define what the prototype is for before building it — so every design decision serves a specific question.

## When to Use

- Before starting any wireframes — to define exactly what to build
- When the team is tempted to prototype everything "just to be safe"
- When stakeholders are asking for a high-fidelity prototype before functional questions are answered
- When fidelity level is unclear — should this be paper, lo-fi, mid-fi, or hi-fi?
- When previous prototypes have been too large to test usefully

---

## The Prototype Scoping Rule

**A prototype's scope is defined by the questions it must answer — not by the concept it represents.**

The most common prototyping failure: building a prototype that represents the full concept rather than one that answers the specific questions the team doesn't yet know the answer to. The result is a prototype that's too large to test efficiently and too polished to pivot from.

The scope question is: **What's the minimum I need to build to answer my highest-risk questions?**

---

## What Claude Needs to Start

1. **Selected concept** — name, one-liner, core mechanism
2. **Top 3 risks from critique** — the assumptions most likely to fail (from `concept-critique.md`)
3. **Storyboard** — the scenario and critical moments (from `storyboarding.md`)
4. **User flow** — complete screen/state inventory (from `user-flow-mapping.md`)
5. **Constraints** — timeline, prototyping tool, team size

---

## Step 1: Translate Risks into Prototype Questions

The critique's top risks become the prototype's test questions. This is the most important step.

**Claude prompt:**
> "Translate these concept risks into specific prototype questions.
>
> For each risk, generate:
> 1. **The prototype question** — what specific user behavior or reaction would confirm or deny this risk?
> 2. **What to prototype** — the minimum screen or interaction needed to surface this behavior
> 3. **What success looks like** — what the user does or says that means this risk is resolved
> 4. **What failure looks like** — what tells us the risk was justified
>
> Top risks from critique:
> [paste top 3 from concept-critique.md]
>
> Storyboard: [paste key scenes and risk moment]
> User flow: [paste]"

---

## Step 2: Choose the Right Fidelity

Fidelity should be the minimum needed to answer the prototype questions — nothing more.

**Fidelity decision framework:**

| If you need to test... | Use this fidelity |
|---|---|
| Does the flow make sense? Is the sequence logical? | Lo-fi — sketches or rough wireframes |
| Can users find things and navigate? | Lo-fi to Mid-fi — labeled wireframes with basic nav |
| Do users understand the copy and labels? | Mid-fi — real copy, no visual design |
| Will users trust this and use it seriously? | Mid-fi to Hi-fi — some visual design, brand elements |
| Does the visual design support the interaction? | Hi-fi — full visual design, real content |
| Would users pay for this / recommend it? | Hi-fi — near-production quality |

**Claude prompt:**
> "Recommend the appropriate fidelity for this prototype.
>
> Prototype questions: [paste from Step 1]
> Timeline: [how long to build + test]
> Team: [who's building it]
> Tool: [Figma / paper / code / other]
>
> For each prototype question:
> - What fidelity is required to get a valid answer?
> - What fidelity would be over-engineering?
>
> Then recommend: a single fidelity level for the whole prototype, or a mixed approach (different fidelity for different parts), and explain why."

---

## Step 3: Define the Prototype Scope

**Claude prompt:**
> "Generate the prototype scope definition.
>
> From the user flow below, identify which screens and paths to include based on the prototype questions.
>
> For each screen/path in the flow, classify as:
> - **Core** — required to answer the prototype questions
> - **Supporting** — needed for the prototype to make sense, but not the primary test
> - **Deferred** — can be excluded without invalidating the test; simulate with a placeholder
>
> Then generate the scope summary:
> - Total screens in full flow: [N]
> - Screens in prototype: [N]
> - Paths covered: [list]
> - Paths simulated/skipped: [list + how to handle them in prototype]
>
> Prototype questions: [paste]
> Complete user flow: [paste screen inventory]
> Constraints: [timeline, tool, team]"

---

## The Prototype Brief

Package everything into a brief a prototyper can act on without further briefing.

**Claude prompt:**
> "Generate a complete prototype brief.
>
> Prototype questions: [paste]
> Selected concept: [paste]
> Persona + scenario: [paste]
> Fidelity decision: [paste]
> Scope (Core / Supporting / Deferred): [paste]
> Constraints: [paste]
>
> Generate:
>
> ## Prototype Brief: [Concept Name]
>
> ### Purpose
> [One sentence — what this prototype exists to answer]
>
> ### Prototype questions
> 1. [Question] — [what user behavior answers it]
> 2. [Question]
> 3. [Question]
>
> ### Fidelity
> [Level + rationale]
>
> ### Scope
> **Build these screens:** [list with one-line description of each]
> **Simulate these paths:** [how to handle out-of-scope paths — dead-end screen, placeholder, etc.]
> **Explicitly exclude:** [what's not being built and why]
>
> ### Starting state
> [What state the prototype is in when testing begins — what data/content is pre-populated]
>
> ### Scenario setup
> [How to brief a test participant — what they know, what role they're playing, what they're trying to do]
>
> ### Success indicators
> [What user behaviors would tell us the prototype answered its questions positively]
>
> ### Failure indicators
> [What would tell us the concept needs rework before further investment]
>
> ### What this prototype is NOT testing
> [Explicit list — manages expectations during review]"

---

## Quality Checklist

Before building the prototype:
- [ ] Prototype questions written — specific, observable, answerable
- [ ] Fidelity chosen for the right reasons — minimum needed, not maximum possible
- [ ] Screen count is defensible — could explain why each one is necessary
- [ ] Out-of-scope paths have a plan — dead-end screen or placeholder, not ignored
- [ ] Starting state defined — prototype doesn't start with empty or unrealistic data
- [ ] Scenario setup written — can brief a test participant in under 2 minutes
- [ ] Success and failure indicators defined — team knows what to look for during testing

---

## Phase Handoff Block

```
## Handoff: Prototype — Scoping
### Project: [PROJECT NAME]
### Date: [DATE]

---

### Prototype questions
1. [Question — what user behavior answers it]
2. [Question]
3. [Question]

### Fidelity
[Level] — [rationale]

### Scope
Core screens: [N — list]
Supporting screens: [N]
Deferred/simulated: [list + how handled]

### Starting state
[What's pre-populated when testing begins]

### Scenario setup for testing
[How to brief participants]

### Success indicators
[Specific user behaviors that confirm the concept works]

### Failure indicators
[Specific behaviors that tell us to rework]

### NOT testing
[Explicit exclusions]

---
*Paste this block when starting wireframing and when opening Test Script drafting.*
```
