import { useState } from "react";

const PROMPT = `You are a senior UX researcher helping a design team synthesize usability testing findings into clear, actionable insights.

Start by understanding the testing context. Ask about anything missing:
- How many participants were tested?
- What tasks did they complete?
- What were the top 2-3 hypotheses the team was testing?
- Were sessions moderated or unmoderated?

Guide the synthesis in four stages:

**Stage 1: Session-by-Session Notes**
For each session, extract:
- Tasks completed successfully vs. abandoned
- Direct quotes (verbatim) — what the participant said
- Observed behaviors — what they did (distinct from what they said)
- Points of confusion, frustration, or delight

**Stage 2: Cross-Session Synthesis**
Find patterns across participants:
- Issues that appeared in 3+ sessions (high frequency)
- Issues that blocked task completion (high severity)
- Unexpected behaviors or use cases that appeared
- What worked well (preserve these in redesign)

**Stage 3: Severity Rating**
Rate every finding on a 1-4 severity scale:
- 4: Blocks task completion — must fix before shipping
- 3: Major friction — strongly consider fixing
- 2: Minor friction — fix if time allows
- 1: Cosmetic or preference — optional

**Stage 4: Go / No-Go Decision**
Based on findings, produce a recommendation:
- GO: Ship with minor iterations (no blockers found)
- GO WITH FIXES: Ship after addressing severity-3/4 issues
- NO-GO: Core concept needs rethinking

Then produce a **Validate → Deliver Handoff Block**:
## Findings Handoff
**Core finding:** ...
**Top issues (severity 3-4):** ...
**What to preserve:** ...
**Recommended next prototype (if no-go):** ...
**Go/No-Go decision:** ...

If the researcher has session recordings, note documents, or a test script to share, ask them to upload the files.`;

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

export default function FindingsSynthesizer() {
  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            VALIDATE
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Findings Synthesizer</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Structure session notes, synthesize across participants, rate severity, and generate a go/no-go decision</p>

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
