#!/usr/bin/env node
// Pathlon MCP server (local, stdio). Wraps store.mjs; no dependencies, no network.
// Protocol: newline-delimited JSON-RPC 2.0 over stdin/stdout (MCP stdio transport).

import { createInterface } from "node:readline";
import * as store from "./store.mjs";

const SERVER = { name: "pathlon", version: "0.2.0" };
const PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];

// ── Tool helpers ─────────────────────────────────────────────────────────────

const WHERE = {
  project_id: { type: "string", description: "Pathlon project id (from list_projects). Optional." },
  path: {
    type: "string",
    description: "A folder inside the project — pass the current working directory when unsure. Optional; defaults to the server's working directory.",
  },
};
const PHASE = { type: "string", pattern: "^0[1-6]$", description: "01 discover · 02 define · 03 ideate · 04 prototype · 05 validate · 06 build & deliver" };

/** Find the project a call refers to, or explain how to create one. */
function locate(args) {
  const start = args.path || process.env.PATHLON_PROJECT_DIR || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const root = store.resolveProject({ projectId: args.project_id, cwd: start });
  if (root) return root;
  const known = store.listProjects().filter((p) => !p.missing).slice(0, 10).map(({ id, name, path }) => ({ id, name, path }));
  const where = args.project_id ? `project id ${args.project_id}` : start;
  throw new store.PathlonError(
    `No Pathlon project found for ${where}. Create one with create_project (in this folder, or with no path for work that has no folder), or pass project_id.` +
      (known.length ? ` Known projects: ${JSON.stringify(known)}` : ""),
  );
}

function daysSince(iso) {
  return iso ? (Date.now() - Date.parse(iso)) / 86_400_000 : null;
}

// ── Tools ────────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "get_project_context",
    description:
      "Where the current project stands: name, current phase, each phase's status, links (Figma files, repo, docs, design system, deliverables), the latest handoff, recent decisions and context, and the suggested next step. Call before phase work.",
    inputSchema: { type: "object", properties: { ...WHERE, recent: { type: "integer", minimum: 1, maximum: 50, description: "How many recent decisions/context items (default 8)." } } },
    run: (a) => store.getContext(locate(a), { recent: a.recent ?? 8 }),
  },
  {
    name: "get_memories",
    description: "Read the project's memories, newest first, optionally filtered by type and phase.",
    inputSchema: {
      type: "object",
      properties: { ...WHERE, memory_type: { type: "string", enum: store.MEMORY_TYPES }, phase: PHASE, limit: { type: "integer", minimum: 1, maximum: 200 } },
    },
    run: (a) => store.getMemories(locate(a), { type: a.memory_type, phase: a.phase, limit: a.limit ?? 20 }),
  },
  {
    name: "write_memory",
    description:
      "Save something to the project as it happens: a decision, deliverable summary (context), phase handoff, engagement brief, friction pattern, preference, or session summary. A handoff needs the phase it closes and also updates the readable handoff file.",
    inputSchema: {
      type: "object",
      required: ["content"],
      properties: {
        ...WHERE,
        content: { type: "string", description: "The memory as markdown." },
        memory_type: { type: "string", enum: store.MEMORY_TYPES, description: "Default: context." },
        phase: { ...PHASE, description: `${PHASE.description}. Defaults to the current phase; required for handoff.` },
        summary: { type: "string", description: "One line (default: the content's first line)." },
        agent: { type: "string", description: "Which agent is writing, e.g. researcher." },
      },
    },
    run: (a) => store.writeMemory(locate(a), { type: a.memory_type ?? "context", content: a.content, phase: a.phase, summary: a.summary, agent: a.agent, source: "claude" }),
  },
  {
    name: "recommend_starting_point",
    description: "What to do next in the project and why, with the latest handoff and open decisions for context.",
    inputSchema: { type: "object", properties: { ...WHERE } },
    run: (a) => {
      const ctx = store.getContext(locate(a), { recent: 5 });
      return { next: ctx.next, current_phase: ctx.project.current_phase, latest_handoff: ctx.latest_handoff?.summary ?? null, recent_decisions: ctx.recent_decisions.map((m) => m.summary) };
    },
  },
  {
    name: "create_project",
    description:
      "Start a Pathlon project. With path, the project lives in that folder (in .pathlon/); without path, in ~/.pathlon/projects/<name>/ for work that has no folder. share_in_git=false keeps the project's state out of git (client work).",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" },
        path: { type: "string", description: "Folder the project belongs to (usually the current working directory)." },
        phase: { ...PHASE, description: `Starting phase (default 01). ${PHASE.description}` },
        share_in_git: { type: "boolean", description: "Default true." },
      },
    },
    run: (a) => store.createProject({ name: a.name, dir: a.path, phase: a.phase ?? "01", shareInGit: a.share_in_git ?? true }),
  },
  {
    name: "list_projects",
    description: "All Pathlon projects on this machine, newest first, with where each lives.",
    inputSchema: { type: "object", properties: {} },
    run: () => ({ projects: store.listProjects() }),
  },
  {
    name: "link_artifact",
    description:
      "Record something the project uses or produced: a Figma file, repo, doc, the design system's source, or a deliverable (artifact). Linking the same kind and URL again updates it.",
    inputSchema: {
      type: "object",
      required: ["kind", "url"],
      properties: {
        ...WHERE,
        kind: { type: "string", enum: store.LINK_KINDS },
        url: { type: "string", description: "URL or path." },
        label: { type: "string" },
        phase: PHASE,
        produced_by: { type: "string", description: "Agent or 'designer' (deliverables)." },
        source: { type: "string", enum: ["framework", "custom"], description: "Deliverables: a framework deliverable or one the team defined." },
      },
    },
    run: (a) => store.addLink(locate(a), { kind: a.kind, url: a.url, label: a.label, phase: a.phase, producedBy: a.produced_by, source: a.source }),
  },
  {
    name: "set_phase",
    description: "Start, complete, or reset a phase. Starting a phase makes it the current phase. Use when a phase closes (after its handoff) or a new one begins.",
    inputSchema: {
      type: "object",
      required: ["phase"],
      properties: { ...WHERE, phase: PHASE, status: { type: "string", enum: store.PHASE_STATUSES, description: "Default in_progress." } },
    },
    run: (a) => {
      const project = store.setPhase(locate(a), a.phase, a.status ?? "in_progress");
      return { current_phase: project.current_phase, phases: project.phases };
    },
  },
  {
    name: "detect_patterns",
    description: "Warning signs in the project: a phase stalled with no recent activity, phases skipped, or a completed phase with no handoff.",
    inputSchema: { type: "object", properties: { ...WHERE, stall_days: { type: "integer", minimum: 1, description: "Default 7." } } },
    run: (a) => {
      const root = locate(a);
      const project = store.loadProject(root);
      const { memories } = store.getMemories(root, { limit: 500 });
      const stallDays = a.stall_days ?? 7;
      const patterns = [];
      for (const [phase, p] of Object.entries(project.phases)) {
        const last = memories.find((m) => m.phase === phase)?.ts ?? p.started_at;
        if (p.status === "in_progress" && daysSince(last) > stallDays) {
          patterns.push({ type: "stalled", phase, detail: `No activity in phase ${phase} for ${Math.floor(daysSince(last))} days.` });
        }
        if (p.status === "complete" && !memories.some((m) => m.type === "handoff" && m.phase === phase)) {
          patterns.push({ type: "missing_handoff", phase, detail: `Phase ${phase} is complete but has no handoff.` });
        }
      }
      const order = Object.keys(store.PHASES);
      const furthest = Math.max(...order.map((ph, i) => (project.phases[ph].status !== "not_started" ? i : -1)));
      order.slice(0, Math.max(0, furthest)).forEach((ph) => {
        if (project.phases[ph].status === "not_started") patterns.push({ type: "skipped", phase: ph, detail: `Phase ${ph} was skipped.` });
      });
      return { patterns };
    },
  },
  {
    name: "log_figma_activity",
    description: "After Figma MCP writes, record what was created so the project keeps track of Figma work. Links the Figma file and saves a context memory.",
    inputSchema: {
      type: "object",
      required: ["action"],
      properties: {
        ...WHERE,
        action: { type: "string", description: "What was created or changed, in a sentence." },
        file_url: { type: "string", description: "The Figma file URL (or key)." },
        phase: PHASE,
        artifact_type: { type: "string", description: "e.g. research board, wireframes, component set." },
      },
    },
    run: (a) => {
      const root = locate(a);
      if (a.file_url) store.addLink(root, { kind: "figma_file", url: a.file_url, phase: a.phase });
      const content = `Figma: ${a.action}${a.artifact_type ? ` (${a.artifact_type})` : ""}${a.file_url ? `\n\nFile: ${a.file_url}` : ""}`;
      return store.writeMemory(root, { type: "context", content, phase: a.phase, summary: `Figma: ${a.action}`.slice(0, 200), source: "claude" });
    },
  },
];

const BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));

// ── JSON-RPC ─────────────────────────────────────────────────────────────────

let batch = null; // when handling a JSON-RPC batch, replies are collected and sent as one array

function send(message) {
  if (batch) batch.push(message);
  else process.stdout.write(JSON.stringify(message) + "\n");
}

function result(id, value) {
  send({ jsonrpc: "2.0", id, result: value });
}

function error(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

function handle(msg) {
  const { id, method } = msg;
  const params = msg.params ?? {};
  const isRequest = id !== undefined && id !== null;
  if (method === undefined) return; // a response to a client request; this server never sends requests

  switch (method) {
    case "initialize":
      return result(id, {
        protocolVersion: PROTOCOL_VERSIONS.includes(params.protocolVersion) ? params.protocolVersion : PROTOCOL_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER,
        instructions:
          "Pathlon keeps design project state as local files in .pathlon/ (the nearest one above the working directory). Read it with get_project_context before phase work; save decisions, deliverables, and handoffs with write_memory and link_artifact as they happen.",
      });
    case "ping":
      return isRequest && result(id, {});
    case "tools/list":
      return result(id, { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
    case "tools/call": {
      const tool = BY_NAME.get(params.name);
      if (!tool) return error(id, -32602, `Unknown tool: ${params.name}`);
      try {
        const value = tool.run(params.arguments ?? {});
        return result(id, { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] });
      } catch (err) {
        const message = err instanceof store.PathlonError ? err.message : `Pathlon error: ${err.message}`;
        return result(id, { content: [{ type: "text", text: message }], isError: true });
      }
    }
    default:
      if (!isRequest) return; // notifications (initialized, cancelled, …) need no reply
      return error(id, -32601, `Method not found: ${method}`);
  }
}

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on("line", (line) => {
  if (!line.trim()) return;
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return error(null, -32700, "Parse error");
  }
  const messages = Array.isArray(msg) ? msg : [msg];
  batch = Array.isArray(msg) ? [] : null;
  for (const m of messages) {
    try {
      handle(m);
    } catch (err) {
      if (m?.id !== undefined) error(m.id, -32603, err.message);
    }
  }
  if (batch) {
    const replies = batch;
    batch = null;
    if (replies.length) process.stdout.write(JSON.stringify(replies) + "\n");
  }
});
