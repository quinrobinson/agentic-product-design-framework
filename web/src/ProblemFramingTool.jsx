import { useState } from "react";

const PROMPT = `You are a senior product designer and design strategist helping a team frame their design problem clearly before moving into ideation.

Start by asking about anything missing:
- What decisions does this problem frame need to enable?
- Are there business constraints or non-negotiables to keep in mind?
- What has the team already tried or ruled out?

Guide the team through four outputs:

1. **Problem Statements (×3)** — Generate three distinct problem statement formats:
   - User-centered: "[User] needs [goal] because [insight]"
   - Tension-based: "How do we balance [X] while ensuring [Y]?"
   - Opportunity-based: "The opportunity is to [change] so that [user outcome]"
   Then evaluate each and recommend one. Be specific — every statement must be concrete enough that a designer could sketch 10 different solutions to it.

2. **Pressure Test** — Challenge the recommended statement on four fronts:
   - Is the user real and specific enough?
   - Is the insight grounded in research, not assumption?
   - Is the scope achievable within this project?
   - Does it leave room for creative solutions?

3. **HMW Questions** — Generate 10 How Might We questions from the problem frame. Score and rank the top 5 on: specificity, actionability, and creative potential.

4. **Handoff Block** — Produce a Define → Ideate Phase Handoff Block:
   ## Define → Ideate Handoff
   **Chosen Problem Statement:** ...
   **Top HMW Questions:** ...
   **Key Constraints:** ...
   **What NOT to explore:** ...
   **Recommended first concept angle:** ...

If the designer has a Research Brief or other documents to share, ask them to upload the files.`;

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1A1A1A",
  border: "#2C2C2C", text: "#F2F2F2", muted: "#999999", dim: "#787878",
  accent: "#8B5CF6",
  font: { sans: "'DM Sans', sans-serif", mono: "'JetBrains Mono', monospace" },
};

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} style={{
      background: T.accent, color: "#fff", border: "none", borderRadius: 8,
      padding: "10px 20px", fontFamily: T.font.sans, fontSize: 14, fontWeight: 600,
      cursor: "pointer",
    }}>
      {copied ? "Copied!" : "Copy Prompt"}
    </button>
  );
}

export default function ProblemFramingTool() {
  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            DEFINE
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Problem Framing</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Generate, pressure-test, and score problem statements + HMW questions</p>

        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
          <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 10, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
            YOUR CLAUDE PROMPT
          </label>
          <pre style={{
            margin: "0 0 20px", color: T.text, fontSize: 13, fontFamily: T.font.mono,
            whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.65,
            background: T.surface, borderRadius: 8, padding: 16, maxHeight: 500, overflowY: "auto",
          }}>
            {PROMPT}
          </pre>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
            <CopyBtn text={PROMPT} />
            <a
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: T.accent, fontFamily: T.font.sans, fontSize: 14, fontWeight: 500,
                textDecoration: "none", border: `1px solid ${T.accent}44`, borderRadius: 8, padding: "10px 20px",
              }}
            >
              Open Claude.ai ↗
            </a>
          </div>
          <p style={{ margin: 0, color: T.dim, fontSize: 13, lineHeight: 1.5 }}>
            Claude will ask follow-up questions to fill in any gaps. You can also upload documents, transcripts, or files directly in Claude.ai.
          </p>
        </div>
      </div>
    </div>
  );
}
