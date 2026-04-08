#!/bin/bash
# PreToolUse — injects project context into APDF tool inputs

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
CONTEXT_FILE=".apdf/context.json"

if [[ "$TOOL_NAME" != mcp__apdf__* ]]; then
  exit 0
fi

if [ ! -f "$CONTEXT_FILE" ]; then
  exit 0
fi

PROJECT_NAME=$(jq -r '.project_name // empty' "$CONTEXT_FILE")
PHASE=$(jq -r '.phase // empty' "$CONTEXT_FILE")
PERSONA=$(jq -r '.persona // empty' "$CONTEXT_FILE")
PROBLEM=$(jq -r '.problem_statement // empty' "$CONTEXT_FILE")
CONSTRAINTS=$(jq -r '.constraints // empty' "$CONTEXT_FILE")

CONTEXT_STRING="Project context from .apdf/context.json:
- Project: $PROJECT_NAME
- Current phase: $PHASE
- Primary persona: $PERSONA
- Problem statement: $PROBLEM
- Constraints: $CONSTRAINTS

Use this context to enrich the tool output where relevant."

jq -n --arg ctx "$CONTEXT_STRING" '{
  additionalContext: $ctx
}'
