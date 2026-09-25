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
- **Working split:** Claude Code executes. Claude Chat (Pathlon project) reviews and decides. When to stop is set by the working rules below.

### Working rules (added Sept 23, 2026, after Phase 1)

- Execute steps back-to-back. After each step, run the `spec-reviewer` agent (`.claude/agents/spec-reviewer.md`) and fix any failures before continuing.
- Stop for Quin only when: (a) about to do something destructive or hard to undo (production database changes, deleting files, force pushes, changing repo visibility), (b) a decision changes scope or conflicts with the spec, or (c) a phase is complete.
- At each stop, give a short summary: what was done, what the reviewer flagged, and what decision is needed.

---

## 1. Problem

Pathlon was designed with Figma as the front door and the Figma file as the project's identity. Day-to-day work now happens in Claude Code and Claude Chat, reaching Figma through the Figma MCP. The framework is portable in theory but not in practice: methodology lives in three places, project state lives in three places, and every Pathlon tool is keyed to a Figma file.

**Goal:** make Pathlon usable in everyday work from any Claude surface, with Claude as the front door and Figma as one tool among several.

## 2. Positioning (locked)

- **Pathlon is an agentic product design framework.** Six phases: Discover, Define, Ideate, Prototype, Validate, Deliver.
- **Naming family:** Pathlon (framework), Pathlon MCP (memory spine), Pathlon for Claude Code (plugin), Pathlon for Figma (companion plugin).
- **ASPF stays a separate framework.** It connects to Pathlon only through a generic engagement brief input (see 5.4). Pathlon does not own strategy. *(Superseded Sept 25, 2026: ASPF folds into Pathlon as the AI track. See section 12.)*
- **Two stores only.** GitHub holds methodology. Pathlon MCP (Supabase) holds live project state. No Notion copy of framework context. *(Superseded Sept 25, 2026: state lives in local `.pathlon/` files. See section 11.)*

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
   (skills, commands,    (local .pathlon/        Drive, Supabase,
   agents, hooks)        files, section 11)      etc.
                         project state,
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
2. Pathlon MCP is the single source of project state. No `context.json`, no pasted handoff blocks as the primary mechanism. *(Superseded Sept 25, 2026: backed by local `.pathlon/` files, not Supabase. See section 11.)*
3. A project exists independently of any Figma file. A Figma file is a linked artifact.
4. The Figma plugin reads and displays. It does not orchestrate.

## 5. Plan

### Phase 1: Clean the foundation (1 to 2 Code sessions)

**5.1 Pick canonical skills**
- Diff each installed skill against its repo counterpart. For each pair, choose the stronger version (or merge) and commit it to the repo.
- Resolve `user-research` vs `research-planning`: one name, one file.
- Acceptance: every Phase skill exists once, in the repo, and Pathlon's `get_skill_doc` for phases 01 to 06 returns content that matches the repo after `refresh_methodology`.

**5.2 Remove duplicates from installed skills** *(folded into 5.5 and 5.8, Sept 23, 2026)*
- Duplicate installed skills are removed when they are replaced: Claude Code copies in 5.5, Chat account copies in 5.8.

**5.3 Refresh `CLAUDE.md`**
- Rewrite to describe the target architecture: Pathlon MCP as state, repo as methodology, local `apdf` MCP deprecated.
- Acceptance: a fresh Code session reading only `CLAUDE.md` describes the system correctly.

### Phase 2: Rewire (2 to 3 Code sessions)

**5.4 Re-key Pathlon MCP to projects** *(superseded by 11.4 R2, done Sept 25, 2026)*
- Add a `projects` table: `id`, `name`, `created_at`, `current_phase`, optional `figma_file_id`, optional `repo`.
- Add `project_id` to `project_memories`, `intervention_log`, `project_artifacts`. Backfill existing rows from `file_id`.
- All tools accept `project_id` or `file_id` (resolve `file_id` to project). Keep `file_id` working so the Figma plugin does not break.
- New tools: `create_project`, `list_projects`, `link_artifact` (Figma file, repo, doc URL).
- Switch the Phase 01 `get_skill_doc` mapping from `user-research` (retired in 5.1) to `research-planning` and `research-synthesis`.
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
- When the plugin is installed, remove the old copies in `~/.claude/skills/` so they don't conflict.
- Acceptance: in a fresh repo, installing the plugin gives Code the skills, commands, and Pathlon MCP with no manual setup.

