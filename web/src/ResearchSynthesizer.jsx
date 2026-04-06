import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1A1A1A",
  border: "#2C2C2C", text: "#F2F2F2", muted: "#999999", dim: "#787878",
  accent: "#22C55E",
  font: { sans: "'DM Sans', sans-serif", mono: "'JetBrains Mono', monospace" },
};

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%", boxSizing: "border-box", background: T.surface,
        border: `1px solid ${T.border}`, borderRadius: 8, color: T.text,
        fontFamily: T.font.sans, fontSize: 14, padding: "10px 12px",
        resize: "vertical", outline: "none",
      }}
    />
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} disabled={!text} style={{
      background: text ? T.accent : T.border, color: text ? "#000" : T.muted,
      border: "none", borderRadius: 8, padding: "10px 20px",
      fontFamily: T.font.sans, fontSize: 14, fontWeight: 600,
      cursor: text ? "pointer" : "default",
    }}>
      {copied ? "Copied!" : "Copy Prompt"}
    </button>
  );
}

export default function ResearchSynthesizer() {
  const [context, setContext] = useState("");
  const [prompt, setPrompt] = useState("");

  function buildPrompt() {
    return `You are a senior UX researcher helping a designer synthesize user or stakeholder interviews into clear, actionable insights.

Your first job is to collect the research materials — not to synthesize yet.

**Step 1: Understand what we're working with**
Start by asking:
1. Are these user interviews, stakeholder interviews, or a mix of both?
2. How many sessions do you have?
3. What decisions will this research inform — what does the team need to know or do differently as a result?

**Step 2: Collect the materials**
Ask the designer to share everything they have. Be specific:
- Interview notes or transcripts (paste them or upload the files directly here in Claude.ai)
- Interview guide or discussion script, if one was used
- Any screener or participant profiles
- Previous research or context documents that informed this round

Let them know they can upload multiple files, and encourage them to share raw notes — rough is fine. Collect one session at a time if it's easier.

**Step 3: Align on the output**
Before synthesizing, confirm what format is most useful:
- A narrative Research Brief for stakeholders?
- A structured insight log (themes, quotes, severity ratings)?
- A handoff doc for the Define phase?
- Or something else?

Ask: who is the audience for this output, and how will it be used?

**Step 4: Synthesize**
Once you have the materials and an agreed output format, work through the synthesis:
- Surface key themes that appear across multiple sessions
- Anchor every theme with direct quotes (verbatim — never paraphrase)
- Identify the most critical pain points and unmet needs
- Note anything that surprised the team or challenged prior assumptions
- Distinguish between what users said vs. what they did (if observation data exists)

**Step 5: Produce the output**
Generate the agreed deliverable in clean markdown. Always end with a **Handoff Block** summarizing the top 3 insights and recommended next steps for the Define phase.${context ? `\n\n---\nContext from the designer:\n${context}` : ""}`;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            DISCOVER
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Research Synthesizer</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Synthesize user and stakeholder interviews into insights your team can act on</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              ANY CONTEXT TO START WITH <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={context}
              onChange={setContext}
              placeholder="Briefly describe the project and what you were trying to learn. Claude will ask you to share your interview notes and documents once you're in the conversation."
              rows={4}
            />
          </div>
        </div>

        <button
          onClick={() => setPrompt(buildPrompt())}
          style={{
            background: T.accent, color: "#000", border: "none", borderRadius: 8,
            padding: "12px 28px", fontFamily: T.font.sans, fontSize: 15, fontWeight: 600,
            cursor: "pointer", marginBottom: 36,
          }}
        >
          Generate Prompt →
        </button>

        {prompt && (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 10, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              YOUR CLAUDE PROMPT
            </label>
            <pre style={{
              margin: "0 0 20px", color: T.text, fontSize: 13, fontFamily: T.font.mono,
              whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.65,
              background: T.surface, borderRadius: 8, padding: 16, maxHeight: 400, overflowY: "auto",
            }}>
              {prompt}
            </pre>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
              <CopyBtn text={prompt} />
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
        )}
      </div>
    </div>
  );
}
