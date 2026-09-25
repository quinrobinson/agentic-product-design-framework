#!/usr/bin/env node
// Pathlon usage report: how Pathlon is performing across projects, from the hook records in each
// project's .pathlon/log.jsonl. Local only; reads files, writes nothing.
//
//   node pathlon/server/report.mjs [--since YYYY-MM-DD] [--json]
//
// Also served by the MCP server as the `usage_report` tool.

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as store from "./store.mjs";

const SKILLS_DIR = fileURLToPath(new URL("../skills", import.meta.url));

/** Target from spec 11.5: specialists pass their Definition of Done on the first try. */
export const FIRST_TRY_TARGET = 0.9;
/** Below this many runs an agent's pass rate is shown but not flagged. */
const MIN_RUNS = 3;

function pluginSkills() {
  if (!existsSync(SKILLS_DIR)) return [];
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(SKILLS_DIR, d.name, "SKILL.md")))
    .map((d) => d.name)
    .sort();
}

function add(into, counts) {
  for (const [k, v] of Object.entries(counts || {})) into[k] = (into[k] || 0) + v;
}

const byCount = (counts) => Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

/**
 * Roll up usage, agent runs, and gaps. `roots` defaults to every registered project that still
 * exists; `since` (ISO date) drops older records.
 */
export function buildReport({ roots, since } = {}) {
  const projects = (roots ?? store.listProjects().filter((p) => !p.missing).map((p) => p.path)).map((root) => ({ root, project: store.loadProject(root) }));
  const skills = {};
  const agents_used = {};
  const commands = {};
  const runs = new Map(); // agent_id → { agent, retried }
  const gaps = [];
  let sessions = 0;

  for (const { root, project } of projects) {
    const { memories } = store.getMemories(root, { limit: Number.MAX_SAFE_INTEGER });
    for (const m of memories) {
      if (since && m.ts < since) continue;
      if (m.type === "usage") {
        sessions++;
        add(skills, m.data?.skills);
        add(agents_used, m.data?.agents);
        add(commands, m.data?.commands);
      } else if (m.type === "agent_run") {
        // Records before R6 carry no data; fall back to their text.
        const found = m.data?.agent_id ?? m.content.match(/Agent id: (\S+)/)?.[1];
        const id = `${project.id}:${found && found !== "unknown" ? found : m.id}`; // no id: count the record as its own run
        const retried = m.data?.retry ?? /after being sent back/.test(m.summary);
        const run = runs.get(id) ?? { agent: m.agent, retried: false };
        run.retried ||= retried;
        runs.set(id, run);
      } else if (m.type === "gap") {
        gaps.push({ project: project.name, phase: m.phase, ts: m.ts, summary: m.summary });
      }
    }
  }

  const agents = {};
  for (const { agent, retried } of runs.values()) {
    const a = (agents[agent] ??= { runs: 0, first_try: 0 });
    a.runs++;
    if (!retried) a.first_try++;
  }
  for (const a of Object.values(agents)) a.first_try_rate = a.runs ? a.first_try / a.runs : null;

  const all = pluginSkills();
  const report = {
    generated_at: new Date().toISOString(),
    since: since ?? null,
    projects: projects.map(({ root, project }) => ({ name: project.name, path: root, phase: project.current_phase })),
    sessions_with_pathlon: sessions,
    agents,
    agents_used,
    skills,
    unused_skills: all.filter((s) => !skills[s]),
    commands,
    gaps: gaps.sort((a, b) => b.ts.localeCompare(a.ts)),
  };
  report.to_look_at = suggestions(report);
  return report;
}

/** Where to refine and what to add, from the numbers. */
function suggestions(r) {
  const out = [];
  for (const [agent, a] of byCount(Object.fromEntries(Object.entries(r.agents).map(([k, v]) => [k, v.runs])))) {
    const { first_try_rate: rate, runs } = r.agents[agent];
    if (runs >= MIN_RUNS && rate < FIRST_TRY_TARGET) {
      out.push(`Refine ${agent}: ${Math.round(rate * 100)}% of ${runs} runs met their Definition of Done on the first try (target ${FIRST_TRY_TARGET * 100}%). Read its retry records.`);
    }
  }
  const top = byCount(r.skills).slice(0, 3).map(([s]) => s);
  if (top.length) out.push(`Most used skills (${top.join(", ")}): improvements here pay off most; give each an eval case.`);
  if (r.gaps.length) out.push(`${r.gaps.length} gap note(s): group them; a gap that recurs across projects is a candidate new skill, agent, or tool.`);
  if (r.sessions_with_pathlon >= 10 && r.unused_skills.length) out.push(`${r.unused_skills.length} skill(s) never used: check their descriptions trigger, or consider merging or retiring them.`);
  return out;
}

const pct = (x) => (x === null ? "–" : `${Math.round(x * 100)}%`);

export function formatReport(r) {
  const lines = [`# Pathlon usage report`, "", `${r.projects.length} project(s) · ${r.sessions_with_pathlon} session(s) that used Pathlon${r.since ? ` · since ${r.since.slice(0, 10)}` : ""}`];
  lines.push("", "## To look at", ...(r.to_look_at.length ? r.to_look_at.map((s) => `- ${s}`) : ["- Not enough data yet."]));
  lines.push("", "## Agents: first-try Definition of Done", "| Agent | Runs | First try |", "|---|---|---|");
  const agentRows = byCount(Object.fromEntries(Object.entries(r.agents).map(([k, v]) => [k, v.runs])));
  lines.push(...(agentRows.length ? agentRows.map(([k]) => `| ${k} | ${r.agents[k].runs} | ${pct(r.agents[k].first_try_rate)} |`) : ["| – | 0 | – |"]));
  lines.push("", "## Skills used", ...(Object.keys(r.skills).length ? byCount(r.skills).map(([k, v]) => `- ${k}: ${v}`) : ["- none recorded"]));
  if (Object.keys(r.commands).length) lines.push("", "## Commands", ...byCount(r.commands).map(([k, v]) => `- /pathlon:${k}: ${v}`));
  lines.push("", `## Never used (${r.unused_skills.length})`, r.unused_skills.join(", ") || "none");
  lines.push("", `## Gaps (${r.gaps.length})`, ...(r.gaps.length ? r.gaps.slice(0, 30).map((g) => `- ${g.ts.slice(0, 10)} · ${g.project} · ${g.phase}: ${g.summary}`) : ["- none recorded"]));
  return lines.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const i = args.indexOf("--since");
  const report = buildReport({ since: i >= 0 ? args[i + 1] : undefined });
  process.stdout.write((args.includes("--json") ? JSON.stringify(report, null, 2) : formatReport(report)) + "\n");
}
