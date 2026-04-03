---
name: research-synthesis
phase: 01 — Discover
description: Transform raw research data — interview transcripts, notes, survey responses, or observation records — into structured themes, ranked pain points, and actionable insights. Use after user interviews or any qualitative data collection. Triggers include requests to analyze transcripts, find patterns in notes, code qualitative data, generate themes, build insight statements, or extract findings from raw research. Depends on outputs from research-planning.md.
ai_leverage: high
claude_surface: chat
---

# Research Synthesis

Turn raw research data into structured insights that drive confident design decisions.

## When to Use

- You've completed interviews, observations, or surveys and need to make sense of the data
- You have notes or transcripts and need to identify themes without spending days on manual analysis
- You need to move from raw data to a shareable findings document
- You're preparing inputs for service blueprinting or insight framing

---

## The Core Principle: Step-by-Step, Not All at Once

The most common mistake: pasting 15 transcripts into Claude and asking for themes.

**Don't do this.** Context gets diluted, details get lost, and outputs become generic summaries with hallucinated quotes.

**Do this instead:** Run synthesis as a pipeline — one step at a time, with human review between each step. Each step gives Claude focused attention on a discrete task. This reduces hallucination risk and produces dramatically better outputs.

```
Raw data
  → Step 1: Per-session summaries
  → Step 2: Initial codes proposed
  → Step 3: Codes applied across sessions
  → Step 4: Cross-session themes identified
  → Step 5: Insight statements generated
  → Step 6: Pain points ranked by severity
  → Output: Research Brief ready for Define
```

---

## What Claude Needs to Start

Before synthesizing, confirm:

1. **What was the research question?** (from research-planning.md)
2. **What type of data?** (interview transcripts / observer notes / survey responses / mixed)
3. **How many sessions?** (affects pipeline approach)
4. **What format is the data in?** (raw transcript / timestamped notes / recording summary)

---

## Step 1: Per-Session Summary

Process one session at a time. For each interview or observation, generate a structured summary before synthesizing across sessions.

**Claude prompt:**
> "Here is the transcript / notes from Session [N] with [participant role]. Generate a structured session summary using the template below. Quote directly from the transcript — do not paraphrase quotes. Flag anything that surprised you or contradicts our research assumptions."

```
## Session Summary: [Participant Role / ID]
### Session: [N of N] | Date: [DATE] | Duration: [X min]

---

### Participant Context
- Role: [What they do]
- Experience level: [New / Intermediate / Expert]
- Key context: [Anything unusual about their situation]

### Primary Goal in This Domain
[What they're ultimately trying to accomplish — in their words if possible]

### Current Workflow
[How they do the thing we're designing for — step by step, as they described it]

### Pain Points Mentioned
| Pain Point | Direct Quote | Severity (their language) |
|---|---|---|
| [Pain] | "[Exact quote]" | [Frustrated / Blocked / Annoyed / Minor] |

### Workarounds Discovered
[Things they do to compensate for what doesn't work — these are gold]

### Mental Model Notes
[How they think about the problem space — terminology they use, analogies they draw]

### Surprises / Contradictions
[Anything that contradicted our assumptions or was unexpected]

### Key Quote
> "[The single most representative quote from this session]"

### Tags (for cross-session coding)
[3–5 thematic tags that apply to this session]
```

---

## Step 2: Propose Initial Codes

After completing per-session summaries for all sessions, generate an initial coding framework.

**Claude prompt:**
> "Here are summaries from [N] research sessions. Propose 8–12 thematic codes that appear across multiple sessions. For each code, name it, define it in one sentence, and list which sessions it appears in. Only include codes that appear in 3 or more sessions."

```
## Initial Coding Framework
### Sessions analyzed: [N] | Date: [DATE]

---

| Code | Definition | Sessions | Frequency |
|---|---|---|---|
| [Code name] | [One sentence definition] | [S1, S3, S5...] | [X of N] |
| [Code name] | [One sentence definition] | [...] | [X of N] |

---

### Notes
- Codes appearing in fewer than 3 sessions: [List — consider dropping or merging]
- Potential code conflicts or overlaps: [Flag any that seem redundant]
- Suggested merges: [Codes that could combine]
```

**Human review checkpoint:** Before proceeding, review and edit the coding framework. Add, remove, merge, or rename codes based on your knowledge of the data. Claude proposes — you decide.

