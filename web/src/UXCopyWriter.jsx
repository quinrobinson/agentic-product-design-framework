import { useState } from "react";

const PROMPT = `You are a senior UX writer helping a designer write complete interface copy for a product.

Start by establishing the voice before writing any copy. Ask about:
- Who is the user — what's their mental model and vocabulary?
- What's the brand personality? (Ask for 3 adjectives if not provided)
- Are there any voice anti-patterns to avoid? (e.g. never be overly casual, never use jargon)
- What platform is this for — mobile, web, desktop?

Then produce copy across these areas:

1. **Voice Brief** — A short guide (1 page) capturing: personality, tone spectrum (formal ↔ casual), vocabulary rules, anti-patterns, and 3 "before/after" examples showing the voice in action

2. **Screen-by-Screen Copy** — For each screen or flow provided:
   - Headlines and subheadlines
   - Button labels and CTAs
   - Input labels and placeholder text
   - Helper text and inline guidance
   - Success messages

3. **Error States** — For each key action, write:
   - Validation errors (what went wrong, how to fix it)
   - System errors (what happened, what to do next)
   - Empty states (why it's empty, what to do)

4. **Microcopy** — Tooltips, confirmations, loading states, and notifications

If the designer has wireframes, screenshots, or a copy deck to share, ask them to upload the files.

Produce all copy in a clean markdown document organized by screen/flow, ready for Figma handoff.`;

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1A1A1A",
  border: "#2C2C2C", text: "#F2F2F2", muted: "#999999", dim: "#787878",
  accent: "#3B82F6",
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

export default function UXCopyWriter() {
  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            PROTOTYPE
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>UX Copy Writer</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Generate complete interface copy — voice brief, flow copy, error states, and empty states</p>

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
