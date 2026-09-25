#!/usr/bin/env node
// Pathlon hooks: automatic project context in, session records out.
//
//   node context.mjs session-start   SessionStart (startup, resume, clear, compact) → inject where the project stands
//   node context.mjs prompt          UserPromptSubmit → one-line phase hint
//   node context.mjs checkpoint      PreCompact → record the session so far, and which Pathlon skills/agents/commands ran
//   node context.mjs session-end     SessionEnd → the same, for the rest of the session
//   node context.mjs agent-stop      SubagentStop (Pathlon agents) → record the agent's run and Done report
//
// Outside a Pathlon project every mode prints nothing. A hook must never break a session, so any
// error is reported on stderr and the script still exits 0.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import * as store from "../server/store.mjs";

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || join(dirname(fileURLToPath(import.meta.url)), "..");

// Which specialist fits each phase. The `start` skill routes individual requests in detail.
const PHASE_AGENTS = {
  "01": "researcher",
  "02": "strategist",
  "03": "designer",
  "04": "designer (systems-designer for components)",
  "05": "researcher",
  "06": "design-engineer (systems-designer for components)",
};

function readInput() {
  try {
    const raw = readFileSync(0, "utf8");
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function emit(event, text) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: text } }) + "\n");
}

function day(iso) {
  return iso ? new Date(iso).toISOString().slice(0, 10) : "?";
}

function phaseLabel(project, phase = project.current_phase) {
  const name = store.PHASES[phase].replace("-", " & ");
  return `${phase} ${name[0].toUpperCase()}${name.slice(1)}`;
}

/** Skills whose `phase:` frontmatter starts with the given phase number. */
function skillsForPhase(phase) {
  const dir = join(PLUGIN_ROOT, "skills");
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const file = join(dir, name, "SKILL.md");
    if (!existsSync(file)) continue;
    const m = readFileSync(file, "utf8").slice(0, 600).match(/^phase:\s*"?(\d\d)/m);
    if (m?.[1] === phase) out.push(name);
  }
  return out.sort();
}

// ── session-start ────────────────────────────────────────────────────────────

