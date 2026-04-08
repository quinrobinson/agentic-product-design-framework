#!/bin/bash
# PostToolUse — writes APDF MCP tool outputs to .apdf/artifacts/

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
TOOL_RESPONSE=$(echo "$INPUT" | jq -r '.tool_response // empty')

if [[ "$TOOL_NAME" != mcp__apdf__* ]]; then
  exit 0
fi

ARTIFACT_NAME="${TOOL_NAME#mcp__apdf__}"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
ARTIFACTS_DIR=".apdf/artifacts"
INDEX_FILE="$ARTIFACTS_DIR/index.md"

mkdir -p "$ARTIFACTS_DIR"

FILENAME="${ARTIFACT_NAME}-${TIMESTAMP}.md"
FILEPATH="$ARTIFACTS_DIR/$FILENAME"

echo "# $ARTIFACT_NAME" > "$FILEPATH"
echo "_Generated: $(date -u +"%Y-%m-%d %H:%M UTC")_" >> "$FILEPATH"
echo "" >> "$FILEPATH"
echo "$TOOL_RESPONSE" >> "$FILEPATH"

if [ ! -f "$INDEX_FILE" ]; then
  echo "# APDF Artifact Index" > "$INDEX_FILE"
  echo "" >> "$INDEX_FILE"
  echo "| Tool | Generated | File |" >> "$INDEX_FILE"
  echo "|------|-----------|------|" >> "$INDEX_FILE"
fi

echo "| $ARTIFACT_NAME | $(date -u +"%Y-%m-%d %H:%M UTC") | $FILENAME |" >> "$INDEX_FILE"

exit 0
