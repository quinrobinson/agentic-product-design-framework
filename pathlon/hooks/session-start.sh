#!/usr/bin/env bash
# Pathlon session start: point Claude at project state in Pathlon MCP.
# Replaces the old inject-context.sh, which read .apdf/context.json.

repo=$(git remote get-url origin 2>/dev/null | tr -d '"\\')
where=${repo:-"this directory (no git remote)"}

context="Pathlon plugin is active. Project state lives in the project's .pathlon/ files, read and written only through the Pathlon MCP tools (never by hand). Working in: ${where}. Before phase work, call the Pathlon get_project_context tool (it finds the project from the working directory; pass path or project_id if needed) and read recent memories with get_memories. If no Pathlon project exists for this work, suggest /pathlon:kickoff. If Pathlon tools error or are unavailable, say so once and continue without project state rather than inventing it."

printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}\n' "$context"
exit 0
