# APDF Agent Evolution Plan
## Goal-Oriented Agents + Artifact Registry Tool

**Status:** Planning — ready for Claude Code execution  
**Scope:** Six agent files + one new MCP tool  
**Out of scope:** Pathlon integration (separate sprint)

---

## What This Plan Does

1. Transforms all six agents from role-based to goal-oriented
2. Adds partial phase logic to the Orchestrator
3. Introduces the Artifact Registry Tool — a shared MCP tool callable by all agents

---

## Part 1 — Goal-Oriented Agent Transformations

Each agent receives two additions at the top of its file, before the existing content:
- **Primary Goal** — one sentence committing to an outcome, not a function
- **Definition of Done** — a checklist that makes "done" concrete and checkable

Everything else in each file stays the same. The goal and DoD reorient what's already there.

---

### Orchestrator

**Primary Goal**
Drive every design phase to a complete, handoff-ready output — resolving blockers, spawning the right agents, and knowing when a phase is genuinely done.

**Definition of Done**
A phase is complete when all of the following are true:
- [ ] The phase's primary artifact exists in `.apdf/artifacts/`
- [ ] All open questions from the previous handoff block are resolved or explicitly deferred with a reason
- [ ] The Phase Handoff Block is updated and reflects current state
- [ ] The next agent has been identified and knows what it needs to start
- [ ] No undocumented assumptions remain buried in the work

> Note: The Orchestrator file already has this transformation applied. See `orchestrator.md` in outputs.

---

### Researcher

**Primary Goal**
Produce a research synthesis that surfaces 3–5 actionable insights the design team can make decisions from — not a summary of what was said, but a clear statement of what it means and what should happen next.

**Definition of Done**
Research work is complete when all of the following are true:
- [ ] All raw inputs (transcripts, notes, session data) have been processed — nothing left unsynthesized
- [ ] Insight statements follow the standard format and are grounded in specific evidence
- [ ] Each insight is confidence-rated: strongly evidenced vs. directional
- [ ] A competitive snapshot exists if the phase requires it
- [ ] Open questions and unvalidated assumptions are explicitly named
- [ ] Phase Handoff Block is written and ready for the Strategist or Designer

---

### Strategist

**Primary Goal**
Produce a problem frame and strategic direction that gives the design team a clear, evidence-backed mandate to execute against — eliminating ambiguity about what is being designed and why before any concept work begins.

**Definition of Done**
Strategy work is complete when all of the following are true:
- [ ] A validated problem statement exists in the standard format
- [ ] At least 3 HMW questions have been generated from the problem statement
- [ ] The primary persona is defined with needs, behaviors, and context
- [ ] Current-state journey is documented before any future-state work begins
- [ ] All assumptions are mapped and ranked by risk × knowability
- [ ] Known facts and assumed facts are explicitly separated throughout all artifacts
- [ ] Phase Handoff Block is written and ready for the Designer

---

### Designer

**Primary Goal**
Produce a validated concept direction — not a list of ideas, but a defensible recommendation with clear rationale, documented trade-offs, and enough fidelity that the Systems Designer can begin component architecture without guessing.

**Definition of Done**
Design work is complete when all of the following are true:
- [ ] At least 4 meaningfully different concepts have been generated and documented
- [ ] Concepts have been evaluated against desirability, feasibility, and novelty criteria
- [ ] A recommended direction has been identified with written rationale
- [ ] At least one user flow is mapped for the primary use case
- [ ] UX copy exists for all primary screens or states in scope
- [ ] What remains unresolved is explicitly named — not left implicit
- [ ] Phase Handoff Block is written and ready for the Systems Designer or Design Engineer

---

### Systems Designer

**Primary Goal**
Produce a token system and component architecture that a design engineer can build from without ambiguity — every component specified, every state defined, every token named for intent.

**Definition of Done**
Systems work is complete when all of the following are true:
- [ ] Token layer is established before any component specs are written
- [ ] All tokens follow semantic naming convention (intent, not appearance)
- [ ] Every component in scope has a full spec: anatomy, props, states, token references, accessibility notes
- [ ] No interactive component is missing hover, focus, active, or disabled states
- [ ] No data component is missing loading, empty, error, or populated states
- [ ] Decision rationale is documented alongside every architectural choice
- [ ] Phase Handoff Block is written and ready for the Design Engineer

