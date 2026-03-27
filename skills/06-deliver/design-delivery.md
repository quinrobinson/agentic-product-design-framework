---
name: design-delivery
phase: 06 — Deliver
description: Create component specifications, developer handoff documentation, design decision records, and release notes. Use this skill when preparing designs for engineering handoff, writing component specs, documenting design decisions for future reference, creating QA checklists, or writing release notes. Also triggers for design system documentation, changelog creation, annotation guides, or when the user mentions shipping, handoff, specs, or documentation.
ai_leverage: high
---

# Design Delivery & Documentation

Ship designs with the precision and documentation that ensures what gets built matches what was designed.

## When to Use

- Preparing designs for developer handoff
- Writing component specifications
- Documenting design decisions and their rationale
- Creating design QA checklists
- Writing release notes or changelogs
- Building design system documentation

## Component Specification

### Full Component Spec

Write specs so a developer can build the component without asking questions:

```
# Component Spec: [Component Name]

## Overview
- Purpose: [What this component does]
- Context: [Where it's used in the product]
- Related components: [Components it's used with]

## API / Props

| Prop      | Type                        | Default   | Required | Description                    |
|-----------|-----------------------------|-----------|----------|--------------------------------|
| variant   | "primary" | "secondary"     | "primary" | No       | Visual style variant           |
| size      | "sm" | "md" | "lg"          | "md"      | No       | Size of the component          |
| disabled  | boolean                     | false     | No       | Prevents interaction           |
| onClick   | () => void                  | —         | Yes      | Handler for click event        |
| children  | ReactNode                   | —         | Yes      | Content to display             |

## Visual States

### Default
[Description of the resting state]

### Hover
- [What changes — background, border, shadow, cursor]
- Transition: [Duration, easing]

### Active / Pressed
- [What changes on mouse down]

### Focus
- [Focus ring style — color, offset, width]
- Must be visible for keyboard navigation

### Disabled
- [Opacity, cursor, pointer-events]
- [What interactions are prevented]

### Loading
- [What replaces the content — spinner, skeleton, shimmer]
- [Is it still interactive during loading?]

### Error
- [Visual treatment — border color, icon, message]
- [How the error clears]

## Responsive Behavior

| Breakpoint   | Behavior                              |
|-------------|---------------------------------------|
| < 375px     | [Full width, stacked layout]          |
| 375-768px   | [Mobile behavior]                     |
| 768-1280px  | [Tablet behavior]                     |
| > 1280px    | [Desktop behavior]                    |

## Accessibility

### Keyboard
- Tab: [Focus behavior]
- Enter/Space: [Activation]
- Escape: [Dismiss/cancel if applicable]

### Screen Reader
- Role: [ARIA role]
- Label: [How it announces]
- State changes: [What aria-live announcements happen]

### ARIA Attributes
- aria-label: [When needed]
- aria-describedby: [For additional context]
- aria-disabled: [For disabled state]

## Content Guidelines

| Element       | Min | Max | Truncation   |
|--------------|-----|-----|--------------|
| Label         | 1   | 30  | Ellipsis     |
| Description   | 0   | 120 | Line clamp 2 |
| Icon          | —   | —   | N/A          |

## Usage Examples

### Do
- [Correct usage with explanation]
- [Another correct usage]

### Don't
- [Incorrect usage with explanation of why]
- [Another anti-pattern]

## Edge Cases
- [What if content is empty?]
- [What if content exceeds maximum?]
- [What if component is inside a scroll container?]
- [What if multiple instances are on the same page?]
```

## Developer Handoff Package

### Handoff Checklist

