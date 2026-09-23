# Pathlon Rewire Spec

**Status:** Approved direction, ready for Claude Code
**Owner:** Quin Robinson
**Suggested repo path:** `docs/specs/pathlon-rewire-spec.md` (APDF repo)
**Date:** September 23, 2026

---

## 0. Session context (read first)

Decisions and changes made Sept 23, 2026, that this spec depends on:

- **Supabase schema change (5.4): approved.**
- **Dogfood project: decided.** Courtside IQ (primary). Tournament app (secondary, if early stage). Toyota excluded: client work.
- **Site is now local-only.** Commit `7705fbc` stopped GitHub Pages auto-deploy; the site runs locally at `http://localhost:3456/agentic-product-design-framework/` and serves skill and agent files from the local repo. Reason: keep the repo public while viewing the framework visually on Quin's Mac.
- **Local repo path:** `~/Documents/Claude/Projects/agentic-product-design-framework`.
- **Uncommitted planning files exist** in the repo root: `apdf-agent-evolution-plan.md`, `apdf-outcome-orientation-handoff.md`, `apdf-system-viz.html`, plus an edited `.claude/settings.json`. Before starting Phase 1, summarize each, flag anything that conflicts with or should be folded into this spec, and wait for Quin's decision. This spec is the governing plan.
- **Working split:** Claude Code executes. Claude Chat (Pathlon project) reviews and decides. Stop for review at the end of each numbered step.

---

## 1. Problem

Pathlon was designed with Figma as the front door and the Figma file as the project's identity. Day-to-day work now happens in Claude Code and Claude Chat, reaching Figma through the Figma MCP. The framework is portable in theory but not in practice: methodology lives in three places, project state lives in three places, and every Pathlon tool is keyed to a Figma file.

**Goal:** make Pathlon usable in everyday work from any Claude surface, with Claude as the front door and Figma as one tool among several.

## 2. Positioning (locked)

- **Pathlon is an agentic product design framework.** Six phases: Discover, Define, Ideate, Prototype, Validate, Deliver.
- **Naming family:** Pathlon (framework), Pathlon MCP (memory spine), Pathlon for Claude Code (plugin), Pathlon for Figma (companion plugin).
- **ASPF stays a separate framework.** It connects to Pathlon only through a generic engagement brief input (see 5.4). Pathlon does not own strategy.
- **Two stores only.** GitHub holds methodology. Pathlon MCP (Supabase) holds live project state. No Notion copy of framework context.

## 3. Current-state inventory (verified Sept 23, 2026)

| Area | Finding | Impact |
|---|---|---|
| Pathlon MCP | Live and remote. 10 tools. Returns real skill content. Reachable from Chat. All tools keyed on Figma `file_id`. | Spine exists. Needs re-keying to work outside Figma. |
| Local `apdf` MCP | Second MCP server in APDF repo (`mcp/`), stdio, 18 tools, each returns a prompt template. Requires local build. | Duplicates what skills and commands already do. |
| Project state | Three homes: `.apdf/context.json` (local per repo), Supabase via Pathlon, and hand-pasted phase handoff blocks. | Context gets lost or diverges across surfaces. |
| Methodology source | Three homes: repo `skills/`, installed Claude skills, Pathlon's served content. | Drift confirmed (see below). |
| Skill drift | `problem-framing`: installed 251 lines vs repo 355. `concept-generation`: installed 388 vs repo 328. `user-research`: installed and served by Pathlon as the Phase 01 skill, but not in the repo (repo has `research-planning`). | Unknown which version is canonical. |
| Skill format | Repo skills are flat `.md` files, not `skill-name/SKILL.md` folders. | Cannot be packaged as a Claude Code plugin as-is. |
| Installed duplicates | Two `frontend-design`; `user-research` vs `design:user-research`; `design-systems` vs `design:design-system` vs `design-system-audit`; `phase-handoff` vs `skill-chaining`. | Unpredictable skill triggering. |
| Claude Code assets | APDF `.claude/`: 6 agents, 21 commands, 3 hooks. ASPF `.claude/`: 9 commands. | Good raw material for the plugin. |
| Figma in Chat | Figma connector authenticated in Chat (Pro team, full seat). | Retire the "Figma MCP only works in Code" rule. |
| Activity | APDF last commit May 10, 2026. ASPF last commit May 26, 2026. `CLAUDE.md` still describes the local `apdf` MCP and `context.json` flow. | Docs are stale; Code will act on outdated context. |

## 4. Target architecture

