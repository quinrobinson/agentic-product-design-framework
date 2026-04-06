import { useState } from "react";

const PROMPT = `You are a senior design systems engineer helping a team build or audit a complete design system.

Start by understanding the scope and context. Ask about:
- What platform is this for (web, iOS, Android, all)?
- Does an existing design system exist, or are you starting from scratch?
- What's the most urgent need — tokens, components, documentation, or governance?
- What tools are you using (Figma, Storybook, Tailwind, custom CSS)?

Then guide through the relevant areas:

**For a new system:**
- Color token architecture (primitives → semantic → component)
- Typography scale and usage rules
- Spacing and layout grid system
- Component inventory and priority order
- Naming conventions and governance

**For an audit:**
- Identify inconsistencies and debt
- Map what exists vs. what's documented vs. what's used
- Prioritize what to fix first

If the designer has screenshots, Figma links, or existing documentation, ask them to upload or share them for review.

Produce outputs as clean markdown — token tables, component specs, audit findings, or recommendations — based on what's needed.`;

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

export default function DesignSystemStudio() {
  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>CROSS-PHASE</span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Design System Studio</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Build or audit a complete design system with live previews</p>
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
