// Run: node --test pathlon/server/server.test.mjs
// Talks to the real server over stdio, the way Claude Code does.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

const SERVER = fileURLToPath(new URL("./index.mjs", import.meta.url));
const FIXTURE = fileURLToPath(new URL("./fixtures/sample-project/pathlon-store", import.meta.url));
const scratch = realpathSync(mkdtempSync(join(tmpdir(), "pathlon-server-")));
const children = [];
after(() => {
  for (const c of children) c.kill(); // a failed assertion must not leave a server running
  rmSync(scratch, { recursive: true, force: true });
});

function startServer(cwd, home) {
  const env = { ...process.env, PATHLON_HOME: home };
  delete env.PATHLON_PROJECT_DIR;
  delete env.CLAUDE_PROJECT_DIR;
  const child = spawn(process.execPath, [SERVER], { cwd, env, stdio: ["pipe", "pipe", "inherit"] });
  children.push(child);
  const pending = new Map();
  const lines = createInterface({ input: child.stdout });
  lines.on("line", (line) => {
    const msg = JSON.parse(line);
    pending.get(msg.id)?.(msg);
    pending.delete(msg.id);
  });
  let nextId = 1;
  const request = (method, params) =>
    new Promise((resolve) => {
      const id = nextId++;
      pending.set(id, resolve);
      child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
    });
  const notify = (method, params) => child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
  const call = async (name, args = {}) => {
    const res = await request("tools/call", { name, arguments: args });
    const text = res.result.content[0].text;
    return { isError: Boolean(res.result.isError), text, data: res.result.isError ? null : JSON.parse(text) };
  };
  return { child, request, notify, call, stop: () => child.kill() };
}

