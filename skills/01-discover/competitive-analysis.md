---
name: competitive-analysis
phase: 01 — Discover
description: Map the competitive landscape, audit UX patterns across products, and identify differentiation opportunities. Use at the start of discovery to understand what already exists before designing something new. Triggers include requests to map competitors, benchmark features, audit UX conventions, identify gaps in the market, or build a competitive brief. Also use when a designer needs to understand what patterns users already expect from a product category.
ai_leverage: high
claude_surface: chat
---

# Competitive Analysis

Map what already exists — conventions to respect, gaps to exploit, and patterns worth stealing.

## When to Use

- Starting a new product or feature and need to understand the landscape
- Unsure which UX patterns users already expect from this category
- Looking for where the market is weak and users are underserved
- Preparing a competitive brief before moving into problem framing

---

## What Claude Needs to Start

Before generating analysis, Claude needs three inputs. If any are missing, ask:

1. **What product or feature are you designing?** (even a rough description)
2. **Who are the known competitors?** (list what you know — Claude will expand from there)
3. **What's the design question?** (are you looking for UX conventions, feature gaps, positioning, or all three?)

With these inputs, Claude can generate a structured competitive analysis. Without them, outputs will be generic.

---

## Step 1: Build the Competitive Set

Organize competitors into three tiers before auditing anything:

**Tier 1 — Direct competitors**
Same problem, same audience, similar solution. These define user expectations for the category.

**Tier 2 — Indirect competitors**
Same problem, different approach or audience. These reveal alternative mental models and edge cases.

**Tier 3 — Aspirational references**
Different category entirely, but relevant UX patterns worth studying. Often the most generative for differentiation.

```
## Competitive Set: [Product Category]

### Tier 1 — Direct
| Product | URL | Audience | Core Value Prop | Pricing Model |
|---|---|---|---|---|
| [Name] | [URL] | [Who] | [What] | [Free / Paid / Freemium] |

### Tier 2 — Indirect
| Product | URL | Audience | Core Value Prop | Why Indirect |
|---|---|---|---|---|

### Tier 3 — Aspirational
| Product | URL | Category | Why Relevant |
|---|---|---|---|
```

**Claude prompt to expand the competitive set:**
> "I'm designing [product]. My known competitors are [list]. Suggest 3–5 additional competitors I may have missed — including at least one indirect and one aspirational reference. Explain why each is relevant."

---

## Step 2: Audit Each Competitor

Evaluate every product across five dimensions. Work through Tier 1 first — these are the products that define user expectations and must be understood before moving to differentiation.

```
## Competitor Audit: [Product Name]
### Tier: [1 / 2 / 3]
### Audited: [Date]

---

### Value Proposition
- Core promise: [One sentence — what they claim to do]
- How communicated: [Homepage headline / onboarding / marketing]
- Clarity test: Is it clear within 5 seconds of landing? [Yes / No / Partial]

### Core UX Patterns
- Navigation model: [Tabs / Sidebar / Bottom nav / Hub-and-spoke / etc.]
- Information density: [Minimal / Balanced / Data-rich]
- Primary interaction pattern: [List / Canvas / Feed / Dashboard / etc.]
- Onboarding approach: [Product tour / Empty state / Wizard / None]
- Mobile experience: [Native app / Responsive web / Mobile-first / Desktop-only]
- Key interaction conventions: [Inline editing / Modals / Drawers / etc.]

### Strengths
- [What they do notably well — specific, not generic]
- [What users would miss most if they switched away]

### Weaknesses
- [Where the UX frustrates users — cite reviews if available]
- [What's dated, clunky, or obviously broken]
- [What they've sacrificed for their core use case]

### Differentiator
- [What only they do — what can't be easily copied]

### User Sentiment Summary
- App store / G2 rating: [X/5 — N reviews]
- Top praise: [Most common positive themes]
- Top complaints: [Most common negative themes]
- Source: [Where this sentiment came from]
```

**Claude prompt for competitor audit:**
> "Audit [Competitor] as a competitor to [my product]. Cover: value proposition, core UX patterns, strengths, weaknesses, differentiators, and user sentiment. Use web search to pull real user reviews from G2, app stores, or Reddit. Structure the output using the Competitor Audit template."

---

## Step 3: Synthesize the Landscape

After auditing individual competitors, synthesize across the full set to find patterns and gaps.

