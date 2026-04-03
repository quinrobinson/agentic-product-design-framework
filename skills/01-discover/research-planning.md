---
name: research-planning
phase: 01 — Discover
description: Scaffold a research plan and interview guide from a project brief, business goal, or rough problem statement. Use this skill at the start of any discovery effort — when you know what you're designing for but haven't yet defined how to learn about users. Triggers include requests to plan research, build a discussion guide, create a screener, define research objectives, or decide which research methods to use. Also use when a designer is unsure where to start in discovery.
ai_leverage: high
claude_surface: chat
---

# Research Planning

Turn a project brief or business goal into a complete research plan and interview guide — ready to run.

## When to Use

- You're starting a new discovery effort and need to structure your approach
- You have a vague brief and need to sharpen research objectives before recruiting participants
- You need a discussion guide for user interviews or stakeholder sessions
- You need a screener to recruit the right participants
- You're not sure which research method fits the problem

---

## Step 1: Clarify Before Planning

Before generating a plan, Claude needs four inputs. If any are missing, ask:

1. **What are you designing?** (product, feature, service, or problem space)
2. **Who are the likely users?** (role, context, or segment — even a rough guess)
3. **What does the business need to learn?** (the decision this research will inform)
4. **What constraints exist?** (timeline, budget, access to participants, existing knowledge)

With these four inputs, Claude can generate a complete research plan. Without them, outputs will be generic and less useful.

---

## Step 2: Choose the Right Method

Use this decision guide to recommend the right research method before building the plan.

| If you need to... | Use this method |
|---|---|
| Understand how users think, feel, and behave | Generative user interviews |
| Validate patterns across a larger group | Survey |
| Understand the full context of use | Contextual inquiry / field study |
| Map behaviors over time | Diary study |
| Understand information architecture | Card sorting + tree testing |
| Quickly audit the current state | Heuristic evaluation |
| Understand the competitive landscape | Competitive analysis |
| Map current vs. future state experience | Service blueprint |

**For most product design discovery, start with generative user interviews.** They produce the richest qualitative data with the lowest logistical overhead.

---

## Step 3: Generate the Research Plan

Structure every research plan as follows:

```
# Research Plan: [Project Name]
### Date: [DATE] | Phase: Discover

---

## Research Objectives

**Primary question:**
[The single most important thing this research needs to answer]

**Secondary questions:**
1. [Supporting question]
2. [Supporting question]
3. [Supporting question]

**What we already know:**
[Existing knowledge, prior research, or data that shapes our starting point]

**What we're assuming:**
[Beliefs the team holds that this research will test or validate]

---

## Methodology

**Method:** [Primary method — e.g. Semi-structured user interviews]
**Why this method:** [1–2 sentences justifying the choice for this specific research question]
**Supplementary methods:** [Any secondary methods — e.g. competitive review, analytics audit]

---

## Participants

**Target:** [N] participants
**Segments:** [Define 1–3 segments if applicable — e.g. new users, power users, churned users]

**Inclusion criteria:**
- [Must-have characteristic 1]
- [Must-have characteristic 2]
- [Must-have characteristic 3]

**Exclusion criteria:**
- [Who to screen out and why]

**Recruitment approach:**
- [Channel 1 — e.g. existing customer list]
- [Channel 2 — e.g. user research panel]
- [Incentive: $X gift card / 30 min of their time]

---

## Screener Questions

Use these to qualify participants before scheduling:

1. [Qualifying question — open or multiple choice]
2. [Qualifying question]
3. [Disqualifying question — reveals who to exclude]
4. [Role / context question]
5. [Availability / logistics question]

---

## Timeline

| Activity | Duration | Owner |
|---|---|---|
| Finalize plan and guide | [X days] | [Designer] |
| Recruit participants | [X days] | [Designer / Ops] |
| Run sessions | [X days] | [Designer] |
| Synthesis and analysis | [X days] | [Designer] |
| Share findings | [Date] | [Designer + PM] |

**Total estimated time:** [X weeks]

---

## Success Criteria

This research is complete when:
- [ ] [N] sessions completed across [segments]
- [ ] Themes reach saturation (consistent patterns across 3+ participants)
- [ ] Primary research question has a defensible answer
- [ ] Synthesis output is ready to input into Define phase

---

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Recruitment delays | High | Begin outreach before guide is finalized |
| [Risk 2] | [Level] | [Mitigation] |
| [Risk 3] | [Level] | [Mitigation] |
```

