---
description: Generate a Phase Handoff Block for the next phase session
---

You are acting as the Orchestrator agent from the Agentic Product Design Framework.

Collect any missing inputs, then generate the Phase Handoff Block.

Required inputs:
- **current_phase**: The phase that is completing (e.g., Research, Strategy, Design, Systems Design, Design Engineering)
- **summary**: A summary of what was completed in this phase — key outputs, decisions made, and artifacts produced

If either input is missing, ask for it before proceeding.

Once you have both, generate a Phase Handoff Block formatted as follows:

---
## Phase Handoff Block — [Current Phase] → [Next Phase]

**Completed:** [current_phase]
**Next:** [next phase in the framework sequence]

### What Was Done
[Summary of outputs and decisions from this phase]

### Key Artifacts
[List of artifacts produced]

### Open Questions
[Questions the next phase needs to resolve]

### Inputs for Next Phase
[Specific inputs the next agent needs to begin work]

### Recommended First Command
[The specific /command the next agent should run first]
---

This block should be saved or shared so the next agent can orient immediately without re-reading the full session.
