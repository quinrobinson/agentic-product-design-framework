---
name: user-flow-mapping
phase: 04 — Prototype
description: Map the complete step-by-step path a user takes to accomplish a goal — including decision points, branches, error paths, and edge cases — before any wireframes are built. Use at the start of Prototype to define the full scope of what needs to be designed. Claude generates flows that are more complete than most designers produce solo, surfacing edge cases and error branches that typically get deferred. Depends on outputs from storyboarding.md and concept-critique.md. Outputs feed into ux-copy.md, prototype-scoping.md, and wireframing.
ai_leverage: high
claude_surface: chat
---

# User Flow Mapping

Define every path a user can take before drawing a single screen — including the paths where things go wrong.

## When to Use

- Starting a prototype and need to define the full scope of screens
- Auditing an existing flow to find gaps, dead ends, or missing error states
- Aligning the team on what the prototype needs to cover before wireframing starts
- Identifying which paths are in scope for v1 vs. deferred
- Handing off a complete flow spec to a prototyper or engineer

---

## What a User Flow Is — and Isn't

**A user flow is:** A step-by-step map of every action, decision, and system response in a user's path through a feature — from trigger to resolution.

**A user flow is not:** A journey map (which maps the emotional experience), a wireframe (which maps screen layouts), or a sitemap (which maps content hierarchy).

The user flow answers: "What happens at every step — including when things go wrong?"

---

## Why Completeness Matters

Most manually drawn user flows capture the happy path and 2–3 branches. Claude systematically generates:
- **Happy path** — when everything goes right
- **Alternative paths** — valid routes that don't follow the primary path
- **Error paths** — what happens when inputs are wrong, connections fail, or permissions are missing
- **Edge cases** — unusual but valid situations (first-time use, returning user, empty state, boundary conditions)
- **Exit points** — where users leave the flow and what happens

A flow missing its error paths produces a prototype missing the moments users need the most help.

---

## What Claude Needs to Start

1. **Selected concept** — name, one-liner, core mechanism from `storyboarding.md`
2. **Primary persona** — who is performing this flow
3. **Trigger** — what specific event or action initiates the flow
4. **Goal** — what the user is trying to accomplish — what does success look like?
5. **Key constraints** — technical, permission, or scope constraints that affect the flow
6. **Scope boundary** — what's in v1 vs. explicitly deferred

---

## Step 1: Define the Flow Boundaries

Lock scope before generating anything. An unbounded flow expands infinitely.

**Claude prompt:**
> "Define the flow boundaries for this user flow.
>
> Concept: [name + one-liner]
> Persona: [name + context]
>
> Help me define:
> 1. **Trigger** — the specific event that starts this flow (not 'when the user wants to...' — a specific action or moment)
> 2. **Entry point** — where in the product the flow begins
> 3. **Success end state** — what the user sees and feels when the flow completes successfully
> 4. **Failure end states** — what happens if the user can't complete the flow (abandonment, error, redirect)
> 5. **In scope** — what this flow must cover for the prototype to test its core assumption
> 6. **Out of scope** — what explicitly won't be designed in v1 (and why)
>
> Focus on the single most important path first — we'll branch from there."

---

## Step 2: Generate the Happy Path

Start with the path where everything goes right. This establishes the spine of the flow.

**Claude prompt:**
> "Generate the happy path user flow for this scenario.
>
> Concept: [name + core mechanism]
> Persona: [name + context + goal]
> Trigger: [specific starting event]
> Success state: [what completion looks like]
> Key constraints: [paste]
>
> For each step in the happy path:
> - **Step name:** [short label — verb + noun]
> - **User action:** [what the user does — specific and observable]
> - **System response:** [what the product does — what the user sees or hears]
> - **Decision point:** [Yes/No — does this step require a choice?]
> - **Screen/state:** [name of the screen or UI state this step occurs in]
>
> Format as a numbered sequence. Mark decision points with [DECISION].
> Stop at the success end state."

---

## Step 3: Branch the Decision Points

Every decision point creates at least two paths. Map them all.

**Claude prompt:**
> "Identify every [DECISION] in this happy path and generate the branch for each.
>
> For each decision point:
> - What triggers the decision?
> - What are all possible outcomes? (minimum 2, often 3–4)
> - For each outcome: what does the user see and what happens next?
> - Does any outcome loop back to a previous step, or lead to a new path?
>
> Happy path: [paste]
> Concept constraints: [paste]"

---

## Step 4: Generate Error Paths

Error paths are where most flows are incomplete. Generate them systematically.

