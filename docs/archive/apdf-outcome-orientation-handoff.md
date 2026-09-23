# APDF Outcome Orientation — Claude Code Handoff

**Repo:** `quinrobinson/Agentic-Product-Design-Framework`
**Branch:** `main`
**Scope:** Skill files only. No UI changes. No React component edits.
**Estimated effort:** 1 session in Claude Code.

---

## Context

This work implements two recommendations from the methodology audit benchmarking APDF against Double Diamond, IDEO HCD, Google Design Sprint, Lean UX, Atlassian Team Playbook, and IBM Enterprise Design Thinking. The audit identified that APDF's six-phase structure is sound but lacks the outcome-contract layer that industry-standard methodologies attach to each phase. The two changes below close that gap with the smallest possible footprint.

**Decisions already made:**
- Skill files only — no edits to `web/src/`, no UI changes, no new components.
- KPIs are locked in from the audit (no review round).
- The Outcome Hill lives as a sub-skill inside Define (markdown only, no new interactive tool).
- The six-phase structure does not change.

---

## Task 1 — Create the Outcome Hill sub-skill in Define

### What to create

A new skill file at `skills/02-define/outcome-hill.md` that teaches the designer to write a single sentence binding user, behavior, business outcome, signal, and time. Adapted from IBM Hill format + Sprint Long-Term Goal + Lean UX hypothesis.

### File spec

**Path:** `skills/02-define/outcome-hill.md`

**Frontmatter:**

```yaml
---
name: outcome-hill
phase: 02 — Define
description: Bind a project to a single, measurable outcome before any solution work begins. Use this skill at the very start of Define — before problem framing, before ideation — to write one sentence that names the user, the behavior change, the business outcome it produces, the signal that proves it, and the time horizon. Adapted from IBM Hills, Google Design Sprint Long-Term Goal, and Lean UX hypothesis statements.
ai_leverage: medium
---
```

**Body structure (write all of this in the file):**

1. **`# Outcome Hill`** — one paragraph naming the problem: most design work fails because it ships outputs without contracting to outcomes. The Outcome Hill is the one sentence that fixes this.

2. **`## When to Use`** — bullet list. Use cases include: starting a new project, kicking off a design sprint, when stakeholders disagree on what success means, when a brief is fuzzy on the "why," and at the top of every Define phase before problem framing.

3. **`## The Outcome Hill Format`** — present the template prominently in a code block:

   ```
   [User] can [accomplish behavior]
   so that [business outcome moves],
   measured by [signal],
   within [time horizon].
   ```

   Then explain each slot:
   - **User** — Specific persona or segment. Not "users" or "customers" — name them.
   - **Behavior** — A verb the user does, not a feature you build. "Schedule a delivery" not "uses the calendar widget."
   - **Business outcome** — A change in a number the business cares about. Revenue, retention, conversion, time-to-value, support cost. Not a craft metric.
   - **Signal** — The leading indicator you'll watch. The thing you can measure in days or weeks, not quarters.
   - **Time horizon** — A specific date or sprint window. "By end of Q2." "Within 6 weeks of ship." "By the next pricing review."

4. **`## Worked Examples`** — provide three filled-in examples across different contexts:

   - **B2B SaaS feature:** "An onboarding admin can complete first-team setup in under 10 minutes so that 30-day activation rate moves from 42% to 60%, measured by Day-7 first-action completion, by end of Q2."
   - **Consumer app:** "A first-time shopper can find a product they want to buy within 90 seconds so that landing-to-cart conversion moves from 8% to 12%, measured by session-to-cart events in Amplitude, within 6 weeks of ship."
   - **Internal tool:** "A support agent can resolve a Tier-1 ticket without escalation so that average handle time drops by 20%, measured by ticket-close-without-escalation rate, by the end of the pilot in November."

5. **`## How to Write Yours — Step by Step`** — a numbered walkthrough:

   1. **Start with the user.** Name the specific role or segment. If you can't name them, pause and revisit Discover.
   2. **Pick one behavior.** If you have two, you have two Hills. Pick the highest-leverage one.
   3. **Connect to a business number.** Ask "if this user does this behavior, what business metric should move?" Avoid craft metrics (NPS, satisfaction) unless they are the company's North Star.
   4. **Choose a signal you can see fast.** Lagging metrics (revenue, retention) take quarters. Pair them with a leading signal you can watch weekly.
   5. **Set a date.** No date = no contract. Use a real calendar date or a real sprint window.
   6. **Test it against three failure modes:**
      - "Is this a feature description?" If yes, rewrite the behavior.
      - "Is this measurable in the next 90 days?" If no, find a leading signal.
      - "Would my PM or founder agree this is the outcome they want?" If no, schedule the conversation now.

