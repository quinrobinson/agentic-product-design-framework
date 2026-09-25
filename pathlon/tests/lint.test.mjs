// Run: node --test pathlon/tests/lint.test.mjs
// Static checks on what makes skills and agents trigger well. No model needed.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const PLUGIN = fileURLToPath(new URL("..", import.meta.url));
const SKILLS = join(PLUGIN, "skills");
const skillNames = readdirSync(SKILLS, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

// Minimal frontmatter reader: `key: value` or `key: >` / `key: |` followed by indented lines.
function frontmatter(text) {
  const block = text.match(/^---\n([\s\S]*?)\n---/)?.[1];
  if (!block) return null;
  const out = {};
  const lines = block.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2];
    if (value === ">" || value === "|") {
      const parts = [];
      while (lines[i + 1]?.startsWith("  ")) parts.push(lines[++i].trim());
      value = parts.join(" ");
    }
    out[m[1]] = value.replace(/^"(.*)"$/, "$1");
  }
  return out;
}

// Skill descriptions shouldn't read like general coding work, or they fire in every repo.
// motion is the exception: it names platforms because translating motion across them is its job.
// Framework names are proper nouns (case-sensitive, so "react to" doesn't match); "frontend" in any case.
const CODING_TERMS = /\b(React|Next\.js|Vue|Svelte|HTML|CSS|JavaScript|TypeScript|Tailwind|Flutter|SwiftUI|Kotlin)\b|\b[Ff]ront-?[Ee]nd\b/;
const PLATFORM_OK = new Set(["motion"]);

// Names that no longer exist; nothing in the plugin should point at them.
const RETIRED = ["user-research", "skill-chaining", "design-systems", "design-system-audit", "figma-ds-audit", "figma-ds-export"];

test("every skill has a name matching its folder and a usable description", () => {
  for (const name of skillNames) {
    const fm = frontmatter(readFileSync(join(SKILLS, name, "SKILL.md"), "utf8"));
    assert.ok(fm, `${name}: frontmatter`);
    assert.equal(fm.name, name, `${name}: name must match folder`);
    assert.ok(fm.description && fm.description.length >= 80, `${name}: description too short`);
    assert.ok(fm.description.length <= 1024, `${name}: description over 1024 characters (${fm.description.length})`);
    assert.ok(fm.phase, `${name}: phase`);
    if (!PLATFORM_OK.has(name)) assert.doesNotMatch(fm.description, CODING_TERMS, `${name}: description names coding frameworks, so it fires on general coding`);
  }
});

test("nothing in the plugin refers to retired skills", () => {
  const files = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory() && !["fixtures", "tests", "node_modules"].includes(e.name)) walk(p);
      else if (/\.(md|json|mjs)$/.test(e.name) && !e.name.endsWith(".test.mjs")) files.push(p);
    }
  };
  walk(PLUGIN);
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const retired of RETIRED) {
      const re = new RegExp(`(^|[^\\w-])${retired}(\\.md)?(?![\\w-])`);
      assert.doesNotMatch(text, re, `${file.slice(PLUGIN.length)} refers to retired skill "${retired}"`);
    }
  }
});

test("agents have a description, a Definition of Done, and a Done report", () => {
  for (const file of readdirSync(join(PLUGIN, "agents"))) {
    const text = readFileSync(join(PLUGIN, "agents", file), "utf8");
    const fm = frontmatter(text);
    assert.ok(fm?.description?.includes("Use proactively"), `${file}: description should say when to use it proactively`);
    assert.match(text, /^## Definition of Done/m, file);
    assert.match(text, /^## Done report/m, file);
  }
});

test("every skill the agents list actually exists", () => {
  for (const file of readdirSync(join(PLUGIN, "agents"))) {
    const text = readFileSync(join(PLUGIN, "agents", file), "utf8");
    const section = text.match(/^## Skills You Use\s*\n([\s\S]*?)(?=^## )/m)?.[1] ?? "";
    for (const [, skill] of section.matchAll(/^- \*\*([a-z-]+)\*\*/gm)) assert.ok(skillNames.includes(skill), `${file}: lists missing skill "${skill}"`);
  }
});