---

### Design Engineer

**Primary Goal**
Produce a handoff package that eliminates back-and-forth between design and engineering — every spec annotated, every accessibility requirement documented, every QA issue resolved or formally accepted before the feature ships.

**Definition of Done**
Delivery work is complete when all of the following are true:
- [ ] Handoff document exists with component inventory, token references, interaction specs, and edge cases
- [ ] Design QA has been run against implementation — not against opinion
- [ ] Every QA issue has a severity rating and resolution status
- [ ] Accessibility audit is complete with pass/fail per WCAG 2.1 AA criterion
- [ ] All design decisions with downstream implications have a Decision Record
- [ ] No open QA items without an explicit accept/defer decision
- [ ] Phase Handoff Block is written confirming the feature is ready for engineering

---

## Part 2 — Partial Phase Logic (Orchestrator Addition)

### The Problem
The Orchestrator currently assumes full phase execution. There is no concept of a designer entering a phase with some work already done, or choosing to skip tasks intentionally.

### The Solution
Add a **Phase Gap Analysis** step that runs before any routing or spawning. It compares what exists in `.apdf/artifacts/` against the full Definition of Done for the current phase and produces a gap list. If gaps exist, the Orchestrator surfaces them before proceeding — not after.

### New Flow: Partial Phase Entry

Add this section to the Orchestrator's **How You Work** block, after step 1 ("Read before routing"):

---

**1b. Run a Phase Gap Analysis before routing.**

Before spawning any agent, compare the current phase's Definition of Done against what exists in `.apdf/artifacts/`. Identify:

- **Satisfied tasks** — artifacts exist and are complete
- **Skipped tasks** — artifacts are missing and the designer has not started them
- **Assumption risks** — things being treated as true that haven't been validated by a skipped task
- **Dependency risks** — downstream agents expecting an artifact that won't exist if a task is skipped

If all tasks are satisfied: proceed normally.

If gaps exist: surface them before routing. Do not proceed silently.

**Gap surface format:**
```
Phase Gap Analysis — [Phase Name]

Satisfied:
- [artifact name] ✓

Missing:
- [artifact name] — not found in .apdf/artifacts/

If you proceed without these:
Assumption risk: [what is being assumed without evidence]
Dependency risk: [what downstream agent will be missing]

To proceed: confirm one of the following —
[ ] I want to complete the missing tasks first
[ ] I want to proceed without them — I accept these risks
    → If accepted: describe what you already have that covers this gap
```

**On confirmation:**
- If the designer completes the missing tasks: proceed normally
- If the designer accepts the risks: log the skipped tasks, the stated risks, and the designer's justification to the Phase Handoff Block under a **Partial Phase Declaration** section. Proceed with available inputs.

**Partial Phase Declaration format (added to handoff block):**
```
## Partial Phase Declaration
Tasks skipped: [list]
Assumption risks accepted: [list]
Dependency risks accepted: [list]
Designer's justification: [what they said]
Compensating actions for downstream agents: [what agents should do differently as a result]
```

---

## Part 3 — Artifact Registry Tool

### Purpose
A shared MCP tool callable by all agents. Maintains a registry of artifacts — both framework-defined and custom — so no agent has an incomplete picture of what has been produced.

### The Problem It Solves
The current artifact list is closed. Agents only know about deliverables the framework shipped with. Real design projects produce things the framework doesn't account for — workshop outputs, content audits, brand briefs, stakeholder maps. These are invisible to agents and can't be referenced in handoffs. There's also no mechanism for the framework to learn from gaps over time.

### Tool Name
`artifact-registry`

### File Format Decision
**TypeScript (`.ts`)** — the repo is already React/Vite (Node/JS environment), Claude Code runs Node natively, and TypeScript type safety on the artifact schema is important given the registry is shared across six agents. Also positions the tool for future npm packaging if the framework is distributed.

File location: `.claude/tools/artifact-registry.ts`

### Phase Manifest Decision
The expected artifact list lives in **`.apdf/phase-manifest.json`** — a separate config file, not hardcoded in the tool. This allows the manifest to grow independently of the tool logic. When a custom artifact is promoted to the framework, it is added to the manifest. That is the promotion mechanism.

