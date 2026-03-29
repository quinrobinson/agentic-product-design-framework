import { useState, useEffect } from "react";
import DesignProcessSystem from "./DesignProcessSystem";
import UniversalDesignSystem from "./DesignTokensSystem";
import DesignSystemChecklist from "./DesignSystemChecklist";
import M3TokenReference from "./M3TokenReference";

// ── Design System Tokens (from Onboarding Deck) ────────────────────────────
const DS = {
  dark: "#0F172A",
  darkCard: "#1E293B",
  darkBorder: "#334155",
  white: "#FFFFFF",
  bodyLight: "#94A3B8",
  bodyDark: "#64748B",
  light: "#F8FAFC",
  lightCard: "#FFFFFF",
  lightBorder: "#E2E8F0",
  phases: {
    "01": { color: "#22C55E", bg: "#052E16", label: "Discover" },
    "02": { color: "#8B5CF6", bg: "#2E1065", label: "Define" },
    "03": { color: "#F59E0B", bg: "#2D1A00", label: "Ideate" },
    "04": { color: "#3B82F6", bg: "#0C1A40", label: "Prototype" },
    "05": { color: "#EF4444", bg: "#2D0A0A", label: "Validate" },
    "06": { color: "#14B8A6", bg: "#042F2E", label: "Deliver" },
  },
};

const TOOLS = [
  {
    id: "process",
    number: "01",
    phase: "01",
    name: "Design Process System",
    subtitle: "AI-integrated phase-by-phase framework",
    description: "Six-phase design process with AI prompts, skill docs, Figma playbook actions, templates, and tool recommendations per phase.",
    tags: ["All phases", "AI prompts", "11 skills"],
    component: DesignProcessSystem,
  },
  {
    id: "tokens",
    number: "02",
    phase: "03",
    name: "Design Tokens System",
    subtitle: "Universal starter design system",
    description: "Live token editor with presets, component previews, system audit against Material/Atlassian/Carbon/HIG, and CSS export.",
    tags: ["Ideate", "Design system", "Live preview"],
    component: UniversalDesignSystem,
  },
  {
    id: "checklist",
    number: "03",
    phase: "06",
    name: "Design System Checklist",
    subtitle: "Audit against 4 major design systems",
    description: "Interactive audit checklist synthesized from Material Design 3, Atlassian, IBM Carbon, and Apple HIG — with Figma-ready prompts per item.",
    tags: ["Deliver", "Audit", "Figma prompts"],
    component: DesignSystemChecklist,
  },
  {
    id: "m3",
    number: "04",
    phase: "06",
    name: "M3 Token Reference",
    subtitle: "Material Design 3 token documentation",
    description: "Interactive token docs for Button, Card, Text Field, and Navigation Bar — color roles, elevation, shape, typography, and spacing.",
    tags: ["Deliver", "M3 tokens", "Figma variables"],
    component: M3TokenReference,
  },
];

const SKILLS = [
  { phase: "01", dir: "01-discover", files: ["user-research.md", "competitive-analysis.md"] },
  { phase: "02", dir: "02-define", files: ["problem-framing.md"] },
  { phase: "03", dir: "03-ideate", files: ["concept-generation.md", "visual-design-execution.md"] },
  { phase: "04", dir: "04-prototype", files: ["prototyping.md", "accessibility-audit.md"] },
  { phase: "05", dir: "05-validate", files: ["usability-testing.md"] },
  { phase: "06", dir: "06-deliver", files: ["design-delivery.md"] },
  { phase: null, dir: "", files: ["design-systems.md", "figma-playbook.md"] },
];

const REPO = "https://github.com/quinrobinson/AI-x-UX-Product-Design-Framework";
const FIGMA_URL = "https://www.figma.com/design/mrHuD7sY7h6uKSVndTSIQE";
const PPTX_URL = `${REPO}/raw/main/artifacts/onboarding-deck.pptx`;

function PhaseChip({ phaseKey, small }) {
  const p = DS.phases[phaseKey];
  if (!p) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: p.bg, border: `1px solid ${p.color}30`, borderRadius: 999,
      padding: small ? "2px 8px" : "4px 12px",
      fontSize: small ? 10 : 11, fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 500, color: p.color, whiteSpace: "nowrap",
    }}>
      <span style={{ width: small ? 5 : 6, height: small ? 5 : 6, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
      {phaseKey} — {p.label}
    </span>
  );
}

