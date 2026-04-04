---
name: component-specs
phase: 06 — Deliver
description: Generate complete component specifications for developer handoff — every state, variant, spacing value, interaction behavior, and edge case — from a component description. The most time-consuming handoff activity. Use before any design handoff to ensure developers have everything they need to build correctly without back-and-forth. Claude generates the spec; the designer validates against the Figma file.
ai_leverage: high
claude_surface: chat
---

# Component Specifications

Generate complete developer-ready specs for every component — states, variants, spacing, interactions, accessibility — in the time it used to take to document one.

## When to Use

- Preparing a design handoff package for engineering
- A component is being built for the first time and needs a full spec
- Existing documentation is incomplete and causing implementation errors
- Onboarding a new developer who needs to understand an existing component
- A design system component is being formalized and needs canonical documentation

---

## What Good Component Specs Contain

Most component specs fail because they document the happy state and skip everything else. A complete spec includes:

**All visual states:** default, hover, focus, active, disabled, loading, error, success, empty
**All variants:** every size, color, and content permutation
**All interactive behaviors:** what happens on click, hover, focus — transitions, timing, feedback
**All content constraints:** character limits, minimum/maximum content, truncation behavior
**All edge cases:** what happens with long text, missing images, zero items, maximum items
**Accessibility requirements:** ARIA roles, keyboard navigation, screen reader behavior
**Spacing and layout:** margins, padding, alignment — ideally mapped to design tokens

---

## What Claude Needs to Start

1. **Component name and purpose** — what it's called and what it does
2. **Visual description** — what it looks like in its default state
3. **Known variants** — any size, color, or behavioral variations
4. **Interaction context** — where it appears and how users interact with it
5. **Design tokens** — if the team uses a token system, reference it

---

## Step 1: Generate the Base Spec

