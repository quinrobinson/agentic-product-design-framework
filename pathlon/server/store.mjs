// Pathlon local store — reads and writes project state as plain files.
// Format: see FORMAT.md. No dependencies; Node 18+.
//
// A project is a folder containing `.pathlon/project.json`. Work that has no folder of its own
// lives in `$PATHLON_HOME/projects/<slug>/` (default `~/.pathlon`). Every project is listed in
// `$PATHLON_HOME/projects.json` so it can be found from anywhere.

import { randomUUID } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync, realpathSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, parse, resolve } from "node:path";

export const SCHEMA_VERSION = 1;
export const PHASES = {
  "01": "discover",
  "02": "define",
  "03": "ideate",
  "04": "prototype",
  "05": "validate",
  "06": "build-deliver",
};
export const PHASE_STATUSES = ["not_started", "in_progress", "complete"];
export const MEMORY_TYPES = ["decision", "context", "handoff", "brief", "pattern", "preference", "session"];
export const LINK_KINDS = ["figma_file", "repo", "doc", "design_system", "artifact", "other"];

const DIR = ".pathlon";
const MAX_CONTENT = 100_000;

export class PathlonError extends Error {}

// ── Locations ────────────────────────────────────────────────────────────────

export function pathlonHome() {
  return resolve(process.env.PATHLON_HOME || join(homedir(), ".pathlon"));
}

/** The folder's real path (symlinks resolved), so one project never has two registry entries. */
function canonical(dir) {
  const abs = resolve(dir);
  try {
    return realpathSync.native(abs);
  } catch {
    return abs; // doesn't exist yet
  }
}

/** Walk up from `startDir` to the nearest folder containing `.pathlon/project.json`. */
export function findProjectRoot(startDir = process.cwd()) {
  let dir = canonical(startDir);
  const { root } = parse(dir);
  for (;;) {
    if (existsSync(join(dir, DIR, "project.json"))) return dir;
    if (dir === root) return null;
    dir = dirname(dir);
  }
}

function storeDir(root) {
  return join(root, DIR);
}

// ── File helpers ─────────────────────────────────────────────────────────────

function readJson(file, fallback) {
  if (!existsSync(file)) return fallback;
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (err) {
    throw new PathlonError(`${file} is not valid JSON (${err.message})`);
  }
}

/** Write via a temp file and rename, so a crash never leaves half a file. */
function writeTextAtomic(file, text) {
  mkdirSync(dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync(tmp, text);
  renameSync(tmp, file);
}

function writeJsonAtomic(file, data) {
  writeTextAtomic(file, JSON.stringify(data, null, 2) + "\n");
}

/**
 * Serialize read-modify-write cycles across processes (the MCP server and hooks can run at once).
 * A lock is a directory; a lock older than 10s is treated as abandoned.
 */
function withLock(lockPath, fn) {
  const deadline = Date.now() + 3000;
  mkdirSync(dirname(lockPath), { recursive: true });
  for (;;) {
    try {
      mkdirSync(lockPath);
      break;
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
      try {
        if (Date.now() - statSync(lockPath).mtimeMs > 10_000) rmSync(lockPath, { recursive: true, force: true });
      } catch {}
      if (Date.now() > deadline) throw new PathlonError(`timed out waiting for ${lockPath}; if no other Pathlon process is running, delete it`);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25);
    }
  }
  try {
    return fn();
  } finally {
    rmSync(lockPath, { recursive: true, force: true });
  }
}

function now() {
  return new Date().toISOString();
}

function slugify(name) {
  return name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "project";
}

// ── Validation ───────────────────────────────────────────────────────────────

function assertPhase(phase, { optional = false } = {}) {
  if (optional && (phase === undefined || phase === null)) return;
  if (!Object.hasOwn(PHASES, phase)) throw new PathlonError(`phase must be one of ${Object.keys(PHASES).join(", ")}; got ${JSON.stringify(phase)}`);
}

function assertOneOf(value, allowed, field) {
  if (!allowed.includes(value)) throw new PathlonError(`${field} must be one of ${allowed.join(", ")}; got ${JSON.stringify(value)}`);
}

function assertText(value, field, max = MAX_CONTENT) {
  if (typeof value !== "string" || !value.trim()) throw new PathlonError(`${field} is required`);
  if (value.length > max) throw new PathlonError(`${field} is too long (${value.length} > ${max} characters)`);
}

// ── Registry ─────────────────────────────────────────────────────────────────

function registryFile() {
  return join(pathlonHome(), "projects.json");
}

function readRegistry() {
  const file = registryFile();
  try {
    return readJson(file, { schema: SCHEMA_VERSION, projects: [] });
  } catch {
    // The registry is only an index of project folders; keep a copy and start a fresh one.
    renameSync(file, `${file}.corrupt-${Date.now()}`);
    return { schema: SCHEMA_VERSION, projects: [] };
  }
}