/** Bullet lines under an "Open Questions" heading in a handoff, if it has one. */
function openQuestions(markdown) {
  if (!markdown) return [];
  const m = markdown.match(/^#{2,4}\s*Open Questions\s*\n([\s\S]*?)(?=^#{1,4}\s|^---\s*$|$(?![\s\S]))/im);
  if (!m) return [];
  return m[1].split("\n").map((l) => l.replace(/^\s*(?:[-*]|\d+\.)\s+/, "").trim()).filter((l) => l && !l.startsWith("[")).slice(0, 5);
}

function sessionStart(input, root) {
  const ctx = store.getContext(root, { recent: 3 });
  const { project } = ctx;
  const status = project.phases[project.current_phase].status.replace("_", " ");
  const lines = [
    `Pathlon project: ${project.name} (state in ${join(root, ".pathlon")}).`,
    `Phase ${phaseLabel(project)} — ${status}. Next: ${ctx.next.reason}`,
  ];
  if (ctx.latest_handoff) lines.push(`Latest handoff (${day(ctx.latest_handoff.ts)}): ${ctx.latest_handoff.summary}`);
  const questions = openQuestions(ctx.latest_handoff?.content);
  if (questions.length) lines.push("Open questions (from that handoff):", ...questions.map((q) => `- ${q}`));
  if (ctx.recent_context.length) lines.push("Recent work:", ...ctx.recent_context.slice(0, 2).map((m) => `- ${m.summary} (${m.phase}, ${day(m.ts)})`));
  if (ctx.recent_decisions.length) {
    lines.push("Recent decisions:", ...ctx.recent_decisions.map((m) => `- ${m.summary} (${m.phase}, ${day(m.ts)})`));
  }
  const links = project.links.filter((l) => l.kind !== "artifact").slice(0, 5);
  if (links.length) lines.push(`Links: ${links.map((l) => `${l.kind.replace("_", " ")} ${l.label ? `"${l.label}" ` : ""}${l.url}`).join("; ")}`);
  if (input.source === "compact") lines.push("(Context was just compacted; this is the project state from .pathlon/.)");
  lines.push(
    "Save by default: when you produce something worth keeping — an assessment, synthesis, deliverable, or a decision the designer agreed to — save it (write_memory, link_artifact) without asking, and say so in one line (\"Saved to Pathlon: …\"). Ask one yes/no question first only before changing project state: moving phases (set_phase), recording a decision the designer hasn't confirmed, or marking work complete. When design work needs something no Pathlon skill covers, or the designer corrects Pathlon's approach, save a one-line gap note (write_memory, memory_type \"gap\") saying what was missing; these drive improvements to Pathlon. Call get_project_context for full detail.",
  );
  emit("SessionStart", lines.join("\n"));
}

// ── prompt ───────────────────────────────────────────────────────────────────

function prompt(input, root) {
  if (typeof input.prompt === "string" && input.prompt.trim().startsWith("/")) return; // slash commands carry their own instructions
  const project = store.loadProject(root);
  const phase = project.current_phase;
  const skills = skillsForPhase(phase);
  emit(
    "UserPromptSubmit",
    `Pathlon · ${project.name} · phase ${phaseLabel(project)} (${project.phases[phase].status.replace("_", " ")}). ` +
      `Phase work fits the ${PHASE_AGENTS[phase]} agent${skills.length ? `; skills: ${skills.join(", ")}` : ""}. ` +
      `If the request is ambiguous about what to do, ask one clarifying question. To route or start over, use /pathlon:start.`,
  );
}

// ── checkpoint / session-end ─────────────────────────────────────────────────

/** Timestamp of the last session record for this session, so records don't repeat each other. */
function lastRecorded(root, sessionId) {
  const hits = ["session", "usage"]
    .flatMap((type) => store.getMemories(root, { type, limit: 200 }).memories)
    .filter((m) => m.content.includes(`Session ${sessionId}`))
    .map((m) => m.ts);
  return hits.length ? hits.sort().at(-1) : null;
}

function bump(counts, key) {
  counts[key] = (counts[key] || 0) + 1;
}

/** A Pathlon name ("pathlon:research-synthesis") without its prefix, or null for anything else. */
function pathlonName(value) {
  const m = typeof value === "string" && value.match(/^\/?pathlon:([\w-]+)$/);
  return m ? m[1] : null;
}

const isSkill = (name) => existsSync(join(PLUGIN_ROOT, "skills", name, "SKILL.md"));

/** Mechanical facts from the transcript since `since`: files changed, Pathlon writes, and which Pathlon skills, agents and commands ran. No prompt text. */
function summarize(transcriptPath, since, root) {
  const files = new Set();
  let outside = 0;
  const pathlon = [];
  let turns = 0;
  let first = null;
  let last = null;
  const usage = { skills: {}, agents: {}, commands: {} };
  if (!transcriptPath || !existsSync(transcriptPath)) return null;
  for (const line of readFileSync(transcriptPath, "utf8").split("\n")) {
    if (!line.trim()) continue;
    let e;
    try {
      e = JSON.parse(line);
    } catch {
      continue;
    }
    if (!e.timestamp || (since && e.timestamp <= since)) continue;
    if (e.type === "user" && typeof e.message?.content === "string") {
      turns++;
      const invoked = pathlonName(e.message.content.match(/<command-name>([^<]+)<\/command-name>/)?.[1]?.trim());
      if (invoked) bump(isSkill(invoked) ? usage.skills : usage.commands, invoked);
    }
    if (e.type !== "assistant" || !Array.isArray(e.message?.content)) continue;
    first ??= e.timestamp;
    last = e.timestamp;
    for (const block of e.message.content) {
      if (block.type !== "tool_use") continue;
      const name = block.name || "";
      const input = block.input || {};
      if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(name) && input.file_path) {
        const rel = relative(root, input.file_path);
        if (rel.startsWith("..") || rel.startsWith("/")) outside++; // count only: no home-folder paths in a committed log
        else files.add(rel);
      }
      const invoked = name === "Skill" && pathlonName(input.skill); // Claude runs commands through the Skill tool too
      if (invoked) bump(isSkill(invoked) ? usage.skills : usage.commands, invoked);
      if ((name === "Agent" || name === "Task") && pathlonName(input.subagent_type)) bump(usage.agents, pathlonName(input.subagent_type));
      const tool = name.split("__").pop();
      if (/pathlon/i.test(name) && ["write_memory", "link_artifact", "set_phase", "create_project", "log_figma_activity"].includes(tool)) {
        const what = input.summary || input.label || input.url || (input.phase ? `phase ${input.phase} → ${input.status || "in_progress"}` : "") || input.memory_type || "";
        pathlon.push(`${tool}${input.memory_type ? ` (${input.memory_type})` : ""}${what ? `: ${String(what).slice(0, 120)}` : ""}`);
      }
    }
  }
  if (!first) return null;
  return { turns, files: [...files].sort(), outside, pathlon, usage, first, last };
}