**Claude prompt:**
> "Generate all error paths for this user flow. For each error:
>
> 1. **Error type** — what caused it
> 2. **Where it occurs** — which step in the happy path
> 3. **What the user sees** — the error state
> 4. **Recovery options** — what the user can do to resolve it
> 5. **Unrecoverable path** — if the user can't resolve it, where do they end up?
>
> Error categories to cover for each applicable step:
> - **Validation errors** — user input doesn't meet requirements
> - **Network/timeout** — connection lost, request timed out
> - **Permission errors** — user lacks access (not logged in, plan limit, role restriction)
> - **Conflict errors** — duplicate record, action already taken
> - **Not found** — resource deleted or URL invalid
> - **System errors** — backend failure, unexpected state
> - **Session errors** — user logged out mid-flow
>
> Happy path: [paste]
> Key constraints: [paste]"

---

## Step 5: Map Edge Cases

Edge cases are valid but unusual paths. They're typically discovered in usability testing — map them before that.

**Claude prompt:**
> "Generate edge cases for this flow.
>
> Edge case categories to consider:
> - **Zero state** — user has no data, no history, nothing populated
> - **First-time use** — user encounters this flow for the first time
> - **Returning user** — user has partially completed this flow before
> - **Interrupted flow** — user leaves mid-flow and returns
> - **Boundary conditions** — maximum/minimum values, character limits, file size limits
> - **Multiple simultaneous actions** — user opens multiple tabs, submits twice
> - **Slow/degraded performance** — what happens when the system is slow
>
> For each edge case:
> - Describe the situation
> - Which step in the happy path it affects
> - What the user experiences
> - Whether this is in scope for v1 or deferred
>
> Happy path: [paste]
> Persona context: [paste]"

---

## Step 6: Complete Flow Document

Compile all paths into a single structured document.

**Claude prompt:**
> "Compile the complete user flow document from all paths generated.
>
> ## Flow Overview
> - Name: [flow name]
> - Persona: [who]
> - Trigger: [what starts it]
> - Success state: [what completion looks like]
> - Scope: [in / out]
>
> ## Screen / State Inventory
> [Every unique screen or state — this becomes the prototype build list]
>
> ## Happy Path
> [Numbered steps — user action + system response + decision points]
>
> ## Branch Paths
> [For each decision point: all branches with steps]
>
> ## Error Paths
> [By error type: where it occurs + what user sees + recovery]
>
> ## Edge Cases
> [By case: situation + affected step + in scope / deferred]
>
> ## Open Design Decisions
> [Steps where the right behavior is a genuine design choice — not obvious]
>
> All paths: [paste everything generated]"

---

## Scope Decision — What Goes in the Prototype

**Claude prompt:**
> "Review this complete user flow and identify the minimum set of paths to include in the v1 prototype to answer these specific questions:
>
> Prototype questions: [paste from concept-critique.md or storyboarding.md]
>
> For each path in the flow:
> - Is it required to answer the prototype questions? (Core / Supporting / Deferred)
> - If deferred — what's the risk of not including it?
>
> Recommend: the minimum viable prototype scope — fewest screens that still answer the key questions.
>
> Complete flow: [paste]"

---

## Quality Checklist

Before starting wireframes:
- [ ] Trigger is specific — one observable event, not a vague goal
- [ ] Happy path covers every step from trigger to success state
- [ ] Every decision point has all branches documented
- [ ] Every error category covered — validation, network, permission, system at minimum
- [ ] Zero state and first-time use edge cases documented
- [ ] Screen inventory complete — every unique screen or state listed
- [ ] Design decisions flagged — team has discussed or deferred each one
- [ ] Prototype scope defined — which paths are in v1

---

## Phase Handoff Block

```
## Handoff: Prototype — User Flow Mapping
### Project: [PROJECT NAME]
### Date: [DATE]

---

### What we completed
- Happy path: [N steps]
- Branch paths: [N branches from N decision points]
- Error paths: [N error types covered]
- Edge cases: [N documented]
- Total unique screens/states: [N]

### Flow overview
- Persona: [name + context]
- Trigger: [specific starting event]
- Success state: [what completion looks like]
- In scope: [what v1 covers]
- Out of scope: [what's deferred]

### Prototype scope
- Core paths: [list]
- Screens required: [N — list key ones]
- Explicitly excluded: [what's not being prototyped]

### Open design decisions
1. [Decision] — [options] — [what we need to know]
2. [Decision] — [options]

### Riskiest moments in the flow
1. [Step] — [why risky] — [what prototype must reveal]

---
*Paste this block when opening UX Copy and Prototype Scoping.*
```
