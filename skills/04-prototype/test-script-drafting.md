---
name: test-script-drafting
phase: 04 — Prototype
description: Write a complete usability test script — scenario setup, tasks, observation prompts, and post-test questions — that directly tests the prototype's highest-risk assumptions. Use at the end of Prototype to prepare for Validate. Bridges the two phases: the prototype answers what to build, the test script answers how to know if it's working. Depends on outputs from prototype-scoping.md and heuristic-review.md. Outputs feed directly into the Validate phase.
ai_leverage: high
claude_surface: chat
---

# Test Script Drafting

Write the test script that turns a prototype into evidence — tasks, scenarios, and questions that surface whether the concept works for real users.

## When to Use

- After building a prototype and before scheduling usability tests
- When writing tasks for the first time and unsure what to ask
- When existing test scripts are too leading, too vague, or miss the key risks
- When multiple prototype questions need to be tested in a single session
- When handing off a test to someone else to run

---

## What a Good Test Script Does

A test script doesn't just organize the session — it turns the session into evidence. Every task must:
- **Test a specific prototype question** from `prototype-scoping.md`
- **Generate observable behavior** — not just opinions
- **Be task-based** — not feature-based ("complete this task" not "explore this feature")
- **Be non-leading** — not revealing what the right answer looks like

A test script that asks "how easy was it to use the navigation?" measures opinion. A script that asks participants to complete a task while you observe whether they find the navigation generates evidence.

---

## What Claude Needs to Start

1. **Prototype questions** — what the prototype must answer (from `prototype-scoping.md`)
2. **Persona** — who is being tested, and what role they should play in the scenario
3. **Flow being tested** — which user flow and key screens
4. **Scenario and trigger** — the context from `storyboarding.md`
5. **Heuristic review findings** — issues to specifically probe (from `heuristic-review.md`)
6. **Session length** — how long each test session will be (typically 45–60 min)
7. **Moderation style** — think-aloud protocol, co-discovery, or retrospective

---

## Test Script Structure

A complete test script has five parts:

1. **Introduction** — welcome, ground rules, consent, recording permission
2. **Warm-up questions** — establish participant context before touching the prototype
3. **Tasks** — the core of the session; each task tests a prototype question
4. **Probing questions** — follow-up after each task to understand behavior
5. **Debrief** — post-session questions and wrap-up

---

## Step 1: Write the Introduction

