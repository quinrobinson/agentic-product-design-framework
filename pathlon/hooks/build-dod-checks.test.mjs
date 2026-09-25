// Run: node --test pathlon/hooks/build-dod-checks.test.mjs
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { buildSubagentStop, checkPrompt, definitionOfDone } from "./build-dod-checks.mjs";

const HOOKS = fileURLToPath(new URL(".", import.meta.url));
const AGENTS = join(HOOKS, "..", "agents");
const agents = readdirSync(AGENTS).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));

test("every agent has a Definition of Done and a Done report section", () => {
  for (const a of agents) {
    const md = readFileSync(join(AGENTS, `${a}.md`), "utf8");
    assert.ok(definitionOfDone(md).length >= 4, `${a}: Definition of Done`);
    assert.match(md, /^## Done report/m, `${a}: Done report`);
    assert.match(md, /^model: inherit$/m, `${a}: model`);
  }
});

test("hooks.json has one SubagentStop check per agent, and it is up to date", () => {
  const hooks = JSON.parse(readFileSync(join(HOOKS, "hooks.json"), "utf8")).hooks;
  assert.deepEqual(hooks.SubagentStop.map((e) => e.matcher).sort(), agents.map((a) => `^pathlon:${a}$`).sort());
  assert.deepEqual(hooks.SubagentStop, buildSubagentStop());
  const res = spawnSync(process.execPath, [join(HOOKS, "build-dod-checks.mjs"), "--check"], { encoding: "utf8" });
  assert.equal(res.status, 0, res.stderr);
});

test("each check lists that agent's items and asks for JSON only", () => {
  for (const entry of buildSubagentStop()) {
    const agent = entry.matcher.slice("^pathlon:".length, -1);
    const [hook, recorder] = entry.hooks;
    assert.equal(hook.type, "prompt");
    assert.match(hook.prompt, /stop_hook_active/);
    assert.equal(recorder.type, "command");
    assert.match(recorder.command, /context\.mjs" agent-stop$/);
    assert.match(hook.prompt, /\$ARGUMENTS/);
    for (const item of definitionOfDone(readFileSync(join(AGENTS, `${agent}.md`), "utf8"))) assert.ok(hook.prompt.includes(item), `${agent}: ${item}`);
    assert.match(hook.prompt, /Respond with JSON only/);
  }
});

test("the prompt builder numbers items", () => {
  assert.match(checkPrompt("x", ["a", "b"]), /1\. a\n2\. b/);
});
