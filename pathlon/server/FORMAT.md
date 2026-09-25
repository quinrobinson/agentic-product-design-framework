# Pathlon local store format (schema 1)

Pathlon keeps project state as plain files the designer owns. Nothing is sent over the network.
Read and write these files through the Pathlon MCP tools (or `store.mjs`), not by hand: the tools keep
`project.json`, the log, and the registry consistent. Reading them yourself is always fine.

## Where a project lives

| Situation | Location |
|---|---|
| Work in a folder (a repo, a client folder) | `<folder>/.pathlon/` |
| Work with no folder (strategy, early research) | `~/.pathlon/projects/<slug>/.pathlon/` |

The **current project** is the nearest `.pathlon/project.json` found walking up from the working
directory. Every project is also listed in `~/.pathlon/projects.json`, so it can be found by id.
`PATHLON_HOME` overrides `~/.pathlon` (used by tests).

```
<project>/.pathlon/
├── project.json          # the project: phase, statuses, links, settings
├── log.jsonl             # append-only memories, one JSON object per line
├── handoffs/
│   └── 02-define.md      # latest readable handoff for each phase that has one
└── .gitignore            # present only when share_in_git is false (contains "*")
```

## `project.json`

```json
{
  "schema": 1,
  "id": "6f1c…",
  "name": "Courtside IQ",
  "created_at": "2026-09-25T17:00:00.000Z",
  "updated_at": "2026-09-25T18:30:00.000Z",
  "current_phase": "02",
  "phases": {
    "01": { "status": "complete",    "started_at": "…", "completed_at": "…" },
    "02": { "status": "in_progress", "started_at": "…", "completed_at": null },
    "03": { "status": "not_started", "started_at": null, "completed_at": null }
  },
  "links": [
    { "id": "…", "kind": "figma_file", "url": "https://www.figma.com/design/…", "label": "Main file",
      "phase": null, "produced_by": null, "source": null, "added_at": "…" },
    { "id": "…", "kind": "artifact", "url": "docs/research/synthesis.md", "label": "Research synthesis",
      "phase": "01", "produced_by": "researcher", "source": "framework", "added_at": "…" }
  ],
  "settings": { "share_in_git": true }
}
```

- **Phases:** `01` discover · `02` define · `03` ideate · `04` prototype · `05` validate · `06` build-deliver. All six are always present.
- **Status:** `not_started` · `in_progress` · `complete`. Starting a phase makes it `current_phase`.
- **Link kinds:** `figma_file` · `repo` · `doc` · `design_system` · `artifact` · `other`. Artifacts are deliverables; `source` is `framework` (a framework deliverable) or `custom` (one the team defined). Adding the same kind + URL again updates the existing link.
- **`settings.share_in_git`:** `true` (default) commits the store with the project. `false` writes `.pathlon/.gitignore` containing `*` — use it for client work that shouldn't reach a shared repo. Git keeps tracking files it already has, so if the store was committed before, also run `git rm -r --cached .pathlon` once.

## `log.jsonl`

One memory per line, oldest first. Never rewritten; new memories are appended.

```json
{"id":"…","ts":"2026-09-25T18:30:00.000Z","type":"decision","phase":"02","agent":"strategist","source":"claude","summary":"Primary persona is the parent, not the player","content":"…full markdown…"}
```

| Field | Values |
|---|---|
| `type` | `decision` · `context` · `handoff` · `brief` · `pattern` · `preference` · `session` · `agent_run` |
| `phase` | the phase it belongs to (defaults to the current phase; required for `handoff`) |
| `agent` | which agent wrote it (`researcher`, `strategist`, …) or `null` |
| `source` | `claude`, `designer`, or `hook` |
| `summary` | one line, ≤200 characters (defaults to the content's first line) |
| `content` | the full memory as markdown, ≤100,000 characters |

- **`handoff`** also rewrites `handoffs/<phase>-<name>.md` with the latest handoff for that phase.
- **`brief`** is an engagement brief (from ASPF-style strategy work or any upstream source).
- **`pattern`** is a friction-log entry (dogfood, Phase 4 reviews).
- **`session`** is an automatic end-of-session summary (hooks, Revision 1 R3).
- **`agent_run`** is recorded automatically each time a Pathlon specialist finishes: the agent, whether it had been sent back by its Definition of Done check, and its Done report. A run checked once and accepted has one record; a run sent back has a second record marked as a retry.
- A line that fails to parse is skipped and counted, never fatal.

## `~/.pathlon/projects.json`

```json
{ "schema": 1, "projects": [ { "id": "…", "name": "Courtside IQ", "path": "/Users/…/courtside-iq", "updated_at": "…" } ] }
```

A project whose folder has moved or been deleted is reported as `missing` rather than removed.

## Versioning

`schema` is an integer. A plugin refuses to read or write a project whose schema is newer than it understands, and asks for a plugin update instead.

## Concurrency

The MCP server and hooks can run at the same time. Changes to `project.json` and `projects.json` re-read the file under a short-lived lock (`.pathlon/.lock`, `projects.json.lock`) so updates aren't lost; a lock older than 10 seconds is treated as abandoned. The log is append-only. A corrupt `projects.json` is kept as `projects.json.corrupt-<time>` and rebuilt.
