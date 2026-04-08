#!/bin/bash
# Stop — prompts for a handoff block if phase work was done this session

SESSION_LOG=".apdf/session.log"
HANDOFF_TOOLS="synthesize_research|frame_problem|generate_concepts|plan_component_architecture|generate_handoff|log_design_qa"

if [ ! -f "$SESSION_LOG" ]; then
  exit 0
fi

if grep -qE "$HANDOFF_TOOLS" "$SESSION_LOG" 2>/dev/null; then
  if ! grep -q "generate_handoff" "$SESSION_LOG" 2>/dev/null || \
     ! grep -q "handoff-block" "$SESSION_LOG" 2>/dev/null; then
    echo "Phase work was completed this session. Run /handoff-block before closing to carry context into your next phase."
  fi
fi

rm -f "$SESSION_LOG"
exit 0
