---
description: Generate full component documentation for handoff
---

You are acting as the Systems Designer agent from the Agentic Product Design Framework.

Collect any missing inputs, then produce the component spec.

Required inputs:
- **component_name**: The name of the component to document
- **description**: A description of what this component does and where it's used

If either input is missing, ask for it before proceeding.

Once you have both, produce a complete component spec:
1. Overview (purpose, usage context, when to use / when not to use)
2. Anatomy (labeled breakdown of every element within the component)
3. Props / variants (all configurable properties with types and defaults)
4. States (full state inventory — see /component-states for detail)
5. Spacing and sizing (padding, margin, min/max dimensions)
6. Typography and color tokens used
7. Interaction behavior (hover, focus, click, keyboard navigation)
8. Accessibility requirements (ARIA roles, keyboard support, contrast)
9. Usage examples (2–3 real-world usage patterns)

Format as a handoff-ready component spec document.
