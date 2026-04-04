---
name: design-decision-record
phase: 06 — Deliver
description: Generate a structured design decision record (DDR) documenting why specific design choices were made — the context, alternatives considered, the decision, and the rationale. Use at handoff and after major design reviews to create a permanent record that prevents decisions from being relitigated and helps future team members understand the design. Never written under time pressure; Claude generates it from a conversation about the decisions.
ai_leverage: high
claude_surface: chat
---

# Design Decision Record

Document why you designed it this way — so you never have to explain it again, and so the next designer doesn't accidentally undo it.

## When to Use

- At handoff — to document the rationale behind key design choices before context is lost
- After a significant design review where major decisions were made
- When a design decision is controversial and likely to be revisited
- When onboarding a new team member who needs to understand existing design choices
- When a design decision will affect the design system and needs to be formalized

---

## Why Design Decision Records Get Skipped

Design decisions lose their context faster than any other artifact. Six months after shipping, no one remembers why the navigation is structured the way it is, why that particular empty state was chosen, or why the confirmation dialog was removed. The designer who made the decision has moved on or forgotten. The decision gets relitigated from scratch — often reaching the same conclusion after weeks of debate.

A DDR costs 20 minutes to write. It saves hours of future discussion, prevents "improvements" that undo intentional choices, and helps new team members understand the product's design logic.

---

## What Claude Needs to Start

1. **The decision** — what was designed and what was decided
2. **The context** — what problem was being solved, what constraints existed
3. **Alternatives considered** — what other options were explored (even briefly)
4. **The rationale** — why this option over the others
5. **Tradeoffs** — what was given up by choosing this option

---

## Step 1: Capture the Decision

**Claude prompt:**
> "Generate a design decision record from this conversation about a design choice.
>
> Feature/component: [name]
> What was decided: [the specific design choice]
> Context: [what problem was being solved — user need, business constraint, technical limitation]
> Alternatives considered: [what else was explored — even briefly]
> Why this option: [the reasoning — could be user research, usability testing, stakeholder feedback, technical constraints]
> What was given up: [the tradeoff — what this option doesn't do well]
> Who was involved: [designer, PM, engineering lead, etc.]
> Date: [when the decision was made]
>
> Format as a structured DDR."

---

## DDR Template

```markdown
# Design Decision Record: [Short title — the decision in 5–8 words]
**Date:** [DATE]
**Feature/Component:** [name]
**Status:** Active / Superseded by [DDR-N] / Under review
**Decision makers:** [names and roles]

---

## Context

### The problem
[What user need or business problem this decision was addressing — 2–3 sentences]

### Constraints
- [Technical constraint — e.g. "API can't return sorted results in real time"]
- [Timeline constraint — e.g. "Must ship before Q3 review"]
- [Research finding — e.g. "Users in testing expected a persistent filter panel, not a modal"]

### What we knew
[Research, testing, or analytics data that informed this decision — cite sources where possible]

---

## Options Considered

### Option A: [Name] ← Selected
**Description:** [What this option is]
**Pros:**
- [Specific advantage]
- [Specific advantage]
**Cons:**
- [Specific disadvantage]
- [Specific disadvantage]
**Why selected:** [The specific reason this won over the alternatives]

### Option B: [Name]
**Description:** [What this option is]
**Pros:**
- [Specific advantage]
**Cons:**
- [Specific disadvantage]
**Why not selected:** [The specific reason this lost]

### Option C: [Name] (if applicable)
[Same format]

---

## The Decision

**We chose [Option A] because:** [2–3 sentences — the specific reasoning that drove the final call]

**The key tradeoff:** [What this option doesn't do well — explicitly acknowledged]

**What would change this decision:**
- [Condition that would make us reconsider — e.g. "If API supports real-time sorting in a future sprint"]
- [Research signal that would trigger a revisit — e.g. "If usability testing shows >30% task failure on this pattern"]

---

## Implementation Notes

**What must be preserved:** [Specific elements of this decision that implementation must not change]

**What is flexible:** [Elements that can be adapted to engineering constraints without violating the decision]

**Common misimplementations to avoid:**
- [Specific mistake this decision is often implemented incorrectly — e.g. "Do not add a confirmation dialog — the decision was explicitly to remove friction here"]

---

## Related Decisions
- [DDR-N: Related decision title] — [how they relate]

---

## Revision History
| Date | Change | Author |
|---|---|---|
| [DATE] | Initial record | [Name] |
```

---

## Step 2: Generate Multiple DDRs at Once

At handoff, generate a DDR for every significant decision in one session.

**Claude prompt:**
> "Generate design decision records for all the major design choices in this feature. I'll describe each decision and you produce a DDR.
>
> Feature: [name]
>
> Decision 1: [describe]
> Decision 2: [describe]
> Decision 3: [describe]
>
> For each, produce a complete DDR using the standard format. Keep each focused — 1 page maximum."

---

## Step 3: Identify Decisions That Need Records

If you're not sure which decisions to document, use this prompt:

**Claude prompt:**
> "Review this feature description and identify the design decisions most likely to be relitigated, misunderstood, or reversed without documentation. For each, explain why it's worth recording.
>
> Feature: [describe the feature — screens, interactions, key patterns]
> Known contentious choices: [anything that was debated during design]
> Known constraints: [anything that forced a suboptimal solution]"

---

## Quality Checklist

Before filing the DDR:
- [ ] The decision is stated clearly — not vague
- [ ] At least two alternatives are documented — even if they were quickly dismissed
- [ ] The rationale explains why this option beat the alternatives — not just what it is
- [ ] The tradeoff is acknowledged — no decision is perfect
- [ ] Conditions that would change the decision are specified — prevents stale decisions from being treated as permanent
- [ ] What must be preserved in implementation is explicit

---

## Phase Handoff Block

```
## Handoff: Deliver — Design Decision Records
### Project: [PROJECT NAME]
### Date: [DATE]

---

### Decisions documented
1. [DDR title] — [one-line summary of the decision]
2. [DDR title] — [one-line summary]
3. [DDR title] — [one-line summary]

### Decisions not yet documented (known gaps)
- [Decision] — [why it needs a record but doesn't have one yet]

### Where DDRs are stored
[Notion / Confluence / Figma / GitHub — link]

### Decisions likely to be revisited
- [Decision title] — [when and why it might be reconsidered]

---
*Share DDRs with the engineering lead at handoff.*
*Add link to DDR in the relevant Jira ticket.*
*Review DDRs when onboarding new team members.*
```