```
                 Claude Code  /  Claude Chat  (front door)
                              |
        +---------------------+---------------------+
        |                     |                     |
   BRAIN                 MEMORY SPINE             HANDS
   Pathlon plugin        Pathlon MCP             Figma MCP, Notion,
   (skills, commands,    (Supabase)              Drive, Supabase,
   agents, hooks)        project state,          etc.
   source: GitHub        memories, phase
                         progress
                              |
                    Pathlon for Figma
                    (companion: reads spine,
                     shows phase status)

   Upstream input: engagement brief (from ASPF or any source)
```

**Rules**
1. GitHub is the single source of methodology. Installed skills and Pathlon's served content are generated from it, never edited directly.
2. Pathlon MCP is the single source of project state. No `context.json`, no pasted handoff blocks as the primary mechanism.
3. A project exists independently of any Figma file. A Figma file is a linked artifact.
4. The Figma plugin reads and displays. It does not orchestrate.

## 5. Plan

### Phase 1: Clean the foundation (1 to 2 Code sessions)

**5.1 Pick canonical skills**
- Diff each installed skill against its repo counterpart. For each pair, choose the stronger version (or merge) and commit it to the repo.
- Resolve `user-research` vs `research-planning`: one name, one file.
- Acceptance: every Phase skill exists once, in the repo, and Pathlon's `get_skill_doc` for phases 01 to 06 returns content that matches the repo after `refresh_methodology`.

**5.2 Remove duplicates from installed skills**
- Consolidate: `frontend-design` (keep one), `user-research` family, design-system family, `phase-handoff` + `skill-chaining` (merge into one).
- Acceptance: no two installed skills share a primary trigger. Quin confirms by removing the extras in Settings.

**5.3 Refresh `CLAUDE.md`**
- Rewrite to describe the target architecture: Pathlon MCP as state, repo as methodology, local `apdf` MCP deprecated.
- Acceptance: a fresh Code session reading only `CLAUDE.md` describes the system correctly.

### Phase 2: Rewire (2 to 3 Code sessions)

