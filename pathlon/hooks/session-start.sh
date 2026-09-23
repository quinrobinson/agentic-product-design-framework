#!/usr/bin/env bash
# Pathlon session start: point Claude at project state in Pathlon MCP.
# Replaces the old inject-context.sh, which read .apdf/context.json.

repo=$(git remote get-url origin 2>/dev/null | tr -d '"\\')
where=${repo:-"this directory (no git remote)"}

context="Pathlon plugin is active. Project state lives in Pathlon MCP, not in local files (.apdf/context.json is deprecated). Working in: ${where}. Before phase work, call the Pathlon get_project_context tool for the current project (by Figma file_id today; by project_id or repo once Pathlon rewire step 5.4 ships) and read recent memories with get_memories. If no Pathlon project exists for this work, suggest /pathlon:kickoff. If Pathlon tools error or are unavailable, say so once and continue without project state rather than inventing it."

printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}\n' "$context"
exit 0