**Claude prompt:**
> "Generate a complete component specification for developer handoff.
>
> Component: [name]
> Purpose: [what it does — from the user's perspective]
> Context: [where it appears in the product]
> Visual description: [describe the default state in detail — layout, elements, relationships]
> Known variants: [list any size, color, or behavioral variations]
> Design tokens in use: [list token names if applicable, or 'standard spacing/color system']
>
> Generate a complete spec covering:
> 1. Component overview (purpose, context, when to use / not use)
> 2. Anatomy (every element that makes up the component — labeled)
> 3. All states (default, hover, focus, active, disabled, loading, error, success, empty — whichever apply)
> 4. All variants (document every permutation)
> 5. Spacing and layout (margins, padding, alignment — use token names if provided)
> 6. Content requirements (character limits, required vs optional elements, truncation rules)
> 7. Interaction behavior (what happens on every user action — with timing)
> 8. Edge cases (long content, missing content, zero state, maximum content)
> 9. Accessibility (ARIA role, keyboard navigation, screen reader behavior, focus management)
> 10. Do's and don'ts (common implementation errors to prevent)"

---

## Component Spec Template

```markdown
# Component: [Name]
**Version:** [N] | **Last updated:** [DATE] | **Owner:** [Designer name]

---

## Overview
**Purpose:** [What this component does — user-facing, one sentence]
**When to use:** [Specific conditions where this component is appropriate]
**When not to use:** [Alternative components to consider — and why]

---

## Anatomy

| # | Element | Required | Description |
|---|---|---|---|
| 1 | [Element name] | Required / Optional | [What it is and what it does] |
| 2 | [Element name] | Required / Optional | [Description] |

---

## States

### Default
[Description of the resting state — what the user sees before interacting]
Key values: background, border, text color, icon color

### Hover
[What changes on hover — be specific: color value, transition duration]
Transition: [property] [duration] [easing] — e.g. "background-color 150ms ease"

### Focus (keyboard)
[Focus ring description — must be visible and meet WCAG 3:1 minimum against adjacent colors]
Focus indicator: [description — outline style, offset, color]

### Active / Pressed
[What changes on press — typically slightly darker background, slight scale]

### Disabled
[Visual treatment — typically reduced opacity or color change]
Opacity: [value] | Cursor: not-allowed | Pointer events: none

### Loading
[Spinner, skeleton, or pulse animation description]
[Does content disappear? Does the component resize?]

### Error
[Error state visual — color changes, icon, error message placement]
Error message: [position, character limit, typography]

### Success
[Success confirmation visual — if applicable]

### Empty
[What appears when there's no content — especially important for list/data components]

---

## Variants

| Variant | Use case | Key differences from default |
|---|---|---|
| [Name] | [When to use this variant] | [What's different] |

---

## Spacing and Layout

| Property | Value | Token |
|---|---|---|
| Padding (top/bottom) | [Npx] | [token-name] |
| Padding (left/right) | [Npx] | [token-name] |
| Gap (between elements) | [Npx] | [token-name] |
| Border radius | [Npx] | [token-name] |
| Min width | [Npx or 'none'] | — |
| Max width | [Npx or '100%'] | — |

---

## Typography

| Element | Font family | Weight | Size | Line height | Token |
|---|---|---|---|---|---|
| [Label/Body/Caption] | [family] | [weight] | [size] | [height] | [token] |

---

## Content Requirements

| Element | Min | Max | Truncation | Required |
|---|---|---|---|---|
| [Label] | [N chars or 'none'] | [N chars] | [ellipsis / wrap / scale] | Yes / No |

---

## Interaction Behavior

| Trigger | Action | Result | Timing |
|---|---|---|---|
| Click / Tap | [What the user does] | [What happens] | [Duration if animated] |
| Keyboard Enter | [Action] | [Result] | — |
| Keyboard Escape | [Action] | [Result] | — |

---

## Edge Cases

| Scenario | Behavior |
|---|---|
| Very long text (label > max chars) | [How it truncates or wraps] |
| Missing optional element | [Layout adjusts / placeholder shown / element hidden] |
| Zero items in list | [Empty state shown — describe] |
| Maximum items | [What happens at the upper limit] |
| Slow network / loading | [Loading state shown for > N ms] |

---

## Accessibility

**ARIA role:** [role name — e.g. button, listbox, dialog]
**ARIA attributes:** [required aria-* attributes — e.g. aria-expanded, aria-label]
**Keyboard navigation:**
- Tab: [where focus goes]
- Enter/Space: [action triggered]
- Arrow keys: [navigation behavior if applicable]
- Escape: [dismiss/close behavior if applicable]

**Screen reader behavior:**
[What a screen reader announces when focused — label, state, hint]
Example: "Save button, disabled" / "Menu, collapsed, press Enter to expand"

**Focus management:**
[Where focus goes after interaction — e.g. after dialog closes, focus returns to trigger]

**Color contrast:**
[Minimum contrast ratios for text and interactive elements — 4.5:1 for normal text, 3:1 for large text and UI elements]

---

## Do's and Don'ts

| ✓ Do | ✗ Don't |
|---|---|
| [Correct usage] | [Common mistake] |
| [Correct usage] | [Common mistake] |

---

## Related Components
- [Component name] — [when to use instead]
- [Component name] — [how they work together]
```

---

## Step 2: Validate Against the Figma File

After generating the spec, validate it:

**Claude prompt:**
> "I've generated a component spec. Help me identify gaps by checking these categories:
>
> 1. **States** — are there any interactive states I haven't documented? (Consider: loading, skeleton, partial-load, refreshing states)
> 2. **Edge cases** — what content scenarios could break this layout? (Consider: RTL text, very long single words, emoji, special characters)
> 3. **Responsive behavior** — how does this component behave at different viewport widths?
> 4. **Dark mode** — if the product supports dark mode, what changes?
> 5. **Motion** — are there any animations or transitions not documented?
>
> Component spec: [paste]
> Product context: [any additional context — platform, dark mode support, etc.]"

---

## Step 3: Generate the Developer Q&A

Pre-empt the questions developers will ask by generating them in advance.

**Claude prompt:**
> "Based on this component spec, generate the 10 questions a developer would most likely ask during implementation. For each question, provide the answer if it's inferable from the spec, or flag it as 'needs designer input.'
>
> Component spec: [paste]"

---

## Quality Checklist

Before including in the handoff package:
- [ ] All interactive states documented — not just default and hover
- [ ] Every variant has its own section or clearly documented differences
- [ ] Spacing uses token names (not just pixel values) if tokens exist
- [ ] Content limits are defined for every text element
- [ ] Edge cases cover long text, missing content, zero state, max items
- [ ] Accessibility section includes ARIA role, keyboard nav, and screen reader behavior
- [ ] Focus state is explicitly documented — visible and WCAG-compliant
- [ ] Do's and Don'ts capture the mistakes this component commonly triggers

---

## Phase Handoff Block

```
## Handoff: Deliver — Component Specifications
### Project: [PROJECT NAME]
### Date: [DATE]

---

### Components documented
| Component | States | Variants | Accessibility | Status |
|---|---|---|---|---|
| [Name] | [N] | [N] | ✓ | Ready / Needs review |

### Known gaps
- [Component] — [what's missing — requires Figma review]

### Tokens referenced
- [Token name] — [value — for developer reference]

### Open questions for engineering
- [Question] — [context]

---
*Attach component spec document to the Figma file or Jira ticket.*
*Review with engineering in the handoff meeting before build begins.*
```
