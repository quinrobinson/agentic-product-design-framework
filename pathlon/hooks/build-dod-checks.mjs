#!/usr/bin/env node
// Generates the SubagentStop "Definition of Done" checks in hooks.json from the agent files,
// so each agent's checklist lives in one place (pathlon/agents/<name>.md).
//
//   node pathlon/hooks/build-dod-checks.mjs          rewrite hooks.json
//   node pathlon/hooks/build-dod-checks.mjs --check  exit 1 if hooks.json is out of date
//
// Each check is a prompt hook: when a Pathlon specialist finishes, a model reads its Done report
// against its Definition of Done and either lets it stop or sends it back with the reason (once at
// most). Alongside it, a command hook records the run and its Done report in .pathlon/ (agent_run).

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOKS_DIR = dirname(fileURLToPath(import.meta.url));
const AGENTS_DIR = join(HOOKS_DIR, "..", "agents");
const HOOKS_FILE = join(HOOKS_DIR, "hooks.json");

export function definitionOfDone(markdown) {
  const section = markdown.match(/^## Definition of Done\s*\n([\s\S]*?)(?=^## |^---\s*$)/m)?.[1] ?? "";
  return section.split("\n").filter((l) => /^- \[ \] /.test(l)).map((l) => l.replace(/^- \[ \] /, "").trim());
}

export function checkPrompt(agent, items) {
  return [
    `You check whether the Pathlon ${agent} agent has really finished its task. The hook input is JSON: $ARGUMENTS`,
    "",
    "Read `last_assistant_message`. It should end with a Done report giving: the task, its scope (single deliverable or full phase), each Definition of Done item that applies (met / deferred with a reason / blocked on the designer), what was saved to Pathlon, and what remains open.",
    "",
    `The ${agent}'s Definition of Done:`,
    ...items.map((item, i) => `${i + 1}. ${item}`),
    "",
    "Rules:",
    '- If `stop_hook_active` is true, the agent was already sent back once: respond {"ok": true}. (One retry at most.)',
    '- No Done report → {"ok": false, "reason": "End with a Done report: task, scope, the Definition of Done items that apply (met / deferred / blocked), what you saved to Pathlon, and what remains open."}',
    "- Judge only the items that apply to the stated scope. A single deliverable is judged on the items relevant to it; full phase work on every item.",
    "- An item explicitly deferred with a reason, or blocked on input only the designer can give, does not fail the check.",
    "- If an applicable item is clearly unmet and not deferred or blocked, fail it: name the item and what to do, in one or two sentences.",
    "- Don't fail for style or length, and don't add requirements beyond the list.",
    "",
    'Respond with JSON only: {"ok": true} or {"ok": false, "reason": "..."}.',
  ].join("\n");
}

export function buildSubagentStop() {
  const agents = readdirSync(AGENTS_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")).sort();
  return agents.map((agent) => {
    const items = definitionOfDone(readFileSync(join(AGENTS_DIR, `${agent}.md`), "utf8"));
    if (!items.length) throw new Error(`${agent}.md has no Definition of Done items`);
    return {
      matcher: `^pathlon:${agent}$`,
      hooks: [
        { type: "prompt", prompt: checkPrompt(agent, items), timeout: 60 },
        { type: "command", command: 'node "${CLAUDE_PLUGIN_ROOT}/hooks/context.mjs" agent-stop', timeout: 10 },
      ],
    };
  });
}

function main() {
  const current = readFileSync(HOOKS_FILE, "utf8");
  const config = JSON.parse(current);
  config.hooks.SubagentStop = buildSubagentStop();
  const next = JSON.stringify(config, null, 2) + "\n";
  if (process.argv.includes("--check")) {
    if (next !== current) {
      console.error("hooks.json is out of date with the agents' Definitions of Done. Run: node pathlon/hooks/build-dod-checks.mjs");
      process.exit(1);
    }
    console.log("hooks.json Definition of Done checks are up to date.");
    return;
  }
  writeFileSync(HOOKS_FILE, next);
  console.log(`Wrote ${config.hooks.SubagentStop.length} Definition of Done checks to hooks.json.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
