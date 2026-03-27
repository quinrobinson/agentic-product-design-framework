import { useState, useCallback } from "react";

const DEFAULT_TOKENS = {
  brandName: "Starter DS",
  // Colors
  primary: "#2563EB",
  primaryLight: "#DBEAFE",
  primaryDark: "#1E40AF",
  secondary: "#0F172A",
  accent: "#F59E0B",
  success: "#16A34A",
  warning: "#EAB308",
  error: "#DC2626",
  info: "#0EA5E9",
  neutral50: "#FAFAFA",
  neutral100: "#F5F5F5",
  neutral200: "#E5E5E5",
  neutral300: "#D4D4D4",
  neutral400: "#A3A3A3",
  neutral500: "#737373",
  neutral600: "#525252",
  neutral700: "#404040",
  neutral800: "#262626",
  neutral900: "#171717",
  // Typography
  fontHeading: "'DM Sans', sans-serif",
  fontBody: "'DM Sans', sans-serif",
  fontMono: "'JetBrains Mono', monospace",
  baseSize: 16,
  scaleRatio: 1.25,
  // Spacing
  spaceUnit: 4,
  // Shape
  radiusSm: 6,
  radiusMd: 10,
  radiusLg: 16,
  radiusFull: 9999,
  // Elevation
  shadowSm: "0 1px 2px rgba(0,0,0,0.06)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.08)",
  shadowLg: "0 12px 32px rgba(0,0,0,0.12)",
};

const PRESETS = {
  default: { ...DEFAULT_TOKENS, brandName: "Starter DS" },
  corporate: {
    ...DEFAULT_TOKENS,
    brandName: "CorpKit",
    primary: "#1B365D",
    primaryLight: "#E8EDF4",
    primaryDark: "#0F1F3D",
    secondary: "#2D3748",
    accent: "#C8102E",
    fontHeading: "'Source Serif 4', serif",
    fontBody: "'Source Sans 3', sans-serif",
    radiusSm: 4,
    radiusMd: 6,
    radiusLg: 8,
    scaleRatio: 1.2,
  },
  startup: {
    ...DEFAULT_TOKENS,
    brandName: "LaunchKit",
    primary: "#7C3AED",
    primaryLight: "#EDE9FE",
    primaryDark: "#5B21B6",
    secondary: "#111827",
    accent: "#06B6D4",
    fontHeading: "'Space Grotesk', sans-serif",
    fontBody: "'DM Sans', sans-serif",
    radiusSm: 8,
    radiusMd: 12,
    radiusLg: 20,
    scaleRatio: 1.333,
  },
  minimal: {
    ...DEFAULT_TOKENS,
    brandName: "Mono",
    primary: "#18181B",
    primaryLight: "#F4F4F5",
    primaryDark: "#09090B",
    secondary: "#3F3F46",
    accent: "#18181B",
    fontHeading: "'DM Sans', sans-serif",
    fontBody: "'DM Sans', sans-serif",
    radiusSm: 0,
    radiusMd: 0,
    radiusLg: 0,
    scaleRatio: 1.2,
  },
  warm: {
    ...DEFAULT_TOKENS,
    brandName: "Hearth",
    primary: "#B45309",
    primaryLight: "#FEF3C7",
    primaryDark: "#92400E",
    secondary: "#44403C",
    accent: "#059669",
    fontHeading: "'Libre Baskerville', serif",
    fontBody: "'DM Sans', sans-serif",
    radiusSm: 8,
    radiusMd: 14,
    radiusLg: 24,
    scaleRatio: 1.25,
  },
};

const FONT_OPTIONS = [
  "'DM Sans', sans-serif",
  "'Source Sans 3', sans-serif",
  "'Space Grotesk', sans-serif",
  "'Libre Baskerville', serif",
  "'Source Serif 4', serif",
  "'DM Serif Display', serif",
  "'JetBrains Mono', monospace",
  "'Fira Code', monospace",
];

const SECTIONS = ["tokens", "typography", "components", "export"];

