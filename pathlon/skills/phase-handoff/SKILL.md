---
name: phase-handoff
phase: all
description: >
  Close a design phase with a Phase Handoff Block saved to the project, so the next phase and every
  later session start with full context. Use when a phase is finishing ("we're done with Define",
  "move to Ideate"), when saving progress mid-phase, when combining handoffs from parallel work,
  when writing the end-of-project retrospective, or when working in Claude Chat without project
  memory and the context has to be carried by hand.
claude_surface: chat-or-code
ai_leverage: high
---

# Phase Handoff

A handoff is how one phase hands its signal to the next: what was done, what was decided, what's still open, and what the next phase needs. In a Pathlon project it's saved to `.pathlon/` and loaded automatically when a session opens, so nobody re-briefs Claude. In Claude Chat, where there's no project memory, the same block is copied into the next conversation.

`/pathlon:transition` runs this end to end (write the handoff, confirm the phase change, start the next phase). Use this skill directly for partial saves, combined handoffs, the retrospective, or Chat.

## When to Use

- A phase is ending, or the designer wants to move to the next one
- A long session should save its progress before stopping (partial handoff)
- Several pieces of work in one phase need one combined handoff
- The project is shipping (retrospective)
- Working in Chat, or onboarding someone who doesn't have the project folder

---

## 1. Write the block

Use this structure every time; the heading format lets Pathlon and people find it:

```
## Phase Handoff Block — [Completed Phase] → [Next Phase]

**Completed:** [phase] · **Next:** [phase] · **Date:** [YYYY-MM-DD]

### What Was Done
[Outputs and the decisions behind them — the signal, not a transcript]

### Key Artifacts
[Each artifact and where it lives (file path, Figma link, doc)]

### Design System Status
[System and link, or "none"; gaps raised with its owner]

### Open Questions
- [What the next phase must resolve — one per line]

### Inputs for Next Phase
[What the next phase's agent needs to start]

### Recommended First Step
[One concrete next action]
```

### What each transition must carry forward

| From → To | Make sure the block includes |
|---|---|
| **Discover → Define** | Product, users, business goal; top themes and ranked pain points; anchoring quotes; personas; opportunity areas; what Define should frame first |
| **Define → Ideate** | The problem statement (HMW and JTBD); journey friction and the biggest opportunity moment; prioritized requirements (must / should / out of scope); constraints; where ideation should start |
| **Ideate → Prototype** | The selected concept, why, and the alternatives rejected; key design decisions; UI patterns chosen; the visual direction (design system in use, or the token set if one was defined); screens to build in priority order; the riskiest flows |
| **Prototype → Validate** | Fidelity; screens and interactions built; components (new, reused, with states); hypotheses to test with success criteria; riskiest assumptions; test focus |
| **Validate → Deliver** | Participants and completion rate; the most critical finding; issues by severity; what tested well; required changes; components ready to spec |

## 2. Save it

**In a Pathlon project:** save the block with `write_memory` (`memory_type: "handoff"`, `phase`: the phase being closed). Pathlon keeps it in `.pathlon/handoffs/` and shows its open questions whenever a session opens. Record the artifacts it names with `link_artifact`. Then ask the designer one yes/no before moving the phase (`set_phase` to complete the old one and start the next) — saving the handoff never changes the phase on its own.

**In Chat or without Pathlon:** give the designer the block to copy, and tell them to paste it as the first message of the next conversation (with the next phase's skill).

Review before saving — the block is the next phase's starting point:
- Is the single most important finding or decision captured?
- Are constraints specific (real platform, timeline, business limits)?
- Is the next step concrete?

## Partial, combined, and final handoffs

- **Partial:** mid-phase, save the block with `[PARTIAL]` in the heading and say what's done and what isn't. A later full handoff for the phase replaces it as the latest.
- **Combined:** when parallel work closes one phase (e.g. research synthesis plus competitive analysis), write one block with a short section per source and a one-to-two sentence synthesis — not separate blocks.
- **Skipped phases:** if the project jumps a phase, the handoff says what's known and flags what's assumed because that phase didn't happen.
- **Retrospective:** when the project ships, save a final handoff for phase 06 covering the insight that drove the work, the problem statement, the concept chosen and why, the key test finding, major decisions, what was left out, and what to pick up in v2.

## Picking a project back up

**In a Pathlon project**, nothing to paste: the latest handoff and its open questions load when the session opens; ask "where does this project stand?" for more. **Without Pathlon**, paste the handoffs so far as the first message and say which phase you're in.

---

## Quality Checklist

- [ ] The block follows the heading and section structure above
- [ ] The most important finding or decision is captured, with evidence
- [ ] Open questions are listed one per line
- [ ] Every artifact named has a location (and is linked in Pathlon)
- [ ] Saved with `write_memory` (handoff) — or handed to the designer to paste, in Chat
- [ ] The phase changed only after the designer said yes
