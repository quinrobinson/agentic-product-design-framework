// Copies skill and agent files into public/ so the site serves them locally
// instead of fetching from raw.githubusercontent.com (which fails once the repo is private).
import { cpSync, rmSync } from "node:fs";
for (const [src, dest] of [["../skills", "public/skills"], ["../.claude/agents", "public/agents"]]) {
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });
}
console.log("Synced skills and agents into public/");