**5.6 `/pathlon:start` intake command** *(superseded by 11.4 R4)*
- Implements the under-90-second intake already designed: read the brief and any linked Figma file in parallel, ask 3 or fewer diagnostic questions, create or resume the project in Pathlon, route to a phase entry point.
- Acceptance: running `/pathlon:start` in a new repo produces a project in Pathlon and a recommended starting phase in one exchange.

**5.7 Deprecate the local `apdf` MCP**
- Its 18 tools are prompt templates, which is what skills and commands are. Fold anything unique into commands, then remove `mcp/` from the APDF repo (keep in git history).
- Acceptance: nothing in the plugin or `CLAUDE.md` references `mcp__apdf__*`.

**5.8 Chat parity**
- Build script that zips each canonical skill for upload to Claude Chat, so Chat skills are generated from the repo.
- Regenerate all Chat skills from the repo, then remove outdated account copies in Settings, including `user-research`.
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
- **5.1: add Outcomes & KPIs headers to every canonical phase skill.** Per-phase business outcome, design KPI, and risk (Cagan's four risks), using the locked per-phase wording in the source file. Inserted after the H1 and before the first section, followed by `---`. Applied once, to the canonical versions chosen in 5.1. Cross-phase skills are excluded. This completes an earlier approved decision; it is not new scope. *Source: `apdf-outcome-orientation-handoff.md`, Task 2.*

- **Design systems: bring your own (decided Sept 23, 2026).** Pathlon no longer builds design systems. The system lives in a Figma library or Claude Design; Pathlon reads it, maps work to it, checks work against it, and proposes gaps back to its owner. `design-systems`, `design-system-audit`, `figma-ds-audit`, and `figma-ds-export` merge into one cross-phase `design-system` skill; the Systems Designer agent is reworked around it. The site's Design System Studio, Design System Builder, and the token/checklist/M3 artifacts are removed. This is consolidation (four skills into one), not new scope. *Source: Quin, during Phase 2.*

### Parking lot

Adds scope. Not scheduled; revisit after dogfood (Phase 3) unless noted.

- **`framework_signals` table.** Cross-project tally of custom artifacts flagged as candidates for framework promotion. Overlaps Phase 3's `pattern` memories; decide whether it adds anything beyond them. *Source: `apdf-agent-evolution-plan.md`, Part 3.*
- **Outcome Hill skill.** New Define skill binding user, behavior, business outcome, signal, and time horizon in one sentence. Candidate to trial on Courtside IQ during dogfood. *Source: `apdf-outcome-orientation-handoff.md`, Task 1.*
- **UI pattern recommendations.** Watch for need during Courtside IQ dogfood. Previously only in the retired installed `concept-generation`. *Source: 5.1 skill review.*
- **System visualization.** Redraw the animated system diagram from the section 4 target architecture after Phase 2; the archived version shows the old `context.json` / local-MCP design. *Source: `apdf-system-viz.html`.*

---

## 11. Revision 1: local-first and agentic

**Status:** Approved Sept 25, 2026. This section supersedes section 2's "two stores" line, section 4 rule 2 and the MEMORY SPINE box, and steps 5.4 and 5.6.

### 11.1 Why

- **Supabase is a single point of failure for memory.** The `pathlon` project paused and every stateful tool broke. Supabase fit a Figma-first, account-based product. Pathlon is now driven by Claude Code, and Figma is reached through the Figma MCP.
- **Users should own their data.** Most work happens in a folder on the designer's machine. Project state should live there as plain files: portable, readable, no account.
- **Pathlon only acts when Claude remembers to call it.** MCP tools run when the model chooses to; hooks run every time. Moving state local lets hooks do the routine work, so the designer isn't the trigger.
- **The six agents are role prompts, not agents.** They keep no state, don't check their own work, and don't loop. Claude Code now supports what real agents need: per-agent models, tool lists and memory, nested subagents, and hooks that can check an agent's output and send it back.

### 11.2 Decisions

1. **Local-first state.** Project state lives on the user's machine. Supabase becomes optional sync later (claude.ai web and mobile, multiple devices, public accounts). It's on the roadmap, not in this revision.
2. **Claude Code drives.** Claude Desktop works too through the same local server. claude.ai web and mobile get project memory when sync exists.
3. **Figma is unaffected.** Figma work goes through the Figma MCP. The Pathlon for Figma plugin is paused until sync exists or a local bridge is worth building.
4. **Automatic by default.** State flows in and out through hooks. Agents and skills are chosen from intent plus project state. Claude asks one clarifying question when intent is unclear, instead of guessing.
5. **The remote Worker and Supabase are frozen, not deleted.** The 5.4 migration and plan in `pathlon-mcp` are shelved for the sync phase.

### 11.3 Architecture

```
             Claude Code  /  Claude Desktop   (front door)
                          |
   hooks: SessionStart · UserPromptSubmit · SubagentStop · PreCompact · SessionEnd
                          |
        +-----------------+------------------+
        |                 |                  |
   BRAIN              MEMORY               HANDS
   Pathlon plugin     Local Pathlon MCP    Figma MCP, Notion,
   skills, agents,    (bundled in the      Drive, etc.
   router, hooks      plugin, stdio)
                          |
                    .pathlon/ in the project folder
                    (or ~/.pathlon/projects/<name>/)
                          |
                  later: optional sync (Supabase)
                  → claude.ai web/mobile, devices, teams
```

**Rules** (replace section 4 rules 2 and 4):
- **One store:** `.pathlon/` for the project, read and written only through the local Pathlon MCP and hooks. Never by hand, never duplicated elsewhere.
- **A project is a folder:** the nearest `.pathlon/` above the working directory. Work without a folder lives in `~/.pathlon/projects/<name>/.pathlon/`, and every project is listed in `~/.pathlon/projects.json`.
- **Plain files:** readable and diffable, so the designer can see and edit their own data.

### 11.4 Plan

Each step ends with the spec-reviewer. The stop rules in section 0 apply.

**R1 — Local store format**
- `.pathlon/project.json`: name, current phase, phase statuses, links (Figma files, repo, docs, design system source).
- `.pathlon/log.jsonl`: append-only memories (`decision`, `context`, `handoff`, `brief`, `pattern`), each with a timestamp, phase, agent and summary.
- `.pathlon/handoffs/<phase>-<name>.md` (e.g. `02-define.md`): the latest readable handoff for each phase.
- Acceptance: the format is documented in the plugin (`pathlon/server/FORMAT.md`), and a fixture project round-trips through R2's tools.
- **Done Sept 25, 2026:** `pathlon/server/store.mjs` (zero dependencies), `FORMAT.md`, a fixture, and 12 passing tests, including a fixture round-trip through the store functions R2's tools will call. The round-trip through the tools themselves is carried into R2's acceptance.
- Additions beyond the list above: memory types `preference` (carried over from the remote MCP) and `session` (for R3); link kinds `artifact` and `other` with `produced_by` and `source` (for `link_artifact`); `settings.share_in_git` (the 11.6 decision).

**R2 — Local Pathlon MCP (replaces 5.4)**
- A Node stdio server bundled in the plugin (`${CLAUDE_PLUGIN_ROOT}`) and registered in the plugin's `.mcp.json` in place of the remote Worker.
- Tools: `get_project_context`, `get_memories`, `write_memory` and `recommend_starting_point` keep their current names. `create_project`, `list_projects` and `link_artifact` are added. `file_id` is no longer required.
- Figma-specific tools (`get_figma_actions`, `log_figma_activity`, `detect_patterns`) are kept only where the local version is useful. The rest wait for sync.
- Acceptance: in a fresh folder, create a project, write a memory, and read it back in a new session. Nothing touches the network. Also closes R1's round-trip: copy `pathlon/server/fixtures/sample-project`, then over stdio call `get_project_context` (no `file_id`), `write_memory`, `get_memories`, `link_artifact` and `list_projects`, and confirm the files match the store tests.
- R2 also updates `CLAUDE.md` (architecture, rule 2, `.mcp.json`) and `hooks/session-start.sh` to the local model.
- **Done Sept 25, 2026:** `pathlon/server/index.mjs`, a zero-dependency stdio MCP server wrapping the R1 store, registered in the plugin's `.mcp.json` in place of the remote Worker (plugin 0.2.0).
  - **Tools (10):** `get_project_context`, `get_memories`, `write_memory`, `recommend_starting_point`, `create_project`, `list_projects`, `link_artifact`, plus `set_phase` (needed by `/pathlon:transition`), and local versions of `detect_patterns` and `log_figma_activity`.
  - **Dropped:** `get_skill_doc`, `get_phase_prompts`, `get_figma_actions` and `refresh_methodology` served methodology from the remote server; the plugin's skills do that now.
  - **Tests:** 19 passing, including the R1 fixture round-trip over stdio and create → write → read back from a new server process.
  - **Verified in Claude Code:** the server connects in a fresh folder and lists all 10 tools. No network modules are imported.

**R3 — Automatic context (hooks)**
- **SessionStart:** inside a Pathlon project, inject the project, phase, open questions, recent decisions and suggested next step. Outside one, stay silent. This fixes the plugin firing in unrelated repos.
- **UserPromptSubmit:** inside a project, add a short routing hint (phase plus the matching agent or skill). No output otherwise.
- **PreCompact and SessionEnd:** record a session summary to the log, so progress survives compaction and session end.
- Acceptance: pick up a project in a new session with no prompt about where things stand, and get the correct phase and next step. An unrelated repo shows no Pathlon context.

**R4 — Agents that act (replaces 5.6)**
- **Router:** the main session routes using the injected state and an intent-to-agent map in an always-available `pathlon` skill. When intent is unclear it asks one question. `/pathlon` becomes the single optional entry point; the other commands stay only if R5's evals show they help.
- **Orchestrator:** a coordinating subagent that runs a whole phase and spawns specialists (nested subagents, supported to 3 levels).
- **Specialists:** each gets its own model, tool list, preloaded skills, persistent memory and turn limit. Long synthesis can run in the background.
- **Definition of Done checks:** a `SubagentStop` hook (prompt or agent type) checks each specialist's output against its Definition of Done. If it fails, the agent gets the reason and continues, up to a retry limit. Results are recorded to `.pathlon/`.
- Verify during build: whether an agent's tool list can name specific MCP tools, and the exact input the `SubagentStop` hook receives.
- Acceptance: "we finished the interviews, here are the notes" leads, with no command, to the Researcher running, its output passing its Definition of Done, and the result being logged. An ambiguous request produces exactly one clarifying question.

**R5 — Triggers and evals**
- A `claude plugin eval` suite in `pathlon/evals/` covering:
  - the right skill fires first (target 80%+)
  - the right agent is chosen
  - Definition of Done pass rate
  - no Pathlon activity in an unrelated repo
- Merge `phase-handoff` and `skill-chaining` into one skill (a leftover from 5.2), rewritten around saving handoffs to `.pathlon/`.
- Narrow skill descriptions that fire on general coding, e.g. `visual-design-execution` and `prototyping`. Update `which-claude` to the Code-drives model.
- Acceptance: the suite runs with one command and meets the targets. Results are logged as the baseline for Phase 4's weekly improvements.

**Then:** Phase 3 dogfood on Courtside IQ, unchanged.

**Later (roadmap, not scheduled):**
- **Optional sync:** reuse the Supabase schema and the Worker; `.pathlon/` stays the source of truth.
- **Pathlon for Figma:** returns via sync or a local bridge.
- **Public release:** accounts come in only through sync.

### 11.5 Success measures (replace the rows in section 6)

| Measure | Target |
|---|---|
| State sources | 1 (`.pathlon/`) |
| Network needed to remember a project | None |
| Pathlon commands the designer must type for a phase | 0 required (`/pathlon` optional) |
| Right skill or agent on first try | 80%+ in evals and in dogfood logs |
| Specialist output passing its Definition of Done | 90%+ after retries |
| Pathlon context injected in unrelated repos | 0 |

### 11.6 Decisions (Sept 25, 2026)

| Question | Decision |
|---|---|
| Commit `.pathlon/` to the project repo? | Yes by default; one setting per project to gitignore it (client work) |
| Commands | Keep all 7 until R5's evals decide |
| Remote Worker while frozen | Turn it off (Quin, in Cloudflare; the plugin stops pointing at it in R2) |

---

## 12. Revision 2: Build & Deliver, and the AI track

**Status:** Approved Sept 25, 2026.
- **Approved by Quin:** the phase model (12.2), the three new agents (12.3), the AI Strategist being part of Pathlon, and the `motion` skill (12.4, Sept 25, 2026).
- **ASPF fold-in (12.6):** approved by Quin as written, no changes.
- **Effect:** supersedes section 2's "ASPF stays a separate framework" line and section 7's first two non-goals.
- **Sequencing:** runs after Revision 1's R4, because the new agents are built on its router, local state and Definition of Done checks.

### 12.1 Why

Pathlon stops at design handoff; nothing covers building the product. Agencies deliver working software, and Pathlon's users increasingly build what they design with Claude Code. AI features also need their own discipline across every phase, not just in build. Courtside IQ is the example: turning performance data into insights.

### 12.2 Phase model (decided)

Phase 06 becomes **Build & Deliver**. The six-phase positioning stays; Build can split into its own phase later if it outgrows 06.

| Stage | Covers | Skills |
|---|---|---|
| **Handoff** | Design → build bridge | Today's Deliver skills: design-delivery, component-specs, handoff-annotation, accessibility-annotation, design-decision-record |
| **Plan the build** | Tickets and estimates from the handoff; definitions of ready and done; environments | New: `build-planning` |
| **Build** | Frontend, data and AI implementation | Via the new agents (12.3) |
| **QA & UAT** | Design QA against the build; accessibility in code; client acceptance (UAT) | design-qa, plus UAT added to it |
| **Launch & handover** | Launch checklist; release notes; monitoring; client handover | New: `launch-handover`; design-delivery keeps release notes |

Agency practices built into these skills:
- tickets sized from the handoff
- code review
- dev, staging and prod environments
- UAT sign-off
- a launch checklist with rollback
- a post-launch review
- a client handover package

### 12.3 New agents

Each agent starts broad and splits only when dogfooding or the evals show a need (Phase 4 rule).

| Agent | Scope | Phases |
|---|---|---|
| **AI Strategist** | AI *product* strategy: which AI features this product should have, what data they need, how they behave (trust, uncertainty, explanations), how output quality is tested, and how they're monitored after launch | Cross-phase, like the Orchestrator |
| **Frontend Developer** | Design fidelity in code: components from the design system, every state, responsive behavior, accessibility, and motion | Prototype (coded prototypes) and 06 Build |
| **Backend & Data Architect** | Data as the UI experiences it: the entities each screen needs, API contracts derived from screens, loading/empty/error/realtime states, and schema that supports the UI. Not business logic | 06 Build, with input from Define and Prototype |

The **Design Engineer** narrows to handoff and QA: it checks what the Frontend Developer builds against the design, and no longer builds it.

### 12.4 Motion: Pathlon's own `motion` skill

**Decided Sept 25, 2026:** Pathlon has its own cross-phase `motion` skill (`pathlon/skills/motion/`: `SKILL.md`, `RECIPES.md`, `ATTRIBUTION.md`). It's adapted from Emil Kowalski's MIT-licensed `animate` skill and recipes, credited in `ATTRIBUTION.md`.

What we kept from Emil's approach:
- a gate first: should this move at all, by how often people see it, and for what purpose?
- a fixed decision order
- real curve, duration and spring values
- hard rules and a "never ship" self-check

What we changed or added:
- **Design-system tokens first.** Missing motion tokens are proposed to the system's owner.
- **Two outputs:** a motion spec for Prototype and handoff, and an implementation for Build.
- **Every platform:** web, React Native, Flutter, SwiftUI, Jetpack Compose, Framer, Webflow and Figma. This covers the Flutter gap for Courtside IQ.
- **A short motion vocabulary.**
- **A data and stat updates recipe**, for dashboards.
- **Emil-specific parts removed:** his persona, his library picks, and links to his other skills.

How the pieces are used:
- **Review:** Emil's review and audit skills are replaced by the skill's "never ship" checklist, which `design-qa` uses.
- **Who uses it:** the Designer in Prototype (spec), the Frontend Developer in Build (implementation), and the Design Engineer in QA.
- **Delivered ahead of B3,** because it's content, not infrastructure.

### 12.5 Backend and data: route to existing skills

- **Existing skills:** strong ones already exist, e.g. the Supabase agent skills, the engineering plugin's architecture and system-design skills, and the Claude API skill. The Backend & Data Architect routes to whichever is installed.
- **What Pathlon adds:** one skill, `data-for-ui`: screens → entities → API contract → UI states. It's the design-side view those skills don't cover.

### 12.6 Folding ASPF into Pathlon (approved)

ASPF (`quinrobinson/ai-strategy-practice-framework`) already covers AI initiatives before, during and after. It has 22 skills, 7 role agents plus the Predictor, 9 commands, its own MCP and `.aspf/context.json`. Its `/handoff` already feeds APDF. Folding it in means one framework and one project state, so the bridge disappears.

**Map ASPF into Pathlon's phases as the AI track:**

| ASPF | Skills | Lands in Pathlon |
|---|---|---|
| **Before** | problem-qualification, use-case-prioritization, data-strategy, ai-method-selection, risk-mapping, outcome-definition, readiness-audit | Discover and Define |
| **During** | mid-project-audit, agent-design, responsible-ai, user-feedback-loops | Prototype, Validate, Build |
| **After** | retrospective, model-monitoring, mlops-readiness | Launch & handover |
| **Practice / org level** | maturity-model, operating-model, managed-service-model, stakeholder-alignment | A small AI-practice set for engagement-level work (the PepsiCo-type roadmaps) |
| **Always on** | failure-mode-library | See the Predictor below |

**Merge rather than add where Pathlon already has the skill:**

| ASPF skill | Merges into Pathlon's |
|---|---|
| stakeholder-interviews | research-planning |
| discovery | Discover |
| outcome-definition | KPI headers, and the Outcome Hill (parking lot) |
| retrospective | Phase 4 review |
| phase-routing | R4 router |

**Agents:**

| ASPF agent | Becomes |
|---|---|
| AI Strategy Lead, AI Product Manager | AI Strategist |
| ML / AI Engineer | Build-side AI work, shared by the AI Strategist and Backend & Data Architect |
| Ethics & Risk Advisor | A skill (responsible-ai + risk-mapping) and a check, not a separate agent |
| Change & Enablement Lead, AI Practice Lead | Practice skills |

**The Predictor becomes automatic.** The failure-mode library is checked by a hook or verifier (Revision 1's R3/R4 pattern), so ASPF's "always active" rule actually runs every time.

**The router adopts ASPF's decision-tree rules.** Several already match Revision 1: detect the entry point, ask at most one clarifying question, problem before solution, name the agent, end with one next action.

**Retire ASPF's own plumbing:** its MCP and KV store, `.aspf/context.json`, and the `/handoff` bridge. State lives in `.pathlon/`. The ASPF repo is archived once migration is done, and its site folds into Pathlon's.

**Caution:** 22 more skills nearly doubles what can trigger. Dedupe hard: target roughly 12–15 AI-track skills. R5's evals decide what stays.

### 12.7 Plan

Each step ends with the spec-reviewer.

| Step | Work | Acceptance |
|---|---|---|
| **B1** | Restructure 06 into the Build & Deliver stages; write `build-planning` and `launch-handover`; add UAT to design-qa | 06 skills cover handoff → launch; evals route build-planning and launch prompts correctly |
| **B2** | AI track: migrate and dedupe ASPF skills; AI Strategist agent; Predictor check | An AI-feature prompt ("turn game stats into player insights") routes to the AI Strategist, runs the right AI-track skills, and flags relevant failure modes without being asked |
| **B3** | Frontend Developer using the `motion` skill (already written; see 12.4); design-system-aware build | "Build this screen from the design" produces code using system tokens and components, with motion reviewed |
| **B4** | Backend & Data Architect; `data-for-ui`; routing to installed backend skills | A screen set produces entities, API contract and UI states that pass the agent's Definition of Done |
| **B5** | Extend the R5 evals to the new agents and the AI track | Targets from 11.5 met for the new agents |

**Then:** dogfood on Courtside IQ. It's Flutter, Supabase and the Claude API, so it exercises all three new agents and the AI track.