test("handshake and tool list", async () => {
  const s = startServer(scratch, join(scratch, "home-a"));
  const init = await s.request("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } });
  assert.equal(init.result.protocolVersion, "2025-06-18");
  assert.equal(init.result.serverInfo.name, "pathlon");
  s.notify("notifications/initialized");
  const { result } = await s.request("tools/list", {});
  const names = result.tools.map((t) => t.name).sort();
  assert.deepEqual(names, ["create_project", "detect_patterns", "get_memories", "get_project_context", "link_artifact", "list_projects", "log_figma_activity", "recommend_starting_point", "set_phase", "usage_report", "write_memory"]);
  for (const t of result.tools) assert.equal(t.inputSchema.type, "object");
  assert.equal((await s.request("nope", {})).error.code, -32601);
  s.stop();
});

test("R1/R2 acceptance: the fixture project round-trips through the tools over stdio", async () => {
  const dir = join(scratch, "fixture-copy");
  cpSync(FIXTURE, join(dir, ".pathlon"), { recursive: true });
  const s = startServer(dir, join(scratch, "home-b"));
  await s.request("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } });

  const ctx = await s.call("get_project_context"); // no file_id, no path: found from the working directory
  assert.equal(ctx.data.project.name, "Sample Project");
  assert.equal(ctx.data.recent_decisions[0].summary, "Primary persona is the parent, not the player");

  const mem = await s.call("write_memory", { memory_type: "decision", content: "Scope v1 to the season recap", agent: "strategist" });
  assert.equal(mem.data.phase, "02");

  const mems = await s.call("get_memories", { memory_type: "decision" });
  assert.deepEqual(mems.data.memories.map((m) => m.summary), ["Scope v1 to the season recap", "Primary persona is the parent, not the player"]);

  const link = await s.call("link_artifact", { kind: "artifact", url: "docs/define/problem-frame.md", phase: "02", produced_by: "strategist" });
  assert.equal(link.data.source, "framework");

  const listed = await s.call("list_projects");
  assert.ok(listed.data.projects.some((p) => p.path === dir && p.name === "Sample Project"));

  // the files on disk match what the store tests assert
  const project = JSON.parse(readFileSync(join(dir, ".pathlon", "project.json"), "utf8"));
  assert.equal(project.links.length, 2);
  const log = readFileSync(join(dir, ".pathlon", "log.jsonl"), "utf8").trim().split("\n");
  assert.equal(log.length, 4);
  s.stop();
});

test("create a project in a fresh folder, then read it back from a new server (new session)", async () => {
  const dir = join(scratch, "fresh");
  const home = join(scratch, "home-c");
  const a = startServer(scratch, home);
  await a.request("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } });
  const created = await a.call("create_project", { name: "Fresh", path: dir });
  assert.equal(created.data.root, dir);
  await a.call("write_memory", { path: dir, content: "First note" });
  await a.call("set_phase", { path: dir, phase: "01", status: "complete" });
  await a.call("write_memory", { path: dir, memory_type: "handoff", phase: "01", content: "## Phase Handoff Block — Discover → Define" });
  a.stop();

  const b = startServer(dir, home); // a later session started inside the project
  await b.request("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } });
  const ctx = await b.call("get_project_context");
  assert.equal(ctx.data.project.name, "Fresh");
  assert.equal(ctx.data.latest_handoff.phase, "01");
  assert.equal(ctx.data.next.phase, "02");
  const rec = await b.call("recommend_starting_point");
  assert.equal(rec.data.next.action, "start");
  b.stop();
});

test("errors come back as tool errors, not crashes", async () => {
  const s = startServer(scratch, join(scratch, "home-d"));
  await s.request("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } });
  const missing = await s.call("get_project_context");
  assert.ok(missing.isError);
  assert.match(missing.text, /No Pathlon project found/);
  const bad = await s.call("write_memory", { path: scratch, content: "" });
  for (const memory_type of ["agent_run", "usage"]) {
    const hookOnly = await s.call("write_memory", { memory_type, content: "x" });
    assert.ok(hookOnly.isError, memory_type);
    assert.match(hookOnly.text, /memory_type must be one of/);
  }
  assert.ok(bad.isError);
  const unknown = await s.request("tools/call", { name: "get_figma_actions", arguments: {} });
  assert.equal(unknown.error.code, -32602);
  // still alive
  assert.ok((await s.request("ping", {})).result);
  s.stop();
});

test("detect_patterns and log_figma_activity", async () => {
  const dir = join(scratch, "patterns");
  const s = startServer(scratch, join(scratch, "home-e"));
  await s.request("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } });
  await s.call("create_project", { name: "Patterns", path: dir });
  await s.call("set_phase", { path: dir, phase: "01", status: "complete" });
  await s.call("set_phase", { path: dir, phase: "03" });
  const { data } = await s.call("detect_patterns", { path: dir });
  const types = data.patterns.map((p) => `${p.type}:${p.phase}`).sort();
  assert.deepEqual(types, ["missing_handoff:01", "skipped:02"]);
  const fig = await s.call("log_figma_activity", { path: dir, action: "Built research board", file_url: "https://figma.com/design/X/y", phase: "03" });
  assert.equal(fig.data.summary, "Figma: Built research board");
  s.stop();
});

test("usage_report rolls up usage, first-try pass rates and gaps across projects", async () => {
  const home = join(scratch, "home-f");
  process.env.PATHLON_HOME = home; // the store calls below register projects where the server looks
  const store = await import("./store.mjs");
  const a = store.createProject({ name: "Alpha", dir: join(scratch, "alpha") }).root;
  const b = store.createProject({ name: "Beta", dir: join(scratch, "beta") }).root;
  const run = (root, id, retry) => store.writeMemory(root, { type: "agent_run", agent: "researcher", source: "hook", content: `## researcher run\nAgent id: ${id}`, data: { agent_id: id, retry } });
  // Alpha: r1 passes; r2 is sent back (two records). Beta: r3 passes; a pre-R6 record with no data, sent back.
  run(a, "r1", false);
  run(a, "r2", false);
  run(a, "r2", true);
  run(b, "r3", false);
  store.writeMemory(b, { type: "agent_run", agent: "researcher", source: "hook", summary: "researcher finished after being sent back by its Definition of Done check", content: "## researcher run (retry)\nAgent id: old1" });
  store.writeMemory(a, { type: "usage", source: "hook", content: "Session s1", data: { skills: { "research-synthesis": 2 }, agents: { researcher: 1 }, commands: { kickoff: 1 } } });
  store.writeMemory(b, { type: "usage", source: "hook", content: "Session s2", data: { skills: { "research-synthesis": 1, motion: 1 }, agents: {}, commands: {} } });

  const s = startServer(scratch, home);
  await s.request("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } });
  await s.call("write_memory", { path: b, memory_type: "gap", content: "No skill for writing a parent onboarding email sequence" });
  const { data } = await s.call("usage_report");
  assert.equal(data.projects.length, 2);
  assert.equal(data.sessions_with_pathlon, 2);
  assert.deepEqual(data.skills, { "research-synthesis": 3, motion: 1 });
  assert.deepEqual(data.agents.researcher, { runs: 4, first_try: 2, first_try_rate: 0.5 });
  assert.equal(data.gaps[0].summary, "No skill for writing a parent onboarding email sequence");
  assert.ok(data.unused_skills.includes("persona-creation") && !data.unused_skills.includes("motion"));
  assert.match(data.to_look_at[0], /Refine researcher: 50% of 4 runs/);
  assert.match(data.markdown, /\| researcher \| 4 \| 50% \|/);

  const one = await s.call("usage_report", { scope: "project", path: a });
  assert.deepEqual(one.data.agents.researcher, { runs: 2, first_try: 1, first_try_rate: 0.5 });
  assert.equal((await s.call("usage_report", { since: "2999-01-01" })).data.sessions_with_pathlon, 0);
  s.stop();
});
