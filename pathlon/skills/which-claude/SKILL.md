---
name: which-claude
phase: all
description: >
  Decide where to run Pathlon work — Claude Code (CLI or the Code tab in Claude Desktop), Claude
  Chat on web or mobile, or Cowork — and what each gives you: project memory, agents, commands,
  Figma, local files. Use when unsure which surface to open, when setting up Pathlon, when
  connecting Figma, or when something isn't working (tools missing, project not remembered).
ai_leverage: high
---

# Which Claude?

**Short answer: do design work in Claude Code** — the CLI, or the Code tab in Claude Desktop. That's where Pathlon's project memory, agents, commands, and automatic context live. Use Chat for quick thinking on the go. Cowork is for work where Claude drives apps and your screen; Pathlon hasn't been tested there, so check what it supports before relying on it for project work.

## What each surface gives you

| | Claude Code (CLI or Desktop Code tab) | Claude Chat (web, mobile, desktop chat) |
|---|---|---|
| Pathlon skills | ✅ all, via the plugin | ✅ after uploading the skill zips |
| Agents and `/pathlon:*` commands | ✅ | — |
| Project memory (`.pathlon/`) | ✅ loads automatically | — (optional sync is on the roadmap) |
| Your local files and repos | ✅ | Only what you upload |
| Figma | ✅ Figma MCP — read and write files | ✅ Figma connector |
| Best for | Everything in a project: research through build | Thinking, drafting, reviewing away from your desk |

## Quick decisions

| You want to… | Use |
|---|---|
| Work on a project so Claude remembers it next time | Claude Code |
| Run a phase, use an agent, or close a phase with a handoff | Claude Code |
| Build or change frames and components in Figma | Claude Code (Figma MCP), or Chat with the Figma connector |
| Synthesize notes or draft copy away from your desk | Chat (paste the result into the project later, or save it from Claude Code) |
| Have Claude click through a staging site or a desktop app | Cowork |

## Setup

- **Claude Code:** install Claude Code and Node.js 18+, then `/plugin marketplace add quinrobinson/agentic-product-design-framework` and `/plugin install pathlon@pathlon`. Restart. Open your project's folder.
- **Figma:** connect the Figma MCP in Claude Code (or the Figma connector in Chat).
- **Chat:** build the skill zips from the repo (`npm --prefix web run chat-skills`) and upload them under Settings → Capabilities → Skills.

## If something isn't working

| Symptom | Likely cause | Fix |
|---|---|---|
| No `pathlon:` skills, agents, or `/pathlon:*` commands | Plugin not installed or not loaded | `/plugin install pathlon@pathlon`, then restart Claude Code or Desktop |
| Pathlon tools missing or erroring | Node.js missing or too old | `node --version` must show 18+; install from nodejs.org, restart |
| Claude doesn't know the project when a session opens | No Pathlon project in this folder (or you're in a different folder) | Run `/pathlon:start` here, or open the folder that has `.pathlon/` |
| Claude asks the same questions every session | Things aren't being saved | Ask "save that to Pathlon" once; check `.pathlon/log.jsonl` |
| Pathlon chimes in on unrelated projects | Shouldn't happen — context is silent outside a Pathlon project | Check the folder isn't inside one that has `.pathlon/` |
| In Chat, Claude has no project context | Chat has no access to `.pathlon/` | Work in Claude Code, or paste the latest handoff |
