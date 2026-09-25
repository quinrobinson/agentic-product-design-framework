// Run: node --test pathlon/server/store.test.mjs
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { appendFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";

const FIXTURE = fileURLToPath(new URL("./fixtures/sample-project", import.meta.url));
const scratch = realpathSync(mkdtempSync(join(tmpdir(), "pathlon-store-")));
process.env.PATHLON_HOME = join(scratch, "home");

const store = await import("./store.mjs");
let n = 0;
const fresh = () => join(scratch, `work-${++n}`);

beforeEach(() => rmSync(process.env.PATHLON_HOME, { recursive: true, force: true }));
after(() => rmSync(scratch, { recursive: true, force: true }));

test("creates a project in a folder and finds it from a subfolder", () => {
  const dir = fresh();
  const { root, project } = store.createProject({ name: "Courtside IQ", dir });
  assert.equal(root, dir);
  assert.equal(project.current_phase, "01");
  assert.equal(project.phases["01"].status, "in_progress");
  assert.deepEqual(Object.keys(project.phases), ["01", "02", "03", "04", "05", "06"]);
  mkdirSync(join(dir, "src", "deep"), { recursive: true });
  assert.equal(store.findProjectRoot(join(dir, "src", "deep")), dir);
  assert.equal(store.findProjectRoot(scratch), null);
});

test("creates a folderless project under PATHLON_HOME and lists it", () => {
  const { root } = store.createProject({ name: "AI Roadmap: Q4!" });
  assert.equal(root, join(process.env.PATHLON_HOME, "projects", "ai-roadmap-q4"));
  const listed = store.listProjects();
  assert.equal(listed.length, 1);
  assert.equal(listed[0].path, root);
  assert.equal(listed[0].missing, false);
});

test("refuses to overwrite an existing project", () => {
  const dir = fresh();
  store.createProject({ name: "One", dir });
  assert.throws(() => store.createProject({ name: "Two", dir }), store.PathlonError);
});

test("memories round-trip, newest first, with filters", () => {
  const { root } = store.createProject({ name: "Memories", dir: fresh() });
  store.writeMemory(root, { type: "decision", content: "# Pick the parent persona\nBecause…", agent: "strategist" });
  store.writeMemory(root, { type: "context", content: "Synthesis done", phase: "01" });
  store.writeMemory(root, { type: "decision", content: "Second decision", summary: "Second" });
  const { memories } = store.getMemories(root, { type: "decision" });
  assert.equal(memories.length, 2);
  assert.equal(memories[0].summary, "Second");
  assert.equal(memories[1].summary, "Pick the parent persona");
  assert.equal(memories[1].agent, "strategist");
  assert.equal(store.getMemories(root, { limit: 1 }).memories.length, 1);
});

test("a handoff writes the readable handoff file and requires a phase", () => {
  const { root } = store.createProject({ name: "Handoffs", dir: fresh() });
  assert.throws(() => store.writeMemory(root, { type: "handoff", content: "x" }), /needs the phase/);
  store.writeMemory(root, { type: "handoff", phase: "01", content: "## Phase Handoff Block — Discover → Define" });
  const file = join(root, ".pathlon", "handoffs", "01-discover.md");
  assert.ok(readFileSync(file, "utf8").includes("Discover → Define"));
});

test("rejects bad input", () => {
  const { root } = store.createProject({ name: "Validation", dir: fresh() });
  assert.throws(() => store.writeMemory(root, { type: "gossip", content: "x" }), /type must be/);
  assert.throws(() => store.writeMemory(root, { content: "   " }), /content is required/);
  assert.throws(() => store.setPhase(root, "07"), /phase must be/);
  assert.throws(() => store.addLink(root, { kind: "tweet", url: "x" }), /kind must be/);
});

test("phases: starting moves the current phase, completing stamps it", () => {
  const { root } = store.createProject({ name: "Phases", dir: fresh() });
  store.setPhase(root, "01", "complete");
  let p = store.loadProject(root);
  assert.ok(p.phases["01"].completed_at);
  assert.equal(store.recommendNext(p).action, "start");
  assert.equal(store.recommendNext(p).phase, "02");
  store.setPhase(root, "02", "in_progress");
  p = store.loadProject(root);
  assert.equal(p.current_phase, "02");
  assert.equal(store.recommendNext(p).action, "continue");
});

test("links dedupe by kind + url and record artifact provenance", () => {
  const { root } = store.createProject({ name: "Links", dir: fresh() });
  store.addLink(root, { kind: "figma_file", url: "https://figma.com/design/abc", label: "Main" });
  store.addLink(root, { kind: "figma_file", url: "https://figma.com/design/abc", label: "Main (renamed)" });
  const art = store.addLink(root, { kind: "artifact", url: "docs/synthesis.md", phase: "01", producedBy: "researcher" });
  const p = store.loadProject(root);
  assert.equal(p.links.length, 2);
  assert.equal(p.links[0].label, "Main (renamed)");
  assert.equal(art.source, "framework");
});

test("share_in_git false writes .pathlon/.gitignore; true removes it", () => {
  const { root } = store.createProject({ name: "Git", dir: fresh(), shareInGit: false });
  const ignore = join(root, ".pathlon", ".gitignore");
  assert.ok(existsSync(ignore));
  store.setShareInGit(root, true);
  assert.ok(!existsSync(ignore));
});

test("a corrupt log line is skipped, not fatal", () => {
  const { root } = store.createProject({ name: "Corrupt", dir: fresh() });
  store.writeMemory(root, { content: "good" });
  appendFileSync(join(root, ".pathlon", "log.jsonl"), "{not json\n");
  const { memories, skipped } = store.getMemories(root);
  assert.equal(memories.length, 1);
  assert.equal(skipped, 1);
});

test("refuses a project from a newer schema", () => {
  const { root } = store.createProject({ name: "Future", dir: fresh() });
  const file = join(root, ".pathlon", "project.json");
  writeFileSync(file, readFileSync(file, "utf8").replace('"schema": 1', '"schema": 99'));
  assert.throws(() => store.loadProject(root), /newer than this plugin supports/);
});

test("fixture project round-trips: read context, write, read back", () => {
  const dir = fresh();
  // The fixture's store is kept as `pathlon-store/` so the repo never contains a live `.pathlon/`.
  cpSync(join(FIXTURE, "pathlon-store"), join(dir, ".pathlon"), { recursive: true });
  assert.equal(store.resolveProject({ cwd: dir }), dir);

  const ctx = store.getContext(dir);
  assert.equal(ctx.project.name, "Sample Project");
  assert.equal(ctx.project.current_phase, "02");
  assert.equal(ctx.latest_handoff.phase, "01");
  assert.equal(ctx.recent_decisions[0].summary, "Primary persona is the parent, not the player");
  assert.equal(ctx.next.action, "continue");

  store.writeMemory(dir, { type: "decision", content: "Scope v1 to the season recap", agent: "strategist" });
  store.addLink(dir, { kind: "design_system", url: "https://figma.com/design/LIB/system", label: "Design system" });
  const again = store.getContext(dir);
  assert.equal(again.recent_decisions[0].summary, "Scope v1 to the season recap");
  assert.equal(again.recent_decisions.length, 2);
  assert.equal(again.project.links.length, 2);
  // the fixture's own id is registered once it's written to
  assert.ok(store.listProjects().some((p) => p.id === again.project.id && p.path === dir));
});

test("a corrupt registry is backed up and rebuilt instead of breaking saves", () => {
  const { root } = store.createProject({ name: "Registry", dir: fresh() });
  writeFileSync(join(process.env.PATHLON_HOME, "projects.json"), "{broken");
  store.writeMemory(root, { content: "still saves" });
  assert.equal(store.listProjects().length, 1);
  assert.ok(readdirSync(process.env.PATHLON_HOME).some((f) => f.startsWith("projects.json.corrupt-")));
});

test("concurrent processes don't lose each other's updates", async () => {
  const { root } = store.createProject({ name: "Concurrent", dir: fresh() });
  const storeUrl = new URL("./store.mjs", import.meta.url).href;
  const workers = [0, 1, 2, 3].map((w) => new Promise((done, fail) => {
    const code = `const s = await import(${JSON.stringify(storeUrl)});
      for (let i = 0; i < 10; i++) s.addLink(${JSON.stringify(root)}, { kind: "doc", url: "doc-${w}-" + i });`;
    const child = spawn(process.execPath, ["--input-type=module", "-e", code], { env: process.env, stdio: "inherit" });
    child.on("exit", (c) => (c === 0 ? done() : fail(new Error(`worker ${w} exited ${c}`))));
  }));
  await Promise.all(workers);
  assert.equal(store.loadProject(root).links.length, 40);
});
