---
name: concept-generation
phase: 03 — Ideate
description: Generate diverse design concepts, wireframes, UI pattern recommendations, and design system foundations. Use this skill when brainstorming solutions, exploring different interaction models, creating wireframes, recommending UI patterns for specific user tasks, or scaffolding a new design system. Triggers for ideation sessions, concept exploration, wireframing briefs, pattern library research, or when the user says they need ideas for how to solve a design problem.
ai_leverage: high
---

# Concept Generation & Ideation

Generate a broad range of design solutions, then converge on the strongest direction.

## When to Use

- You have a defined problem and need to explore solutions
- You want to push beyond the obvious first idea
- You need UI pattern recommendations for a specific interaction
- You're starting a new design system from scratch
- You need wireframe briefs or concept cards to evaluate

## Concept Exploration

### The Five-Direction Method

For any design problem, generate concepts across this spectrum:

**1. Convention** — What most competitors do
- Study existing patterns in the category
- Identify the "expected" solution users are familiar with
- Strength: Low learning curve. Risk: No differentiation.

**2. Improvement** — Better version of the existing pattern
- Take the conventional approach and refine the weakest parts
- Strength: Familiar but noticeably better. Risk: Incremental, may not be enough.

**3. Recombination** — Patterns borrowed from other domains
- Look at how analogous problems are solved in other industries
- Example: What if onboarding worked like a dating app? What if data entry worked like a chat?
- Strength: Fresh perspective. Risk: May not translate well.

**4. Paradigm Shift** — Rethink the core interaction model
- Challenge the fundamental assumption about how users should interact
- Example: What if there was no dashboard? What if the interface was voice-first?
- Strength: Truly novel. Risk: High learning curve, may confuse users.

**5. Moonshot** — Zero constraints
- Imagine the ideal with unlimited technology, budget, and time
- Useful for identifying the "north star" even if v1 is simpler
- Strength: Reveals the aspirational vision. Risk: Not directly buildable.

### Concept Card Format

For each concept, document:

```
# Concept: [Name]

## Core Idea
[2-3 sentences describing the interaction model]

## Key Interaction
[The primary way users accomplish their goal]

## UX Pattern
[The foundational pattern this relies on — e.g., wizard, feed, canvas, chat]

## Strengths
- [What makes this approach compelling]

## Risks
- [What could go wrong or confuse users]

## Best For
[Which user segment or use case this serves best]

## Open Questions
- [What needs to be validated before committing]
```

## UI Pattern Recommendations

When recommending patterns for a specific user task, evaluate across:

### Pattern Selection Criteria

1. **Task complexity** — Simple task = simple pattern. Complex task = consider progressive disclosure.
2. **Data volume** — Few items = list/cards. Many items = table with filters. Huge dataset = search-first.
3. **User expertise** — Novice = guided/wizard. Expert = power-user shortcuts, keyboard navigation.
4. **Frequency** — Rare task = discoverability matters. Frequent = efficiency matters.
5. **Error cost** — High cost = confirmation, undo, preview. Low cost = inline, immediate.

### Common Pattern Recommendations

**Data Entry**
- Simple form: <5 fields, single purpose
- Multi-step wizard: >5 fields or requires guidance
- Inline editing: Frequent small updates to existing data
- Conversational: When context-dependent or unfamiliar to users

**Data Display**
- Cards: Visual content, scannable, variable content lengths
- Tables: Structured data, comparison, sorting/filtering needed
- Lists: Sequential items, simple data, mobile-first
- Dashboard: Multiple metrics, overview + drill-down

**Navigation**
- Tabs: 2-7 parallel sections of equal weight
- Sidebar: Deep hierarchy, persistent navigation
- Bottom nav (mobile): 3-5 primary destinations
- Breadcrumbs: Deep hierarchy with back-tracking needs

**Selection & Input**
- Dropdown: >5 options, single select, familiar
- Radio/chips: 2-5 options, need to see all at once
- Combobox: Large option set, search + select
- Toggle: Binary on/off, immediate effect