```
# Handoff: [Feature/Screen Name]

## Design Files
- [ ] Figma link: [URL]
- [ ] All screens finalized (no "WIP" frames)
- [ ] Components linked to design system
- [ ] Responsive variants included

## Specifications
- [ ] Component specs written for new/modified components
- [ ] Interaction specs for animations and transitions
- [ ] Copy is finalized and approved
- [ ] All states documented (default, hover, focus, disabled, error, loading, empty, success)

## Assets
- [ ] Icons exported (SVG, multiple sizes if needed)
- [ ] Images optimized and exported
- [ ] Custom fonts/typefaces listed with licenses
- [ ] Favicon and meta images

## Annotations
- [ ] Spacing values annotated (using design system tokens)
- [ ] Color values referenced by token name, not hex
- [ ] Typography uses type scale names, not pixel values
- [ ] Breakpoint behavior noted

## Accessibility
- [ ] Heading hierarchy documented
- [ ] Tab order specified
- [ ] Alt text written for all images
- [ ] ARIA requirements noted
- [ ] Color contrast verified

## Implementation Notes
- [ ] Known technical constraints documented
- [ ] API data mapping (which fields map to which UI elements)
- [ ] Error handling requirements
- [ ] Performance considerations (lazy loading, virtualization)
- [ ] Analytics events to track

## Review
- [ ] Design review completed with eng lead
- [ ] Questions list resolved
- [ ] Acceptance criteria defined
```

## Design Decision Records

Document significant decisions so future team members understand *why*, not just *what*.

```
# DDR-[NNN]: [Decision Title]

## Status
Accepted | Superseded by DDR-[NNN] | Deprecated

## Date
[YYYY-MM-DD]

## Context
[What prompted this decision? What problem were we solving?
Include enough background that someone unfamiliar can understand.]

## Decision
[What we decided to do, stated clearly.]

## Options Considered

### Option A: [Name]
- Description: [What this approach would look like]
- Pros: [Benefits]
- Cons: [Drawbacks]

### Option B: [Name] ← Selected
- Description: [What this approach would look like]
- Pros: [Benefits]
- Cons: [Drawbacks]

### Option C: [Name]
- Description: [What this approach would look like]
- Pros: [Benefits]
- Cons: [Drawbacks]

## Rationale
[Why we chose Option B over the others.
What tradeoffs we accepted and why.]

## Consequences
- [What this decision enables]
- [What this decision constrains]
- [What risks we're accepting]

## Related Decisions
- DDR-[NNN]: [Related decision]
- [Link to relevant research or test results]
```

### When to Write a DDR

Write one whenever:
- You choose between meaningful alternatives (not trivial styling choices)
- A stakeholder might later ask "why did we do it this way?"
- The decision constrains future design options
- You're reversing or modifying a previous decision

## Release Notes

### Internal Changelog

```
# Changelog: [Version/Sprint]
Date: [YYYY-MM-DD]

## New
- [Feature]: [What it does and why we built it]

## Improved
- [Feature]: [What changed and the user impact]

## Fixed
- [Bug]: [What was broken and how it's resolved]

## Design System Updates
- [Component]: [What changed — new variant, token update, etc.]

## Known Issues
- [Issue]: [Workaround if any]

## Metrics to Watch
- [Metric]: [Expected change and why]
```

### User-Facing Release Notes

```
# What's New — [Version/Date]

## [Headline feature]
[1-2 sentences focused on the user benefit, not the technical change.]

## Improvements
- [Change]: [How it helps you]

## Bug Fixes
- [Fix]: [What you'll notice]
```

Rules for user-facing notes:
- Lead with benefits, not features
- Use the user's language, not internal terminology
- Keep it scannable — one line per item
- Skip internal refactors the user won't notice
- Include screenshots or GIFs for visual changes

## Design System Documentation

### Component Documentation Page

```
# [Component Name]

## Description
[One sentence: what it is and when to use it]

## Variants
[Visual examples of each variant with labels]

## Props / Configuration
[Table from component spec]

## Usage Guidelines

### When to Use
- [Good context for this component]

### When NOT to Use
- [Use [Alternative Component] instead when...]

### Composition
[How this component works with other components]

## Accessibility
[Key a11y requirements from the spec]

## Code Example
[Minimal implementation example]

## Changelog
- [Date]: [What changed]
```

## Quality Checklist

- [ ] Component specs are complete enough for a developer to build without questions
- [ ] All assets are exported and organized
- [ ] Design decisions are documented with rationale, not just the outcome
- [ ] Handoff includes accessibility requirements, not just visual specs
- [ ] Release notes are written for the audience (internal vs external)
- [ ] Token names are used instead of raw values (colors, spacing, typography)