### Custom Artifact Flow Decision
Three states an artifact can be in:

1. **Framework artifact** — exists in `phase-manifest.json`, surfaced automatically by agents
2. **Custom artifact** — declared by a designer for their project, stored in the registry, not yet in the manifest
3. **Framework signal** — a custom artifact that has been flagged, sitting in `framework_signals` pending review

**The flow:**
- Agents surface available artifacts for the current phase from the manifest
- If the designer needs something not on the list, they declare it — name it, describe it, assign it to a phase
- Registry stores it as a custom artifact, visible to all agents for that project from that point forward
- Agent automatically asks: *"This artifact isn't in the framework yet — should we flag it so it can be considered for a future version?"* One confirmation, no friction, fully opt-in
- Flagged artifacts accumulate in `framework_signals` with a `signal_count` that increments each time a different project registers the same type
- Quin reviews the signal table periodically — high signal count = promotion candidate → artifact type added to `phase-manifest.json` → becomes a framework artifact for all users

### Modes
The tool operates in two modes, detected automatically:

| Mode | Trigger | Storage |
|------|---------|---------|
| Standalone | No Supabase credentials in environment | `.apdf/registry.json` |
| Connected | Supabase credentials present | `.apdf/registry.json` + Supabase `project_artifacts` table |

Same interface either way. Agents never need to know which mode is active.

---

### Methods

#### `registry.lookup(phase, type)`
Check whether an artifact of a given type exists for the current phase.

**Input:**
```json
{
  "phase": "discover | define | ideate | prototype | validate | deliver",
  "type": "string — artifact type name e.g. 'research-synthesis', 'journey-map'"
}
```

**Output:**
```json
{
  "exists": true | false,
  "artifact": {
    "id": "string",
    "name": "string",
    "phase": "string",
    "type": "string",
    "source": "framework | custom",
    "location": "string — file path or URL",
    "produced_by": "agent name",
    "created_at": "ISO timestamp",
    "flagged_for_framework": false
  } | null
}
```

---

#### `registry.register(artifact)`
Declare a new artifact — whether framework-defined or custom. Called by any agent when it produces a deliverable, or when the designer declares something produced outside the framework.

**Input:**
```json
{
  "name": "string",
  "phase": "string",
  "type": "string",
  "source": "framework | custom",
  "location": "string — file path or URL",
  "produced_by": "string — agent name or 'designer'",
  "description": "string — what this artifact is and what decisions it informs",
  "flag_for_framework": false
}
```

**Output:**
```json
{
  "registered": true,
  "id": "string",
  "mode": "standalone | connected"
}
```

**Behavior:**
- If `flag_for_framework: true`, writes to `framework_signals` table in Supabase (connected mode only)
- In standalone mode, `flag_for_framework` is stored locally and syncs when credentials are added later

---

#### `registry.list_gaps(phase)`
Return all artifacts expected for a phase that are not yet registered. Used by the Orchestrator's Phase Gap Analysis.

**Input:**
```json
{
  "phase": "string"
}
```

**Output:**
```json
{
  "phase": "string",
  "expected": ["artifact type strings"],
  "registered": ["artifact type strings"],
  "gaps": [
    {
      "type": "string",
      "description": "string — what this artifact is for",
      "dependency_risk": "string — what downstream agent needs it",
      "assumption_risk": "string — what is assumed without it"
    }
  ]
}
```

---

#### `registry.flag_for_framework(artifact_id)`
Mark a registered artifact as a candidate for becoming a framework skill file. Writes to the shared `framework_signals` table in connected mode.

**Input:**
```json
{
  "artifact_id": "string",
  "rationale": "string — why this should be a framework skill"
}
```

**Output:**
```json
{
  "flagged": true,
  "framework_signal_id": "string | null (standalone mode)"
}
```

---

### Supabase Tables (Connected Mode)

#### `project_artifacts`
Extends the existing table. New fields required:

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `project_id` | uuid | FK to projects table |
| `phase` | text | discover, define, ideate, prototype, validate, deliver |
| `type` | text | Artifact type slug |
| `name` | text | Human-readable name |
| `source` | text | 'framework' or 'custom' |
| `location` | text | File path or URL |
| `produced_by` | text | Agent name or 'designer' |
| `description` | text | What it is and what it informs |
| `flagged_for_framework` | boolean | Default false |
| `created_at` | timestamptz | Auto |

