---
name: design-qa
phase: 06 — Deliver
description: Structure, prioritize, and document design QA issues after engineering builds a feature — comparing the implementation against the approved design and producing a severity-rated issue log ready for developer action. Use after the first engineering build is deployed to a staging environment, before any production release. Claude structures scattered QA notes into a consistent, actionable log.
ai_leverage: high
claude_surface: chat
---

# Design QA

Compare what was built against what was designed — systematically, with a severity-rated issue log developers can act on immediately.

## When to Use

- Engineering has built a feature and it's deployed to staging or a test environment
- The designer has reviewed the implementation and has notes but they're scattered
- The team needs a structured issue log before a production release
- A previous release shipped with visual discrepancies and the team wants a more formal QA process
- Preparing a QA report for stakeholders before sign-off

---

## What Design QA Is — and Why It Gets Skipped

Design QA is comparing what was coded against what was planned — examining the front-end for gaps missed in the handoff prototype. It's not functional QA (does it work?) — it's visual and behavioral QA (does it match the design?).

It gets skipped because:
- Time pressure at the end of a sprint
- The assumption that "close enough is good enough"
- No structured process — the designer doesn't know what to check or how to log it

The cost of skipping: fonts get swapped, spacing breaks down, UI states get overlooked — and those details compound into a product that feels unpolished regardless of how good the design was.

Claude's role here: structuring the QA log. The designer does the visual comparison (human judgment required). Claude converts scattered notes into a consistent, prioritized issue log developers can act on without clarification.

---

## What Claude Needs to Start

1. **Raw QA notes** — observations from reviewing the implementation (any format)
2. **Component or screen context** — what was being reviewed
3. **Approved design reference** — description of what the design specified (or paste from component-specs.md)
4. **Severity definitions** — or use the defaults below

---

## QA Review Areas

Run through each area systematically when reviewing an implementation:

**Visual fidelity:**
- Typography: font family, weight, size, line height, letter spacing
- Color: exact values matching design tokens or hex codes
- Spacing: margins, padding, gaps — compare against spec
- Border radius, shadows, and dividers
- Icon size, weight, and alignment

**Component states:**
- Hover, focus, active, disabled states — all present and correct
- Loading and skeleton states
- Error and empty states
- Transitions and animations — timing, easing, duration

**Layout and responsive behavior:**
- Component alignment at specified breakpoints
- Content reflow behavior at narrow viewports
- Fixed vs. fluid widths behaving as specified

**Content handling:**
- Long text truncation working correctly
- Missing/optional content handled gracefully
- Character limits enforced or handled

**Accessibility:**
- Focus ring visible on keyboard navigation
- Focus order logical
- Interactive elements reachable by keyboard

---

## Step 1: Structure Raw QA Notes

**Claude prompt:**
> "Structure these raw design QA notes into a consistent issue log.
>
> Component / Screen: [what was reviewed]
> Design spec reference: [paste relevant spec or describe the approved design]
>
> Raw QA notes:
> [Paste scattered observations — any format]
>
> For each distinct issue, produce:
>
> | # | Issue | Location | Expected | Actual | Severity |
> |---|---|---|---|---|---|
>
> Severity definitions:
> - P1 Critical: Blocks usability — missing states, broken interactions, inaccessible elements
> - P2 Major: Visible design deviation that affects quality perception — wrong font, wrong spacing, wrong color
> - P3 Minor: Small inconsistency with low user impact — slightly off spacing, minor alignment issue
> - P4 Cosmetic: Pixel-level polish — negligible user impact, fix when convenient
>
> After the table, group issues by:
> - Fix before release (P1 + P2)
> - Fix in next sprint (P3)
> - Backlog (P4)"

---

## Step 2: Write Issue Tickets

For P1 and P2 issues, generate developer-ready ticket descriptions.

