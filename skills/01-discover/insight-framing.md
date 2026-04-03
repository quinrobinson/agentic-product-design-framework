---
name: insight-framing
phase: 01 — Discover
description: Transform synthesized research insights into sharp, actionable How Might We (HMW) statements that seed ideation. Use at the end of discovery — after themes and pain points are established — to bridge research findings into a focused problem space. Triggers include requests to generate HMW statements, frame design opportunities, prioritize problem areas, create a problem statement, or prepare inputs for an ideation session. Depends on outputs from research-synthesis.md and service-blueprint.md. Final skill in the Discover phase — output feeds directly into Define.
ai_leverage: high
claude_surface: chat
---

# Insight Framing

Turn research findings into sharp, actionable HMW statements that make ideation focused and productive.

## When to Use

- You've completed research synthesis and need to bridge findings into design
- You have insight statements but need them sharpened into actionable problem framings
- You're preparing HMW statements for an ideation workshop or sprint
- You need to prioritize which problems to tackle before moving to Define
- You want to pressure-test whether you're solving the right problem before committing to ideation

---

## The Insight → HMW Pipeline

Insight framing is the capstone of Discover. Every skill before this one feeds into it:

```
Research Planning → Research Synthesis → Insight Statements
Competitive Analysis → Gaps + Opportunities
Service Blueprint → Systemic Gaps + Future State Direction
                          ↓
                  Insight Framing
                          ↓
         Prioritized HMW Statements → Define Phase
```

The output of this skill is the direct input to Define. Getting this right determines whether ideation produces solutions to the right problems — or creative answers to the wrong ones.

---

## What Makes a Good HMW Statement

HMW statements sit in a narrow window between too broad and too narrow. Getting the calibration right is the skill.

| Type | Example | Problem |
|---|---|---|
| **Too broad** | HMW improve the user experience? | Any solution qualifies — no creative constraint |
| **Too narrow** | HMW add a search bar to the dashboard? | Solution already embedded — no room to explore |
| **Just right** | HMW help users find what they need without knowing what to search for? | Specific enough to focus, open enough to explore |

