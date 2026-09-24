---
name: design-system
phase: all
description: >
  Work from the design system the team already has, in Figma (library variables, styles, and
  components, read through the Figma MCP) or in Claude Design, instead of building one inside
  Pathlon. Use when starting UI work on a project, when a design, prototype, or implementation
  needs checking against the system, when a screen needs components the system lacks, or as a
  health check before handoff. Pathlon reads and checks the system; changes to the system are
  proposed back to wherever it lives.
claude_surface: chat-or-code
ai_leverage: high
---

# Design System

Pathlon doesn't build design systems. The system lives where the team designs: a Figma library or Claude Design. This skill finds it, reads it, maps the work to it, checks the work against it, and sends anything missing back to the system's owner as a proposal. Run it before other UI skills (prototyping, component-specs, visual-design-execution, design-qa) so their work references the system it identifies.

## When to Use

- At the start of UI work on a project: find and summarize the system before anyone designs screens
- When a design, prototype, or implementation needs checking against the system
- When a flow needs components or tokens the system doesn't have
- Before handoff, as a system health check
- When the Systems Designer or Design Engineer agent is invoked

---

## Step 1 — Locate the system

Ask where the system lives, and record the answer in Pathlon so no one asks again
(`link_artifact` once Pathlon rewire step 5.4 ships; until then `write_memory` with `memory_type: "decision"`).

| Source | What to get |
|---|---|
| **Figma library** | The library file URL (not a product file that only uses the library) |
| **Claude Design** | The design system the team maintains in Claude Design. Work from what it holds — tokens, components, usage guidance — as the source of truth, the same way you would a Figma library |
| **Code** | The token file or component package, if the coded system is the source of truth |
| **None** | Say so plainly. Don't generate a system inside Pathlon. Recommend creating it in Figma or Claude Design first; if work must proceed, use the platform's native system (Material 3 on Android, Apple HIG on iOS) and record that as a decision |

## Step 2 — Read the system

**Claude Design:** there's no direct tool access from Claude Code or Chat. Ask the designer to export, hand off, or paste what the system holds (tokens, components, usage guidance), and build the summary below from that.

**Figma library:** use the Figma MCP (see `figma-playbook`):
- `get_variable_defs` — variable collections, modes, and values
- `search_design_system` — published components, styles, and variables
- `get_design_context` / `get_metadata` — structure and properties of specific frames or components

Produce a **system summary** and save it to Pathlon (`write_memory`, `memory_type: "context"`) so other agents don't re-read the library:

```
Design system summary — [system name] ([source + link])
Modes:        [light / dark / brand modes]
Color roles:  [semantic roles, e.g. surface, on-surface, primary, error]
Type scale:   [styles and sizes]
Spacing:      [scale]
Shape/effects:[radius scale, elevation levels]
Components:   [component → variants → states], one line each
Conventions:  [naming pattern, layering, anything unusual]
Gaps noticed: [anything obviously missing]
```

## Step 3 — Map the work to the system

For the screens or flows in scope, map every UI element to what the system provides:

| Screen / element | System component + variant | Tokens used | Status |
|---|---|---|---|
| [Checkout / Pay button] | Button / Filled / Large | color/primary, space/400 | ✅ exists |
| [Checkout / Saved card row] | — | — | ❌ gap |
| [Settings / Toggle] | Switch | — | ⚠️ exists, missing Disabled state |

Use the actual screen and component names. Reuse beats invention: if a close match exists, use it and note the difference rather than proposing a new component.

## Step 4 — Check work against the system

For a design, prototype, or implementation, check:

- **Tokens, not raw values** — fills, text, spacing, and radius reference system variables
- **Instances, not copies** — components are library instances, not detached or rebuilt
- **States** — interactive components cover default, hover, focus, active, disabled; data components cover loading, empty, error, populated
- **Accessibility** — text contrast ≥ 4.5:1 (3:1 for large text), touch targets ≥ 44pt / 48dp, visible focus, errors not signaled by color alone
- **Naming** — new frames and layers follow the system's conventions

Rate each finding Critical (blocks handoff), Major (visible inconsistency), or Minor (polish).

## Step 5 — System health check (before handoff, optional)

When the question is "is the system itself ready?", score it:

| Domain | Checks |
|---|---|
| Foundations | Semantic token naming; reference → system → component layering; light/dark (or brand) modes |
| Typography | Complete scale (display → label); 2–3 families; consistent naming |
| Components | Core set present (button, inputs, selection controls, navigation, cards/lists, overlays, feedback); full state coverage |
| Accessibility | Contrast of primary color pairs; touch targets; focus states |
| Documentation | Usage guidance and anatomy for core components; variant/property matrix |

Score each check ✅ complete (1.0), ⚠️ partial (0.5), ❌ missing (0). Overall ≥ 85% is ready for handoff; 60–84% needs work; below 60% means the system needs attention from its owner before the project leans on it. Material 3, IBM Carbon, Atlassian, and Apple HIG are useful comparison points for what "complete" means, not templates to copy.

## Step 6 — Send gaps back to the system's owner

Pathlon doesn't create system components or tokens on its own. For each gap, write a proposal the system owner can act on:

```
# Design system gap report — [project] — [date]
System: [name + link]

## Critical (blocks this project)
1. [Gap] — found in [screen/flow]
   Proposal: [component or token name in the system's convention, variants, states, tokens it uses]
   Owner: [who maintains the system]

## Major
...

## Minor
...
```

If the designer asks you to add something to a Figma library directly, do it in the library file through the Figma MCP (`figma-playbook`), follow the system's own naming and layering, and log it with `log_figma_activity`. Save the gap report to Pathlon.

---

## Quality Checklist

- [ ] The system's source is identified and recorded in Pathlon
- [ ] A system summary exists in Pathlon before any screen work
- [ ] Every element in scope maps to a system component or is listed as a gap
- [ ] Conformance findings have severities and specific locations
- [ ] No tokens or components were invented locally; gaps are proposals to the owner
- [ ] Contrast and touch-target checks were run, not assumed

## Phase Handoff Note

Include in any handoff that touches UI: the system name and link, where the summary lives in Pathlon, open gaps with their owners, and any decision to proceed without a system.
