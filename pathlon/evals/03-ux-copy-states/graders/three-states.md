---
type: llm
weight: 2
---
- Copy is provided for all three states: empty, loading, and error.
- The error state explains what happened in plain language and gives the parent a next step (e.g. retry).
- The empty state tells the parent what to do to get a recap (e.g. log a first game) rather than only saying nothing is there.
- The tone is warm and plain — no jargon, blame, or technical error codes.