---

## Step 3: Apply Codes Across Sessions

With the approved coding framework, apply codes to every session summary systematically.

**Claude prompt:**
> "Using the approved coding framework below, apply codes to each session summary. For each code, list: which sessions it appears in, the strongest supporting quote from each session, and a severity indicator. Flag any session where a code appears strongly but wasn't in the initial framework."

```
## Coded Data: [Code Name]
### Definition: [Code definition]

| Session | Quote | Severity |
|---|---|---|
| S1 — [Role] | "[Direct quote]" | Critical / Major / Minor |
| S3 — [Role] | "[Direct quote]" | Critical / Major / Minor |
| S5 — [Role] | "[Direct quote]" | Critical / Major / Minor |

**Frequency:** [X of N sessions]
**Pattern notes:** [Anything notable about how this code clusters — certain roles, contexts, or segments]
```

---

## Step 4: Synthesize Cross-Session Themes

Themes are higher-order patterns that emerge from multiple related codes. This is where the real synthesis happens.

**Claude prompt:**
> "Based on the coded data, identify 3–5 overarching themes. Each theme should group 2–3 related codes. Name each theme, describe it in 2–3 sentences, list supporting codes, cite the 2 strongest evidence quotes, and assess its design implication."

```
## Research Themes

---

### Theme 1: [Theme Name]
**Summary:** [2–3 sentences describing the pattern — what users experience, why it matters]

**Supporting codes:** [Code A] + [Code B] + [Code C]

**Frequency:** [X of N participants]

**Evidence:**
> "[Strongest supporting quote — Session N, Role]"
> "[Second supporting quote — Session N, Role]"

**Design implication:** [What this theme suggests we should solve for]

---

### Theme 2: [Theme Name]
[Repeat structure]

---

### Theme 3: [Theme Name]
[Repeat structure]

---

### Contradictions and Tensions
[Findings that don't fit neatly into themes — competing needs, conflicting behaviors, outliers worth noting]

### What We Expected But Didn't Find
[Assumptions that research didn't confirm — important for scoping and stakeholder conversations]
```

---

## Step 5: Generate Insight Statements

Insights are not themes. An insight is a sharp, actionable statement of what you learned — connecting observation to implication.

**Format:** *[User] [does/believes/feels X] because [root cause Y], which means [design implication Z].*

**Claude prompt:**
> "From the themes above, generate one insight statement per theme. Each statement should follow the format: [User] [does/believes/feels X] because [root cause Y], which means [design implication Z]. Then generate 3 HMW statements per insight to seed the insight-framing skill."

```
## Insight Statements

---

### Insight 1 — from Theme: [Theme Name]
**Statement:** [User] [does/believes/feels X] because [root cause Y], which means [design implication Z].

**Evidence strength:** High / Medium / Low (based on frequency + quote quality)

**How Might We seeds:**
- HMW [action] so that [user outcome]?
- HMW [action] so that [user outcome]?
- HMW [action] so that [user outcome]?

---

### Insight 2 — from Theme: [Theme Name]
[Repeat structure]
```

---

## Step 6: Rank Pain Points by Severity

Before packaging findings, rank pain points systematically so Define and Ideate focus on the right problems.

**Severity scoring:**
- **Critical** — Blocks the user from completing their goal entirely
- **Major** — Creates significant friction, workarounds required, causes visible frustration
- **Minor** — Noticeable but doesn't stop progress

**Claude prompt:**
> "From all sessions and themes, compile the complete list of pain points. Rank them by severity (Critical / Major / Minor) and frequency (how many sessions). Flag any that are Critical but low-frequency — these may be edge cases or segment-specific."

```
## Pain Point Rankings

| # | Pain Point | Severity | Frequency | Sessions | Notes |
|---|---|---|---|---|---|
| 1 | [Pain point description] | Critical | [X of N] | [S1, S3...] | [Any segment or context note] |
| 2 | [Pain point] | Critical | [X of N] | [...] | |
| 3 | [Pain point] | Major | [X of N] | [...] | |
| 4 | [Pain point] | Major | [X of N] | [...] | |
| 5 | [Pain point] | Minor | [X of N] | [...] | |

### Critical but Low-Frequency (investigate further)
- [Pain point] — Appeared in [N] sessions but was described as blocking when it occurs
```