6. **`## What Not to Do`** — common anti-patterns:
   - Writing the Hill as a feature ("Users can use the new dashboard").
   - Stacking three behaviors into one Hill.
   - Using craft metrics as the business outcome.
   - Skipping the time horizon.
   - Writing a Hill that no one outside the design team will care about.

7. **`## Quality Checklist`** — checkboxes:
   - [ ] The user is named specifically (not "users")
   - [ ] The behavior is a verb the user performs, not a feature you build
   - [ ] The business outcome is a number the business cares about
   - [ ] The signal can be measured in days or weeks
   - [ ] The time horizon is a real date or sprint window
   - [ ] The Hill fits in one sentence
   - [ ] A PM or founder would agree this is the right outcome

8. **`## Industry References`** — short note crediting the sources:
   IBM Enterprise Design Thinking Hills (Who/What/Wow format), Google Design Sprint Long-Term Goal, Lean UX hypothesis statements (Gothelf & Seiden), Teresa Torres outcome typing (business outcome vs. product outcome).

9. **`## Phase Handoff Note`** — one paragraph: the Outcome Hill is the artifact that opens the Define phase. Problem Framing then refines the *how* — the problem statement, journey map, and requirements — but everything in Problem Framing should ladder back to the Hill. Carry the Hill verbatim into every subsequent phase handoff block.

### Acceptance criteria for Task 1

- File exists at `skills/02-define/outcome-hill.md`.
- Frontmatter matches the spec exactly (name, phase, description, ai_leverage).
- All 9 sections present and in order.
- Three worked examples included.
- Quality checklist has 7 items as specified.
- File reads as a peer to `problem-framing.md` in tone and structure.

---

## Task 2 — Add an Outcomes & KPIs header to every phase skill

### What to add

A standardized header block at the top of every phase skill file, inserted **immediately after the frontmatter and the H1 title, and immediately before the first existing section** (typically "When to Use" or a short intro paragraph).

### Header template

For every phase skill file, insert this exact block — with the phase-specific content filled in from the table below:

```markdown
## Outcomes & KPIs

**Business outcome this phase moves:** [PHASE-SPECIFIC]
**Design KPI this phase improves:** [PHASE-SPECIFIC]
**Risk this phase burns down:** [PHASE-SPECIFIC]

---
```

The `---` after the block creates a horizontal rule separating the header from the rest of the skill.

### Phase-specific content (locked in from the audit)

The risk vocabulary uses Marty Cagan's four risks: **Value** (will users want it), **Usability** (can they figure it out), **Feasibility** (can we build it), **Viability** (does it work for the business).

#### Phase 01 — Discover

Files: `skills/01-discover/user-research.md`, `skills/01-discover/competitive-analysis.md`

```markdown
## Outcomes & KPIs

**Business outcome this phase moves:** Reduce ambiguity about which problem is worth solving — fewer wrong-problem rebuilds, faster time-to-strategic-clarity.
**Design KPI this phase improves:** Customer signals collected per week; ratio of validated to assumed insights in the brief.
**Risk this phase burns down:** Value risk — confirming users actually have the problem we think they do.

---
```

#### Phase 02 — Define

Files: `skills/02-define/problem-framing.md`, **and the new** `skills/02-define/outcome-hill.md`

```markdown
## Outcomes & KPIs

**Business outcome this phase moves:** A single shared, measurable mission the team commits to — reduces scope creep, mid-build pivots, and stakeholder misalignment.
**Design KPI this phase improves:** Time from kickoff to signed problem statement; % of build-phase work traceable to a Hill or hypothesis.
**Risk this phase burns down:** Value and Viability risk — confirming we are solving the right problem in a way the business can sustain.

---
```

Note: Add this header to the **new** `outcome-hill.md` too — it sits in the Define phase.

#### Phase 03 — Ideate

Files: `skills/03-ideate/concept-generation.md`, `skills/03-ideate/visual-design-execution.md`