function record(input, root, kind) {
  const sessionId = input.session_id;
  if (!sessionId) return; // can't tell sessions apart without an id
  const facts = summarize(input.transcript_path, lastRecorded(root, sessionId), root);
  if (!facts) return;
  recordUsage(root, sessionId, facts.usage);
  if (!facts.files.length && !facts.outside && !facts.pathlon.length) return; // nothing else worth recording
  const why = kind === "checkpoint" ? `before compaction (${input.trigger || "auto"})` : `session end${input.reason ? ` (${input.reason})` : ""}`;
  const content = [
    `## Session ${sessionId} — ${why}`,
    `${day(facts.first)} ${facts.first.slice(11, 16)}–${facts.last.slice(11, 16)} UTC · ${facts.turns} message(s)`,
    facts.pathlon.length ? `\n**Saved to Pathlon (${facts.pathlon.length}):**\n${facts.pathlon.map((p) => `- ${p}`).join("\n")}` : "",
    facts.files.length ? `\n**Files changed (${facts.files.length}):**\n${facts.files.slice(0, 40).map((f) => `- ${f}`).join("\n")}${facts.files.length > 40 ? `\n- …and ${facts.files.length - 40} more` : ""}` : "",
    facts.outside ? `\n${facts.outside} change(s) to files outside the project (not listed).` : "",
  ].filter(Boolean).join("\n");
  store.writeMemory(root, {
    type: "session",
    content,
    summary: `Session ${day(facts.first)}: ${facts.pathlon.length} Pathlon update(s), ${facts.files.length} file(s) changed`,
    source: "hook",
  });
}

/** One `usage` record per checkpoint: counts of the Pathlon skills, agents and commands that ran. */
function recordUsage(root, sessionId, usage) {
  const parts = Object.entries(usage)
    .filter(([, counts]) => Object.keys(counts).length)
    .map(([kind, counts]) => `${kind}: ${Object.entries(counts).map(([n, c]) => (c > 1 ? `${n} ×${c}` : n)).join(", ")}`);
  if (!parts.length) return;
  store.writeMemory(root, {
    type: "usage",
    source: "hook",
    summary: `Pathlon used — ${parts.join("; ")}`,
    content: `Session ${sessionId}\n\n${parts.map((p) => `- ${p}`).join("\n")}`,
    data: usage,
  });
}

// ── agent-stop ───────────────────────────────────────────────────────────────

/** The Done report at the end of an agent's final message, if there is one. */
function doneReport(message) {
  if (typeof message !== "string") return null;
  const i = message.search(/\*{0,2}Done report\*{0,2}/i);
  return i >= 0 ? message.slice(i).trim().slice(0, 1500) : null;
}

function agentStop(input, root) {
  const agent = String(input.agent_type || "").replace(/^pathlon:/, "");
  if (!agent || agent === input.agent_type) return; // only Pathlon's own agents
  const retry = input.stop_hook_active === true;
  const report = doneReport(input.last_assistant_message);
  const task = report?.match(/^Task:\s*(.+)$/im)?.[1]?.trim();
  store.writeMemory(root, {
    type: "agent_run",
    agent,
    source: "hook",
    data: { agent_id: input.agent_id || null, retry },
    summary: `${agent} finished${retry ? " after being sent back by its Definition of Done check" : ""}${task ? `: ${task}` : ""}`.slice(0, 200),
    content: [
      `## ${agent} run${retry ? " (retry)" : ""}`,
      `Agent id: ${input.agent_id || "unknown"} · Session: ${input.session_id || "unknown"}`,
      "",
      report ?? "No Done report in the agent's final message.",
    ].join("\n"),
  });
}

// ── main ─────────────────────────────────────────────────────────────────────

const mode = process.argv[2];
try {
  const input = readInput();
  const root = store.findProjectRoot(input.cwd || process.cwd());
  if (root) {
    if (mode === "session-start") sessionStart(input, root);
    else if (mode === "prompt") prompt(input, root);
    else if (mode === "checkpoint") record(input, root, "checkpoint");
    else if (mode === "session-end") record(input, root, "session-end");
    else if (mode === "agent-stop") agentStop(input, root);
  }
} catch (err) {
  process.stderr.write(`pathlon hook (${mode}): ${err.message}\n`);
}
process.exit(0);
