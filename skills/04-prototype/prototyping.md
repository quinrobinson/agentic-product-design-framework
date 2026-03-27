---
name: prototyping
phase: 04 — Prototype
description: Build functional prototypes, write UX copy, and conduct accessibility audits. Use this skill when the user needs to create working prototypes in React/HTML, generate complete UI copy for screens, audit designs for WCAG accessibility compliance, or specify micro-interactions and component behavior. Also triggers for design QA, responsive design specs, or when translating wireframes/mockups into testable prototypes.
ai_leverage: high
---

# Prototyping & Production Design

Transform concepts into testable, accessible, production-quality prototypes.

## When to Use

- Building a functional prototype for user testing
- Writing UX copy systematically across screens
- Auditing a design or prototype for accessibility
- Specifying component behavior, states, and interactions
- Preparing a design for QA review

## Functional Prototyping

### Prototype Specification

Before building, define:

```
# Prototype Spec: [Screen/Flow Name]

## Purpose
- [ ] User testing
- [ ] Stakeholder review
- [ ] Developer reference
- [ ] Concept validation

## Fidelity Level
- [ ] Low (structure + flow, no styling)
- [ ] Medium (styled, placeholder content)
- [ ] High (production-quality, real content, all states)

## Scope
Screens included: [List]
User flow: [Step 1 → Step 2 → Step 3]

## Requirements
- Framework: [React / HTML / Figma prototype]
- Responsive: [Yes — breakpoints: 375, 768, 1280]
- Interactive elements: [List what needs to actually work]
- Data: [Static / Mock API / Real data]

## States to Build
For each screen:
- [ ] Default / loaded
- [ ] Empty state (no data / first use)
- [ ] Loading (skeleton / spinner)
- [ ] Error (inline / toast / full-page)
- [ ] Success (confirmation / next step)
- [ ] Edge cases: [Specify]
```

### Building the Prototype

When generating code prototypes:

1. **Start with structure** — Build the layout skeleton first, verify structure is correct
2. **Add real content** — Use realistic data, not "Lorem ipsum." Users react to content.
3. **Handle all states** — Empty, loading, error, and success states are where UX lives
4. **Add micro-interactions** — Hover states, transitions, and feedback that make it feel real
5. **Make it responsive** — Test at mobile (375px), tablet (768px), and desktop (1280px)

### Micro-Interaction Specs

Document each interaction:

```
## Interaction: [Name]

### Trigger
[What initiates the interaction — click, hover, scroll, load, gesture]

### Animation
- Property: [What changes — opacity, transform, color, size]
- Duration: [100ms / 200ms / 300ms]
- Easing: [ease-out / ease-in-out / spring]
- Delay: [If staggered]

### Feedback
[What the user sees/hears/feels in response]

### End State
[What the UI looks like after the interaction completes]

### Edge Cases
- Interrupted: [What if user triggers again before completion?]
- Disabled: [What if the element is disabled?]
- Reduced motion: [What happens with prefers-reduced-motion?]
```

## UX Copy System

### Screen Copy Audit

For each screen, document all copy systematically:

```
# UX Copy: [Screen Name]

## Headlines & Subheads
- H1: [Primary heading]
- Subhead: [Supporting context]

## Actions
- Primary CTA: [Button label] — Verb-first, specific
- Secondary CTA: [Button label]
- Tertiary: [Link text]

## Form Labels & Help Text
- [Field]: Label: [X] | Placeholder: [X] | Help: [X] | Error: [X]

## Empty States
- Title: [What to say when there's nothing here]
- Body: [Explain why and what to do]
- CTA: [Action to populate]

## Error Messages
- [Error type]: [Specific, helpful message that says what went wrong AND how to fix it]
- Avoid: "An error occurred" — Say what error and what to do

## Success / Confirmation
- [Action completed]: [Confirmation message] — Brief, positive, with clear next step

## Tooltips & Help
- [Element]: [Tooltip text] — Only when the element isn't self-explanatory

## Loading States
- [What to show]: [Message if loading >2 seconds]
```

### Copy Principles

