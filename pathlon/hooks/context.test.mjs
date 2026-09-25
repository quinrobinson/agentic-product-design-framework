// Run: node --test pathlon/hooks/context.test.mjs
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

const HOOK = fileURLToPath(new URL("./context.mjs", import.meta.url));
const PLUGIN_ROOT = fileURLToPath(new URL("..", import.meta.url));
const scratch = realpathSync(mkdtempSync(join(tmpdir(), "pathlon-hooks-")));
process.env.PATHLON_HOME = join(scratch, "home");
const store = await import("../server/store.mjs");
after(() => rmSync(scratch, { recursive: true, force: true }));

function run(mode, input) {
  const res = spawnSync(process.execPath, [HOOK, mode], {
    input: JSON.stringify(input),
    env: { ...process.env, CLAUDE_PLUGIN_ROOT: PLUGIN_ROOT },
    encoding: "utf8",
  });
  assert.equal(res.status, 0, res.stderr);
  return { out: res.stdout.trim(), err: res.stderr.trim(), json: res.stdout.trim() ? JSON.parse(res.stdout) : null };
}

function transcript(file, entries) {
  writeFileSync(file, entries.map((e) => JSON.stringify(e)).join("\n") + "\n");
}
const edit = (ts, file_path) => ({ type: "assistant", timestamp: ts, message: { content: [{ type: "tool_use", name: "Edit", input: { file_path } }] } });
const pathlonWrite = (ts, summary) => ({ type: "assistant", timestamp: ts, message: { content: [{ type: "tool_use", name: "mcp__plugin_pathlon_pathlon__write_memory", input: { memory_type: "decision", summary, content: "…" } }] } });
const userMsg = (ts) => ({ type: "user", timestamp: ts, message: { content: "please do the thing" } });

test("outside a Pathlon project every mode is silent", () => {
  const dir = join(scratch, "unrelated");
  mkdirSync(dir, { recursive: true });
  for (const mode of ["session-start", "prompt", "checkpoint", "session-end"]) {
    const { out } = run(mode, { cwd: dir, source: "startup", prompt: "hello", session_id: "s0", transcript_path: join(dir, "none.jsonl") });
    assert.equal(out, "", mode);
  }
});

test("session start injects where the project stands, from a subfolder", () => {
  const dir = join(scratch, "proj-a");
  const { root } = store.createProject({ name: "Courtside IQ", dir });
  store.setPhase(root, "01", "complete");
  store.writeMemory(root, { type: "handoff", phase: "01", content: "## Discover → Define handoff\n\n### Open Questions\n- Which sport first?\n- Do players see their own stats?\n\n### Inputs for Next Phase\n- Interview notes" });
  store.writeMemory(root, { type: "context", phase: "01", content: "Research synthesis complete" });
  store.setPhase(root, "02");
  store.writeMemory(root, { type: "decision", content: "Primary persona is the parent" });
  store.addLink(root, { kind: "figma_file", url: "https://figma.com/design/X", label: "Main" });
  mkdirSync(join(dir, "src"), { recursive: true });

  const { json } = run("session-start", { cwd: join(dir, "src"), source: "startup" });
  assert.equal(json.hookSpecificOutput.hookEventName, "SessionStart");
  const text = json.hookSpecificOutput.additionalContext;
  assert.match(text, /Pathlon project: Courtside IQ/);
  assert.match(text, /Phase 02 Define — in progress/);
  assert.match(text, /Latest handoff .*Discover → Define/);
  assert.match(text, /- Primary persona is the parent/);
  assert.match(text, /Open questions \(from that handoff\):\n- Which sport first\?\n- Do players see their own stats\?\nRecent work/);
  assert.doesNotMatch(text, /Interview notes/);
  assert.match(text, /- Research synthesis complete/);
  assert.match(text, /figma file "Main"/);
  assert.doesNotMatch(text, /compacted/);
  assert.match(text, /Save by default/);
  assert.match(text, /Ask one yes\/no question first only before changing project state/);

  const again = run("session-start", { cwd: dir, source: "compact" }).json.hookSpecificOutput.additionalContext;
  assert.match(again, /Context was just compacted/);
});

test("prompt hint names the phase, agent, and that phase's skills; slash commands are skipped", () => {
  const dir = join(scratch, "proj-b");
  store.createProject({ name: "Hints", dir, phase: "02" });
  const { json } = run("prompt", { cwd: dir, prompt: "let's frame the problem" });
  const text = json.hookSpecificOutput.additionalContext;
  assert.equal(json.hookSpecificOutput.hookEventName, "UserPromptSubmit");
  assert.match(text, /phase 02 Define/);
  assert.match(text, /strategist agent/);
  assert.match(text, /problem-framing/);
  assert.doesNotMatch(text, /research-planning/); // a 01 skill
  assert.equal(run("prompt", { cwd: dir, prompt: "/pathlon:route" }).out, "");
});