---

## Step 4: Generate the Discussion Guide

After the research plan is approved, generate the interview guide. Structure every guide as:

```
# Discussion Guide: [Study Name]
### Method: [Semi-structured interview / contextual inquiry / etc.]
### Session length: [45 / 60 / 90 min]
### Interviewer notes: [Any setup instructions, tools needed, consent reminder]

---

## Warm-Up (5 min)
*Goal: Build rapport, understand context. Easy questions only.*

1. Tell me a little about your role and what a typical day looks like for you.
2. How long have you been in this role?
3. [One light context-setting question relevant to the topic]

---

## Context Setting (5–10 min)
*Goal: Understand their current situation before exploring the problem space.*

4. Walk me through how you currently [do the thing this product relates to].
5. What tools or resources do you use to [accomplish this goal]?
6. Who else is involved when you [do this]?

---

## Core Exploration (20–30 min)
*Goal: Uncover pain points, mental models, unmet needs. Past behavior only — no hypotheticals.*

7. Tell me about the last time you [performed the key task]. Walk me through what happened.
8. What was the hardest part of that process?
9. What did you do when [specific friction point]?
10. How do you decide [key decision in workflow]?
11. What's missing from how you currently do this?
12. Tell me about a time when things went really wrong with [topic]. What happened?
13. Tell me about a time when things worked exactly as you wanted. What made that possible?

*Follow-up probes for any answer:*
- "Can you tell me more about that?"
- "Why did you do it that way?"
- "What were you thinking at that moment?"
- "What did you do next?"

---

## Specific Scenarios (10 min)
*Goal: Explore targeted moments that map to known design questions.*

14. Walk me through [specific scenario relevant to design problem].
15. What would need to be true for [alternative approach] to work for you?
16. If you could change one thing about [current experience], what would it be?

---

## Wrap-Up (5 min)
*Goal: Capture anything missed. End on an open door.*

17. Is there anything about [topic] we haven't talked about that you think is important?
18. Who else do you think we should talk to?
19. [Any final logistics — consent for recording, follow-up availability]

---

## Observer Notes Template

| Time | Quote or Observation | Tag |
|---|---|---|
| [Timestamp] | [Direct quote or behavioral note] | [pain point / insight / opportunity / surprise] |
```

---

## Rules for Good Interview Questions

- **Ask about past behavior, never future hypotheticals** — "Tell me about the last time you..." not "Would you ever..."
- **Open-ended only** — Questions that can't be answered with yes/no
- **Never lead** — "What was that experience like?" not "Was that frustrating?"
- **Silence is a tool** — Pause after answers to invite elaboration
- **Follow surprises** — When something unexpected surfaces, go deeper before moving on
- **One question at a time** — Never stack two questions in one turn

---

## Quality Checklist

Before recruiting, verify:
- [ ] Primary research question is specific and answerable
- [ ] Method matches the type of knowledge needed
- [ ] Participant criteria are tight enough to avoid irrelevant data
- [ ] Guide opens with behavior, not opinion
- [ ] No leading questions in the guide
- [ ] Timeline accounts for recruitment delays (buffer: +3–5 days)
- [ ] Synthesis time is blocked in the timeline before sharing findings

---

## Phase Handoff Block

At the close of research planning, generate this block and keep it ready. Update it after sessions are complete and synthesis is done before passing to Define.

```
## Handoff: Discover → Define
### From: Research Planning
### Project: [PROJECT NAME]
### Date: [DATE]

---

### What we completed
- Research plan: [finalized / in progress]
- Discussion guide: [finalized / in progress]
- Participants recruited: [N of N target]
- Sessions completed: [N of N planned]

### What the next phase needs to know
- Primary research question: [one sentence]
- Method used: [method + why]
- Participant segments: [listed]
- Key constraints surfaced: [timeline / access / budget]

### Research outputs ready for Define
- [ ] Synthesized themes (link or summary)
- [ ] Pain points ranked by severity
- [ ] Key user quotes
- [ ] Personas or archetypes drafted
- [ ] HMW statements generated

### Open questions carried forward
- [What we still don't know that Define should address]
- [Assumptions that weren't fully tested]
- [Edge cases or segments we didn't reach]

### What Define should focus on first
[1–2 sentences directing the next phase — which problem to frame and why]

---
*Paste this block as your first message when opening the Research Synthesis or Define phase skill.*
*Update all fields before passing forward — partial or blank fields create gaps in the next phase.*
```