### Pattern Documentation Format

```
# Pattern: [Name]

## What it is
[Brief description of the interaction pattern]

## When to use
- [Context 1]
- [Context 2]

## When NOT to use
- [Anti-pattern context]

## Accessibility considerations
- [Keyboard navigation requirements]
- [Screen reader behavior]
- [ARIA roles needed]

## Examples in the wild
- [Product A]: [How they use it]
- [Product B]: [Their variation]

## Implementation notes
- [Key technical considerations]
```

## Design System Scaffolding

When creating a design system foundation, define:

### Token System

```
# Design System: [Name]

## Design Principles
1. [Principle]: [What it means in practice]
2. [Principle]: [What it means in practice]
3. [Principle]: [What it means in practice]

## Typography
- Display: [Font, weight] — Used for: hero headings
- Heading: [Font, weight] — Used for: section titles
- Body: [Font, weight] — Used for: paragraph text
- Mono: [Font, weight] — Used for: code, data
- Scale ratio: [1.2 / 1.25 / 1.333] — [Why this ratio]

## Color
- Primary: [Hex] — Brand identity, primary actions
- Secondary: [Hex] — Supporting elements
- Accent: [Hex] — Highlights, calls to action
- Success/Warning/Error/Info: [Hex values] — Semantic feedback
- Neutral scale: [50-900] — Structure and hierarchy

## Spacing
- Base unit: [4px / 8px]
- Scale: [4, 8, 12, 16, 24, 32, 48, 64]

## Shape
- Border radius philosophy: [Sharp = professional, Round = friendly]
- SM: [Xpx] — Buttons, inputs
- MD: [Xpx] — Cards, modals
- LG: [Xpx] — Containers, panels

## Elevation
- Level 1: [Subtle] — Cards, dropdowns
- Level 2: [Medium] — Modals, floating elements
- Level 3: [Prominent] — Toasts, overlays

## Motion
- Duration: [Fast 100ms / Normal 200ms / Slow 300ms]
- Easing: [ease-out for entries, ease-in for exits]
- Principle: [Functional, not decorative — motion should guide attention]

## Component Inventory (v1)
- [ ] Button (primary, secondary, outline, ghost, danger)
- [ ] Input (text, select, checkbox, radio, toggle)
- [ ] Card
- [ ] Modal / Dialog
- [ ] Toast / Notification
- [ ] Navigation (header, sidebar, tabs)
- [ ] Table
- [ ] Badge / Tag
- [ ] Avatar
- [ ] Empty state
- [ ] Loading state
```

## Wireframe Brief Format

When creating wireframe specifications:

```
# Wireframe: [Screen Name]

## User Story
As a [user], I need to [action] because [reason].

## Entry Point
How does the user arrive at this screen? [Navigation path, trigger]

## Key Elements
1. [Element]: [Purpose] — Priority: [High/Medium/Low]
2. [Element]: [Purpose] — Priority: [High/Medium/Low]

## Primary Action
[The main thing the user should do on this screen]

## Secondary Actions
- [Action 1]
- [Action 2]

## Content Requirements
- [What content appears and where it comes from]

## States
- Default: [Normal state]
- Empty: [No data / first-time user]
- Loading: [While fetching data]
- Error: [When something goes wrong]
- Success: [After completing the primary action]

## Edge Cases
- [What if there are 0 items? 1000 items?]
- [What if the user has no permissions?]
- [What if the content is very long / very short?]

## Responsive Notes
- Desktop: [Layout approach]
- Tablet: [What changes]
- Mobile: [What changes]
```

## Quality Checklist

- [ ] At least 3 concept directions explored (not just variations of one idea)
- [ ] Each concept has clear strengths AND risks identified
- [ ] Pattern recommendations consider accessibility
- [ ] Design system tokens are opinionated (have a point of view, not generic)
- [ ] Wireframe briefs include edge cases and states
- [ ] Concepts are evaluated against the problem statement, not personal preference