- **Clarity over cleverness** — Users are trying to accomplish a task, not read marketing copy
- **Verb-first CTAs** — "Save changes" not "Changes" / "Create account" not "Submit"
- **Specific errors** — "Password must be at least 8 characters" not "Invalid input"
- **No dead ends** — Every empty state, error, and confirmation should tell users what to do next
- **Consistent voice** — Define and maintain a tone (professional, casual, playful, etc.)
- **Front-load key info** — The most important word in every string should come first

## Accessibility Audit

### WCAG 2.1 AA Audit Checklist

Run through each category:

**Perceivable**
- [ ] Color contrast: Text meets 4.5:1 ratio (3:1 for large text)
- [ ] Color not sole indicator: Information isn't conveyed by color alone
- [ ] Images: All meaningful images have alt text
- [ ] Video/audio: Captions and transcripts provided
- [ ] Text resize: Content remains usable at 200% zoom

**Operable**
- [ ] Keyboard accessible: All interactive elements reachable via Tab
- [ ] Focus visible: Clear focus indicator on all interactive elements
- [ ] Focus order: Logical tab sequence matching visual layout
- [ ] No keyboard traps: User can always Tab away from any element
- [ ] Touch targets: Minimum 44x44px on mobile
- [ ] Skip links: Available for repetitive navigation
- [ ] Motion: Respects prefers-reduced-motion

**Understandable**
- [ ] Language: Page language declared
- [ ] Labels: Form inputs have visible, associated labels
- [ ] Error identification: Errors clearly described with suggestions to fix
- [ ] Consistent navigation: Same patterns used throughout

**Robust**
- [ ] Semantic HTML: Proper heading hierarchy, landmarks, lists
- [ ] ARIA: Used correctly where native HTML isn't sufficient
- [ ] Name/Role/Value: All interactive elements properly labeled

### Audit Report Format

```
# Accessibility Audit: [Screen/Component]

## Summary
- Critical issues: [N]
- Major issues: [N]
- Minor issues: [N]
- Overall compliance: [Pass / Fail / Partial]

## Issues

### [Issue 1]: [Title]
- Severity: Critical / Major / Minor
- WCAG Criterion: [e.g., 1.4.3 Contrast]
- Location: [Where in the UI]
- Problem: [What's wrong]
- Impact: [Who is affected and how]
- Fix: [Specific code or design change]

### [Issue 2]: [Title]
...

## Recommendations
1. [Highest priority fix — address before launch]
2. [Important improvement]
3. [Nice-to-have enhancement]
```

## Design QA Checklist

Before any handoff or user test:

```
# Design QA: [Screen/Feature]

## Visual Consistency
- [ ] Colors match design system tokens
- [ ] Typography follows the type scale
- [ ] Spacing uses the spacing system
- [ ] Icons are consistent style and size
- [ ] Alignment is pixel-perfect

## Responsive Behavior
- [ ] Tested at 375px (mobile)
- [ ] Tested at 768px (tablet)
- [ ] Tested at 1280px (desktop)
- [ ] Tested at 1920px (large desktop)
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch targets adequate on mobile

## Content & Copy
- [ ] No placeholder text remaining
- [ ] Strings handle long text gracefully (truncation, wrapping)
- [ ] Numbers handle extremes (0, 1, 999, 1000000)
- [ ] Dates handle all formats and time zones

## States
- [ ] Default state
- [ ] Empty state
- [ ] Loading state
- [ ] Error state
- [ ] Success state
- [ ] Hover / Focus / Active states
- [ ] Disabled state

## Edge Cases
- [ ] First-time user experience
- [ ] Power user with maximum data
- [ ] Slow network / offline
- [ ] Browser back button behavior
- [ ] Page refresh mid-flow

## Accessibility
- [ ] Keyboard navigation complete
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] Focus management correct
```

## Quality Checklist

- [ ] Prototype uses realistic data, not placeholders
- [ ] All states are accounted for (not just the happy path)
- [ ] Copy is specific, actionable, and consistent in voice
- [ ] Accessibility audit has specific fixes, not just "improve contrast"
- [ ] Responsive behavior is tested, not assumed
- [ ] Micro-interactions enhance usability, not just aesthetics
