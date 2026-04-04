---
name: handoff-annotation
phase: 06 — Deliver
description: Generate screen-by-screen annotation text for developer handoff — behavior notes, edge case callouts, interaction explanations, and open questions — that prevent implementation errors before they happen. Use before any design handoff to annotate prototype screens with the information developers need that isn't visible in the static design. Claude generates the annotation content; the designer places it in Figma.
ai_leverage: high
claude_surface: chat
---

# Handoff Annotation

Write the notes developers need to build correctly — before they ask, before they guess, before they ship something wrong.

## When to Use

- Preparing a Figma handoff for engineering
- A complex interaction or behavior isn't self-evident from the static design
- Edge cases and error states need to be called out explicitly
- The team has had previous handoffs where developers implemented things incorrectly because the design didn't explain the intent
- A screen or component has conditional behavior that depends on data or user state

---

## What Annotations Are — and What They're Not

**Annotations are:** Notes added to handoff screens that explain behavior, intent, and edge cases that aren't visible in the static mockup. They answer the developer's unasked questions.

**Annotations are not:** Specs (those are in the component spec document). They're not visual design descriptions — developers can see what the design looks like. They explain *why* and *what happens*.

**The three questions annotations answer:**
1. What happens when the user interacts with this? (behavior not visible in a static design)
2. What happens when the data or state is unusual? (edge cases)
3. Why is this designed this way? (decisions that might otherwise be "corrected")

---

## What Claude Needs to Start

1. **Screen description** — what the screen contains and what the user can do on it
2. **Interactions** — what happens on click, hover, tap, swipe
3. **Conditional states** — what changes based on user state, data, or permissions
4. **Known edge cases** — unusual content, empty states, loading behavior
5. **Design decisions** — anything that might seem wrong but is intentional

---

## Step 1: Generate Behavior Annotations

**Claude prompt:**
> "Generate behavior annotations for this screen. For each interactive element, produce an annotation that explains what happens — not what it looks like.
>
> Screen: [name and purpose]
> User's goal on this screen: [what they're trying to accomplish]
>
> Interactive elements:
> [List each button, input, link, and interactive component — with what it does]
>
> For each element, write an annotation in this format:
>
> **[Element name]**
> On [action]: [What happens — specific, including transition behavior if animated]
> If [condition]: [Different behavior — conditional states]
> Note: [Any implementation consideration the developer should know]
>
> Keep each annotation to 2–4 sentences. No visual description — developers can see the design."

---

## Step 2: Generate Edge Case Annotations

**Claude prompt:**
> "Generate edge case annotations for this screen. For each area that could receive unusual content or data, explain what should happen.
>
> Screen: [name]
> Data sources: [what populates this screen — API, user input, etc.]
>
> Edge cases to annotate:
> - Long content: [what could be longer than expected]
> - Missing content: [what might be absent or null]
> - Loading state: [what shows while data loads]
> - Error state: [what shows if data fails to load]
> - Empty state: [what shows if there's no content yet]
> - Permission state: [what changes based on user role or permissions]
>
> For each edge case, write:
> **[Edge case name]**
> [What should happen — specific behavior, not visual description]"

---

## Step 3: Generate Decision Annotations

**Claude prompt:**
> "Generate design decision annotations — explanations for design choices that might seem counterintuitive or that developers might be tempted to 'fix.'
>
> Screen: [name]
>
> Decisions to annotate:
> [List each design choice that might raise a developer question — e.g. 'Why is this button disabled?', 'Why is this text truncated here instead of wrapping?', 'Why does this not have a confirmation dialog?']
>
> For each decision, write:
> **[Decision description — what might seem odd]**
> Reason: [Why it's designed this way — UX rationale in 1–2 sentences]
> Please don't change: [What specifically to preserve]"

---

## Annotation Format for Figma

When placing annotations in Figma, use a consistent format:

```
[Number] [Category icon]
[Short title]
[Annotation body — 2–4 sentences max]
```

**Category icons (for visual scanning):**
- 🔵 Behavior — what happens on interaction
- 🟡 Edge case — unusual content or state handling
- 🔴 Important — must not be changed or misinterpreted
- ⚪ Note — additional context or rationale

**Example annotations:**

```
01 🔵 Behavior
Primary CTA — loading state
On tap, the button enters a loading state immediately (spinner replaces label, button disabled).
If the API call fails, the button returns to default state with the error shown inline below.
Do not add a separate loading overlay — the button state is sufficient feedback.

02 🟡 Edge case
User name — truncation
Display name truncates at 32 characters with an ellipsis. Full name shown on hover (tooltip) and in the profile drawer.
Names shorter than 8 characters should not be padded — left-aligned, no minimum width.

03 🔴 Important
Search results — empty state
The empty state illustration appears when zero results are returned. Do NOT show this for loading states.
The 'Clear filters' CTA should only appear if the user has applied at least one filter.
```

---

## Screen Annotation Checklist

For each screen in the handoff package:
- [ ] Every interactive element has a behavior annotation
- [ ] All loading states documented (skeleton, spinner, or inline indicator — specify which)
- [ ] All error states documented (inline, toast, full-page — specify which)
- [ ] All empty states documented (first-use vs. filtered-empty vs. cleared)
- [ ] Conditional content documented (what changes based on user role, data, or permissions)
- [ ] Long content behavior documented (truncation, wrapping, or scrolling)
- [ ] Design decisions that might look wrong are explained

---

## Phase Handoff Block

```
## Handoff: Deliver — Handoff Annotation
### Project: [PROJECT NAME]
### Date: [DATE]

---

### Annotation summary
- Screens annotated: [N]
- Behavior annotations: [N]
- Edge case annotations: [N]
- Decision annotations: [N]

### Screens requiring special attention
- [Screen name] — [what's complex about it]

### Open questions for engineering
- [Question that came up during annotation — needs engineering input]

### What's not annotated (and why)
- [Screen name] — [straightforward — no annotations needed]

---
*Annotations placed in Figma as sticky notes on the relevant screens.*
*Engineering should review annotations before starting implementation.*
*Flag any annotation that's unclear — ambiguity at handoff is cheaper than ambiguity at QA.*
```
