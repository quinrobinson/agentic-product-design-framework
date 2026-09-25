# Pathlon eval suite

Measures whether the right skill or agent fires for design requests, whether its output is good, and that Pathlon stays out of unrelated work. Format: `claude plugin eval` (Claude Code 2.1.282+).

| Case | Checks |
|---|---|
| 01–05 | The right skill fires (`research-synthesis`, `problem-framing`, `ux-copy-writing`, `motion`, `phase-handoff`) and its output meets an outcome rubric |
| 06 | A research request is delegated to the `pathlon:researcher` agent |
| 07 | An ambiguous request gets exactly one clarifying question |
| 08–10 | General coding and unrelated questions do **not** trigger Pathlon skills |

Pathlon's MCP tools are mocked (`mocks/pathlon/`) as "no project in this folder", so no case touches real project state.

```bash
# From pathlon/ — pilot one run per case, keep the report local
claude plugin eval . --runs 1 --judge-model sonnet --no-publish
# Full suite (3 runs per case, with and without the plugin)
claude plugin eval . --judge-model sonnet
```

The headline number is Δ: the with-plugin score minus the without-plugin score. Skill-fired graders are shown as trigger indicators but don't move Δ; outcome graders do. Results land in `evals/results/` (gitignored).