function register(project, root) {
  withLock(`${registryFile()}.lock`, () => {
    const reg = readRegistry();
    const entry = { id: project.id, name: project.name, path: root, updated_at: project.updated_at };
    const i = reg.projects.findIndex((p) => p.id === project.id || p.path === root);
    if (i >= 0) reg.projects[i] = entry;
    else reg.projects.push(entry);
    writeJsonAtomic(registryFile(), reg);
  });
}

/** All registered projects, newest first. Entries whose folder no longer exists are marked `missing`. */
export function listProjects() {
  const reg = readRegistry();
  return reg.projects
    .map((p) => ({ ...p, missing: !existsSync(join(p.path, DIR, "project.json")) }))
    .sort((a, b) => (b.updated_at || "").localeCompare(a.updated_at || ""));
}

// ── Projects ─────────────────────────────────────────────────────────────────

/**
 * Create a project. With `dir`, the project lives in `dir/.pathlon/`; without it, in
 * `$PATHLON_HOME/projects/<slug>/`. Refuses to overwrite an existing project.
 */
export function createProject({ name, dir, phase = "01", shareInGit = true } = {}) {
  assertText(name, "name", 200);
  assertPhase(phase);
  const target = resolve(dir || join(pathlonHome(), "projects", slugify(name)));
  if (existsSync(join(storeDir(target), "project.json"))) throw new PathlonError(`a Pathlon project already exists at ${target}`);
  mkdirSync(target, { recursive: true });
  const root = canonical(target);

  const ts = now();
  const phases = Object.fromEntries(Object.keys(PHASES).map((p) => [p, { status: "not_started", started_at: null, completed_at: null }]));
  phases[phase] = { status: "in_progress", started_at: ts, completed_at: null };
  const project = {
    schema: SCHEMA_VERSION,
    id: randomUUID(),
    name: name.trim(),
    created_at: ts,
    updated_at: ts,
    current_phase: phase,
    phases,
    links: [],
    settings: { share_in_git: shareInGit },
  };
  mkdirSync(join(storeDir(root), "handoffs"), { recursive: true });
  writeJsonAtomic(join(storeDir(root), "project.json"), project);
  if (!existsSync(join(storeDir(root), "log.jsonl"))) writeFileSync(join(storeDir(root), "log.jsonl"), "");
  applyGitSetting(root, shareInGit);
  register(project, root);
  return { root, project };
}

export function loadProject(root) {
  const file = join(storeDir(root), "project.json");
  if (!existsSync(file)) throw new PathlonError(`no Pathlon project at ${root}`);
  const project = readJson(file);
  if (project.schema > SCHEMA_VERSION) throw new PathlonError(`project.json schema ${project.schema} is newer than this plugin supports (${SCHEMA_VERSION}); update the Pathlon plugin`);
  return project;
}

/** Re-read project.json under a lock, apply `change`, and write it back. */
function updateProject(root, change) {
  const project = withLock(join(storeDir(root), ".lock"), () => {
    const current = loadProject(root);
    change(current);
    current.updated_at = now();
    writeJsonAtomic(join(storeDir(root), "project.json"), current);
    return current;
  });
  register(project, root);
  return project;
}

/**
 * Resolve which project a call refers to: an explicit `projectId` (from the registry), an explicit
 * `root`, or the nearest `.pathlon/` above `cwd`. Returns null when nothing matches.
 */
export function resolveProject({ projectId, root, cwd = process.cwd() } = {}) {
  if (root) return findProjectRoot(root);
  if (projectId) {
    const hit = listProjects().find((p) => p.id === projectId);
    return hit && !hit.missing ? hit.path : null;
  }
  return findProjectRoot(cwd);
}

// ── Phases ───────────────────────────────────────────────────────────────────

/** Set a phase's status. Starting a phase makes it current; completing one records when. */
export function setPhase(root, phase, status = "in_progress") {
  assertPhase(phase);
  assertOneOf(status, PHASE_STATUSES, "status");
  return updateProject(root, (project) => {
    const entry = project.phases[phase];
    const ts = now();
    entry.status = status;
    if (status === "in_progress") {
      entry.started_at ??= ts;
      entry.completed_at = null;
      project.current_phase = phase;
    } else if (status === "complete") {
      entry.started_at ??= ts;
      entry.completed_at = ts;
    } else {
      entry.started_at = null;
      entry.completed_at = null;
    }
  });
}

// ── Links (Figma files, repos, docs, design system, deliverables) ───────────

export function addLink(root, { kind, url, label, phase, producedBy, source } = {}) {
  assertOneOf(kind, LINK_KINDS, "kind");
  assertText(url, "url", 2000);
  assertPhase(phase, { optional: true });
  let link;
  updateProject(root, (project) => {
    const existing = project.links.find((l) => l.kind === kind && l.url === url.trim());
    link = {
      id: existing?.id ?? randomUUID(),
      kind,
      url: url.trim(),
      label: label?.trim() || null,
      phase: phase ?? null,
      produced_by: producedBy ?? null,
      source: source ?? (kind === "artifact" ? "framework" : null),
      added_at: existing?.added_at ?? now(),
    };
    if (existing) Object.assign(existing, link);
    else project.links.push(link);
  });
  return link;
}

