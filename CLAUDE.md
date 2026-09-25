# CLAUDE.md — Pathlon (repo: agentic-product-design-framework)

Pathlon is an agentic product design framework with six phases: Discover → Define → Ideate → Prototype → Validate → Deliver. Claude (Code or Chat) is the front door; Figma is one tool among several.

**Governing plan:** [`docs/specs/pathlon-rewire-spec.md`](docs/specs/pathlon-rewire-spec.md). Read section 0 first. It overrides older docs and the plans in `docs/archive/`. Stop for Quin's review at the end of each numbered step.

---

## Architecture

| Layer | What | Source of truth |
|---|---|---|
| **Brain** | Skills, commands, agents, hooks | This repo, packaged as the Pathlon for Claude Code plugin (`pathlon/`) |
| **Memory spine** | Project state, memories, phase progress, artifacts | Local Pathlon MCP bundled in the plugin (`pathlon/server/`), reading and writing `.pathlon/` files in each project |
| **Hands** | Figma MCP, Notion, Drive, etc. | External |

Rules:
1. **This repo is the only source of methodology.** Installed Claude skills and Pathlon's served skill content are generated from it. Edit skills here, never in `~/.claude/skills/` or claude.ai Settings.
2. **`.pathlon/` is the only store for project state**, read and written through the Pathlon MCP tools (`get_project_context`, `get_memories`, `write_memory`, `link_artifact`, `set_phase`, …) — never by hand, never duplicated elsewhere. Handoffs are saved there, not pasted. No network or account is involved.
3. **A project is a folder** (the nearest `.pathlon/` above the working directory), or `~/.pathlon/projects/<name>/` for work without one. A Figma file is a linked artifact, not the project.

---

## Repo layout

- `pathlon/` — the Claude Code plugin, and the canonical source for all methodology:
  - `skills/<name>/SKILL.md` — every skill. The `phase:` frontmatter sets its phase; phase skills start with an Outcomes & KPIs header. Cross-phase skills are listed in `web/sync-content.mjs`.
  - `agents/` — 6 agents (orchestrator + 5 specialists). `commands/` — 7 slash commands (`/pathlon:kickoff`, `/pathlon:route`, `/pathlon:transition`, …).
  - `hooks/` — SessionStart hook pointing Claude at Pathlon MCP. `.mcp.json` — runs the local Pathlon MCP (`server/index.mjs`) over stdio.
  - `server/` — the local Pathlon store (Revision 1): `store.mjs` reads and writes `.pathlon/` project files, format in `FORMAT.md`. Test with `node --test pathlon/server/store.test.mjs`. `index.mjs` is the MCP server (no dependencies); test with `node --test pathlon/server/server.test.mjs`. The remote Worker and Supabase (`../pathlon-mcp`) are frozen until optional sync (spec 11.2).
  - Validate with `claude plugin validate ./pathlon`; try it with `claude --plugin-dir ./pathlon`.
- `.claude-plugin/marketplace.json` — makes this repo installable: `/plugin marketplace add quinrobinson/agentic-product-design-framework`, then `/plugin install pathlon@pathlon`.
- `.claude/agents/spec-reviewer.md` — reviews each rewire step against the spec. Not part of the plugin.
- `web/` — Vite + React 19 site for viewing the framework. `App.jsx` is the router/shell; each `.jsx` in `src/` is a tool page. `SkillsLibrary.jsx` is a standalone overlay not imported by `App.jsx`, so keep its skill list in sync with `App.jsx`.
- `docs/specs/` — current plans. `docs/archive/` — superseded plans (read-only reference).
- `artifacts/` — standalone JSX tools and the onboarding deck.

---

## Local site (local-only)

GitHub Pages auto-deploy is paused (`.github/workflows/deploy.yml`, manual trigger only). The site runs locally and serves skills and agents from `pathlon/` (copied into `web/public/` in the phase-folder layout the site expects).

```bash
cd web && npm install
npm run dev      # syncs skills/agents into web/public, then serves
npm run build    # production build check
npm run lint
npm run chat-skills   # build/chat-skills/<name>.zip for upload to Claude Chat (generated from pathlon/skills)
```

Open **http://localhost:3456/agentic-product-design-framework/** (port set in `.claude/launch.json`; the base path is required).

---

## Removed (do not reintroduce)

Removed in spec 5.7; still in git history before that commit.
- **The local APDF MCP server** (`mcp/`). Its tools were prompt templates duplicating skills and commands.
- **Local project state** (`.apdf/` context, artifacts, registry, phase manifest), the `.claude/hooks/` that read it, `.claude/tools/artifact-registry.ts`, and `.claude/settings.json`. Project state lives in Pathlon MCP; the plugin's `session-start.sh` points Claude at it.
- **`docs/archive/commands/`** holds the 17 commands pruned in 5.5 (reference only, not loaded).

Do not edit generated output: `web/dist/`, `web/public/skills/`, `web/public/agents/`, `build/`.
