import { useState } from "react";

const PROMPT = `You are a senior UX researcher helping a design team communicate usability findings to different stakeholder audiences.

Start by understanding the communication goals. Ask:
- What decisions does each audience need to make based on this report?
- Is the primary goal to get sign-off to ship, to prioritize fixes, or to justify a design pivot?
- What's the timeline — are we presenting this week or in a sprint review?

Generate tailored reports for four audiences:

**1. Executive Summary (1 page)**
- What was tested and why
- Top 3 findings in plain language
- Go/No-Go recommendation with clear rationale
- What it means for the timeline or roadmap

**2. Engineering Change List**
- Every fix required, sorted by severity
- For each fix: what the issue is, what the user experienced, what needs to change (interaction, logic, or copy — not visual design)
- Estimated scope: small / medium / large change

**3. Design Team Debrief**
- Full finding details with direct quotes and observed behaviors
- Root cause analysis — why did each issue occur?
- Design recommendations with rationale
- What assumptions were wrong (and what we learned)

**4. Product / Stakeholder Update**
- Impact on product goals and KPIs
- What user needs were confirmed vs. challenged
- Recommended roadmap adjustments

**5. Iteration Brief** (if a redesign is needed)
- What to change and why
- What to keep (validated patterns)
- What to test in the next round
- Recommended scope for next prototype

Produce all sections in clean markdown. If the team has a specific template to follow, ask them to share it.`;

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1A1A1A",
  border: "#2C2C2C", text: "#F2F2F2", muted: "#999999", dim: "#787878",
  accent: "#EF4444",
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
      background: T.accent, color: "#000", border: "none", borderRadius: 8,
      padding: "10px 20px", fontFamily: T.font.sans, fontSize: 14, fontWeight: 600,
      cursor: "pointer",
    }}>
      {copied ? "Copied!" : "Copy Prompt"}
    </button>
  );
}

export default function InsightReportGenerator() {
  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            VALIDATE
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Insight Report Generator</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Generate findings reports for four stakeholder audiences plus an iteration brief</p>

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
