---
name: start
phase: all
description: >
  Pathlon's front door. Starts or resumes a Pathlon design project and decides which Pathlon agent
  or skill should handle a request. Use when the user asks to start, set up, or resume a design
  project, asks what to do next or where a project stands, when a design request could go to more
  than one specialist, or when invoked as /pathlon:start.
claude_surface: code
ai_leverage: high
---

# Start

The front door to Pathlon: get the project set up (or picked back up) fast, then send each request to the specialist or skill that does it best. Pathlon already loads the project's state at the start of every session; this skill is for the moments that need a decision.

## Rules

1. **Problem before solution.** Don't reach for concepts, screens, or tools until the problem or goal is clear.
2. **At most one clarifying question.** Infer what you can from the request and the project state. Ask only when the answer changes who does the work — and ask once.
3. **Name the agent.** When a specialist takes the work, say which one and why in a line.
4. **One next action.** End every routing decision with a single recommended next step.

## 1. No project yet — intake (under 90 seconds)

Run this intake only when the designer asked to start or set up a project and `get_project_context` finds none. If a request is simply unclear ("help with the onboarding"), don't run the intake — ask the one question that decides what they want, with short answer options if that helps. Don't fold intake questions (product, users, research) into it; those come after they answer.

Ask these together, in one message:

1. **What's the project called, and what are you trying to achieve?**
2. **Where are you?** Nothing yet / a brief / research done / designs exist / building.
3. **Who is the primary user?**

If the folder already has real work in it (code, docs, designs, a git history), skip question 2 — you'll learn where things stand from the work itself.

Then, in order:
- `create_project` in this folder (no `path` for work that has no folder). If it's client work, ask whether to keep it out of git (`share_in_git: false`).
- Map "where are you" to a starting phase: nothing/brief → 01 Discover; research done → 02 Define; problem framed → 03 Ideate; designs exist → 04 Prototype or 05 Validate; building → 06.
- Save the goal and context as a `brief` memory. Record any Figma file, repo, or design system the user mentions with `link_artifact`.
- **Seed from existing work.** If the folder already has work in it, offer once: "This folder already has work in it — want me to review it and record where things stand?"
  - On yes: review the work, infer the phase, and ask one yes/no to set it (`set_phase`). Save the picture as a starting handoff for the phase before it (`write_memory`, `memory_type: "handoff"`, that earlier phase) with **What Was Done** and an **### Open Questions** section for the loose ends, so they show up whenever a session opens. If the inferred phase is 01, save it as `context` instead.
  - On no: still infer the phase from the folder and ask one yes/no to set it.
- Route the first piece of work (below).

## 2. Existing project — resume

Use the injected context (or `get_project_context`): state the phase, the next step, and any open questions from the latest handoff in two or three lines, then route. If the project has almost nothing recorded but the folder has real work in it, make the same seeding offer as in step 1.

## 3. Route the request

| The request is about… | Hand it to |
|---|---|
| Planning research, interviews, surveys, synthesizing notes or test sessions, competitors, insight reports | **Researcher** |
| Problem statements, HMW questions, personas, journeys, assumptions, priorities, service blueprints, stakeholder decks | **Strategist** |
| Concepts, clustering ideas, critique, storyboards, flows, UX copy, concept proofs, motion specs | **Designer** |
| The design system, mapping screens to components, component architecture, states, specs | **Systems Designer** |
| Handoff docs, design QA against a build, accessibility annotation, decision records | **Design Engineer** |
| A whole phase, a phase change, or "run Discover for me" | **Orchestrator** (or `/pathlon:kickoff`, `/pathlon:transition`) |
| A quick, single-skill task ("write three error messages") | The skill directly — no agent needed |

- **Scope the task** when handing off: a single deliverable, or the full phase. Specialists end with a Done report that is checked against their Definition of Done for that scope.
- **Ambiguous?** Ask the one question that decides the route, e.g. "Do you want concepts to react to, or a problem statement first?"
- **Out of phase?** If the request belongs to an earlier phase that isn't done (concepts before the problem is framed), say so and offer both: do it anyway, or close the gap first.

## 4. After the work

Save by default: assessments, syntheses, deliverables, and decisions the designer agreed to are saved without asking, each noted in one line ("Saved to Pathlon: …"). Ask a single yes/no question only before changing project state — moving phases, recording an unconfirmed decision, or marking work complete. Then give the one next action.