test("checkpoint then session end record the session without repeating, and without prompt text", () => {
  const dir = join(scratch, "proj-c");
  const { root } = store.createProject({ name: "Sessions", dir });
  const t = join(scratch, "t.jsonl");
  transcript(t, [userMsg("2026-09-25T10:00:00.000Z"), edit("2026-09-25T10:01:00.000Z", join(dir, "src/app.tsx")), edit("2026-09-25T10:01:30.000Z", "/Users/someone/private/notes.md"), pathlonWrite("2026-09-25T10:02:00.000Z", "Chose parent persona")]);
  run("checkpoint", { cwd: dir, session_id: "abc", transcript_path: t, trigger: "auto" });

  let { memories } = store.getMemories(root, { type: "session" });
  assert.equal(memories.length, 1);
  assert.match(memories[0].content, /Session abc — before compaction \(auto\)/);
  assert.match(memories[0].content, /- src\/app\.tsx/);
  assert.match(memories[0].content, /write_memory \(decision\): Chose parent persona/);
  assert.doesNotMatch(memories[0].content, /please do the thing/);
  assert.doesNotMatch(memories[0].content, /someone\/private/);
  assert.match(memories[0].content, /1 change\(s\) to files outside the project/);
  assert.equal(memories[0].source, "hook");

  // Session continues; only the new work is recorded at the end
  transcript(t, [
    userMsg("2026-09-25T10:00:00.000Z"), edit("2026-09-25T10:01:00.000Z", join(dir, "src/app.tsx")), pathlonWrite("2026-09-25T10:02:00.000Z", "Chose parent persona"),
    edit("2099-01-01T00:00:00.000Z", join(dir, "docs/flow.md")),
  ]);
  run("session-end", { cwd: dir, session_id: "abc", transcript_path: t, reason: "logout" });
  ({ memories } = store.getMemories(root, { type: "session" }));
  assert.equal(memories.length, 2);
  assert.match(memories[0].content, /session end \(logout\)/);
  assert.match(memories[0].content, /- docs\/flow\.md/);
  assert.doesNotMatch(memories[0].content, /src\/app\.tsx/);
});

test("a session with nothing worth recording writes nothing", () => {
  const dir = join(scratch, "proj-d");
  const { root } = store.createProject({ name: "Quiet", dir });
  const t = join(scratch, "quiet.jsonl");
  transcript(t, [userMsg("2026-09-25T10:00:00.000Z")]);
  run("session-end", { cwd: dir, session_id: "q", transcript_path: t });
  assert.equal(store.getMemories(root, { type: "session" }).memories.length, 0);
});

test("a broken project never breaks the session", () => {
  const dir = join(scratch, "proj-e");
  const { root } = store.createProject({ name: "Broken", dir });
  writeFileSync(join(root, ".pathlon", "project.json"), "{nope");
  const res = run("session-start", { cwd: dir, source: "startup" });
  assert.equal(res.out, "");
  assert.match(res.err, /pathlon hook/);
});

test("agent-stop records Pathlon agent runs, retries, and Done reports; ignores other agents", () => {
  const dir = join(scratch, "proj-f");
  const { root } = store.createProject({ name: "Agents", dir, phase: "01" });
  const msg = "Synthesis below.\n\n**Done report**\nTask: Synthesize five interviews\nScope: single deliverable\nDefinition of Done: 1 met, 2 met\nSaved to Pathlon: write_memory (context)\nOpen: none";
  run("agent-stop", { cwd: dir, agent_type: "pathlon:researcher", agent_id: "a1", session_id: "s1", stop_hook_active: false, last_assistant_message: msg });
  run("agent-stop", { cwd: dir, agent_type: "pathlon:researcher", agent_id: "a1", session_id: "s1", stop_hook_active: true, last_assistant_message: "no report" });
  run("agent-stop", { cwd: dir, agent_type: "Explore", agent_id: "x", stop_hook_active: false, last_assistant_message: msg });
  const { memories } = store.getMemories(root, { type: "agent_run" });
  assert.equal(memories.length, 2);
  assert.match(memories[1].summary, /^researcher finished: Synthesize five interviews$/);
  assert.match(memories[1].content, /Scope: single deliverable/);
  assert.doesNotMatch(memories[1].content, /Synthesis below/);
  assert.match(memories[0].summary, /after being sent back/);
  assert.match(memories[0].content, /No Done report/);
  assert.equal(memories[0].agent, "researcher");
});