**Claude prompt:**
> "Write a moderator introduction script for this usability test.
>
> Include:
> 1. Welcome and purpose statement (what we're testing — emphasize: testing the product, not the person)
> 2. Think-aloud instruction — explain what think-aloud means with a brief example
> 3. Ground rules: no wrong answers, stop anytime, we want honest reactions
> 4. Recording consent — what's being recorded, how it's used, who sees it
> 5. Questions before we start?
>
> Keep it conversational — not clinical. Target: 3–4 minutes to read aloud.
> Product type: [what kind of product]
> Session length: [N minutes]
> Recording: [screen only / screen + audio / screen + video]"

---

## Step 2: Write Warm-Up Questions

Warm-up questions establish participant context and get them talking before the prototype appears. They also verify screening criteria.

**Claude prompt:**
> "Write 4–6 warm-up questions for a usability test with [persona description].
>
> Goals:
> - Confirm participant matches the target persona
> - Understand their current workflow and tools related to [problem domain]
> - Surface any relevant context before the prototype session
> - Build rapport before the tasks begin
>
> Rules:
> - Open-ended questions only — no yes/no
> - Ask about past behavior, not hypotheticals
> - Don't reveal what the prototype does — keep questions about their current reality
>
> Persona: [paste]
> Problem domain: [what the product addresses]"

---

## Step 3: Write the Task Scenarios

This is the most critical part of the script. Each task must:
- Be grounded in a realistic scenario
- Ask the participant to accomplish a goal — not to find or use a feature
- Be non-leading — not revealing what to look for or do
- Generate observable behavior that answers a prototype question

**Claude prompt:**
> "Write [N] task scenarios for this usability test.
>
> Prototype questions to answer:
> [paste from prototype-scoping.md]
>
> For each task:
> 1. **Scenario setup** — 2–3 sentences putting the participant in the situation (make it real)
> 2. **Task instruction** — one sentence asking them to accomplish a goal (not 'click the X button')
> 3. **Success criteria** — what the participant must do to complete the task (for observer use only — not read aloud)
> 4. **Prototype question it tests** — which risk this task addresses
> 5. **Observer notes prompt** — what the observer should specifically watch for
>
> Rules:
> - Task instruction must name the goal, not the mechanism: 'Save your work' not 'Click the save button'
> - Scenario must give enough context to make the task feel real
> - Don't use the product's own terminology in the scenario if users wouldn't know it yet
> - One primary task per prototype question
>
> Persona: [paste]
> Scenario trigger from storyboard: [paste]
> Flow being tested: [paste key steps]
> Session length: [N minutes] (tasks should fill [N-15] minutes)"

---

## Step 4: Write Probing Questions

Probing questions follow each task — they turn observation into explanation.

**Claude prompt:**
> "Write probing questions for each task in this test script.
>
> After each task, generate:
> 1. **Immediate reaction** — what was going through your mind when you [specific action from task]?
> 2. **Expectation check** — what did you expect to happen when you [specific decision point]?
> 3. **Difficulty probe** — was there a moment where you weren't sure what to do? What was that?
> 4. **Preference probe** — is there anything about this that felt different from how you normally [related activity]?
>
> Rules:
> - Never ask 'was this easy/hard?' — ask about specific moments
> - Ask about what they did, not what they would do
> - Follow up on hesitations and unexpected paths first — those are the signal
>
> Tasks: [paste tasks from Step 3]"

---

## Step 5: Write Debrief Questions

Debrief questions capture overall reaction after the participant has seen the full prototype.

**Claude prompt:**
> "Write debrief questions for this usability test.
>
> Include:
> 1. **Overall reaction** — open-ended, no leading (not 'what did you like?')
> 2. **Most confusing moment** — specific moment, not general feedback
> 3. **Most valuable moment** — what felt most useful or relevant to their work
> 4. **Missing element** — if they could add one thing, what would it be?
> 5. **Adoption question** — in their current workflow, where would this fit? Would they use it?
> 6. **Comparison** — how does this compare to how they currently [solve the problem]?
>
> Avoid:
> - 'Would you recommend this?' (hypothetical)
> - 'What would you rate this?' (surveys belong after sessions, not in them)
> - Leading language: 'Did you find the navigation intuitive?'
>
> Product context: [what it does]
> Persona: [paste]"

---

## Complete Test Script Template

**Claude prompt:**
> "Compile the complete test script from all parts generated.
>
> Format:
>
> # Usability Test Script: [Prototype Name]
> ### Date: [DATE] | Session length: [N min] | Moderator: [name]
>
> ## Pre-session checklist
> [Things to verify before participant arrives]
>
> ## Introduction [~5 min]
> [Introduction script]
>
> ## Warm-up [~5 min]
> [Warm-up questions]
>
> ## Task 1 — [Task name] [~X min]
> **Scenario setup:** [read aloud]
> **Task instruction:** [read aloud]
> **Success criteria:** [observer use only — not read aloud]
> **Prototype question:** [which risk this tests]
> **Observer watch for:** [specific behaviors]
> **Probing questions:** [ask after task]
>
> [Repeat for all tasks]
>
> ## Debrief [~10 min]
> [Debrief questions]
>
> ## Session close
> [Wrap-up script — thank participant, explain next steps, any incentive info]
>
> ## Observer guide (separate page — not shown to participant)
> [What to observe, how to take notes, what counts as success/failure per task]
>
> All parts: [paste everything generated]"

---

## Quality Checklist

Before running the first session:
- [ ] Every task tests a specific prototype question — no tasks that are just "explore the product"
- [ ] No task instruction uses the product's own terminology before participants have seen it
- [ ] Tasks ask for goal completion — not feature use ('save your project' not 'use the save button')
- [ ] Success criteria defined for every task — observer knows what to count
- [ ] Probing questions follow every task — observation alone misses the why
- [ ] Session timing adds up — tasks + intro + debrief ≤ session length
- [ ] Observer guide separate from participant script — moderator can focus on the participant
- [ ] Script tested with a colleague before the first real session (pilot test)

---

## Phase Handoff Block

```
## Handoff: Prototype → Validate
### From: Test Script Drafting
### Project: [PROJECT NAME]
### Date: [DATE]

---

### Prototype summary
- Concept: [name + one-liner]
- Fidelity: [level]
- Screens: [N]
- Prototype questions: [list]

### Test setup
- Session length: [N minutes]
- Participants needed: [N — typically 5 per persona for qualitative]
- Participant criteria: [screening requirements]
- Moderation style: [think-aloud / co-discovery / retrospective]

### Tasks (summary)
1. [Task name] — tests: [prototype question]
2. [Task name] — tests: [prototype question]
3. [Task name] — tests: [prototype question]

### Success criteria per task
1. [Task]: success = [observable behavior]
2. [Task]: success = [observable behavior]
3. [Task]: success = [observable behavior]

### Known issues entering testing
[Issues from heuristic review not fixed — observer should specifically note if these affect sessions]

### What we most need to learn
[The single most important question this test round must answer]

---
*This block is the complete Prototype → Validate handoff.*
*Paste it as the first message when opening any Validate phase skill.*
*The test script, success criteria, and prototype questions are the inputs to analysis.*
```