function typeScale(base, ratio, step) {
  return Math.round(base * Math.pow(ratio, step) * 100) / 100;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function contrastOn(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000" : "#fff";
}

export default function UniversalDesignSystem() {
  const [tokens, setTokens] = useState({ ...DEFAULT_TOKENS });
  const [activeSection, setActiveSection] = useState("tokens");
  const [showPanel, setShowPanel] = useState(true);
  const [aiPromptCopied, setAiPromptCopied] = useState(false);

  const update = useCallback((key, val) => {
    setTokens((prev) => ({ ...prev, [key]: val }));
  }, []);

  const applyPreset = (name) => setTokens({ ...PRESETS[name] });

  const sizes = {
    xs: typeScale(tokens.baseSize, tokens.scaleRatio, -2),
    sm: typeScale(tokens.baseSize, tokens.scaleRatio, -1),
    base: tokens.baseSize,
    lg: typeScale(tokens.baseSize, tokens.scaleRatio, 1),
    xl: typeScale(tokens.baseSize, tokens.scaleRatio, 2),
    "2xl": typeScale(tokens.baseSize, tokens.scaleRatio, 3),
    "3xl": typeScale(tokens.baseSize, tokens.scaleRatio, 4),
    "4xl": typeScale(tokens.baseSize, tokens.scaleRatio, 5),
  };

  const space = (n) => tokens.spaceUnit * n;

  const cssVarsOutput = `/* ${tokens.brandName} — Design Tokens */
:root {
  /* Color — Primary */
  --color-primary: ${tokens.primary};
  --color-primary-light: ${tokens.primaryLight};
  --color-primary-dark: ${tokens.primaryDark};
  --color-secondary: ${tokens.secondary};
  --color-accent: ${tokens.accent};

  /* Color — Semantic */
  --color-success: ${tokens.success};
  --color-warning: ${tokens.warning};
  --color-error: ${tokens.error};
  --color-info: ${tokens.info};

  /* Color — Neutrals */
  --color-neutral-50: ${tokens.neutral50};
  --color-neutral-100: ${tokens.neutral100};
  --color-neutral-200: ${tokens.neutral200};
  --color-neutral-300: ${tokens.neutral300};
  --color-neutral-400: ${tokens.neutral400};
  --color-neutral-500: ${tokens.neutral500};
  --color-neutral-600: ${tokens.neutral600};
  --color-neutral-700: ${tokens.neutral700};
  --color-neutral-800: ${tokens.neutral800};
  --color-neutral-900: ${tokens.neutral900};

  /* Typography */
  --font-heading: ${tokens.fontHeading};
  --font-body: ${tokens.fontBody};
  --font-mono: ${tokens.fontMono};
  --text-xs: ${sizes.xs}px;
  --text-sm: ${sizes.sm}px;
  --text-base: ${sizes.base}px;
  --text-lg: ${sizes.lg}px;
  --text-xl: ${sizes.xl}px;
  --text-2xl: ${sizes["2xl"]}px;
  --text-3xl: ${sizes["3xl"]}px;
  --text-4xl: ${sizes["4xl"]}px;

  /* Spacing (${tokens.spaceUnit}px base unit) */
  --space-1: ${space(1)}px;
  --space-2: ${space(2)}px;
  --space-3: ${space(3)}px;
  --space-4: ${space(4)}px;
  --space-5: ${space(5)}px;
  --space-6: ${space(6)}px;
  --space-8: ${space(8)}px;
  --space-10: ${space(10)}px;
  --space-12: ${space(12)}px;
  --space-16: ${space(16)}px;

  /* Shape */
  --radius-sm: ${tokens.radiusSm}px;
  --radius-md: ${tokens.radiusMd}px;
  --radius-lg: ${tokens.radiusLg}px;
  --radius-full: ${tokens.radiusFull}px;

  /* Elevation */
  --shadow-sm: ${tokens.shadowSm};
  --shadow-md: ${tokens.shadowMd};
  --shadow-lg: ${tokens.shadowLg};
}`;

  const aiCustomizationPrompt = `You are a design system architect. I have a universal starter design system with the following current tokens:

${cssVarsOutput}

I need you to customize this for a client with the following brand:
- Brand name: [CLIENT NAME]
- Industry: [INDUSTRY]
- Brand personality: [DESCRIBE: e.g., professional yet approachable, bold and disruptive, warm and trustworthy]
- Existing brand colors (if any): [HEX VALUES]
- Existing brand fonts (if any): [FONT NAMES]
- Target audience: [DESCRIBE]

Generate a complete replacement set of CSS custom properties that:
1. Maps their brand colors into the primary/secondary/accent system
2. Recommends a type scale and font pairing appropriate for their industry
3. Adjusts border-radius to match their brand personality (sharp = corporate, round = friendly)
4. Keeps semantic colors (success/warning/error/info) accessible and conventional
5. Adjusts elevation/shadow style to match overall aesthetic

Return ONLY the updated :root {} block with comments explaining each choice.`;

  const ColorSwatch = ({ color, label, size = 48 }) => (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: tokens.radiusSm,
          background: color,
          border: "1px solid rgba(0,0,0,0.08)",
          marginBottom: 6,
        }}
      />
      <div style={{ fontSize: 10, fontFamily: tokens.fontMono, color: "#888" }}>{label}</div>
      <div style={{ fontSize: 9, fontFamily: tokens.fontMono, color: "#bbb" }}>{color}</div>
    </div>
  );

  const SectionNav = () => (
    <div style={{ display: "flex", borderBottom: "1px solid #eee", marginBottom: 24 }}>
      {[
        { id: "tokens", label: "Design Tokens" },
        { id: "typography", label: "Type Scale" },
        { id: "components", label: "Components" },
        { id: "export", label: "Export & AI" },
      ].map((s) => (
        <button
          key={s.id}
          onClick={() => setActiveSection(s.id)}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeSection === s.id ? `2px solid ${tokens.primary}` : "2px solid transparent",
            color: activeSection === s.id ? tokens.primary : "#888",
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: activeSection === s.id ? 600 : 400,
            cursor: "pointer",
            fontFamily: tokens.fontBody,
          }}
        >
          {s.label}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily: tokens.fontBody, background: "#FAFAF8", minHeight: "100vh", color: tokens.neutral900 }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&family=Source+Sans+3:wght@300;400;600;700&family=Source+Serif+4:wght@400;600;700&family=Space+Grotesk:wght@400;500;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Fira+Code:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{ background: tokens.secondary, color: "#fff", padding: "32px 28px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
              Universal Starter
            </div>
            <h1 style={{ fontFamily: tokens.fontHeading, fontSize: 32, fontWeight: 700, margin: "0 0 6px" }}>{tokens.brandName}</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0 }}>Tune the knobs. Preview live. Export for your client.</p>
          </div>
          <button
            onClick={() => setShowPanel(!showPanel)}
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: tokens.fontMono,
            }}
          >
            {showPanel ? "Hide" : "Show"} Controls
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 28px 48px", display: "grid", gridTemplateColumns: showPanel ? "280px 1fr" : "1fr", gap: 24 }}>
        {/* Control Panel */}
        {showPanel && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Presets */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" }}>
              <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Presets</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    style={{
                      background: tokens.brandName === preset.brandName ? tokens.primary : "#f5f5f5",
                      color: tokens.brandName === preset.brandName ? "#fff" : "#555",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 12px",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Name */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" }}>
              <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 10 }}>Brand Name</div>
              <input
                value={tokens.brandName}
                onChange={(e) => update("brandName", e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, fontFamily: tokens.fontBody, boxSizing: "border-box" }}
              />
            </div>

            {/* Colors */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" }}>
              <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Colors</div>
              {[
                ["primary", "Primary"],
                ["primaryLight", "Primary Light"],
                ["primaryDark", "Primary Dark"],
                ["secondary", "Secondary"],
                ["accent", "Accent"],
              ].map(([key, label]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <input type="color" value={tokens[key]} onChange={(e) => update(key, e.target.value)} style={{ width: 32, height: 24, border: "none", padding: 0, cursor: "pointer", borderRadius: 4 }} />
                  <span style={{ fontSize: 12, flex: 1 }}>{label}</span>
                  <span style={{ fontSize: 10, fontFamily: tokens.fontMono, color: "#bbb" }}>{tokens[key]}</span>
                </div>
              ))}
            </div>

            {/* Typography */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" }}>
              <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Typography</div>
              {[
                ["fontHeading", "Heading Font"],
                ["fontBody", "Body Font"],
              ].map(([key, label]) => (
                <div key={key} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{label}</div>
                  <select
                    value={tokens[key]}
                    onChange={(e) => update(key, e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #ddd", fontSize: 12, fontFamily: tokens[key], boxSizing: "border-box" }}
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f} value={f} style={{ fontFamily: f }}>{f.split("'")[1]}</option>
                    ))}
                  </select>
                </div>
              ))}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Base Size: {tokens.baseSize}px</div>
                <input type="range" min={14} max={20} value={tokens.baseSize} onChange={(e) => update("baseSize", Number(e.target.value))} style={{ width: "100%" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Scale Ratio: {tokens.scaleRatio}</div>
                <input type="range" min={1.125} max={1.5} step={0.025} value={tokens.scaleRatio} onChange={(e) => update("scaleRatio", Number(e.target.value))} style={{ width: "100%" }} />
              </div>
            </div>

            {/* Shape */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" }}>
              <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Shape</div>
              {[
                ["radiusSm", "Small", 0, 16],
                ["radiusMd", "Medium", 0, 24],
                ["radiusLg", "Large", 0, 32],
              ].map(([key, label, min, max]) => (
                <div key={key} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 2 }}>
                    <span>{label}</span>
                    <span>{tokens[key]}px</span>
                  </div>
                  <input type="range" min={min} max={max} value={tokens[key]} onChange={(e) => update(key, Number(e.target.value))} style={{ width: "100%" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div>
          <SectionNav />

          {/* TOKENS SECTION */}
          {activeSection === "tokens" && (
            <div>
              {/* Color Palette */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee", marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Color Palette</div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>Brand</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <ColorSwatch color={tokens.primary} label="Primary" />
                    <ColorSwatch color={tokens.primaryLight} label="Primary Light" />
                    <ColorSwatch color={tokens.primaryDark} label="Primary Dark" />
                    <ColorSwatch color={tokens.secondary} label="Secondary" />
                    <ColorSwatch color={tokens.accent} label="Accent" />
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>Semantic</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <ColorSwatch color={tokens.success} label="Success" />
                    <ColorSwatch color={tokens.warning} label="Warning" />
                    <ColorSwatch color={tokens.error} label="Error" />
                    <ColorSwatch color={tokens.info} label="Info" />
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>Neutrals</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => (
                      <div key={n} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ height: 40, background: tokens[`neutral${n}`], borderRadius: 4, border: "1px solid rgba(0,0,0,0.06)" }} />
                        <div style={{ fontSize: 9, fontFamily: tokens.fontMono, color: "#aaa", marginTop: 4 }}>{n}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spacing */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee", marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>
                  Spacing Scale — {tokens.spaceUnit}px base
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((n) => (
                    <div key={n} style={{ textAlign: "center" }}>
                      <div style={{ width: 32, height: space(n), background: tokens.primaryLight, borderRadius: 3, border: `1px solid ${tokens.primary}33` }} />
                      <div style={{ fontSize: 9, fontFamily: tokens.fontMono, color: "#aaa", marginTop: 6 }}>{space(n)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shape */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Border Radius</div>
                <div style={{ display: "flex", gap: 20 }}>
                  {[
                    ["sm", tokens.radiusSm],
                    ["md", tokens.radiusMd],
                    ["lg", tokens.radiusLg],
                    ["full", tokens.radiusFull],
                  ].map(([label, val]) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ width: 56, height: 56, background: tokens.primaryLight, border: `2px solid ${tokens.primary}`, borderRadius: val }} />
                      <div style={{ fontSize: 10, fontFamily: tokens.fontMono, color: "#aaa", marginTop: 8 }}>{label} — {val === 9999 ? "full" : val + "px"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TYPOGRAPHY SECTION */}
          {activeSection === "typography" && (
            <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
              <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 24 }}>
                Type Scale — ratio {tokens.scaleRatio}
              </div>
              {Object.entries(sizes).reverse().map(([label, size]) => (
                <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 20, padding: "14px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ width: 50, fontSize: 10, fontFamily: tokens.fontMono, color: "#bbb", textAlign: "right", flexShrink: 0 }}>{label}</div>
                  <div style={{ width: 50, fontSize: 10, fontFamily: tokens.fontMono, color: "#bbb", flexShrink: 0 }}>{Math.round(size)}px</div>
                  <div style={{ fontFamily: label.includes("x") || label === "sm" || label === "base" ? tokens.fontBody : tokens.fontHeading, fontSize: size, fontWeight: size > 20 ? 700 : 400, lineHeight: 1.3 }}>
                    {tokens.brandName}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 32 }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 16 }}>Font Pairing Preview</div>
                <div style={{ padding: 24, background: tokens.neutral50, borderRadius: tokens.radiusMd }}>
                  <h2 style={{ fontFamily: tokens.fontHeading, fontSize: sizes["2xl"], fontWeight: 700, margin: "0 0 8px", lineHeight: 1.2 }}>The quick brown fox jumps over the lazy dog</h2>
                  <p style={{ fontFamily: tokens.fontBody, fontSize: sizes.base, lineHeight: 1.7, color: tokens.neutral600, margin: "0 0 12px" }}>
                    Typography is the voice of your interface. A strong type system creates hierarchy, guides attention, and establishes brand personality without a single pixel of color.
                  </p>
                  <code style={{ fontFamily: tokens.fontMono, fontSize: sizes.sm, background: tokens.neutral200, padding: "3px 8px", borderRadius: 4 }}>
                    const designSystem = true;
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* COMPONENTS SECTION */}
          {activeSection === "components" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Buttons */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Buttons</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  {[
                    { label: "Primary", bg: tokens.primary, color: contrastOn(tokens.primary), border: "none" },
                    { label: "Secondary", bg: tokens.secondary, color: contrastOn(tokens.secondary), border: "none" },
                    { label: "Outline", bg: "transparent", color: tokens.primary, border: `2px solid ${tokens.primary}` },
                    { label: "Ghost", bg: "transparent", color: tokens.neutral700, border: "none" },
                    { label: "Danger", bg: tokens.error, color: "#fff", border: "none" },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      style={{
                        background: btn.bg,
                        color: btn.color,
                        border: btn.border,
                        borderRadius: tokens.radiusMd,
                        padding: "10px 22px",
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: tokens.fontBody,
                        cursor: "pointer",
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  {["sm", "md", "lg"].map((size) => (
                    <button
                      key={size}
                      style={{
                        background: tokens.primary,
                        color: contrastOn(tokens.primary),
                        border: "none",
                        borderRadius: tokens.radiusMd,
                        padding: size === "sm" ? "6px 14px" : size === "md" ? "10px 22px" : "14px 30px",
                        fontSize: size === "sm" ? 12 : size === "md" ? 14 : 16,
                        fontWeight: 600,
                        fontFamily: tokens.fontBody,
                        cursor: "pointer",
                      }}
                    >
                      Size {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Elements */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Inputs & Forms</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6, color: tokens.neutral700 }}>Default Input</label>
                    <input
                      placeholder="Enter text..."
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: tokens.radiusMd,
                        border: `1px solid ${tokens.neutral300}`,
                        fontSize: 14,
                        fontFamily: tokens.fontBody,
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6, color: tokens.error }}>Error State</label>
                    <input
                      defaultValue="Invalid entry"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: tokens.radiusMd,
                        border: `2px solid ${tokens.error}`,
                        fontSize: 14,
                        fontFamily: tokens.fontBody,
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                    <div style={{ fontSize: 11, color: tokens.error, marginTop: 4 }}>This field is required</div>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Cards</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {[
                    { title: "Flat", shadow: "none", border: `1px solid ${tokens.neutral200}` },
                    { title: "Elevated", shadow: tokens.shadowMd, border: "1px solid transparent" },
                    { title: "Prominent", shadow: tokens.shadowLg, border: "1px solid transparent" },
                  ].map((card) => (
                    <div
                      key={card.title}
                      style={{
                        padding: 20,
                        borderRadius: tokens.radiusLg,
                        background: "#fff",
                        border: card.border,
                        boxShadow: card.shadow,
                      }}
                    >
                      <div style={{ fontFamily: tokens.fontHeading, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{card.title}</div>
                      <p style={{ fontSize: 13, color: tokens.neutral500, lineHeight: 1.5, margin: 0 }}>Card component with {card.title.toLowerCase()} treatment for content hierarchy.</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges & Tags */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Badges & Status</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { label: "Active", bg: `${tokens.success}18`, color: tokens.success },
                    { label: "Pending", bg: `${tokens.warning}18`, color: tokens.warning },
                    { label: "Error", bg: `${tokens.error}18`, color: tokens.error },
                    { label: "Info", bg: `${tokens.info}18`, color: tokens.info },
                    { label: "Default", bg: tokens.neutral100, color: tokens.neutral600 },
                    { label: "Brand", bg: tokens.primaryLight, color: tokens.primaryDark },
                  ].map((b) => (
                    <span
                      key={b.label}
                      style={{
                        background: b.bg,
                        color: b.color,
                        padding: "5px 14px",
                        borderRadius: tokens.radiusFull,
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: tokens.fontBody,
                      }}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Alert */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Alerts</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { type: "Success", bg: `${tokens.success}10`, border: tokens.success, color: tokens.success, msg: "Your changes have been saved successfully." },
                    { type: "Error", bg: `${tokens.error}10`, border: tokens.error, color: tokens.error, msg: "Something went wrong. Please try again." },
                    { type: "Info", bg: `${tokens.info}10`, border: tokens.info, color: tokens.info, msg: "A new version is available for update." },
                  ].map((a) => (
                    <div
                      key={a.type}
                      style={{
                        padding: "14px 18px",
                        borderRadius: tokens.radiusMd,
                        background: a.bg,
                        borderLeft: `4px solid ${a.border}`,
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 13, color: a.color, marginBottom: 2 }}>{a.type}</div>
                      <div style={{ fontSize: 13, color: tokens.neutral700 }}>{a.msg}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EXPORT SECTION */}
          {activeSection === "export" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* CSS Variables */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999" }}>CSS Custom Properties</div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(cssVarsOutput); }}
                    style={{ background: tokens.primary, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    Copy CSS
                  </button>
                </div>
                <pre style={{
                  fontFamily: tokens.fontMono,
                  fontSize: 11,
                  background: "#1a1a1a",
                  color: "#e0e0e0",
                  padding: 20,
                  borderRadius: 10,
                  overflow: "auto",
                  maxHeight: 400,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}>
                  {cssVarsOutput}
                </pre>
              </div>

              {/* AI Customization Prompt */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999" }}>AI Customization Prompt</div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(aiCustomizationPrompt); setAiPromptCopied(true); setTimeout(() => setAiPromptCopied(false), 2000); }}
                    style={{ background: aiPromptCopied ? "#16A34A" : tokens.secondary, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    {aiPromptCopied ? "✓ Copied" : "Copy Prompt"}
                  </button>
                </div>
                <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, margin: "0 0 16px" }}>
                  Paste this prompt into Claude along with your client's brand guidelines. It will generate a complete set of customized tokens you can paste back into this system.
                </p>
                <pre style={{
                  fontFamily: tokens.fontMono,
                  fontSize: 11,
                  background: "#1a1a1a",
                  color: "#e0e0e0",
                  padding: 20,
                  borderRadius: 10,
                  overflow: "auto",
                  maxHeight: 300,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}>
                  {aiCustomizationPrompt}
                </pre>
              </div>

              {/* Packaging Guide */}
              <div style={{ background: tokens.secondary, borderRadius: tokens.radiusLg, padding: 28, color: "#fff" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Client Delivery Checklist</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {[
                    { title: "Token File", desc: "Export CSS custom properties or JSON tokens for their tech stack (Tailwind config, Style Dictionary, Figma tokens)" },
                    { title: "Component Library", desc: "Document each component with props, states, accessibility notes, and usage guidelines" },
                    { title: "Brand Application", desc: "Show tokens applied to 3-5 real screens from their product as proof of concept" },
                    { title: "Governance Guide", desc: "Define who can modify tokens, how to request changes, and versioning strategy" },
                  ].map((item) => (
                    <div key={item.title}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
