---
name: skill-chaining
phase: all
description: Connect design phases so outputs become inputs. Use this skill to generate Phase Handoff Blocks at the close of each phase — structured summaries Claude fills in that become the opening context for the next phase. Eliminates context loss between conversations and turns six separate sessions into one continuous AI-assisted workflow.
claude_surface: chat
ai_leverage: high
---

# Skill Chaining — Phase Handoff System

Without explicit handoffs, each phase is a fresh start. A designer finishing Discover has to mentally re-brief Claude when moving to Define. This skill fixes that — turning six modular phases into one composable workflow.


## Claude Surface

**Use Claude Chat** (`claude.ai`) for all skill-chaining workflows.

Skill chaining is a conversational pattern — generating handoff blocks, pasting them
into new sessions, and continuing the thread. No installation or MCP required.

## How It Works

At the close of each phase, ask Claude to generate a **Phase Handoff Block** — a structured summary of everything produced. Paste that block as the *first message* of the next phase conversation. Claude picks up with full context, no re-briefing required.

```
Discover → [Handoff Block] → Define → [Handoff Block] → Ideate → ...
```

Each Handoff Block captures:
- The project and user context
- Key decisions made this phase
- Primary outputs and what they revealed
- Open questions carried forward
- Recommended focus for the next phase

---

## Phase Handoff Prompts

Use these at the close of each phase to generate the handoff block.

### After Discover → passing to Define

```
We've completed the Discover phase. Generate a Phase Handoff Block I can paste at the start of the Define phase. Include:

PROJECT CONTEXT
- Product: [what we're designing]
- Users: [who we're designing for]
- Business goal: [what success looks like]

RESEARCH SUMMARY
- Top 3 themes by frequency and impact
- Most critical pain points (ranked)
- Key user quotes that anchor the findings

PERSONAS DEFINED
- [Persona name, role, primary goal, primary frustration]
- (repeat for each persona)

OPPORTUNITIES IDENTIFIED
- [Top 3 opportunity areas with evidence]

OPEN QUESTIONS
- [What we don't know yet that Define should answer]

RECOMMENDED DEFINE FOCUS
- [Which problem to frame first and why]
```

---

### After Define → passing to Ideate

```
We've completed the Define phase. Generate a Phase Handoff Block I can paste at the start of the Ideate phase. Include:

PROBLEM STATEMENT
- HMW framing: [the primary How Might We statement]
- JTBD framing: [the primary Jobs to Be Done]
- Design brief summary: [scope, constraints, success metrics]

JOURNEY MAP INSIGHTS
- Stage with most friction: [stage name + what happens]
- Biggest opportunity moment: [stage + what could change]
- Emotion low point: [where users feel worst and why]

PRIORITIZED REQUIREMENTS
- Must haves: [list]
- Should haves: [list]
- Out of scope: [list]

CONSTRAINTS TO DESIGN WITHIN
- [Technical, business, or user constraints that shape the solution]

OPEN QUESTIONS
- [What ideation needs to answer or explore]

RECOMMENDED IDEATE FOCUS
- [Which direction or constraint to explore first]
```

---

### After Ideate → passing to Prototype

```
We've completed the Ideate phase. Generate a Phase Handoff Block I can paste at the start of the Prototype phase. Include:

SELECTED CONCEPT
- Concept name and direction: [what we're building]
- Core interaction: [the key user action]
- Why selected: [evaluation rationale]

CONCEPT EVALUATION SUMMARY
- Concepts explored: [list with one-line summary each]
- Evaluation criteria used: [criteria + weights]
- Concept scores: [ranked results]

KEY DESIGN DECISIONS
- [Decision made + rationale + alternatives rejected]

UI PATTERNS ESTABLISHED
- [Patterns chosen for navigation, layout, interaction]

SCREENS TO PROTOTYPE
- [List of screens with priority order]

OPEN QUESTIONS
- [What prototyping needs to validate or resolve]

RECOMMENDED PROTOTYPE FOCUS
- [Highest-risk flows to prototype first]
```

---

### After Prototype → passing to Validate

```
We've completed the Prototype phase. Generate a Phase Handoff Block I can paste at the start of the Validate phase. Include:

PROTOTYPE SUMMARY
- Fidelity level: [lo-fi / mid-fi / hi-fi]
- Screens built: [list]
- Key interactions implemented: [list]

COMPONENT INVENTORY
- New components created: [list with states documented]
- Reused components: [list]
- Known accessibility considerations: [list]

HYPOTHESES TO TEST
- [Assumption we're testing + what success looks like]
- (repeat for each hypothesis)

RISKIEST ASSUMPTIONS
- [The thing most likely to fail with users + why]

TEST FOCUS AREAS
- [Flows or moments we most need feedback on]

OPEN QUESTIONS
- [What we don't know that validation should answer]

RECOMMENDED VALIDATE FOCUS
- [Which task scenarios to prioritize in testing]
```

---

### After Validate → passing to Deliver

```
We've completed the Validate phase. Generate a Phase Handoff Block I can paste at the start of the Deliver phase. Include:

TEST SUMMARY
- Participants: [N] | Completion rate: [X%] | Overall sentiment: [positive/mixed/negative]
- Most critical finding: [one sentence]

ISSUES BY SEVERITY
- Critical (blocks completion): [list with frequency]
- Major (significant confusion): [list with frequency]
- Minor (friction): [list with frequency]

WHAT TESTED WELL
- [Flows or moments users navigated successfully]

DESIGN CHANGES REQUIRED
- [Issue → specific fix required] (repeat for each critical/major issue)

COMPONENTS READY TO SPEC
- [Components that are validated and ready for handoff]

OPEN QUESTIONS
- [Edge cases or states that still need resolution]

RECOMMENDED DELIVER FOCUS
- [Which components to spec first based on dev priority]
```

---

## Receiving a Handoff Block

When starting a new phase with a handoff block, open with:

```
I'm starting the [PHASE NAME] phase. Here is the handoff from [PREVIOUS PHASE]:

[PASTE HANDOFF BLOCK HERE]

Please confirm you have the context and tell me what you recommend we tackle first.
```

Claude will acknowledge the context, flag any gaps, and recommend a starting point — no additional briefing needed.

---

## Tips for Clean Chains

**Keep blocks in your project notes.** Store each handoff block in Notion, a shared doc, or your Figma file's AI Toolkit page. They become a project audit trail.

**Don't skip phases.** If you move from Discover directly to Prototype, generate a combined handoff that captures what's known and explicitly flags what's assumed.

**Use blocks to re-orient mid-phase.** If a conversation gets long or goes off track, paste the original handoff block to reset context.

**Update blocks when the phase reveals something unexpected.** If Define uncovered a constraint that changes the research framing, update the Discover block before passing to Ideate.

---

## Quality Checklist

- [ ] Handoff block generated at the close of every phase before moving on
- [ ] Block includes project context, decisions, outputs, and open questions
- [ ] Next phase opened with the handoff block as the first message
- [ ] Block stored in project notes or Figma AI Toolkit page
- [ ] Unexpected findings from one phase reflected in the block before passing forward
- [ ] Combined handoff created if any phases were skipped or compressed
