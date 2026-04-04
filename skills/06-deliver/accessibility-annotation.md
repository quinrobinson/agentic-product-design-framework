---
name: accessibility-annotation
phase: 06 — Deliver
description: Generate WCAG 2.1 AA accessibility annotations for design handoff — ARIA roles, keyboard navigation, focus order, screen reader behavior, and contrast requirements — from component and screen descriptions. Use before handoff to ensure developers have the accessibility specifications they need to build inclusively. Claude generates the annotation content; the designer validates and places in Figma.
ai_leverage: high
claude_surface: chat
---

# Accessibility Annotation

Generate the accessibility specifications developers need to build inclusively — ARIA roles, keyboard navigation, focus management, and screen reader behavior — before the feature ships.

## When to Use

- Preparing a design handoff and accessibility specifications don't exist yet
- A component is being built for the first time and needs complete a11y docs
- A previous release had accessibility issues and the team wants a more systematic approach
- An accessibility audit found gaps and the design needs to specify the fixes
- Preparing for WCAG 2.1 AA compliance review

---

## Why Accessibility Annotations Belong in Handoff

Accessibility failures in production are almost always handoff failures — not engineering failures. If the handoff doesn't specify focus order, keyboard navigation, and ARIA roles, the developer makes their best guess. Their best guess is often wrong.

Accessibility annotations are the specification that prevents this. They're not extra work — they're the spec for the 26% of people who use assistive technology to use your product.

---

## What Claude Needs to Start

1. **Component or screen description** — what it contains and how it behaves
2. **Interactive elements** — every element the user can interact with
3. **Component type** — is it a button, dialog, form, navigation, list, etc.
4. **Dynamic behavior** — anything that changes without a page load
5. **Existing ARIA patterns** — if the team has existing conventions

---

## The WCAG 2.1 AA Requirements Claude Works From

**Perceivable:**
- 1.4.3: Color contrast — 4.5:1 for normal text, 3:1 for large text and UI components
- 1.4.4: Text resize — content usable up to 200% zoom without loss of content
- 1.4.11: Non-text contrast — 3:1 for UI component boundaries and state indicators

**Operable:**
- 2.1.1: All functionality available via keyboard
- 2.4.3: Focus order logical and consistent with reading order
- 2.4.7: Focus visible — keyboard focus indicator always visible

**Understandable:**
- 3.2.1: No unexpected context changes on focus
- 3.3.1: Error identification — errors are identified and described in text

**Robust:**
- 4.1.2: Name, role, value — all UI components have accessible names and roles
- 4.1.3: Status messages communicated to assistive technology without focus change

---

## Step 1: Generate Component ARIA Annotations

**Claude prompt:**
> "Generate complete ARIA and accessibility annotations for this component.
>
> Component: [name]
> Type: [button / input / select / dialog / navigation / list / table / form / custom]
> Description: [what it does and what it contains]
> Interactive behavior: [what happens on interaction]
> States: [default, expanded, collapsed, selected, disabled, error — whichever apply]
>
> Generate:
>
> 1. **ARIA role** — the correct role for this component
> 2. **ARIA attributes** — all required and recommended aria-* attributes with example values
> 3. **Accessible name** — how the component gets its accessible name (visible label, aria-label, or aria-labelledby)
> 4. **Keyboard navigation** — Tab, Enter, Space, Arrow keys, Escape behavior
> 5. **Focus management** — where focus goes before, during, and after interaction
> 6. **Screen reader announcement** — what a screen reader announces on focus and on interaction
> 7. **State changes** — how state changes are communicated to assistive technology"

---

## Step 2: Generate Screen-Level Accessibility Annotations

