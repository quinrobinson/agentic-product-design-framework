// Builds one upload-ready zip per skill (the whole skill folder) for Claude Chat (claude.ai → Settings → Capabilities → Skills),
// generated from the canonical skills in pathlon/skills/. Never edit Chat skills by hand; rerun this.
//
//   npm --prefix web run chat-skills   →   build/chat-skills/<name>.zip  (each contains <name>/SKILL.md plus any supporting files)
//
// Chat accepts only name, description, license, allowed-tools, metadata, and compatibility in frontmatter,
// so repo-only fields (phase, ai_leverage, claude_surface, ...) are moved under metadata in the zip copy.
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SKILLS = `${ROOT}pathlon/skills`;
const OUT = `${ROOT}build/chat-skills`;
const STAGE = `${ROOT}build/.chat-skills-stage`;
const ALLOWED = new Set(["name", "description", "license", "allowed-tools", "metadata", "compatibility"]);
// Skills that only work with Pathlon's MCP tools, which Chat doesn't have.
const CODE_ONLY = new Set(["start"]);

// Pass 1: parse and validate every skill before writing anything
const errors = [];
const skills = [];
for (const entry of readdirSync(SKILLS, { withFileTypes: true })) {
  if (!entry.isDirectory() || CODE_ONLY.has(entry.name)) continue;
  const name = entry.name;
  const text = readFileSync(`${SKILLS}/${name}/SKILL.md`, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) { errors.push(`${name}: no frontmatter`); continue; }

  const fm = yaml.load(match[1]);
  if (fm.name !== name) errors.push(`${name}: name "${fm.name}" does not match folder`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) errors.push(`${name}: invalid name`);
  if (typeof fm.description !== "string" || !fm.description.trim()) errors.push(`${name}: missing description`);
  else if (fm.description.length > 1024) errors.push(`${name}: description is ${fm.description.length} chars (max 1024)`);

  const out = {};
  const metadata = { ...(fm.metadata ?? {}) };
  for (const [key, value] of Object.entries(fm)) {
    if (ALLOWED.has(key)) { if (key !== "metadata") out[key] = value; }
    else metadata[key] = typeof value === "object" ? JSON.stringify(value) : String(value);
  }
  if (Object.keys(metadata).length) out.metadata = metadata;
  skills.push({ name, content: `---\n${yaml.dump(out, { lineWidth: -1 })}---\n${text.slice(match[0].length)}` });
}
if (errors.length) {
  console.error(`Chat skill build failed; nothing written:\n  ${errors.join("\n  ")}`);
  process.exit(1);
}

// Pass 2: write and zip
rmSync(OUT, { recursive: true, force: true });
rmSync(STAGE, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const { name, content } of skills) {
  // Copy the whole skill folder (recipes, references, attribution), then write the Chat-ready SKILL.md
  cpSync(`${SKILLS}/${name}`, `${STAGE}/${name}`, { recursive: true });
  writeFileSync(`${STAGE}/${name}/SKILL.md`, content);
  execFileSync("zip", ["-qrX", `${OUT}/${name}.zip`, name], { cwd: STAGE });
}
rmSync(STAGE, { recursive: true, force: true });
console.log(`Built ${skills.length} Chat skill zips in build/chat-skills/`);
