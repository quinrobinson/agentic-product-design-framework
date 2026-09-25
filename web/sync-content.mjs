// Copies skill and agent files from the Pathlon plugin into public/ so the site serves them locally
// instead of fetching from raw.githubusercontent.com (which fails once the repo is private).
// Skills live as pathlon/skills/<name>/SKILL.md; the site reads them in the phase-folder layout
// (public/skills/01-discover/<name>.md, cross-phase skills at the top level).
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";

const PLUGIN = "../pathlon";
const PHASE_DIRS = { "01": "01-discover", "02": "02-define", "03": "03-ideate", "04": "04-prototype", "05": "05-validate", "06": "06-deliver" };
const CROSS_PHASE = new Set(["start", "design-system", "motion", "figma-playbook", "phase-handoff", "skill-chaining", "which-claude"]);

rmSync("public/skills", { recursive: true, force: true });
for (const entry of readdirSync(`${PLUGIN}/skills`, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const name = entry.name;
  const src = `${PLUGIN}/skills/${name}/SKILL.md`;
  let dir = "";
  if (!CROSS_PHASE.has(name)) {
    const phase = readFileSync(src, "utf8").match(/^phase:\s*(0[1-6])/m)?.[1];
    if (!phase) throw new Error(`${src}: no phase in frontmatter and not listed as cross-phase`);
    dir = `${PHASE_DIRS[phase]}/`;
  }
  mkdirSync(`public/skills/${dir}`, { recursive: true });
  cpSync(src, `public/skills/${dir}${name}.md`);
}

rmSync("public/agents", { recursive: true, force: true });
cpSync(`${PLUGIN}/agents`, "public/agents", { recursive: true });

console.log("Synced skills and agents into public/");