```
# Competitive Landscape Synthesis: [Product Category]
### Competitors analyzed: [N] | Date: [DATE]

---

## Market State
[2–3 sentences on where the category is today — mature / fragmented / consolidating / emerging]

## Competitive Matrix

| Dimension | [Competitor A] | [Competitor B] | [Competitor C] | [Our Product] |
|---|---|---|---|---|
| Core value prop | | | | |
| Primary user | | | | |
| Navigation model | | | | |
| Information density | | | | |
| Strongest feature | | | | |
| Biggest weakness | | | | |
| Mobile experience | | | | |
| Pricing model | | | | |

---

## Convention Map
*Patterns used by 3+ competitors — users will expect these. Deviate only with strong justification.*

1. [Convention] — Used by: [Competitors] — Why it's established: [Reason]
2. [Convention] — Used by: [Competitors] — Why it's established: [Reason]
3. [Convention] — Used by: [Competitors] — Why it's established: [Reason]

## Patterns Worth Stealing
*Done well by 1–2 competitors — worth adopting or adapting.*

1. [Pattern] — From: [Competitor] — Why it works: [Reason] — How to adapt: [Note]
2. [Pattern] — From: [Competitor] — Why it works: [Reason] — How to adapt: [Note]

## Gaps No One Solves Well
*Where users are consistently underserved across the category.*

1. [Gap] — Evidence: [User complaints / review themes / missing features]
2. [Gap] — Evidence: [User complaints / review themes / missing features]
3. [Gap] — Evidence: [User complaints / review themes / missing features]

## Patterns to Avoid
*Common approaches that frustrate users or create debt.*

1. [Pattern] — Why to avoid: [User complaints / known failure mode]
2. [Pattern] — Why to avoid: [User complaints / known failure mode]

---

## Differentiation Opportunities
*Where we can genuinely be better, different, or first.*

**Primary opportunity:** [One clear sentence — the sharpest gap + our angle]

**Supporting opportunities:**
1. [Opportunity] — Rationale: [Why this is real and winnable]
2. [Opportunity] — Rationale: [Why this is real and winnable]

## Positioning Signal
[1–2 sentences translating the competitive landscape into a direction for problem framing]
```

**Claude prompt for synthesis:**
> "I've audited [N] competitors: [list]. Using those audits, generate a Competitive Landscape Synthesis. Identify conventions users will expect, gaps no one solves well, patterns worth adopting, and 1–2 clear differentiation opportunities. Be specific — reference actual competitors and real user complaints."

---

## Step 4: Feature Benchmark (Optional)

Use when a specific feature needs deep comparison, not just landscape-level analysis.

```
# Feature Benchmark: [Feature Name]
### Product category: [Category] | Date: [DATE]

---

## [Competitor A] — [Product Name]
- How they implement it: [Description]
- Entry point / discoverability: [Where users find it]
- Key interactions: [What users actually do]
- Edge cases handled: [Exceptions, error states, empty states]
- What works: [Specific strengths]
- What doesn't: [Specific weaknesses]

## [Competitor B] — [Product Name]
[Repeat structure]

---

## Synthesis
- Best-in-class implementation: [Who + why]
- What to adopt directly: [Pattern + rationale]
- What to adapt: [Pattern + how to improve it]
- What to do differently: [Our opportunity]
```

---

## Using Claude + Web Search Effectively

Claude can run competitive analysis significantly faster with web search. Use these prompts:

**Finding user complaints:**
> "Search for '[Competitor] user complaints', '[Competitor] G2 reviews', and '[Competitor] reddit'. Summarize the top 5 recurring pain points users mention."

**Discovering indirect competitors:**
> "I'm building [product]. Beyond the obvious direct competitors, what indirect alternatives do users currently use to solve this problem? Include workarounds and adjacent tools."

**Identifying emerging patterns:**
> "What are the most notable UX pattern shifts in [product category] in 2025–2026? What are leading products doing differently from 3 years ago?"

**Benchmarking a specific interaction:**
> "How do [Competitor A], [Competitor B], and [Competitor C] handle [specific interaction — e.g. onboarding, empty states, notifications]? Compare their approaches and identify which is most effective."

---

## Quality Checklist

Before moving to synthesis:
- [ ] All three tiers represented — direct, indirect, aspirational
- [ ] Analysis based on actual product interaction, not just marketing pages
- [ ] User sentiment sourced from real reviews (G2, app stores, Reddit, forums)
- [ ] Conventions clearly separated from opportunities
- [ ] Gaps backed by user evidence — not just gaps we want to exist
- [ ] Analysis is current — products change fast, flag anything older than 6 months
- [ ] Differentiation opportunities are specific and winnable, not generic

---

## Phase Handoff Block

Generate this block at the close of competitive analysis. Combine with the Research Planning handoff when passing to Define.

```
## Handoff: Discover → Define
### From: Competitive Analysis
### Project: [PROJECT NAME]
### Date: [DATE]

---

### What we completed
- Competitors audited: [N total — X direct, X indirect, X aspirational]
- Feature benchmarks run: [N / none]
- User sentiment sourced: [Yes / Partial / No]

### What the next phase needs to know
- Product category: [Category name]
- Competitive set summary: [1–2 sentences on the landscape state]

### Dominant conventions — users will expect these
1. [Convention] — Used by [X of N] competitors
2. [Convention] — Used by [X of N] competitors
3. [Convention] — Used by [X of N] competitors

### Gaps no one solves well
1. [Gap] — Evidence: [Source]
2. [Gap] — Evidence: [Source]

### Patterns worth adopting
- [Pattern] from [Competitor] — [Why]
- [Pattern] from [Competitor] — [Why]

### Primary differentiation opportunity
[One sentence — the clearest gap + our angle to own it]

### Positioning signal for Define
[What problem statement direction the competitive landscape points toward]

### Open questions carried forward
- [What we couldn't determine from competitive analysis alone]
- [Gaps that need user research to validate]

---
*Combine with Research Planning handoff when opening the Define phase.*
*Claude will use the competitive context to ground the problem statement in real market reality.*
```
