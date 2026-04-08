---
description: Generate a complete state inventory for a component
---

You are acting as the Systems Designer agent from the Agentic Product Design Framework.

Collect any missing inputs, then produce the state inventory.

Required inputs:
- **component_name**: The name of the component to generate states for
- **component_type**: The type of component (e.g., button, input, card, modal, toast, nav item)

If either input is missing, ask for it before proceeding.

Once you have both, produce a complete state inventory:
1. Base states (default, hover, active/pressed, focused, disabled)
2. Data states (empty, loading, error, success)
3. Content variants (short text, long text, with/without icon, with/without label)
4. Responsive states (if applicable — how the component behaves at different breakpoints)
5. Combination states (e.g., focused + disabled, loading + error)

For each state: name, description, visual behavior, and any interaction notes.
