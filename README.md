# Pathlon

**An agentic product design framework for Claude.** Six phases — Discover → Define → Ideate → Prototype → Validate → Deliver — delivered as skills, specialist agents, and commands that run in Claude Code, with project memory that stays on your machine.

You work the way you normally would ("synthesize these interview notes", "let's frame the problem", "spec the motion for this modal"). Pathlon picks up the right skill or agent, remembers where the project stands, and carries decisions and handoffs from one session to the next — so you never re-explain a project.

> **Status:** early and unfinished — shared publicly while it's being shaped, not yet ready for general use. Skills, agents, the plugin, and local project memory work today. Real agent orchestration and a Build & Deliver phase are in progress — see [Roadmap](#roadmap) and the governing plan in [`docs/specs/pathlon-rewire-spec.md`](docs/specs/pathlon-rewire-spec.md).

---

## How it works

```
          You, in Claude Code (or Claude Desktop)
                          │
   hooks load project context automatically, every session
                          │
     ┌────────────────────┼─────────────────────┐
     │                    │                     │
   BRAIN               MEMORY                 HANDS
   Pathlon plugin      .pathlon/ in your      Figma MCP and your
   42 skills           project folder,        other tools
   6 agents            managed by a local
   7 commands          Pathlon server
```

- **Brain — the plugin.** Skills hold the methodology for each phase (workflows, templates, quality checklists). Agents are specialists with a goal and a Definition of Done. Commands start and move whole phases.
- **Memory — `.pathlon/`.** The project's phase, decisions, handoffs, and links (Figma files, design system, deliverables) are saved as plain files in your project folder by a small server bundled in the plugin. No account, no database, no network.
- **Hands — your tools.** Design work happens where it always does. Claude reads and writes your own Figma files through the Figma MCP, and works from your existing design system (a Figma library or Claude Design) rather than inventing one.

---

## Before you start