**Claude prompt:**
> "Generate screen-level accessibility annotations for this screen.
>
> Screen: [name and purpose]
> Page title: [what the browser tab and screen reader reads]
> Landmark regions: [header, main, nav, aside, footer — describe what's in each]
> Heading structure: [describe the heading hierarchy — H1, H2, H3]
> Interactive elements: [list all buttons, links, inputs, and controls]
> Dynamic regions: [anything that updates without a page reload]
>
> Generate:
>
> 1. **Landmark structure** — ARIA landmark roles and their labels
> 2. **Heading hierarchy** — the correct H1–H3 structure for this screen
> 3. **Focus order** — the logical tab order through interactive elements (numbered list)
> 4. **Skip navigation** — if the page has repeated navigation, where the skip link goes
> 5. **Dynamic content** — ARIA live regions for content that updates automatically
> 6. **Error handling** — how form errors are communicated to screen reader users"

---

## Common Component Patterns

### Button
```
Role: button
Name: [visible label text] — if icon-only, add aria-label="[action]"
States:
  - aria-disabled="true" when disabled (not HTML disabled — preserves focusability)
  - aria-pressed="true/false" for toggle buttons
  - aria-expanded="true/false" when controlling a collapsible section
Keyboard: Enter or Space activates
Screen reader: "[Label], button" / "[Label], button, pressed" / "[Label], button, expanded"
```

### Input / Form Field
```
Role: textbox (native input)
Name: associated <label> element (preferred) or aria-label
Required: aria-required="true"
Error state:
  - aria-invalid="true" on the input
  - aria-describedby="[error-message-id]" linking to the error message
  - Error message has role="alert" or is in a live region
Screen reader: "[Label], edit field, required" / "[Label], edit field, invalid entry, [error message]"
```

### Dialog / Modal
```
Role: dialog
Name: aria-labelledby="[heading-id]" — pointing to the dialog's visible heading
aria-modal="true"
Focus management:
  - On open: focus moves to first focusable element inside (or the dialog itself)
  - Focus trapped inside while open (Tab cycles through dialog elements only)
  - On close: focus returns to the trigger that opened it
Keyboard: Escape closes
Screen reader: "[Dialog title], dialog" announced on open
```

### Navigation
```
Role: navigation (landmark)
Name: aria-label="[Navigation name]" — distinguish from other nav landmarks
Current page: aria-current="page" on the active link
Screen reader: "[Navigation name], navigation" on entry
```

### Accordion
```
Role: button (on the trigger) + region (on the panel)
Name: Visible heading text
States:
  - aria-expanded="true/false" on the trigger
  - aria-controls="[panel-id]" on the trigger
  - Panel: id matching the controls value, role="region", aria-labelledby="[trigger-id]"
Keyboard: Enter/Space toggles
Screen reader: "[Title], button, expanded/collapsed"
```

### Tab Panel
```
Role: tablist (container) + tab (each tab) + tabpanel (each panel)
States:
  - aria-selected="true/false" on tabs
  - aria-controls="[panel-id]" on tabs
  - aria-labelledby="[tab-id]" on panels
Keyboard: Arrow keys navigate between tabs; Enter/Space selects
Focus management: Focus follows selected tab; panel content in reading order after tab row
```

---

## Step 3: Generate Contrast Requirements

**Claude prompt:**
> "Generate contrast requirements for this component's color combinations.
>
> Background colors: [list]
> Text colors: [list]
> UI element colors (borders, icons, focus rings): [list]
>
> For each combination, specify:
> - The WCAG requirement (4.5:1 for normal text, 3:1 for large text/UI components)
> - Whether the combination passes or needs adjustment
> - If failing: suggest a passing alternative that stays within the design system palette"

---

## Annotation Format for Figma

When placing in Figma, use a consistent badge system:

```
♿ [Component/element name]
Role: [ARIA role]
Name: [How it gets its accessible name]
States: [Key ARIA state attributes]
Keys: [Tab / Enter / Space / Arrows / Escape]
SR: "[What the screen reader announces]"
```

---

## Quality Checklist

Before handoff:
- [ ] Every interactive element has an accessible name (visible label or aria-label)
- [ ] All form inputs are associated with a label (not just placeholder text)
- [ ] Focus order annotation matches the visual reading order
- [ ] All state changes are documented (expanded, selected, invalid)
- [ ] Error states specify how errors are communicated to screen readers
- [ ] Dialogs/modals specify focus trapping and return focus behavior
- [ ] Dynamic content regions have ARIA live region specifications
- [ ] Color contrast requirements documented for all text and UI element combinations
- [ ] Keyboard navigation specified for every interactive component

---

## Phase Handoff Block

```
## Handoff: Deliver — Accessibility Annotations
### Project: [PROJECT NAME]
### Date: [DATE]
### WCAG Target: 2.1 AA

---

### Annotation coverage
- Components annotated: [N]
- Screens annotated: [N]
- Known gaps: [components or screens not yet annotated]

### Key accessibility patterns used
- [Pattern name] — [components that use it]

### Contrast review
- All color combinations reviewed: Yes / No / Partial
- Combinations needing attention: [list any failing combinations]

### Keyboard navigation notes
- [Any non-standard keyboard patterns that need implementation attention]

### Open questions for engineering
- [Any a11y implementation question that needs engineering input]

---
*Share with engineering lead at handoff.*
*Include in design QA checklist — verify focus order and keyboard navigation in staging.*
*Schedule accessibility review before launch if this is a new complex interaction pattern.*
```