#### `framework_signals`
New table. Aggregates flags across all users and projects.

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `artifact_type` | text | The type being flagged |
| `artifact_name` | text | Human-readable name |
| `phase` | text | Which phase it belongs to |
| `rationale` | text | Why it should be a skill |
| `project_id` | uuid | Source project (for context) |
| `flagged_at` | timestamptz | Auto |
| `signal_count` | int | Incremented when same type flagged again |

---

### Local Registry Format (Standalone Mode)

`.apdf/registry.json`:
```json
{
  "project_id": "string",
  "last_updated": "ISO timestamp",
  "artifacts": [
    {
      "id": "string",
      "name": "string",
      "phase": "string",
      "type": "string",
      "source": "framework | custom",
      "location": "string",
      "produced_by": "string",
      "description": "string",
      "flagged_for_framework": false,
      "created_at": "ISO timestamp"
    }
  ],
  "pending_framework_signals": []
}
```

`pending_framework_signals` holds flags that couldn't be written to Supabase (standalone mode). Syncs on first connected-mode session.

---

### How Agents Use the Registry

**At the start of every session:**
```
registry.lookup(phase, type) → confirm what already exists before doing work
```

**When producing a deliverable:**
```
registry.register(artifact) → declare it immediately, don't wait until handoff
```

**During Phase Gap Analysis (Orchestrator only):**
```
registry.list_gaps(phase) → get the full gap list before routing
```

**When a designer declares a custom artifact:**
```
registry.register(artifact, source: "custom") → make it visible to all agents
registry.flag_for_framework(artifact_id) → if it should become a skill
```

---

## Execution Order for Claude Code

1. **Add goal + DoD to Researcher** → `.claude/agents/researcher.md`
2. **Add goal + DoD to Strategist** → `.claude/agents/strategist.md`
3. **Add goal + DoD to Designer** → `.claude/agents/designer.md`
4. **Add goal + DoD to Systems Designer** → `.claude/agents/systems-designer.md`
5. **Add goal + DoD to Design Engineer** → `.claude/agents/design-engineer.md`
6. **Add partial phase logic to Orchestrator** → `.claude/agents/orchestrator.md` (already has goal + DoD)
7. **Create phase manifest** → `.apdf/phase-manifest.json`
8. **Create Artifact Registry Tool** → `.claude/tools/artifact-registry.ts`
9. **Update all agent files** to reference `artifact-registry` in their Tools section
10. **Create empty registry template** → `.apdf/registry.json`
11. **Run build check** — confirm all agent files are valid markdown, tool compiles cleanly

---

## Claude Code Handoff

This plan is complete and has no open questions. It is ready for Claude Code execution.

### How to hand off

Open Claude Code in the repo root and paste the following as your opening prompt:

---

**Claude Code opening prompt:**

```
Read the file at: apdf-agent-evolution-plan.md

This is a complete, resolved plan. No decisions are pending. Execute it in the order specified under "Execution Order for Claude Code."

Key constraints:
- Agent file additions go at the TOP of each file, before all existing content
- Do not modify any existing content in agent files — only prepend the Primary Goal and Definition of Done sections
- The Orchestrator already has its goal + DoD — skip to step 6 (partial phase logic addition) for that file
- The registry tool is TypeScript: .claude/tools/artifact-registry.ts
- The phase manifest is a separate JSON config: .apdf/phase-manifest.json
- Populate phase-manifest.json with the artifact types already present across the six phase skill files in skills/
- Run a build check after step 11 before closing

Confirm each step as you complete it.
```

---

### What Claude Code needs access to
- The repo cloned locally (`quinrobinson/agentic-product-design-framework`)
- Read access to `.claude/agents/` — all six agent files
- Read access to `skills/` — to populate the phase manifest from existing skill files
- Write access to `.claude/agents/`, `.claude/tools/`, and `.apdf/`
- Node/TypeScript available in the environment (already present via Vite)

### What Claude Code does NOT need to do
- Touch anything in `web/src/` — this is agent and tooling work only
- Run `npm run build` on the web app — the Vite build check is only for the TypeScript tool compilation
- Push to GitHub — Quin reviews and pushes manually using the standard PAT pattern
