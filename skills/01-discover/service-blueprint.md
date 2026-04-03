---
name: service-blueprint
phase: 01 — Discover
description: Generate current-state and future-state service blueprints from research data. Use when a designer needs to map the full end-to-end experience — frontstage user actions, backstage processes, and supporting systems — for a service, product, or workflow. Triggers include requests to map the current experience, visualize what a future state should look like, identify systemic gaps between user experience and organizational delivery, or prepare a blueprint for service design workshops. Depends on outputs from research-synthesis.md. Includes a built-in Phase Handoff Block to Define.
ai_leverage: high
claude_surface: chat
---

# Service Blueprint

Map the complete picture — what users experience, what happens behind the scenes, and where the system breaks down.

## When to Use

- You need to visualize the full current-state experience before designing solutions
- You want to map a future-state service model from research insights and HMW statements
- Your design problem involves multiple touchpoints, backstage processes, or organizational handoffs
- You're preparing for a service design workshop or stakeholder alignment session
- You need a shared artifact that connects user research to organizational reality

---

## Two Modes — Choose Before Starting

**Mode A: Current State**
Maps what actually happens today — the real experience, including friction, gaps, and workarounds. Input is research data from `research-synthesis.md`. Use when the goal is to understand and diagnose before designing.

**Mode B: Future State**
Maps what the experience should become — an aspirational model grounded in research insights and design principles. Input is the current state blueprint plus insight statements and HMW outputs. Use when the goal is to align the team on a shared direction before prototyping.

**When doing both** (which your team typically does): always complete current state first. Future state is meaningless without an honest baseline.

---

## Anatomy of a Service Blueprint

Every blueprint has five swim lanes. Understand these before generating output.

| Swim Lane | What It Contains | Who Owns It |
|---|---|---|
| **User Actions** | Steps the user takes — what they do, in sequence | User (observed in research) |
| **Frontstage** | What the user sees and interacts with — interfaces, touchpoints, interactions | Design / Product |
| **Backstage** | What happens behind the scenes to make the frontstage work — staff actions, internal processes | Operations / Engineering |
| **Support Processes** | Systems, tools, and infrastructure that enable backstage actions | Engineering / IT |
| **Evidence** | What the user sees or receives as proof of the service — receipts, emails, screens, notifications | Design / Comms |

**The Line of Visibility** separates frontstage (above) from backstage (below). Users can see everything above it. Nothing below it is visible to them — but failures there are often what users feel most acutely.

---

## What Claude Needs to Start

### For Current State
1. Research synthesis outputs — themes, pain points, session summaries from `research-synthesis.md`
2. The primary user persona and the scenario being mapped (one scenario per blueprint)
3. Known touchpoints — any channels, interfaces, or interaction moments already identified
4. Approximate number of stages in the journey (can be rough)

### For Future State
1. The completed current-state blueprint
2. Insight statements and prioritized HMW statements from `insight-framing.md`
3. Any design principles or constraints already defined
4. The primary opportunity area the future state should address

---

## Mode A: Current State Blueprint

### Step 1: Define the Scenario

Before mapping, lock the scenario. A service blueprint maps one persona doing one thing in one context. If you try to map everything at once, the blueprint becomes unreadable.

**Claude prompt:**
> "Based on the research synthesis below, identify the primary scenario to map for a current-state service blueprint. Name the persona, state their goal, describe the trigger that starts the experience, and describe where the experience ends. Suggest 5–7 stages that structure the journey between start and end."

```
## Blueprint Scenario Definition

**Persona:** [Name / Role]
**Goal:** [What they're trying to accomplish]
**Trigger:** [What initiates this experience]
**End point:** [What signals the experience is complete]

**Stages:**
1. [Stage name — e.g. Awareness / Onboarding / Core Task / Review / Exit]
2. [Stage name]
3. [Stage name]
4. [Stage name]
5. [Stage name]
```

**Human review checkpoint:** Confirm or adjust the stages before generating the full blueprint. Stages are the hardest thing to change after the fact.

---

### Step 2: Generate the Current State Blueprint