function ToolCard({ tool, onClick }) {
  const [hovered, setHovered] = useState(false);
  const p = DS.phases[tool.phase];
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", width: "100%",
        background: DS.white,
        border: `1px solid ${hovered ? p.color + "88" : DS.lightBorder}`,
        borderRadius: 16, padding: "28px", cursor: "pointer", textAlign: "left",
        transition: "all 0.2s ease", outline: "none",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 12px 32px ${p.color}14` : "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        {/* Light-mode phase chip — colored border + text, no dark bg */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "transparent", border: `1px solid ${p.color}55`, borderRadius: 999,
          padding: "4px 12px", fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 500, color: p.color, whiteSpace: "nowrap",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          {tool.phase} — {p.label}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: DS.bodyDark, opacity: 0.5 }}>{tool.number} / 04</span>
      </div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: "#0F172A", marginBottom: 8, lineHeight: 1.2 }}>{tool.name}</div>
      <div style={{ fontSize: 12, color: p.color, fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>{tool.subtitle}</div>
      <div style={{ fontSize: 13, color: DS.bodyDark, lineHeight: 1.65, marginBottom: 20 }}>{tool.description}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {tool.tags.map(tag => (
          <span key={tag} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "transparent", color: p.color, fontWeight: 500, border: `1px solid ${p.color}55` }}>{tag}</span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: p.color, fontSize: 13, fontWeight: 500, opacity: hovered ? 1 : 0.4, transition: "opacity 0.2s ease" }}>
        Open tool
        <span style={{ transform: hovered ? "translateX(4px)" : "none", transition: "transform 0.2s ease", display: "inline-block" }}>→</span>
      </div>
    </button>
  );
}

export default function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const tool = activeTool ? TOOLS.find(t => t.id === activeTool) : null;
  const ToolComponent = tool?.component;

  if (ToolComponent) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: DS.dark }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          background: `${DS.dark}ee`, backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${DS.darkBorder}`,
          padding: "0 32px", display: "flex", alignItems: "center", gap: 16, height: 56,
        }}>
          <button onClick={() => setActiveTool(null)} style={{
            background: DS.darkCard, border: `1px solid ${DS.darkBorder}`, borderRadius: 8,
            padding: "6px 14px", cursor: "pointer", fontSize: 12, color: DS.bodyLight,
            fontFamily: "'JetBrains Mono', monospace",
          }}>← Back</button>
          <div style={{ width: 1, height: 20, background: DS.darkBorder }} />
          <PhaseChip phaseKey={tool.phase} small />
          <span style={{ fontSize: 14, fontWeight: 600, color: DS.white, fontFamily: "'DM Sans', sans-serif" }}>{tool.name}</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {TOOLS.filter(t => t.id !== activeTool).map(t => (
              <button key={t.id} onClick={() => setActiveTool(t.id)} style={{
                background: "none", border: `1px solid ${DS.darkBorder}`, borderRadius: 8,
                padding: "5px 12px", cursor: "pointer", fontSize: 11, color: DS.bodyLight,
                fontFamily: "'JetBrains Mono', monospace",
              }}>{t.number} {t.name.split(" ")[0]}</button>
            ))}
          </div>
        </div>
        <ToolComponent />
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif", background: DS.dark,
      minHeight: "100vh", color: DS.white,
      opacity: mounted ? 1 : 0, transition: "opacity 0.4s ease",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* HERO — dark */}
      <div style={{ padding: "80px 60px 72px", maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 4, textTransform: "uppercase", color: DS.bodyLight, marginBottom: 28, opacity: 0.7 }}>
          AI × UX Product Design Framework
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 60, alignItems: "end", marginBottom: 52 }}>
          <div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 60, fontWeight: 400, margin: "0 0 24px", lineHeight: 1.05, color: DS.white, letterSpacing: "-0.5px" }}>
              Design smarter.<br />
              <em style={{ fontStyle: "italic", color: DS.bodyLight }}>Ship with confidence.</em>
            </h1>
            <p style={{ fontSize: 16, color: DS.bodyLight, lineHeight: 1.75, margin: "0 0 36px", maxWidth: 480 }}>
              An AI-integrated framework covering every phase of product and UX design. Eleven skill files, four interactive tools, and a Figma template built to scale with your practice.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href={PPTX_URL} style={{ background: DS.white, color: DS.dark, padding: "12px 24px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Download Onboarding Deck</a>
              <a href={FIGMA_URL} target="_blank" rel="noopener noreferrer" style={{ background: "transparent", color: DS.white, padding: "12px 24px", borderRadius: 10, fontSize: 13, fontWeight: 500, textDecoration: "none", border: `1px solid ${DS.darkBorder}` }}>Figma Template ↗</a>
              <a href={REPO} target="_blank" rel="noopener noreferrer" style={{ background: "transparent", color: DS.bodyLight, padding: "12px 24px", borderRadius: 10, fontSize: 13, fontWeight: 500, textDecoration: "none", border: `1px solid ${DS.darkBorder}` }}>GitHub ↗</a>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[{ n: "11", label: "Skills" }, { n: "6", label: "Phases" }, { n: "4", label: "Tools" }, { n: "∞", label: "Projects" }].map(s => (
              <div key={s.n} style={{ background: DS.darkCard, border: `1px solid ${DS.darkBorder}`, borderRadius: 14, padding: "22px 24px", textAlign: "center" }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 42, color: DS.white, lineHeight: 1, marginBottom: 6 }}>{s.n}</div>
                <div style={{ fontSize: 11, color: DS.bodyLight, fontFamily: "'JetBrains Mono', monospace" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
          {Object.entries(DS.phases).map(([key, p]) => (
            <div key={key} style={{ background: "transparent", border: `1px solid ${p.color}55`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.color, marginBottom: 4, opacity: 0.6 }}>{key}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: p.color }}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TOOLS — light */}
      <div style={{ background: DS.light }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "64px 60px" }}>
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 3, color: DS.bodyDark, marginBottom: 28 }}>
            Interactive Tools — 04
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {TOOLS.map(t => <ToolCard key={t.id} tool={t} onClick={() => setActiveTool(t.id)} />)}
          </div>
        </div>
      </div>

      {/* SKILLS — light */}
      <div style={{ background: DS.light }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "64px 60px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 3, color: DS.bodyDark }}>Claude Skills Library — 11 files</div>
            <a href={`${REPO}/tree/main/skills`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: DS.bodyDark, textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", opacity: 0.5 }}>View on GitHub ↗</a>
          </div>
          <div style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            {SKILLS.map((row, i) => {
              const p = row.phase ? DS.phases[row.phase] : null;
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "200px 1fr", borderBottom: i < SKILLS.length - 1 ? `1px solid ${DS.lightBorder}` : "none" }}>
                  <div style={{ padding: "16px 20px", borderRight: `1px solid ${DS.lightBorder}`, display: "flex", alignItems: "center", background: "#FAFAF8" }}>
                    {p ? (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        background: "transparent", border: `1px solid ${p.color}55`, borderRadius: 999,
                        padding: "2px 8px", fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 500, color: p.color, whiteSpace: "nowrap",
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                        {row.phase} — {p.label}
                      </span>
                    ) : (
                      <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: DS.bodyDark, opacity: 0.5 }}>Cross-phase</span>
                    )}
                  </div>
                  <div style={{ padding: "14px 20px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                    {row.files.map(file => (
                      <a key={file} href={`${REPO}/tree/main/skills/${row.dir ? row.dir + "/" : ""}${file}`} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 11, padding: "5px 12px", borderRadius: 8, background: "transparent", color: p ? p.color : DS.bodyDark, textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${p ? p.color + "55" : DS.lightBorder}` }}>
                        {file}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: DS.dark }}>
      <div style={{ borderTop: `1px solid ${DS.darkBorder}`, maxWidth: 1160, margin: "0 auto", padding: "28px 60px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontSize: 11, color: DS.bodyLight, fontFamily: "'JetBrains Mono', monospace", opacity: 0.4 }}>AI × UX Product Design Framework</div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["GitHub", REPO], ["Figma Template", FIGMA_URL], ["Onboarding Deck", PPTX_URL]].map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: DS.bodyLight, textDecoration: "none", opacity: 0.5, fontFamily: "'JetBrains Mono', monospace" }}>{label}</a>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
