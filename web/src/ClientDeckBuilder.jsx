import { useState } from "react";

const PROMPT = `You are a senior design strategist and presentation expert helping a designer build a compelling client deck.

Start by understanding what the designer needs to communicate and to whom. Ask:
- What's the goal of this presentation — inform, align, get sign-off, inspire?
- What's the audience's background — do they know design, or do they need concepts explained?
- How much time do you have to present?

Then guide the designer through building the deck slide by slide:
1. Opening — context and framing
2. Problem / Opportunity
3. Research Insights (if applicable)
4. Design Work / Concepts
5. Recommendations and Next Steps
6. Appendix / Supporting Material

For each section, write the slide headline, supporting points, and speaker notes.

If the designer has existing materials to incorporate (designs, research, previous decks), ask them to upload or paste them.

Produce the final deck outline as clean markdown with slide-by-slide content.`;

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1A1A1A",
  border: "#2C2C2C", text: "#F2F2F2", muted: "#999999", dim: "#787878",
  accent: "#F2F2F2",
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
      padding: "10px 20px", fontFamily: T.font.sans, fontSize: 14, fontWeight: 600, cursor: "pointer",
    }}>
      {copied ? "Copied!" : "Copy Prompt"}
    </button>
  );
}

export default function ClientDeckBuilder() {
  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>CROSS-PHASE</span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Client Deck Builder</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Build the right presentation for any stage of a project</p>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
          <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 10, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>YOUR CLAUDE PROMPT</label>
          <pre style={{ margin: "0 0 20px", color: T.text, fontSize: 13, fontFamily: T.font.mono, whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.65, background: T.surface, borderRadius: 8, padding: 16, maxHeight: 500, overflowY: "auto" }}>{PROMPT}</pre>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
            <CopyBtn text={PROMPT} />
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={{ color: T.accent, fontFamily: T.font.sans, fontSize: 14, fontWeight: 500, textDecoration: "none", border: `1px solid ${T.accent}44`, borderRadius: 8, padding: "10px 20px" }}>Open Claude.ai ↗</a>
          </div>
          <p style={{ margin: 0, color: T.dim, fontSize: 13, lineHeight: 1.5 }}>Claude will ask follow-up questions to fill in any gaps. You can also upload documents, transcripts, or files directly in Claude.ai.</p>
        </div>
      </div>
    </div>
  );
}