**Claude prompt:**
> "Using the research synthesis and the scenario definition above, generate the current-state service blueprint. For each stage, populate all five swim lanes. Mark pain points with ⚠️ and workarounds with 🔧. Cite the research session where each pain point was observed."

```
# Service Blueprint — Current State
## [Project Name] | Persona: [Name] | Scenario: [Goal]
### Date: [DATE] | Research basis: [N sessions]

---

## Stage 1: [Stage Name]

**User Actions**
[What the user does — specific steps, decisions, behaviors observed in research]

**Frontstage**
[What they see and interact with — screens, interfaces, people, physical touchpoints]

**Backstage**
[What happens behind the scenes to enable this stage — staff actions, internal processes, automated triggers]

**Support Processes**
[Systems, tools, data flows, integrations that enable backstage actions]

**Evidence**
[What the user receives as proof — emails, receipts, notifications, confirmations]

**Pain Points** ⚠️
- [Pain point — cite session where observed, e.g. "S3 — Marketing Manager"]
- [Pain point]

**Workarounds** 🔧
- [What users do to compensate — often reveals unmet needs]

---

## Stage 2: [Stage Name]
[Repeat structure]

---

## Stage 3: [Stage Name]
[Repeat structure]

---

[Continue for all stages]

---

## Blueprint Summary

### Moments of Highest Friction
| Stage | Pain Point | Severity | Frequency |
|---|---|---|---|
| [Stage] | [Pain point] | Critical / Major / Minor | [X of N sessions] |

### Systemic Gaps
[Places where frontstage and backstage are disconnected — user impact is real but root cause is organizational]
1. [Gap description — what users feel vs. what's actually happening backstage]
2. [Gap description]

### Workarounds That Reveal Unmet Needs
[Workarounds that indicate the system is failing users in a structured way]
1. [Workaround] → [Unmet need it reveals]
2. [Workaround] → [Unmet need it reveals]

### Emotional Journey
[One sentence per stage describing user emotional state — sourced from research]
- Stage 1: [Emotional state]
- Stage 2: [Emotional state]
- Stage 3: [Emotional state]
```

---

## Mode B: Future State Blueprint

### Step 1: Establish Design Principles

Future state blueprints are aspirational — but they must be grounded. Before generating future state, establish the principles that constrain it.

**Claude prompt:**
> "Based on the current state pain points, systemic gaps, and insight statements below, generate 3–5 design principles for the future state. Each principle should name a direction, describe what it means in practice, and explain what it rejects from the current state."

```
## Future State Design Principles

### Principle 1: [Name — e.g. "Proactive over reactive"]
**Means:** [What this looks like in practice]
**Rejects:** [What current state behavior this replaces]

### Principle 2: [Name]
**Means:** [What this looks like in practice]
**Rejects:** [What current state behavior this replaces]

### Principle 3: [Name]
[Repeat]
```

---

### Step 2: Generate the Future State Blueprint

**Claude prompt:**
> "Using the current state blueprint, design principles, and prioritized HMW statements below, generate a future-state service blueprint. For each stage: describe what changes from current state, what new frontstage experiences exist, what backstage changes are required, and what systems need to change or be created. Mark new elements with ✦ and improved elements with ↑."

```
# Service Blueprint — Future State
## [Project Name] | Persona: [Name] | Scenario: [Goal]
### Date: [DATE] | Based on: Current state blueprint + [N] insight statements

---

## Stage 1: [Stage Name]

**User Actions**
[What the user does in the future state — note changes from current with ↑ or ✦]

**Frontstage** ✦ / ↑
[New or improved touchpoints — what users now see and experience]

**Backstage** ✦ / ↑
[New or changed behind-the-scenes processes — what has to change organizationally]

**Support Processes** ✦ / ↑
[New systems, integrations, or data flows required]

**Evidence** ✦ / ↑
[New or improved proof points delivered to users]

**Design Decision**
[Why this future state is better — which design principle it serves, which pain point it addresses]

**Assumption**
[What must be true for this future state to work — flag for validation]

---

## Stage 2: [Stage Name]
[Repeat structure]

---

[Continue for all stages]

---

## Future State Summary

### What Changes Most
| Stage | Change | Type | Principle Served |
|---|---|---|---|
| [Stage] | [What changes] | New ✦ / Improved ↑ | [Principle] |

### What Stays the Same
[Elements of current state worth preserving — conventions users rely on]

### Organizational Changes Required
[Backstage and support process changes that have no visible user impact but are prerequisites]
1. [Change] — Owner: [Team / Role]
2. [Change] — Owner: [Team / Role]

### Riskiest Assumptions
[Things that must be true for this future state to work — highest priority for prototyping and validation]
1. [Assumption] — Risk if wrong: [Impact]
2. [Assumption] — Risk if wrong: [Impact]

### Open Design Questions
[Things the future state blueprint raises but doesn't resolve — feed into Define]
1. [Question]
2. [Question]
```