**Three tests for a good HMW:**
1. Can you think of 10 different solutions to it? (if not, it's too narrow)
2. Does it still feel like a real user problem? (if not, it's too abstract)
3. Would solving it move a meaningful metric? (if not, it might not matter)

---

## What Claude Needs to Start

1. **Insight statements** from `research-synthesis.md` — the formatted [User X does Y because Z, which means W] statements
2. **Top pain points** ranked by severity
3. **Systemic gaps** from `service-blueprint.md` (if completed)
4. **Competitive gaps** from `competitive-analysis.md` (if completed)
5. **Any design constraints** already identified — platform, business, user accessibility

---

## Step 1: Sharpen Insight Statements

Before generating HMW statements, ensure each insight is tight. Weak insights produce weak HMW statements.

**Claude prompt:**
> "Review these insight statements. For each one: evaluate whether it clearly names a user, a behavior/belief, a root cause, and a design implication. Rewrite any that are missing a component. Flag any that are actually observations (what happened) rather than insights (why it matters)."

**Insight quality check:**

```
## Insight Review

### Insight: [Original statement]

**Quality check:**
- Names a user: [Yes / No — who?]
- States a behavior or belief: [Yes / No — what?]
- Explains root cause: [Yes / No — why?]
- States design implication: [Yes / No — which means what?]

**Status:** [Strong / Needs sharpening / Is an observation not an insight]

**Sharpened version (if needed):**
[User] [does/believes/feels X] because [root cause Y], which means [design implication Z].
```

---

## Step 2: Generate HMW Statements

With sharpened insights, generate a broad set of HMW statements — quantity first, quality second. You'll filter in the next step.

**Claude prompt:**
> "For each insight statement below, generate 5 HMW statements. Vary the angle: one should address the root cause, one should reframe the constraint as an asset, one should focus on the emotional dimension, one should address the systemic gap, and one should be the most ambitious version. Label each by angle."

```
## HMW Generation

### From Insight: [Insight statement]

**Root cause angle:**
HMW [address the underlying reason the problem exists] so that [user outcome]?

**Constraint reframe:**
HMW use [the thing that currently causes friction] as an advantage so that [user outcome]?

**Emotional dimension:**
HMW make [the hardest moment] feel [positive emotion] so that [user outcome]?

**Systemic angle:**
HMW change [the backstage process or system] so that [user experience improves]?

**Ambitious angle:**
HMW [eliminate the problem entirely] so that [user never has to deal with it]?

---

### From Insight: [Next insight statement]
[Repeat structure]
```

---

## Step 3: Enrich from Competitive and Blueprint Gaps

Research insights aren't the only source of HMW statements. Pull additional framing from competitive gaps and service blueprint systemic gaps.

**Claude prompt:**
> "Using the competitive gaps and service blueprint systemic gaps below, generate 2–3 additional HMW statements per gap. These should frame the gap as a design opportunity — not a problem to describe, but a direction to explore."

```
## HMW from Competitive Gaps

### Gap: [Competitive gap — what no competitor solves well]
**HMW:** [Frame as design opportunity]
**HMW:** [Frame differently]

---

## HMW from Systemic Gaps (Service Blueprint)

### Gap: [Disconnect between frontstage experience and backstage reality]
**HMW:** [Frame as design opportunity targeting the root cause]
**HMW:** [Frame targeting the user experience symptom]
```

---

## Step 4: Cluster and Deduplicate

After generating a broad set, cluster overlapping statements and remove duplicates before prioritizing.

**Claude prompt:**
> "Here is the full set of HMW statements generated. Cluster them into 3–5 themes. For each cluster, name the theme, list the statements that belong to it, and identify the single strongest statement that best represents the cluster. Remove any duplicates or statements that are too narrow to be useful."

```
## HMW Clusters

### Cluster 1: [Theme name — e.g. "Reducing cognitive load at decision points"]
**Statements in this cluster:**
- HMW [statement]
- HMW [statement]
- HMW [statement]

**Strongest representative:**
HMW [the sharpest, most actionable statement from this cluster]

**Why this cluster matters:**
[1 sentence connecting this theme to the research finding that generated it]

---

### Cluster 2: [Theme name]
[Repeat structure]
```

---

## Step 5: Prioritize — Select the Top 5

From the clustered set, select the 5 HMW statements that will drive Define and Ideate. Use this scoring model.

**Scoring criteria:**
- **User impact** (1–3): How directly does solving this improve the user's core experience?
- **Business value** (1–3): How directly does solving this move a metric that matters?
- **Design leverage** (1–3): How much creative space does this HMW open up?
- **Feasibility signal** (1–3): Is solving this within realistic reach given constraints?

**Claude prompt:**
> "Score each clustered HMW statement using the four criteria below. Produce a prioritized ranked list with total scores. Flag any statement that scores high on user impact and design leverage but low on feasibility — these are 'future bets' worth keeping visible even if not the primary focus."

```
## HMW Priority Scoring

| # | HMW Statement | User Impact | Business Value | Design Leverage | Feasibility | Total |
|---|---|---|---|---|---|---|
| 1 | HMW [statement] | /3 | /3 | /3 | /3 | /12 |
| 2 | HMW [statement] | /3 | /3 | /3 | /3 | /12 |
| 3 | HMW [statement] | /3 | /3 | /3 | /3 | /12 |

---

### Top 5 Selected
1. [HMW — primary focus for Define]
2. [HMW]
3. [HMW]
4. [HMW]
5. [HMW]

### Future Bets (high impact, lower feasibility now)
- [HMW — worth revisiting in v2 or future sprint]
```

---

## Step 6: Define the Primary Problem Statement

From the top-ranked HMW, distill a single primary problem statement. This becomes the anchor for Define.

**Three formats — generate all three, then select one:**

**How Might We (for ideation):**
```
HMW [action] for [user] so that [outcome]?
```

**Jobs to Be Done (for solution grounding):**
```
When [situation], I want to [action], so I can [outcome].
```

**Design brief framing (for stakeholder alignment):**
```
[User] needs a way to [accomplish goal] because [root cause], 
which currently results in [negative outcome]. 
We'll know we've solved it when [measurable success signal].
```

**Claude prompt:**
> "Using the top-ranked HMW statement, generate the problem statement in all three formats: HMW, JTBD, and design brief framing. Then recommend which format is most useful for this project's context — ideation workshop, stakeholder alignment, or development handoff — and explain why."

---

## Quality Checklist

Before passing to Define:
- [ ] Every HMW traces to a specific research insight or gap — not invented
- [ ] Top 5 HMW statements pass the calibration test — not too broad, not too narrow
- [ ] HMW clusters cover meaningfully different problem angles — not variations on one idea
- [ ] Scoring is based on evidence — not gut feel
- [ ] Primary problem statement is written in all three formats
- [ ] Future bets are documented separately — not lost, not in the critical path
- [ ] The Define phase knows exactly which HMW to tackle first and why

---

## Phase Handoff Block

This is the final Discover phase handoff. Combine this block with the Research Synthesis, Competitive Analysis, and Service Blueprint handoffs when opening the Define phase. Together, the four blocks give Define complete context — user reality, market landscape, systemic picture, and sharpened problem framing.

```
## Handoff: Discover → Define
### From: Insight Framing
### Project: [PROJECT NAME]
### Date: [DATE]

---

### What we completed
- Insights sharpened: [N]
- HMW statements generated: [N total]
- HMW clusters identified: [N]
- Top 5 selected: [Yes / No]
- Primary problem statement: [Drafted / TBD]

### What the next phase needs to know
- Primary research question answered: [One sentence summary of what we learned]
- Primary user: [Persona / segment]
- Core tension: [The central conflict or unmet need the research surfaced]

### Top 5 HMW Statements (ranked)
1. HMW [statement] — Score: [X/12]
2. HMW [statement] — Score: [X/12]
3. HMW [statement] — Score: [X/12]
4. HMW [statement] — Score: [X/12]
5. HMW [statement] — Score: [X/12]

### Primary problem statement
**HMW format:** HMW [statement]?
**JTBD format:** When [situation], I want to [action], so I can [outcome].
**Design brief format:** [User] needs a way to [goal] because [root cause], which currently results in [negative outcome]. We'll know we've solved it when [success signal].

### Future bets (high impact, lower feasibility)
- HMW [statement] — Why it's a future bet: [Constraint or risk]

### Key constraints carried into Define
- Technical: [Platform, stack, integration constraints]
- Business: [Timeline, budget, non-negotiables]
- User: [Accessibility, device, literacy, trust requirements]

### Open questions for Define
- [What insight framing surfaced but couldn't resolve]
- [Assumptions about the problem that still need team alignment]
- [Scope decisions that Define must make before Ideate can start]

### Recommended Define focus
[1–2 sentences — which HMW to tackle first, why it's the highest-leverage starting point, and what Define needs to lock in before ideation begins]

---
*This is the final Discover → Define handoff artifact.*
*Combine with Research Synthesis, Competitive Analysis, and Service Blueprint handoffs.*
*Paste all four as the opening message when starting the Define phase.*
*Claude will synthesize all four into a unified project context before beginning problem framing.*
```
