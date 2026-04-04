---
name: heuristic-review
phase: 04 — Prototype
description: Evaluate a prototype or existing product against Nielsen's 10 usability heuristics before user testing — surfacing usability issues systematically when they're cheapest to fix. Use after a prototype is built and before scheduling user tests. Claude applies heuristics with specific, actionable feedback rather than generic observations. Depends on outputs from prototype-scoping.md. Outputs feed into test-script.md and the next prototype iteration.
ai_leverage: high
claude_surface: chat
---

# Heuristic Self-Review

Evaluate your prototype against proven usability standards — before putting it in front of real users.

## When to Use

- After building a prototype, before scheduling usability tests
- When you want to catch obvious issues without spending user testing budget
- When reviewing a competitor's product systematically
- When auditing an existing product for a redesign project
- As a structured alternative to informal design critique

---

## Why Heuristic Review Before User Testing

User testing is expensive (recruiting, scheduling, sessions) and slow. Heuristic review is fast and free. It won't catch everything — but it reliably catches the issues that make user testing results harder to interpret because participants keep getting stuck on the same preventable problems.

Run heuristic review first. Fix the obvious issues. Then test with users to catch the non-obvious ones.

---

## Nielsen's 10 Heuristics

| # | Heuristic | Core question |
|---|---|---|
| 1 | **Visibility of system status** | Does the system always keep users informed of what's happening? |
| 2 | **Match between system and real world** | Does the system speak the user's language? |
| 3 | **User control and freedom** | Can users undo and redo actions they didn't intend? |
| 4 | **Consistency and standards** | Are conventions followed consistently throughout? |
| 5 | **Error prevention** | Does the design prevent problems before they occur? |
| 6 | **Recognition over recall** | Are options visible rather than requiring users to remember them? |
| 7 | **Flexibility and efficiency of use** | Can expert users use shortcuts the novice doesn't see? |
| 8 | **Aesthetic and minimalist design** | Does every element earn its place on the screen? |
| 9 | **Help users recognize, diagnose, recover from errors** | Are error messages written in plain language with recovery steps? |
| 10 | **Help and documentation** | If help is needed, is it findable and actionable? |

---

## What Claude Needs to Start

1. **Prototype description** — a screen-by-screen walkthrough of the prototype, OR screenshots with descriptions
2. **Primary persona** — who the prototype is designed for
3. **Key flow** — which user flow to evaluate
4. **Prototype questions** — what the prototype is trying to answer (from `prototype-scoping.md`)

**Note:** This skill works best when Claude has detailed screen descriptions. For each screen, describe: what's visible, what actions are available, what labels are used, and what happens on each action.

---

## Step 1: Screen-by-Screen Description

If Claude can't see the prototype, describe it systematically.

**Claude prompt:**
> "I'll describe my prototype screen by screen. For each screen, I'll tell you:
> - Screen name and purpose
> - What's visible on the screen
> - What actions are available (buttons, links, inputs)
> - What labels and copy are used
> - What happens when each action is taken
>
> After I describe all screens, evaluate the prototype against all 10 Nielsen heuristics.
>
> Primary persona: [paste]
> Flow being evaluated: [name + purpose]
>
> Screen 1: [describe]"

---

## Step 2: Full Heuristic Evaluation

**Claude prompt:**
> "Evaluate this prototype against all 10 Nielsen usability heuristics.
>
> For each heuristic:
> 1. **Rating:** Pass / Partial / Fail
> 2. **Specific issues found:** For each issue — describe exactly what's wrong, which screen it's on, and why it's a problem for [persona]
> 3. **Severity:** Critical (blocks task completion) / Major (significant friction) / Minor (noticeable but manageable)
> 4. **Recommendation:** Specific fix — not 'improve this' but 'change X to Y because Z'
>
> Be specific — reference exact labels, screens, and interactions. Generic observations ('the UI is inconsistent') are not useful. Specific observations ('the primary CTA says Save on screens 1–3 but Submit on screen 4, creating terminology inconsistency') are.
>
> Prototype description: [paste all screens]
> Persona: [paste]
> Key flow: [paste]"