---

## Running Both Modes Together

When producing current and future state in the same session:

1. Complete and review current state fully before starting future state
2. Use the current state pain points and systemic gaps as the direct input to future state
3. Annotate the future state blueprint with explicit references back to current state — every major change should trace to a specific pain point or insight
4. Generate a **delta summary** showing what changed, what improved, and what was intentionally left unchanged

**Claude prompt for delta summary:**
> "Generate a delta summary comparing the current and future state blueprints. For each stage, note: what was removed, what was improved, what is new, and what was preserved. Then summarize the net organizational lift required to deliver the future state."

---

## Quality Checklist

Before passing the blueprint to Define:
- [ ] Scenario is specific — one persona, one goal, one context
- [ ] Every current state pain point traces to a research session
- [ ] Systemic gaps are documented — not just user-facing friction
- [ ] Workarounds are captured — each one represents an unmet need
- [ ] Future state changes trace to specific insight statements or HMW outputs
- [ ] Riskiest assumptions are listed and ranked
- [ ] Organizational changes required are explicitly noted — not just design changes
- [ ] Blueprint is readable without narration — stages and lane labels are self-explanatory

---

## Phase Handoff Block

Generate this block at the close of service blueprinting. This is the primary handoff artifact into Define — it carries the richest picture of the current experience and the direction of the future state.

```
## Handoff: Discover → Define
### From: Service Blueprint
### Project: [PROJECT NAME]
### Date: [DATE]

---

### What we completed
- Current state blueprint: [Complete / Partial — note any stages missing]
- Future state blueprint: [Complete / Partial / Not yet done]
- Modes run: [Current only / Future only / Both]

### Scenario mapped
- Persona: [Name / Role]
- Goal: [What they were trying to accomplish]
- Stages: [N stages — list stage names]

### What the next phase needs to know
- Most critical current state failure: [One sentence — the worst systemic gap]
- Most important future state direction: [One sentence — the clearest design opportunity]
- Organizational change required: [The hardest backstage change needed to deliver the future state]

### Top frontstage pain points (what users feel)
1. [Stage] — [Pain point] — Severity: [Critical / Major / Minor]
2. [Stage] — [Pain point] — Severity: [Critical / Major / Minor]
3. [Stage] — [Pain point] — Severity: [Critical / Major / Minor]

### Top systemic gaps (what causes the pain)
1. [Gap between frontstage and backstage — root cause]
2. [Gap between frontstage and backstage — root cause]

### Riskiest assumptions in the future state
1. [Assumption] — Risk if wrong: [Impact on design]
2. [Assumption] — Risk if wrong: [Impact on design]

### Design principles established
1. [Principle name] — [One sentence]
2. [Principle name] — [One sentence]
3. [Principle name] — [One sentence]

### Open questions for Define
- [What the blueprint raised but didn't resolve]
- [Design decisions that need problem framing before ideation]
- [Anything that requires stakeholder alignment before moving forward]

### Ready for
- [ ] Insight Framing (HMW generation from blueprint pain points)
- [ ] Define phase (problem statement grounded in blueprint findings)
- [ ] Stakeholder presentation (blueprint as alignment artifact)

---
*This is the primary Discover → Define handoff artifact.*
*Combine with Research Synthesis and Competitive Analysis handoffs for full context.*
*Paste all three as the opening message when starting the Define phase.*
```