- **Claude Code** (the CLI, or the Code tab in Claude Desktop).
- **Node.js 18 or newer** on your PATH — Pathlon's local server runs on it. Check with `node --version`; if it's missing, install it from [nodejs.org](https://nodejs.org).
- **Figma** — optional. To let Claude read and write your files, connect the Figma MCP in Claude Code.
- **Your design system** — optional but recommended: a Figma library or Claude Design. Pathlon reads it; it doesn't build one for you.

## Set up (Claude Code)

```
/plugin marketplace add quinrobinson/agentic-product-design-framework
/plugin install pathlon@pathlon
```

Restart Claude Code. Then, in your project's folder:

1. Run **`/pathlon:start`** (or just say "start a Pathlon project for this folder"). Claude asks three quick questions — the project and goal, where you are, the primary user — and creates `.pathlon/`.
2. Work normally. The right skills and agents are picked from what you ask and the phase you're in.
3. Next time you open this folder, Claude already knows the project: phase, next step, the latest handoff and its open questions, and recent decisions.

To update later: `/plugin update pathlon@pathlon`, then restart.

---

## Using it day to day

| What you do | What Pathlon does |
|---|---|
| **Open a session** in a Pathlon project | Loads where the project stands — automatically. Outside a Pathlon project it stays silent. |
| **Ask in plain language** ("cluster these ideas", "write the error states") | The matching skill loads; each message carries a one-line hint about the current phase and the agent that fits it. |
| **Ask for a specialist** ("have the researcher synthesize these notes") — or just describe the work | Runs the agent — Researcher, Strategist, Designer, Systems Designer, Design Engineer. Each ends with a Done report that's checked automatically against its Definition of Done; if something applicable is missing, it keeps working. |
| **`/pathlon:start`** | Starts or resumes the project and routes your request to the right agent or skill. |
| **`/pathlon:kickoff`** | Runs the current phase: the Orchestrator plans it, spawns the specialists in parallel, checks their work, and saves the result. |
| **`/pathlon:route`** | Recommends what to do next and which agent to use. |
| **`/pathlon:transition`** | Writes the phase handoff, closes the phase, and starts the next one. |
| **`/pathlon:synthesize-research`, `frame-problem`, `generate-concepts`, `design-qa`** | Shortcuts for the most common deliverables. |
| **End a session, or hit context compaction** | Records a factual session log (files changed, what was saved) so progress survives. |

Unsure what to do? Ask **"where does this project stand?"**, or run `/pathlon:start` or `/pathlon:route`.

## Your project data

Everything Pathlon remembers lives in `.pathlon/` inside your project — readable, diffable files you own:

```
.pathlon/
├── project.json     name, current phase, each phase's status, links
├── log.jsonl        decisions, context, handoffs, briefs — append-only
└── handoffs/        the latest readable handoff for each phase
```

- It's **committed with your project by default**, so it travels with the repo. For client work, say so when you start the project ("keep it out of git") — Pathlon then keeps `.pathlon/` out of git. This is set when the project is created; if a store was already committed, also run `git rm -r --cached .pathlon` once.
- **Your prompts are never stored.** Session logs record files changed and what was saved to Pathlon, nothing else.
- Work without a folder of its own (strategy, early research) lives in `~/.pathlon/projects/<name>/`.
- Format reference: [`pathlon/server/FORMAT.md`](pathlon/server/FORMAT.md).

## Using Pathlon in Claude Chat

Skills work in Claude Chat (claude.ai) too. Build upload-ready zips from this repo and add them under **Settings → Capabilities → Skills**:

```bash
cd web && npm install && npm run chat-skills   # → build/chat-skills/<name>.zip
```

Chat has the skills but not agents, commands, or project memory — `.pathlon/` lives on your machine. Optional sync for claude.ai on web and mobile is on the roadmap.

---

## What's inside

### Skills — `pathlon/skills/<name>/SKILL.md`

42 skills. Every phase skill opens with the business outcome it moves, the design KPI it improves, and the product risk it reduces.

| Phase | Skills |
|---|---|
| 01 — Discover | `research-planning`, `research-synthesis`, `competitive-analysis`, `service-blueprint`, `insight-framing` |
| 02 — Define | `problem-framing`, `journey-mapping`, `persona-creation`, `assumption-mapping`, `requirements-prioritization` |
| 03 — Ideate | `concept-generation`, `concept-proof`, `visual-design-execution`, `concept-critique`, `idea-clustering`, `storyboarding` |
| 04 — Prototype | `prototyping`, `accessibility-audit`, `user-flow-mapping`, `ux-copy-writing`, `prototype-scoping`, `heuristic-review`, `test-script-drafting` |
| 05 — Validate | `usability-testing`, `usability-findings-synthesis`, `insight-report`, `recruitment-screener`, `stakeholder-presentation`, `iteration-brief` |
| 06 — Deliver | `design-delivery`, `component-specs`, `design-qa`, `handoff-annotation`, `accessibility-annotation`, `design-decision-record` |
| Cross-phase | `start`, `design-system`, `motion`, `figma-playbook`, `phase-handoff`, `skill-chaining`, `which-claude` |

Three cross-phase skills worth knowing:
- **`start`** — Pathlon's front door (`/pathlon:start`): a three-question intake for a new project, and routing each request to the right agent or skill.
- **`design-system`** — finds your existing system (Figma library or Claude Design), maps screens to its components, checks work against it, and sends gaps to its owner.
- **`motion`** — decides whether something should move at all, then specs or builds it on any platform (web, React Native, Flutter, SwiftUI, Compose, Framer, Webflow, Figma), with recipes for common components.

### Agents — `pathlon/agents/`

Each agent declares a **Primary Goal** and a **Definition of Done**, so it knows what "finished" means before it starts, and ends every run with a **Done report**. When a specialist finishes, an automatic check reads that report against its Definition of Done (for the scope it was given) and sends it back to keep working if something applicable is missing. The Orchestrator can run a whole phase, spawning the specialists itself.

| Agent | Invoke when |
|---|---|
| **Orchestrator** | Starting a project, changing phases, or unsure which agent to use. Routes work and spawns specialists. |
| **Researcher** | Planning a study, synthesizing interviews or test sessions, competitive analysis, insight reports. |
| **Strategist** | Framing problems, journeys, personas, service blueprints, stakeholder decks. |
| **Designer** | Concepts, idea clustering, flows, UX copy, concept proofs, motion specs. |
| **Systems Designer** | Grounding screens in your design system: component mapping, architecture, states, gap reports. |
| **Design Engineer** | Handoff documentation, design QA against the build, accessibility annotation, decision records. |

### Commands — `pathlon/commands/`

`kickoff`, `route`, `transition`, `synthesize-research`, `frame-problem`, `generate-concepts`, `design-qa` — all prefixed `/pathlon:`.

---

## The design process

```
Discover → Define → Ideate → Prototype → Validate → Deliver
   ↑                                                  │
   └──────────────── iterate as needed ←──────────────┘
```

Each phase closes with a **handoff** — what was done, key artifacts, open questions, inputs for the next phase — saved to `.pathlon/` so the next phase (and the next session) starts with full context.

## AI leverage levels

Each skill is tagged with an AI leverage level:

- **High** — AI handles the heavy lifting (synthesis, generation, documentation). You review, refine, and direct.
- **Medium** — AI assists with structure and drafts. You bring judgment, context, and strategic thinking.
- **Low** — Fundamentally human skills (empathy, taste, stakeholder navigation). AI supports but doesn't replace.

---

## Roadmap

**Now — measured triggers** (Revision 1)
- An evaluation suite measuring whether the right skill and agent fire on the first try, and that Pathlon stays quiet in unrelated projects.
- Merging overlapping handoff skills and tightening skill descriptions that fire too broadly.

**Next — Build & Deliver and the AI track** (Revision 2)
- Phase 06 expands to **Build & Deliver**: handoff → build planning → build → QA and client acceptance → launch and handover, following agency practice.
- New agents: **AI Strategist** (AI features, data, trust, evaluation, monitoring — across all phases), **Frontend Developer** (design fidelity and motion in code), **Backend & Data Architect** (data as the UI experiences it).
- The AI Strategy Practice Framework folds in as Pathlon's AI track.

**Later**
- Optional sync so claude.ai on web and mobile, multiple devices, and teams share project memory — with `.pathlon/` staying the source of truth.

---

## Repository layout

| Path | What's there |
|---|---|
| `pathlon/` | The Claude Code plugin: `skills/`, `agents/`, `commands/`, `hooks/` (automatic context), `server/` (local project memory) |
| `.claude-plugin/marketplace.json` | Makes this repo installable as a plugin marketplace |
| `docs/specs/` | The governing plan. `docs/archive/` holds superseded plans. |
| `web/` | A local viewer for browsing skills, agents, and phases (`cd web && npm run dev`) |
| `artifacts/` | Earlier standalone tools and the onboarding deck (predate Pathlon's current model) |

## Contributing

To add or change a skill:
1. Edit it in `pathlon/skills/<name>/SKILL.md` — this repo is the only source; installed copies and Chat zips are generated from it.
2. Frontmatter: `name` (matches the folder), `phase` (`01 — Discover` … or `all`), `description` (what it does and when to use it — this is what makes it trigger), `ai_leverage`.
3. Phase skills open with an **Outcomes & KPIs** header; every skill ends with a quality checklist. Use structured templates with clear `[PLACEHOLDERS]`, and keep it actionable — workflows, not theory.
4. Check your work:
   ```bash
   claude plugin validate ./pathlon
   node --test pathlon/server/store.test.mjs pathlon/server/server.test.mjs pathlon/hooks/context.test.mjs
   claude --plugin-dir ./pathlon   # try the plugin without installing it
   ```

## Credits

The `motion` skill is adapted from [Emil Kowalski's animation skills](https://github.com/emilkowalski/skill) (MIT) — see [`pathlon/skills/motion/ATTRIBUTION.md`](pathlon/skills/motion/ATTRIBUTION.md).

## License

MIT — see [`LICENSE`](LICENSE).
