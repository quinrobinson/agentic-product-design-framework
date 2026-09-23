# CLAUDE.md — Pathlon (repo: agentic-product-design-framework)

Pathlon is an agentic product design framework with six phases: Discover → Define → Ideate → Prototype → Validate → Deliver. Claude (Code or Chat) is the front door; Figma is one tool among several.

**Governing plan:** [`docs/specs/pathlon-rewire-spec.md`](docs/specs/pathlon-rewire-spec.md). Read section 0 first. It overrides older docs and the plans in `docs/archive/`. Stop for Quin's review at the end of each numbered step.

---

## Architecture

| Layer | What | Source of truth |
|---|---|---|
| **Brain** | Skills, commands, agents, hooks | This repo, packaged as the Pathlon for Claude Code plugin (`pathlon/`) |
| **Memory spine** | Project state, memories, phase progress, artifacts | Pathlon MCP (`mcp.pathlon.io`, Supabase), source in `../pathlon-mcp` |
| **Hands** | Figma MCP, Notion, Drive, Supabase, etc. | External |

Rules:
1. **This repo is the only source of methodology.** Installed Claude skills and Pathlon's served skill content are generated from it. Edit skills here, never in `~/.claude/skills/` or claude.ai Settings.
2. **Pathlon MCP is the only store for project state.** Read and write it with the Pathlon tools (`get_project_context`, `get_memories`, `write_memory`, `get_skill_doc`, ...). Handoff blocks are not the primary mechanism.
3. **A project exists independently of any Figma file.** A Figma file is a linked artifact. (Until spec 5.4 lands, Pathlon tools are still keyed on Figma `file_id`.)

---

## Repo layout

- `pathlon/` — the Claude Code plugin, and the canonical source for all methodology:
  - `skills/<name>/SKILL.md` — every skill. The `phase:` frontmatter sets its phase; phase skills start with an Outcomes & KPIs header. Cross-phase skills are listed in `web/sync-content.mjs`.
  - `agents/` — 6 agents (orchestrator + 5 specialists). `commands/` — 7 slash commands (`/pathlon:kickoff`, `/pathlon:route`, `/pathlon:transition`, …).
  - `hooks/` — SessionStart hook pointing Claude at Pathlon MCP. `.mcp.json` — Pathlon MCP (`https://mcp.pathlon.io/mcp`).
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
```

Open **http://localhost:3456/agentic-product-design-framework/** (port set in `.claude/launch.json`; the base path is required).

---

## Deprecated (do not build on)

- **Local `apdf` MCP** (`mcp/`, `mcp__apdf__*` tools). Its tools are prompt templates that duplicate skills and commands. Removed in spec 5.7.
- **`.apdf/context.json` and the hooks that read it** (`inject-context.sh`, `ds-gate.sh`, `figma-write-log.sh`). Project state lives in Pathlon MCP. Replaced in the plugin by `pathlon/hooks/session-start.sh`; this repo's `.claude/settings.json` still loads the old hooks until 5.7.
- **`docs/archive/commands/`** — the 17 commands pruned in 5.5 (kept for reference, not loaded).
- **`.apdf/artifacts/`, `.apdf/registry.json`, `.claude/tools/artifact-registry.ts`.** Superseded by Pathlon's `link_artifact` (5.4).

Do not edit generated output: `web/dist/`, `web/public/skills/`, `web/public/agents/`, `mcp/dist/`.
