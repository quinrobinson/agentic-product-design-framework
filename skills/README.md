# AI × UX Design Process — Skills Library

A collection of Claude skills for every phase of the product design process. Each skill provides structured workflows, templates, and quality checklists that can be used directly with Claude or as reference documentation for your design practice.

## Skills by Phase

### 01 — Discover
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| User Research | `01-discover/user-research.md` | High | Synthesize raw research into structured insights, plan studies, create interview guides |
| Competitive Analysis | `01-discover/competitive-analysis.md` | High | Map competitive landscapes, benchmark features, identify differentiation opportunities |

### 02 — Define
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| Problem Framing | `02-define/problem-framing.md` | Medium | Frame problems with HMW/JTBD/user stories, journey mapping, requirements prioritization |

### 03 — Ideate
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| Concept Generation | `03-ideate/concept-generation.md` | High | Generate diverse concepts, recommend UI patterns, scaffold design systems |

### 04 — Prototype
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| Prototyping | `04-prototype/prototyping.md` | High | Build functional prototypes, write UX copy, conduct accessibility audits |

### 05 — Validate
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| Usability Testing | `05-validate/usability-testing.md` | High | Plan tests, write scenarios, analyze results, heuristic evaluations |

### 06 — Deliver
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| Design Delivery | `06-deliver/design-delivery.md` | High | Component specs, dev handoff, design decision records, release notes |

### Cross-Phase
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| Figma Playbook | `figma-playbook.md` | High | Execute design work directly in Figma via MCP — patterns for every phase |

## How to Use

### With Claude
1. Upload a skill file or paste its contents into your conversation
2. Describe your project context and what you need
3. Claude will follow the skill's workflow and output templates

### As Reference
Each skill contains structured templates you can use directly:
- Copy the markdown templates into your project docs
- Use the quality checklists before moving to the next phase
- Reference the frameworks when you need structure for your thinking

### In Your Repo
```
skills/
├── README.md
├── 01-discover/
│   ├── user-research.md
│   └── competitive-analysis.md
├── 02-define/
│   └── problem-framing.md
├── 03-ideate/
│   └── concept-generation.md
├── 04-prototype/
│   └── prototyping.md
├── 05-validate/
│   └── usability-testing.md
└── 06-deliver/
    └── design-delivery.md
```

## Design Process Overview

```
Discover → Define → Ideate → Prototype → Validate → Deliver
   ↑                                              |
   └──────────── Iterate as needed ←──────────────┘
```

The process is not strictly linear. You'll loop back based on what you learn:
- **Validation reveals new problems** → Loop back to Define
- **Prototyping surfaces technical constraints** → Loop back to Ideate
- **Delivery QA catches issues** → Loop back to Prototype

## Companion Artifacts

- **Interactive JSX Site** — Clickable phase-by-phase system with live design system tuner
- **Figma Template** — [AI × UX Design Process Template](https://www.figma.com/design/mrHuD7sY7h6uKSVndTSIQE) — Duplicate per project

## AI Leverage Levels

- **High** — AI handles the heavy lifting (synthesis, generation, documentation). You review, refine, and direct.
- **Medium** — AI assists with structure and drafts. You bring judgment, context, and strategic thinking.
- **Low** — Fundamentally human skills (empathy, taste, stakeholder navigation). AI can support but not replace.

## Contributing

To add or modify skills:
1. Follow the frontmatter format (`name`, `phase`, `description`, `ai_leverage`)
2. Include structured templates with clear placeholders
3. Add a quality checklist at the end of every skill
4. Keep skills actionable — workflows, not theory