**Claude prompt:**
> "Write developer-ready issue descriptions for these design QA findings. Each description should be specific enough to fix without a design review meeting.
>
> Format per issue:
>
> **[DESIGN QA] [Component/Screen] — [Short title]**
>
> **What was designed:**
> [Specific value from the spec — e.g. 'Font-size: 14px / line-height: 1.5 / weight: 500']
>
> **What was built:**
> [What the implementation shows instead]
>
> **Where:**
> [Specific screen, component, and state — e.g. 'Button component, hover state, primary variant']
>
> **Fix:**
> [The specific CSS property or token to update — be as precise as possible]
>
> **Priority:** P[N] — [Critical / Major / Minor / Cosmetic]
>
> Issues to ticket: [paste P1 + P2 issues]"

---

## Step 3: Generate the QA Report

**Claude prompt:**
> "Generate a design QA report from these findings.
>
> Feature/Component: [name]
> Review date: [date]
> Reviewer: [designer name]
> Build reviewed: [staging URL or build version]
>
> Issues: [paste structured issue list]
>
> Report structure:
>
> ## Design QA Report: [Feature/Component]
> **Reviewed:** [date] | **Build:** [version/URL] | **Reviewer:** [name]
>
> ### Summary
> - Total issues: [N]
> - P1 Critical: [N] — [must fix before release]
> - P2 Major: [N] — [fix before release]
> - P3 Minor: [N] — [next sprint]
> - P4 Cosmetic: [N] — [backlog]
> - **Release recommendation:** [Ready / Not ready — with brief rationale]
>
> ### P1 + P2 Issues (must fix)
> [Full issue table with location, expected, actual, fix]
>
> ### P3 Issues (next sprint)
> [Abbreviated table]
>
> ### What's Correct (don't change)
> [List things that were implemented correctly — prevents unnecessary churn]
>
> ### Open Questions
> [Anything that needs a design decision before it can be fixed]"

---

## Common QA Issues by Category

Use these as a checklist when reviewing — these are the most commonly missed:

**Typography:**
- [ ] Line height correct (especially multi-line text)
- [ ] Letter spacing applied (especially to all-caps labels)
- [ ] Font weight correct (400 vs 500 vs 600 look similar but matter)
- [ ] Text truncation working at max character count

**Spacing:**
- [ ] Padding inside components (not just between)
- [ ] Gap between list items
- [ ] Margin between sections
- [ ] Icon-to-text gap

**Color:**
- [ ] Exact token or hex value — not "close enough"
- [ ] Disabled state color distinct from enabled
- [ ] Focus ring color meeting 3:1 contrast against adjacent background

**States:**
- [ ] Hover state present on all interactive elements
- [ ] Focus ring visible — not removed with `outline: none` without replacement
- [ ] Disabled state non-interactive (pointer-events: none)
- [ ] Error state styled — not just default with error message below

**Responsive:**
- [ ] Component at mobile breakpoint
- [ ] Long text wrapping correctly at narrow widths
- [ ] Touch targets minimum 44×44px on mobile

---

## Quality Checklist

Before sharing the QA report:
- [ ] Every issue has a specific location (screen + component + state)
- [ ] Every issue has an expected vs. actual — not just "this is wrong"
- [ ] P1 and P2 issues have developer-ready fix descriptions
- [ ] What's correct is documented — prevents unnecessary re-implementation
- [ ] Release recommendation is explicit — not implied

---

## Phase Handoff Block

```
## Handoff: Deliver — Design QA
### Project: [PROJECT NAME]
### Feature/Component: [NAME]
### Date: [DATE]

---

### QA summary
- Build reviewed: [staging URL or build version]
- Total issues: [N]
- P1 Critical: [N] | P2 Major: [N] | P3 Minor: [N] | P4 Cosmetic: [N]
- Release recommendation: Ready / Not ready

### Must fix before release (P1 + P2)
1. [Issue title] — [location] — [fix]
2. [Issue title] — [location] — [fix]

### What was implemented correctly
- [Element/state] — matches spec ✓

### Open design decisions
- [Anything that requires a design call before it can be fixed]

### Next QA round
- After P1/P2 fixes are deployed — [estimated date]

---
*Attach QA report to the sprint ticket or Jira epic.*
*Re-review P1/P2 fixes before marking the ticket as done.*
```