**5.4 Re-key Pathlon MCP to projects** *(needs Quin's go on schema change)*
- Add a `projects` table: `id`, `name`, `created_at`, `current_phase`, optional `figma_file_id`, optional `repo`.
- Add `project_id` to `project_memories`, `intervention_log`, `project_artifacts`. Backfill existing rows from `file_id`.
- All tools accept `project_id` or `file_id` (resolve `file_id` to project). Keep `file_id` working so the Figma plugin does not break.
- New tools: `create_project`, `list_projects`, `link_artifact` (Figma file, repo, doc URL).
- Add `brief` to `memory_type` enum. This is the engagement brief input; ASPF's Master Client Brief or any other upstream brief lands here.
- Acceptance: from Chat, create a project with no Figma file, write a memory, read it back from Code. Existing Figma-keyed projects still resolve.

**5.5 Package Pathlon for Claude Code as a plugin**
- Convert repo skills to `skills/<name>/SKILL.md` folders.
- Structure [likely format; verify against current Claude Code plugin docs]:
  ```
  pathlon/
    .claude-plugin/plugin.json
    skills/<name>/SKILL.md
    commands/
    agents/
    hooks/
    .mcp.json          # points to mcp.pathlon.io
  ```
- Port the 6 agents and prune the 21 commands to the ones that map to real work. Target 8 or fewer to start.
- Hooks: replace `inject-context.sh` (reads `context.json`) with a session-start step that calls `get_project_context`.
- Acceptance: in a fresh repo, installing the plugin gives Code the skills, commands, and Pathlon MCP with no manual setup.

**5.6 `/pathlon:start` intake command**
- Implements the under-90-second intake already designed: read the brief and any linked Figma file in parallel, ask 3 or fewer diagnostic questions, create or resume the project in Pathlon, route to a phase entry point.
- Acceptance: running `/pathlon:start` in a new repo produces a project in Pathlon and a recommended starting phase in one exchange.

**5.7 Deprecate the local `apdf` MCP**
- Its 18 tools are prompt templates, which is what skills and commands are. Fold anything unique into commands, then remove `mcp/` from the APDF repo (keep in git history).
- Acceptance: nothing in the plugin or `CLAUDE.md` references `mcp__apdf__*`.

**5.8 Chat parity**
- Build script that zips each canonical skill for upload to Claude Chat, so Chat skills are generated from the repo.
- Acceptance: one command regenerates all Chat skill zips from the repo.

### Phase 3: Dogfood (2 to 3 weeks)

- Use Pathlon on one live design workstream and one strategy task.
- **Friction log:** after each session, Claude calls `write_memory` with `memory_type: "pattern"` recording surface, skill that fired, whether it helped, and anything Quin had to re-explain.
- Rule: any skill or command that does not fire usefully during the window gets merged or archived.

### Phase 4: Evolve weekly

- Fold into the existing weekly build-process review. Pull the week's `pattern` memories, ship one Pathlon improvement per week.

### Parallel, lower priority

- **Rebrand repo** to Pathlon. Since the site is now local-only, a rename no longer breaks a public site URL. Update the local dev path and any hardcoded `/agentic-product-design-framework/` base path when renaming.
- **Pathlon for Figma** refactor to companion role (read spine, show phase status). Only after 5.4 lands.

## 6. Success measures

| Measure | Target | When |
|---|---|---|
| Context re-explained when switching surfaces | Zero times per week | End of dogfood |
| Right skill fires on first try | 80%+ of logged sessions | End of dogfood |
| Real deliverables produced through Pathlon | 5+ | End of dogfood |
| Skills and commands cut or merged | Any nonzero number is a healthy sign | End of dogfood |
| Methodology sources | 1 (GitHub) | End of Phase 1 |
| State sources | 1 (Pathlon MCP) | End of Phase 2 |

## 7. Non-goals

- **ASPF integration beyond the brief input.** Separate framework; revisit after dogfood.
- **New skills or phases.** This is consolidation, not expansion.
- **Companion dashboard (Supabase + FlutterFlow).** Remains paused.
- **Gate confidence scoring and proactive interventions.** Wait for dogfood data.

## 8. Open questions

| Question | Owner | Blocking? |
|---|---|---|
| Approve the Supabase schema change in 5.4? | Quin | **Approved Sept 23, 2026** |
| Which live workstream to dogfood on? | Quin | **Decided Sept 23, 2026: Courtside IQ (primary), tournament app (secondary)** |
| Is Cursor still part of the workflow? If not, drop `.cursor/rules` upkeep. | Quin | No |
| Does heavy `use_figma` work behave the same in Chat as in Code? | Test during dogfood | No |

## 9. First Claude Code prompt

> Read `docs/specs/pathlon-rewire-spec.md`, starting with section 0. Resolve the uncommitted planning files first, then execute Phase 1 (5.1 to 5.3). Start with 5.1: list each installed-vs-repo skill pair, show the diff summary, and recommend the canonical version for each. Stop for my review before committing.

## 10. Folded in from earlier plans

Resolved Sept 23, 2026. This spec governs; where an earlier plan conflicts with it, the spec wins. Source files are archived in `docs/archive/`.

- **5.4: carry artifact columns into the migration.** When adding `project_id` to `project_artifacts`, also add `phase`, `type`, `source` (`framework` | `custom`), and `produced_by`. *Source: `apdf-agent-evolution-plan.md`, Part 3.*
- **5.4: `link_artifact` replaces the local artifact registry.** It covers the registry's `register` and `lookup` jobs; gap listing becomes a read over the project's artifacts in Pathlon MCP. Retire `.claude/tools/artifact-registry.ts`, `.apdf/registry.json`, and the registry's standalone/direct-Supabase modes. *Source: `apdf-agent-evolution-plan.md`, Part 3.*
- **5.5: keep the agent goals when porting.** Each agent's Primary Goal and Definition of Done (already in `.claude/agents/`, commit `d92c687`) and the Orchestrator's Phase Gap Analysis move into the plugin, with artifact checks pointed at Pathlon MCP instead of `.apdf/artifacts/` and handoff blocks. The Orchestrator is the one agent without its own Primary Goal and Definition of Done; the draft in the source plan is used when it is ported. *Source: `apdf-agent-evolution-plan.md`, Parts 1 and 2.*
- **5.1: extra evidence of skill drift.** The outcome-orientation plan targets `skills/01-discover/user-research.md`, which does not exist in the repo (the repo has `research-planning.md`). This confirms the `user-research` vs `research-planning` split to resolve in 5.1. *Source: `apdf-outcome-orientation-handoff.md`, Task 2.*

### Parking lot

Adds scope. Not scheduled; revisit after dogfood (Phase 3) unless noted.

- **`framework_signals` table.** Cross-project tally of custom artifacts flagged as candidates for framework promotion. Overlaps Phase 3's `pattern` memories; decide whether it adds anything beyond them. *Source: `apdf-agent-evolution-plan.md`, Part 3.*
- **Outcome Hill skill.** New Define skill binding user, behavior, business outcome, signal, and time horizon in one sentence. Candidate to trial on Courtside IQ during dogfood. *Source: `apdf-outcome-orientation-handoff.md`, Task 1.*
- **Outcomes & KPIs headers on phase skills.** Per-phase business outcome, design KPI, and risk (Cagan's four risks) at the top of each phase skill. If adopted, apply to the canonical skills after 5.1 so they are only edited once. *Source: `apdf-outcome-orientation-handoff.md`, Task 2.*
- **System visualization.** Redraw the animated system diagram from the section 4 target architecture after Phase 2; the archived version shows the old `context.json` / local-MCP design. *Source: `apdf-system-viz.html`.*