---

## Output: Research Brief

Package everything into a shareable brief that stakeholders can read and Define can build from.

**Claude prompt:**
> "Using the themes, insights, pain points, and session summaries, generate a complete Research Brief. Keep it tight — executives read the Overview, designers read the Themes and Insights, PMs read the Pain Points and Recommendations."

```
# Research Brief: [Study Name]
### Project: [PROJECT NAME] | Date: [DATE] | Sessions: [N]

---

## Overview (60-second read)
[3–4 sentences capturing the most important finding, who it affects, and what it means for the product]

## Research Objectives
- Primary question: [What we set out to learn]
- Secondary questions: [Supporting questions]

## Method & Participants
- Method: [Interviews / Contextual inquiry / Mixed]
- Participants: [N = X; segments or roles]
- Sessions: [Date range]

---

## Key Themes

### Theme 1: [Name]
[2–3 sentence summary. Frequency: X of N participants]
> "[Strongest supporting quote]"

### Theme 2: [Name]
[Repeat]

### Theme 3: [Name]
[Repeat]

---

## Insight Statements
1. [Insight statement — User X does Y because Z, which means W]
2. [Insight statement]
3. [Insight statement]

---

## Pain Points (Ranked)
**Critical**
1. [Pain point] — [X of N participants]
2. [Pain point] — [X of N participants]

**Major**
3. [Pain point] — [X of N participants]
4. [Pain point] — [X of N participants]

**Minor**
5. [Pain point] — [X of N participants]

---

## What We Expected But Didn't Find
- [Assumption] — [What the research actually showed]

## Limitations
- [Sample size, recruitment constraints, method limitations]
- [What this research can and can't tell us]

## Recommended Next Steps
1. [Most urgent action — move to service blueprinting / insight framing / Define]
2. [Secondary action — anything to validate further]
3. [What to deprioritize based on findings]
```

---

## Quality Checklist

Before passing synthesis to Define:
- [ ] Every insight traces directly to session data — no invented patterns
- [ ] Quotes are verbatim, not paraphrased — mark approximations clearly
- [ ] Pain points are ranked with consistent severity criteria
- [ ] Themes include frequency counts — not just "many participants said"
- [ ] Contradictions and surprises are documented, not smoothed over
- [ ] Assumptions that weren't confirmed are explicitly noted
- [ ] Participant privacy protected — quotes anonymized by role, not name
- [ ] Research Brief is readable by non-designers in under 5 minutes

---

## Phase Handoff Block

Generate this block at the close of Research Synthesis. This feeds directly into both `service-blueprint.md` and `insight-framing.md` before passing to Define.

```
## Handoff: Discover → Define
### From: Research Synthesis
### Project: [PROJECT NAME]
### Date: [DATE]

---

### What we completed
- Sessions synthesized: [N total]
- Themes identified: [N]
- Insight statements generated: [N]
- Pain points ranked: [N total — X Critical, X Major, X Minor]

### What the next phase needs to know
- Research question answered: [Yes / Partial / No — if partial, note what's unresolved]
- Primary user segment: [Who this research represents]
- Key constraint surfaced: [Any hard constraint that shapes the design space]

### Top 3 themes (ranked by design impact)
1. **[Theme name]** — [One sentence. Frequency: X of N]
2. **[Theme name]** — [One sentence. Frequency: X of N]
3. **[Theme name]** — [One sentence. Frequency: X of N]

### Critical pain points
1. [Pain point] — [X of N sessions]
2. [Pain point] — [X of N sessions]

### Strongest insight statement
[User] [does/believes/feels X] because [root cause Y], which means [design implication Z].

### Key user quote
> "[Most representative quote from the full study]"
> — [Role / segment, anonymized]

### What we expected but didn't find
- [Assumption that research didn't confirm — important for problem framing]

### Ready for
- [ ] Service Blueprint (current state mapping)
- [ ] Insight Framing (HMW generation)
- [ ] Define phase (problem statement)

### Open questions carried forward
- [What we still don't know]
- [Segments or contexts we didn't reach]
- [Anything that needs validation before Define locks the problem statement]

---
*Feed this block into service-blueprint.md and insight-framing.md before passing to Define.*
*Both downstream skills need the themes and pain points as their primary inputs.*
```