---

## Step 3: Severity-Ranked Issue List

After the full evaluation, extract the prioritized action list.

**Claude prompt:**
> "From the heuristic evaluation above, generate a severity-ranked issue list.
>
> Format:
> | Priority | Heuristic | Screen | Issue | Fix |
> |---|---|---|---|---|
>
> Sort by severity (Critical → Major → Minor), then by screen order.
>
> Then identify:
> - **Must fix before testing** — Critical issues that will invalidate test results
> - **Fix if time allows** — Major issues worth addressing before testing
> - **Backlog** — Minor issues to address in the next iteration
>
> Evaluation: [paste]"

---

## Step 4: Evaluate Against Persona Specifically

The 10 heuristics are universal — but some issues matter more for specific personas.

**Claude prompt:**
> "Review the heuristic issues found and evaluate each through the lens of [persona name] specifically.
>
> For each issue:
> - How likely is [persona] to encounter this in their real context?
> - How much will this friction affect their confidence or willingness to continue?
> - Is there anything specific about [persona]'s experience level, context, or mental model that makes this worse or less significant?
>
> Then rerank the issue list from [persona]'s perspective — which issues matter most for this specific user?
>
> Issues found: [paste ranked list]
> Persona: [paste — especially context, experience level, stress level during use]"

---

## Heuristic Review Output Template

```
# Heuristic Review: [Prototype Name]
### Reviewer: Claude (assisted) | Date: [DATE] | Persona: [Name]

---

## Summary
- Heuristics evaluated: 10
- Pass: [N] | Partial: [N] | Fail: [N]
- Critical issues: [N]
- Major issues: [N]
- Minor issues: [N]
- Must fix before testing: [N]

---

## H1 — Visibility of System Status
**Rating:** Pass / Partial / Fail
**Issues:**
- [Screen]: [specific issue] — Severity: [level]
  Fix: [specific recommendation]

## H2 — Match Between System and Real World
[Repeat structure]

[Continue for all 10]

---

## Priority Fix List (before testing)

| Priority | Screen | Issue | Fix | Effort |
|---|---|---|---|---|
| 1 | [screen] | [issue] | [fix] | [S/M/L] |

---

## Backlog (next iteration)
- [Issue] — [screen] — [fix]

---

## What to watch for in usability testing
[Issues the heuristic review found that the test should specifically probe]
```

---

## Quality Checklist

Before scheduling usability tests:
- [ ] All 10 heuristics evaluated — not just the ones that seemed relevant
- [ ] Every issue has a specific screen reference — not vague
- [ ] Every issue has a specific fix — not generic advice
- [ ] Severity rated consistently — critical means blocks task completion
- [ ] Persona-specific rerank done — generic severity ≠ severity for this user
- [ ] Must-fix issues addressed before testing — or documented as known risks
- [ ] Test script updated to specifically probe issues found in review

---

## Phase Handoff Block

```
## Handoff: Prototype — Heuristic Review
### Project: [PROJECT NAME]
### Date: [DATE]

---

### Summary
- Critical issues: [N] — [fixed before testing: Y/N]
- Major issues: [N] — [fixed: N, logged for next iteration]
- Minor issues: [N] — backlogged

### Must-fix issues (resolved before testing)
1. [Issue] — [screen] — [fix applied]
2. [Issue] — [screen] — [fix applied]

### Known issues entering testing (not fixed)
1. [Issue] — [why not fixed] — [risk to test validity]

### What to watch in usability testing
[Specific things to observe that the heuristic review flagged as uncertain]

---
*Paste this block when opening Test Script drafting.*
*The "what to watch" section should directly inform test tasks and observation focus.*
```