// ── Memories (append-only log) ───────────────────────────────────────────────

/**
 * Append a memory to `log.jsonl`. A `handoff` also rewrites the readable
 * `handoffs/<phase>-<name>.md`, so the latest handoff for each phase is one file.
 */
export function writeMemory(root, { type = "context", content, summary, phase, agent, source = "claude" } = {}) {
  assertOneOf(type, MEMORY_TYPES, "type");
  assertText(content, "content");
  const project = loadProject(root);
  const memPhase = phase ?? project.current_phase;
  assertPhase(memPhase);
  if (type === "handoff" && !phase) throw new PathlonError("a handoff needs the phase it closes");

  const entry = {
    id: randomUUID(),
    ts: now(),
    type,
    phase: memPhase,
    agent: agent ?? null,
    source,
    summary: (summary?.trim() || firstLine(content)).slice(0, 200),
    content: content.trim(),
  };
  appendFileSync(join(storeDir(root), "log.jsonl"), JSON.stringify(entry) + "\n");

  if (type === "handoff") {
    const file = join(storeDir(root), "handoffs", `${memPhase}-${PHASES[memPhase]}.md`);
    writeTextAtomic(file, `<!-- Written by Pathlon ${entry.ts}. Latest handoff for this phase; history is in log.jsonl. -->\n\n${entry.content}\n`);
  }
  updateProject(root, () => {}); // bump updated_at and the registry
  return entry;
}

function firstLine(text) {
  return text.trim().split("\n").find((l) => l.trim())?.replace(/^#+\s*/, "").trim() ?? "";
}

/** Read memories, newest first. Skips (and reports) lines that don't parse, rather than failing. */
export function getMemories(root, { type, phase, limit = 20 } = {}) {
  if (type !== undefined) assertOneOf(type, MEMORY_TYPES, "type");
  assertPhase(phase, { optional: true });
  const file = join(storeDir(root), "log.jsonl");
  if (!existsSync(file)) return { memories: [], skipped: 0 };
  let skipped = 0;
  const all = [];
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      all.push(JSON.parse(line));
    } catch {
      skipped++;
    }
  }
  const memories = all
    .filter((m) => (!type || m.type === type) && (!phase || m.phase === phase))
    .reverse()
    .slice(0, Math.max(0, limit));
  return { memories, skipped };
}

// ── Context and next step ────────────────────────────────────────────────────

/** Everything a session needs to orient: project, phase, latest handoff, recent decisions and context. */
export function getContext(root, { recent = 8 } = {}) {
  const project = loadProject(root);
  const { memories: decisions } = getMemories(root, { type: "decision", limit: recent });
  const { memories: context } = getMemories(root, { type: "context", limit: recent });
  const { memories: handoffs } = getMemories(root, { type: "handoff", limit: 1 });
  return {
    root,
    project,
    latest_handoff: handoffs[0] ?? null,
    recent_decisions: decisions,
    recent_context: context,
    next: recommendNext(project, handoffs[0]),
  };
}

/** A simple, explainable recommendation for what to do next. */
export function recommendNext(project, latestHandoff = null) {
  const cur = project.current_phase;
  const status = project.phases[cur]?.status;
  const order = Object.keys(PHASES);
  if (status === "in_progress") {
    return { phase: cur, action: "continue", reason: `Phase ${cur} (${PHASES[cur]}) is in progress.` };
  }
  if (status === "complete") {
    const next = order.find((p) => p > cur && project.phases[p].status !== "complete");
    if (!next) return { phase: cur, action: "done", reason: "All phases are complete." };
    const why = latestHandoff?.phase === cur ? "the handoff is written" : "no handoff is recorded yet — write one first";
    return { phase: next, action: "start", reason: `Phase ${cur} is complete and ${why}; next is ${next} (${PHASES[next]}).` };
  }
  return { phase: cur, action: "start", reason: `Phase ${cur} (${PHASES[cur]}) hasn't started.` };
}

// ── Git sharing setting ──────────────────────────────────────────────────────

/**
 * `share_in_git: false` writes `.pathlon/.gitignore` containing `*`, so git ignores the whole store.
 * Git keeps tracking files it already has: if the store was committed before, also run
 * `git rm -r --cached .pathlon` (see FORMAT.md).
 */
export function setShareInGit(root, share) {
  const project = updateProject(root, (p) => {
    p.settings.share_in_git = Boolean(share);
  });
  applyGitSetting(root, project.settings.share_in_git);
  return project;
}

function applyGitSetting(root, share) {
  const file = join(storeDir(root), ".gitignore");
  if (share) rmSync(file, { force: true });
  else writeFileSync(file, "# Pathlon state is kept out of git for this project (settings.share_in_git = false)\n*\n");
}