```markdown
## Outcomes & KPIs

**Business outcome this phase moves:** Increase decision quality and option diversity per unit of design time — fewer mid-build pivots, stronger final selection.
**Design KPI this phase improves:** Solutions explored per opportunity (target: 3–5 distinct paths); decision velocity (decisions per week).
**Risk this phase burns down:** Value risk — exploring enough of the solution space to find one that actually moves the outcome.

---
```

#### Phase 04 — Prototype

Files: `skills/04-prototype/prototyping.md`, `skills/04-prototype/accessibility-audit.md`

```markdown
## Outcomes & KPIs

**Business outcome this phase moves:** Burn down the largest product risk per dollar of build effort — less code thrown away, faster engineering handoff.
**Design KPI this phase improves:** Time-to-first-clickable-prototype; cost-per-assumption-tested.
**Risk this phase burns down:** Usability and Feasibility risk — confirming users can actually use it and engineering can actually build it.

---
```

#### Phase 05 — Validate

Files: `skills/05-validate/usability-testing.md`

```markdown
## Outcomes & KPIs

**Business outcome this phase moves:** Convert assumptions into evidence with the shortest validated-learning cycle — fewer post-launch surprises.
**Design KPI this phase improves:** Validation cycle time (target: days, not weeks); assumption hit-rate (% of hypotheses validated).
**Risk this phase burns down:** Usability and Value risk — confirming the design works and produces the predicted behavior change.

---
```

#### Phase 06 — Deliver

Files: `skills/06-deliver/design-delivery.md`

```markdown
## Outcomes & KPIs

**Business outcome this phase moves:** Convert design intent into shipped product behavior change — close the loop from outcome contract to evidence.
**Design KPI this phase improves:** Time from final design to production; design-system reuse rate.
**Risk this phase burns down:** Feasibility and Viability risk — confirming the design ships as intended and the business can sustain it.

---
```

### Files NOT to touch in Task 2

Cross-phase skills do not get the Outcomes & KPIs header in this pass:
- `skills/design-systems.md`
- `skills/figma-playbook.md`
- `skills/phase-handoff.md`
- `skills/skill-chaining.md`

Rationale: these are routing/scaffolding skills, not phase deliverables. Adding phase-bound KPIs would misrepresent them. Revisit in a future pass if needed.

### Acceptance criteria for Task 2

- The header is present on all 10 phase skill files (including the new `outcome-hill.md`).
- The header sits immediately after the H1 title and before any "When to Use" or intro section.
- A horizontal rule (`---`) separates the header from the rest of the skill.
- The phase-specific content matches the table above verbatim.
- Cross-phase skills are untouched.

---

## Implementation order

1. **Pull and branch.** Pull latest `main`, create a working branch `outcome-orientation-pass-1`.
2. **Task 1 first.** Create `skills/02-define/outcome-hill.md` in full.
3. **Task 2 second.** Insert the Outcomes & KPIs header into each of the 10 phase files (including the new `outcome-hill.md`).
4. **Verify no UI files were touched.** Confirm nothing in `web/src/` changed. If anything did, revert it.
5. **Build sanity check.** Run `npm --prefix web run build` to confirm the build still passes (it should — no JSX was touched, but this catches accidental edits).
6. **Commit and push.** Single commit titled: `Add Outcome Hill sub-skill and Outcomes & KPIs headers to phase skills`. Push to `main` using the standard GitHub push pattern.
7. **Verify on GitHub.** Confirm all 11 changed files (1 new + 10 edited) are visible on `main`.

---

## What this handoff is deliberately NOT doing

These are deferred to future passes — do not implement now:

- No new interactive tool for the Outcome Hill (kept as markdown only per the decision).
- No UI changes to surface the Outcome Hill on phase pages or the Skills Library.
- No edits to cross-phase skills.
- No updates to the SKILLS array in `web/src/SkillsLibrary.jsx` or `web/src/App.jsx` to register the new file. The new skill is downloadable from the GitHub repo; surfacing it in the UI is a separate decision for a later pass.
- No KPI starter card deck (Tier 1 recommendation #3 from the audit).
- No risk tags on prototype/validate skills beyond what the header introduces.
- No changes to the Define phase's existing problem-framing content. The new Outcome Hill skill is additive, not a replacement.

---

## After this lands

Quin reviews the live skill files on GitHub, downloads `outcome-hill.md` to test the workflow on a real project, and decides whether to:
- Promote the Outcome Hill into the UI in a follow-up pass.
- Register the new skill in the SKILLS array and Skills Library page.
- Move to the next Tier 1 recommendation (the 12-KPI starter card deck).
