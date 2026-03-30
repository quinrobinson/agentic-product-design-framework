import { useState, useRef, useCallback } from "react";

// ─── Carbon component library (all 46 components) ───────────────────────────
const CARBON_COMPONENTS = [
  { id:"accordion", name:"Accordion", category:"Navigation", variants:["Default","Flush","Align start/end"], sizes:["sm","md","lg"], tokens:[["$layer-01","Accordion bg"],["$border-subtle-01","Border between items"],["$text-primary","Header text"],["$icon-primary","Chevron icon"]], rule:"Never nest accordions. Flush variant has no border-radius." },
  { id:"breadcrumb", name:"Breadcrumb", category:"Navigation", variants:["Default","With overflow menu"], sizes:["sm","md","lg"], tokens:[["$link-primary","Link color"],["$text-primary","Current page"],["$text-secondary","Separator"]], rule:"Show only when 3+ levels of hierarchy. Current page is not a link." },
  { id:"button", name:"Button", category:"Actions", variants:["Primary","Secondary","Tertiary","Ghost","Danger","Danger tertiary","Danger ghost"], sizes:["sm (32px)","md (40px)","lg (48px)","xl (64px)","2xl (80px)"], tokens:[["$button-primary","Primary fill"],["$text-on-color","Label on filled"],["$button-secondary","Secondary fill"],["$button-tertiary","Tertiary border"],["$focus","Focus ring"]], rule:"One primary per visible context. Danger only for destructive ops." },
  { id:"checkbox", name:"Checkbox", category:"Forms", variants:["Default","Indeterminate","Disabled","Read-only"], sizes:["sm","md"], tokens:[["$interactive","Checked fill"],["$border-strong-01","Unchecked border"],["$text-primary","Label text"],["$focus","Focus ring"]], rule:"Use for multiple selection. Single binary toggle → use Toggle." },
  { id:"code-snippet", name:"Code Snippet", category:"Content", variants:["Single line","Multi-line","Inline"], sizes:["sm","md","lg"], tokens:[["$layer-01","Code bg"],["$text-primary","Code text"],["$border-subtle-01","Snippet border"],["$button-primary","Copy button"]], rule:"Always include copy button. Inline variant lives within body text." },
  { id:"combo-box", name:"Combo Box", category:"Forms", variants:["Default","With filtering"], sizes:["sm","md","lg"], tokens:[["$field-01","Input bg"],["$border-strong-01","Active border"],["$text-primary","Input text"],["$layer-01","Menu bg"]], rule:"Use over Dropdown when list is 10+ items and type-ahead helps." },
  { id:"contained-list", name:"Contained List", category:"Content", variants:["Default","Disclosed","Inset","On page"], sizes:["sm","md","lg"], tokens:[["$layer-01","List bg"],["$layer-accent-01","Header bg"],["$border-subtle-01","Row dividers"]], rule:"Use for dense data lists. Not a nav pattern — use UI Shell for that." },
  { id:"content-switcher", name:"Content Switcher", category:"Navigation", variants:["Default","Icon only"], sizes:["sm","md","lg"], tokens:[["$layer-selected-01","Active segment bg"],["$text-primary","Active label"],["$border-strong-01","Container border"]], rule:"2–5 options max. Use for in-page view switching, not global nav." },
  { id:"copy-button", name:"Copy Button", category:"Actions", variants:["Default","Icon only"], sizes:["sm","md","lg"], tokens:[["$icon-primary","Copy icon"],["$background-hover","Hover state"],["$layer-01","Feedback tooltip bg"]], rule:"Always provide visual feedback on copy (checkmark + tooltip)." },
  { id:"data-table", name:"Data Table", category:"Data Display", variants:["Default","Sortable","Selectable","Expandable","With toolbar","With batch actions","Inline edit"], sizes:["xs (24px)","sm (32px)","md (40px)","lg (48px)","xl (64px)"], tokens:[["$layer-01","Table bg"],["$layer-accent-01","Header bg"],["$layer-hover-01","Row hover"],["$layer-selected-01","Selected row"],["$border-subtle-01","Row dividers"]], rule:"Header row never scrolls out of view. Batch actions appear above table." },
  { id:"date-picker", name:"Date Picker", category:"Forms", variants:["Simple","Single","Range"], sizes:["sm","md","lg"], tokens:[["$field-01","Input bg"],["$border-strong-01","Active border"],["$layer-02","Calendar bg"],["$interactive","Selected date fill"]], rule:"Range picker uses two inputs. Always show input mask for date format." },
  { id:"definition-tooltip", name:"Definition Tooltip", category:"Overlays", variants:["Default"], sizes:["sm","md","lg"], tokens:[["$background-inverse","Tooltip bg"],["$text-inverse","Tooltip text"],["$border-interactive","Trigger underline"]], rule:"Triggered by hover/focus on underlined term only. For icons use Tooltip." },
  { id:"dropdown", name:"Dropdown", category:"Forms", variants:["Default","Inline"], sizes:["sm","md","lg"], tokens:[["$field-01","Trigger bg (layer-aware)"],["$border-strong-01","Trigger border"],["$layer-01","Menu bg"],["$layer-hover-01","Option hover"]], rule:"Menus float one layer above trigger. Use Combo Box for 10+ items." },
  { id:"file-uploader", name:"File Uploader", category:"Forms", variants:["Button","Drag and drop"], sizes:["sm","md","lg"], tokens:[["$field-01","Drop zone bg"],["$border-interactive","Drop zone border"],["$support-error","Error state"],["$button-primary","Upload button"]], rule:"Show file list with status after upload. Always validate file type/size." },
  { id:"form", name:"Form", category:"Forms", variants:["Default","With sections","Inline"], sizes:["sm","md","lg"], tokens:[["$field-01","Field bg"],["$layer-01","Form bg"],["$support-error","Error"],["$text-helper","Helper text"]], rule:"Form is a layout container. Left-align labels above fields. 640px max width." },
  { id:"inline-loading", name:"Inline Loading", category:"Feedback", variants:["Loading","Error","Finished","Inactive"], sizes:["sm","md"], tokens:[["$interactive","Spinner color"],["$support-error","Error state"],["$support-success","Finished state"]], rule:"Use for actions that take 1–9s. Over 10s → use Loading overlay." },
  { id:"link", name:"Link", category:"Navigation", variants:["Default","Inline","Standalone","Paired"], sizes:["sm","md","lg"], tokens:[["$link-primary","Default link"],["$link-primary-hover","Hover"],["$link-visited","Visited"],["$icon-primary","External link icon"]], rule:"External links need warning. Never use link color for non-link text." },
  { id:"list", name:"List", category:"Content", variants:["Unordered","Ordered","Nested"], sizes:["sm","md","lg"], tokens:[["$text-primary","List text"],["$text-secondary","Nested items"],["$icon-primary","Bullet/number color"]], rule:"Max 2 nesting levels. For interactive items → use Contained List." },
  { id:"loading", name:"Loading", category:"Feedback", variants:["Overlay","Small","Large"], sizes:["sm","lg"], tokens:[["$interactive","Spinner stroke"],["$overlay","Overlay backdrop"],["$layer-01","Inner circle fill"]], rule:"Small for inline context. Overlay for full page. Always label with text." },
  { id:"menu", name:"Menu", category:"Navigation", variants:["Default","With dividers","With icons"], sizes:["sm","md","lg"], tokens:[["$layer-01","Menu bg"],["$layer-hover-01","Item hover"],["$border-subtle-01","Dividers"],["$text-primary","Item text"]], rule:"Max 2 levels of nesting. Dividers group related actions logically." },
  { id:"menu-button", name:"Menu Button", category:"Actions", variants:["Default","Ghost","Tertiary"], sizes:["sm","md","lg"], tokens:[["$button-primary","Trigger fill"],["$layer-01","Menu bg"],["$icon-primary","Chevron"]], rule:"Use when a button needs to reveal a set of actions. Not for navigation." },
  { id:"modal", name:"Modal", category:"Overlays", variants:["Passive","Transactional","Danger","Input/Form","Acknowledgment"], sizes:["xs (400px)","sm (520px)","md (672px)","lg (800px)","full-width"], tokens:[["$overlay","Backdrop"],["$layer-01","Modal bg"],["$layer-accent-01","Header"],["$focus","Focus trap ring"]], rule:"Always implement focus trap. Danger modal uses red primary action." },
  { id:"multiselect", name:"Multiselect", category:"Forms", variants:["Default","Filterable"], sizes:["sm","md","lg"], tokens:[["$field-01","Trigger bg"],["$layer-01","Menu bg"],["$interactive","Checkbox fill"],["$layer-selected-01","Selected item bg"]], rule:"Show selected count in trigger. Filterable for 10+ items." },
  { id:"notification", name:"Notification", category:"Feedback", variants:["Inline","Toast","Actionable"], sizes:["sm","lg"], tokens:[["$support-error","Error kind"],["$support-success","Success kind"],["$support-warning","Warning kind"],["$support-info","Info kind"]], rule:"Never use color alone — always pair with icon. Toast auto-dismisses." },
  { id:"number-input", name:"Number Input", category:"Forms", variants:["Default","With helper","Disabled","Read-only"], sizes:["sm","md","lg"], tokens:[["$field-01","Input bg"],["$border-strong-01","Border"],["$interactive","Stepper buttons"],["$text-primary","Value"]], rule:"Always provide min, max, step. Steppers don't replace keyboard input." },
  { id:"overflow-menu", name:"Overflow Menu", category:"Actions", variants:["Default","With icons","Danger items"], sizes:["sm","md","lg"], tokens:[["$layer-01","Menu bg"],["$layer-hover-01","Item hover"],["$icon-primary","Trigger icon"],["$support-error","Danger items"]], rule:"Use for 3+ secondary actions. Danger actions go last, with divider." },
  { id:"pagination", name:"Pagination", category:"Navigation", variants:["Default","With page size"], sizes:["sm","md","lg"], tokens:[["$layer-01","Control bg"],["$interactive","Active page"],["$text-primary","Page numbers"],["$border-subtle-01","Dividers"]], rule:"Always show total count. Allow user to set page size when data is large." },
  { id:"popover", name:"Popover", category:"Overlays", variants:["Default","With caret","Tab tip"], sizes:["sm","md","lg"], tokens:[["$layer-01","Popover bg"],["$border-subtle-01","Popover border"],["$overlay","Optional backdrop"]], rule:"Non-modal. Closes on outside click. Use for rich non-tooltip content." },
  { id:"progress-bar", name:"Progress Bar", category:"Feedback", variants:["Default","Indeterminate","Finished","Error"], sizes:["sm","md"], tokens:[["$interactive","Fill color"],["$border-subtle-01","Track bg"],["$support-error","Error"],["$support-success","Finished"]], rule:"Show percentage or step label. Indeterminate for unknown duration." },
  { id:"progress-indicator", name:"Progress Indicator", category:"Navigation", variants:["Horizontal","Vertical"], sizes:["sm","md","lg"], tokens:[["$interactive","Active step"],["$border-subtle-01","Incomplete step"],["$support-success","Complete step"],["$text-primary","Step label"]], rule:"Use for multi-step workflows. Always show current step and total count." },
  { id:"radio-button", name:"Radio Button", category:"Forms", variants:["Default","Horizontal group","Vertical group","Disabled","Read-only"], sizes:["sm","md"], tokens:[["$interactive","Selected fill"],["$border-strong-01","Unselected ring"],["$text-primary","Label"]], rule:"One selected at all times in a group. Vertical for 4+ options." },
  { id:"search", name:"Search", category:"Forms", variants:["Default","Expandable","Toolbar"], sizes:["sm","md","lg"], tokens:[["$field-01","Search bg"],["$border-strong-01","Active border"],["$text-primary","Input text"],["$icon-primary","Search/clear icons"]], rule:"Clear button appears when input has value. Expandable for space-constrained toolbars." },
  { id:"select", name:"Select", category:"Forms", variants:["Default","With helper","Disabled","Read-only","Invalid"], sizes:["sm","md","lg"], tokens:[["$field-01","Select bg"],["$border-strong-01","Select border"],["$text-primary","Selected value"],["$icon-primary","Chevron"]], rule:"Native HTML select. For custom styling → use Dropdown." },
  { id:"slider", name:"Slider", category:"Forms", variants:["Default","Range","With input","Skeleton"], sizes:["sm","md","lg"], tokens:[["$interactive","Track fill + thumb"],["$border-subtle-01","Track bg"],["$field-01","Attached input bg"],["$text-primary","Current value"]], rule:"Always show current value. Range slider uses two thumbs for min/max." },
  { id:"stack", name:"Stack", category:"Layout", variants:["Horizontal","Vertical"], sizes:["sm","md","lg"], tokens:[["$spacing-01–13","Gap between children"]], rule:"Stack is a spacing utility. Use gap token, not margin on children." },
  { id:"structured-list", name:"Structured List", category:"Content", variants:["Default","Selectable","Flush"], sizes:["sm","md","lg"], tokens:[["$layer-01","Row bg"],["$layer-hover-01","Row hover"],["$interactive","Selected fill"],["$border-subtle-01","Row dividers"]], rule:"For simple key-value pairs or tabular data without a full DataTable." },
  { id:"tabs", name:"Tabs", category:"Navigation", variants:["Line","Contained","Vertical","Icon only"], sizes:["sm","md","lg"], tokens:[["$border-interactive","Active tab underline"],["$text-primary","Active label"],["$text-secondary","Inactive label"],["$layer-selected-01","Contained active bg"]], rule:"Never nest tabs. Line for most UI. Contained for dense toolbars." },
  { id:"tag", name:"Tag", category:"Content", variants:["Read-only","Dismissible","Selectable","Operational"], sizes:["sm (16px)","md (24px)","lg (32px)"], tokens:[["$tag-color-[type]","Tag fill"],["$tag-border-[type]","Tag border"],["$tag-hover-[type]","Tag hover"]], rule:"Document color-to-meaning mappings. Dismissible needs close icon aria-label." },
  { id:"text-area", name:"Text Area", category:"Forms", variants:["Default","With helper","Disabled","Read-only","Invalid"], sizes:["md","lg"], tokens:[["$field-01","Input bg"],["$border-strong-01","Active border"],["$text-primary","Input text"],["$text-placeholder","Placeholder"],["$support-error","Error state"]], rule:"Layer-aware like Text Input. Show character count if there is a limit." },
  { id:"text-input", name:"Text Input", category:"Forms", variants:["Default","With helper","Password","Disabled","Read-only","Invalid"], sizes:["sm","md","lg"], tokens:[["$field-01 / $field-02","Input bg (layer-aware)"],["$border-strong-01","Active border"],["$text-primary","Input text"],["$text-placeholder","Placeholder"],["$support-error","Error border"]], rule:"Layer-aware: $field-01 on $layer-01, $field-02 on $layer-02." },
  { id:"tile", name:"Tile", category:"Content", variants:["Default","Clickable","Selectable","Expandable"], sizes:["sm","md","lg"], tokens:[["$layer-01","Tile bg"],["$layer-hover-01","Clickable hover"],["$layer-selected-01","Selected state"],["$border-subtle-01","Tile border"]], rule:"Selectable tiles for choosing configurations. Clickable navigate elsewhere." },
  { id:"toggle", name:"Toggle", category:"Forms", variants:["Default","Small","Read-only"], sizes:["sm","md"], tokens:[["$interactive","On fill"],["$ui-03","Off fill"],["$text-primary","Label"],["$icon-on-color","Thumb icon"]], rule:"Immediate effect — no form submission. For deferred → use Checkbox." },
  { id:"toggletip", name:"Toggletip", category:"Overlays", variants:["Default","With actions"], sizes:["sm","md","lg"], tokens:[["$background-inverse","Tooltip bg"],["$text-inverse","Tooltip text"],["$button-primary","Action button"]], rule:"Triggered by click, not hover. Keyboard accessible. Use for complex tips." },
  { id:"tooltip", name:"Tooltip", category:"Overlays", variants:["Default","Icon button tooltip","Definition tooltip"], sizes:["sm","md","lg"], tokens:[["$background-inverse","Tooltip bg"],["$text-inverse","Tooltip text"]], rule:"Hover/focus only. Never include interactive elements inside a tooltip." },
  { id:"tree-view", name:"Tree View", category:"Navigation", variants:["Default","With checkboxes","With icons"], sizes:["sm","md","lg"], tokens:[["$layer-01","Tree bg"],["$layer-selected-01","Selected node"],["$layer-hover-01","Hover"],["$icon-primary","Expand chevron"]], rule:"For hierarchical data navigation. Max indent of 4 levels recommended." },
  { id:"ui-shell", name:"UI Shell", category:"Navigation", variants:["Header","Side nav","Panel"], sizes:["sm","md","lg"], tokens:[["$background-brand","Shell header bg"],["$text-on-color","Header text"],["$layer-01","Side nav bg"],["$layer-selected-01","Active nav item"]], rule:"Always persistent. Header 48px. Side nav 256px. Never hide on desktop." },
];

const CATEGORIES = [...new Set(CARBON_COMPONENTS.map(c => c.category))].sort();

// ─── Carbon structural template for generated output ─────────────────────────
const buildMarkdown = (ds) => {
  const comps = ds.selectedComponents || CARBON_COMPONENTS.map(c => c.id);
  const selected = CARBON_COMPONENTS.filter(c => comps.includes(c.id));
  const sp = ds.spacing || 8;
  const r = ds.radius || 0;
  const fs = ds.baseFontSize || 14;
  const scale = ds.typeScale || 1.2;
  const sizes = Array.from({length:7},(_,i)=>Math.round(fs * Math.pow(scale,i)));
  const heights = {compact:32,regular:40,comfortable:48};
  const h = heights[ds.density||'regular'];

  return `# ${ds.name || 'Custom Design System'} — Claude Context Block
> Structured following the Carbon Design System schema for AI agent consumption.
> Generated by the Agentic Product Design Framework — Design System Builder.

---

## CLAUDE.md — Agent Entry Point

This file is the AI agent reference for the **${ds.name || 'Custom Design System'}**.
Read this file first. Then reference Tokens, Components, and Patterns as needed.

### Agent Rules (non-negotiable)
1. Use design tokens from this file — never hardcode raw values
2. Font family: **${ds.fontFamily || 'IBM Plex Sans'}** for UI, monospace for code
3. Spacing: use the token scale below — no arbitrary pixel values
4. All interactive elements must meet WCAG 2.1 AA (4.5:1 text, 3:1 UI)
5. Component decision: check Components → check Patterns → then custom
6. Figma MCP: bind all fills/strokes to variable collection, never hardcode

---

## Foundations

### Brand Colors
| Token | Value | Role |
|-------|-------|------|
| \`--color-primary\` | ${ds.primary || '#0f62fe'} | Primary action, key UI |
| \`--color-accent\` | ${ds.accent || '#6929c4'} | Accent, secondary brand |
| \`--color-danger\` | ${ds.danger || '#da1e28'} | Destructive actions, errors |
| \`--color-success\` | ${ds.success || '#198038'} | Success states |
| \`--color-warning\` | ${ds.warning || '#f1c21b'} | Warning states |

### Surface & Layer
| Token | Value | Role |
|-------|-------|------|
| \`--background\` | ${ds.background || '#ffffff'} | Page background |
| \`--layer-01\` | ${ds.layer01 || '#f4f4f4'} | First layer container |
| \`--layer-02\` | ${ds.layer02 || '#ffffff'} | Second layer (cards on layer-01) |
| \`--text-primary\` | ${ds.textPrimary || '#161616'} | Headings, labels, body |
| \`--text-secondary\` | ${ds.textSecondary || '#525252'} | Descriptions, captions |
| \`--border-subtle\` | ${ds.borderSubtle || '#e0e0e0'} | Dividers, row lines |
| \`--border-strong\` | ${ds.borderStrong || '#8d8d8d'} | Active input borders |

### Typography
| Token | Value |
|-------|-------|
| \`--font-family\` | ${ds.fontFamily || 'IBM Plex Sans'}, system-ui |
| \`--font-size-base\` | ${fs}px |
| \`--type-scale\` | ${scale} (${['Minor second','Minor third','Major third','Perfect fourth'][['1.125','1.200','1.250','1.333'].indexOf(String(scale))]||'Minor third'}) |
| \`--text-xs\` | ${sizes[0]}px |
| \`--text-sm\` | ${sizes[1]}px |
| \`--text-base\` | ${fs}px |
| \`--text-lg\` | ${sizes[2]}px |
| \`--text-xl\` | ${sizes[3]}px |
| \`--text-2xl\` | ${sizes[4]}px |
| \`--text-3xl\` | ${sizes[5]}px |

### Spacing Scale (${sp}px base unit)
| Token | Value | Usage |
|-------|-------|-------|
| \`--spacing-1\` | ${sp/2}px | Micro gaps, icon-to-text |
| \`--spacing-2\` | ${sp}px | Internal component padding |
| \`--spacing-3\` | ${Math.round(sp*1.5)}px | Small padding, list gaps |
| \`--spacing-4\` | ${sp*2}px | Standard padding (default) |
| \`--spacing-6\` | ${sp*3}px | Card padding, section gaps |
| \`--spacing-8\` | ${sp*4}px | Between grouped sections |
| \`--spacing-12\` | ${sp*6}px | Major section breaks |
| \`--spacing-16\` | ${sp*8}px | Page-level spacing |

### Shape
| Token | Value |
|-------|-------|
| \`--radius\` | ${r}px |
| \`--radius-sm\` | ${Math.max(0,r-2)}px |
| \`--radius-lg\` | ${r+4}px |
| \`--radius-full\` | 9999px |

### Component Heights (${ds.density || 'regular'} density)
| Size | Height |
|------|--------|
| sm | ${h-8}px |
| md | ${h}px |
| lg | ${h+8}px |

---

## Components (${selected.length} of ${CARBON_COMPONENTS.length})

${selected.map(c => `### ${c.name}
**Category:** ${c.category} | **Variants:** ${c.variants.join(' · ')} | **Sizes:** ${c.sizes.join(' · ')}

**Tokens:**
${c.tokens.map(([t,r])=>`- \`${t}\` — ${r}`).join('\n')}

**Rule:** ${c.rule}
`).join('\n')}

---

## Patterns

### Forms
Use the Form component as layout container. Left-align labels above fields. Max width 640px. Group related fields in sections. Show validation inline — never in a modal.

### Dialogs
Use Modal for focused tasks requiring interruption. Passive → no required action. Transactional → primary + cancel. Danger → red primary. Always implement focus trap. Max 3 actions in footer.

### Notifications
Inline for contextual feedback (near the element). Toast for transient system messages (top-right, auto-dismiss 5s). Actionable when user must respond. Always pair status with icon.

### Empty States
Show when no data exists. Include: illustration or icon, headline, body explanation, primary action. Never show an empty container without explanation.

### Loading States
Inline Loading for actions 1–9s. Loading overlay for full-page operations. Skeleton screens for initial data load. Progress bar when % is known.

### Filtering
Use Search + Dropdown/Multiselect combo. Show applied filters as Dismissible Tags. Always show result count after filtering. Provide a "Clear all" action.

---

## Accessibility
- Text contrast: 4.5:1 minimum (WCAG 2.1 AA)
- Large text / UI elements: 3:1 minimum
- All interactive elements keyboard-operable
- Focus ring visible on every interactive element (2px outline, 1px offset)
- Touch targets: 44×44px minimum
- Never communicate state by color alone — always pair with icon or text
- Screen reader: every icon-only button needs aria-label

---

## Figma MCP Variable Bindings
Collection: **Color** → bind fills/strokes via setBoundVariableForPaint
Collection: **Spacing** → bind width/height/padding via setBoundVariable
Collection: **Typography** → bind fontFamily via setBoundVariable
Never hardcode any value in a layer property.
`;
};

const buildTokensJSON = (ds) => ({
  color: {
    primary: ds.primary || '#0f62fe',
    accent: ds.accent || '#6929c4',
    danger: ds.danger || '#da1e28',
    success: ds.success || '#198038',
    warning: ds.warning || '#f1c21b',
    background: ds.background || '#ffffff',
    'layer-01': ds.layer01 || '#f4f4f4',
    'layer-02': ds.layer02 || '#ffffff',
    'text-primary': ds.textPrimary || '#161616',
    'text-secondary': ds.textSecondary || '#525252',
    'border-subtle': ds.borderSubtle || '#e0e0e0',
    'border-strong': ds.borderStrong || '#8d8d8d',
  },
  typography: {
    fontFamily: ds.fontFamily || 'IBM Plex Sans',
    baseFontSize: `${ds.baseFontSize || 14}px`,
    typeScale: ds.typeScale || 1.2,
  },
  spacing: {
    base: `${ds.spacing || 8}px`,
    1: `${(ds.spacing||8)/2}px`,
    2: `${ds.spacing||8}px`,
    3: `${Math.round((ds.spacing||8)*1.5)}px`,
    4: `${(ds.spacing||8)*2}px`,
    6: `${(ds.spacing||8)*3}px`,
    8: `${(ds.spacing||8)*4}px`,
    12:`${(ds.spacing||8)*6}px`,
    16:`${(ds.spacing||8)*8}px`,
  },
  shape: {
    radius: `${ds.radius||0}px`,
    'radius-sm': `${Math.max(0,(ds.radius||0)-2)}px`,
    'radius-lg': `${(ds.radius||0)+4}px`,
    'radius-full': '9999px',
  },
  components: {
    heightSm: `${(ds.density==='compact'?32:ds.density==='comfortable'?48:40)-8}px`,
    heightMd: `${ds.density==='compact'?32:ds.density==='comfortable'?48:40}px`,
    heightLg: `${(ds.density==='compact'?32:ds.density==='comfortable'?48:40)+8}px`,
    density: ds.density || 'regular',
  }
});

const buildCSS = (ds) => {
  const sp = ds.spacing || 8;
  const r = ds.radius || 0;
  const fs = ds.baseFontSize || 14;
  const sc = ds.typeScale || 1.2;
  const sizes = Array.from({length:7},(_,i)=>Math.round(fs * Math.pow(sc,i)));
  const h = {compact:32,regular:40,comfortable:48}[ds.density||'regular'];
  return `:root {
  /* Brand */
  --color-primary: ${ds.primary||'#0f62fe'};
  --color-accent: ${ds.accent||'#6929c4'};
  --color-danger: ${ds.danger||'#da1e28'};
  --color-success: ${ds.success||'#198038'};
  --color-warning: ${ds.warning||'#f1c21b'};

  /* Surfaces */
  --background: ${ds.background||'#ffffff'};
  --layer-01: ${ds.layer01||'#f4f4f4'};
  --layer-02: ${ds.layer02||'#ffffff'};

  /* Text */
  --text-primary: ${ds.textPrimary||'#161616'};
  --text-secondary: ${ds.textSecondary||'#525252'};

  /* Borders */
  --border-subtle: ${ds.borderSubtle||'#e0e0e0'};
  --border-strong: ${ds.borderStrong||'#8d8d8d'};

  /* Typography */
  --font-family: '${ds.fontFamily||'IBM Plex Sans'}', system-ui, sans-serif;
  --text-xs:  ${sizes[0]}px;
  --text-sm:  ${sizes[1]}px;
  --text-base:${fs}px;
  --text-lg:  ${sizes[2]}px;
  --text-xl:  ${sizes[3]}px;
  --text-2xl: ${sizes[4]}px;
  --text-3xl: ${sizes[5]}px;

  /* Spacing */
  --spacing-1: ${sp/2}px;
  --spacing-2: ${sp}px;
  --spacing-3: ${Math.round(sp*1.5)}px;
  --spacing-4: ${sp*2}px;
  --spacing-6: ${sp*3}px;
  --spacing-8: ${sp*4}px;
  --spacing-12:${sp*6}px;
  --spacing-16:${sp*8}px;

  /* Shape */
  --radius:    ${r}px;
  --radius-sm: ${Math.max(0,r-2)}px;
  --radius-lg: ${r+4}px;
  --radius-full: 9999px;

  /* Components */
  --height-sm: ${h-8}px;
  --height-md: ${h}px;
  --height-lg: ${h+8}px;
}`;
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function DesignSystemBuilder() {
  const [tab, setTab] = useState('upload');
  const [uploadStage, setUploadStage] = useState('idle'); // idle | parsing | review | done
  const [uploadSummary, setUploadSummary] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [parseError, setParseError] = useState('');
  const [dsName, setDsName] = useState('My Design System');
  const [bs, setBs] = useState({
    name:'My Design System', primary:'#0f62fe', accent:'#6929c4', danger:'#da1e28',
    success:'#198038', warning:'#f1c21b', background:'#ffffff', layer01:'#f4f4f4',
    layer02:'#ffffff', textPrimary:'#161616', textSecondary:'#525252',
    borderSubtle:'#e0e0e0', borderStrong:'#8d8d8d',
    fontFamily:'IBM Plex Sans', baseFontSize:14, typeScale:1.2,
    spacing:8, radius:0, density:'regular',
    selectedComponents: CARBON_COMPONENTS.map(c=>c.id)
  });
  const [exportFormat, setExportFormat] = useState('markdown');
  const [copied, setCopied] = useState(false);
  const [previewCategory, setPreviewCategory] = useState('All');
  const [compSearch, setCompSearch] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);
  const fileRef = useRef();

  const upd = (key, val) => setBs(p => ({...p, [key]: val}));

  // Live preview helpers
  const previewStyle = {
    fontFamily: `'${bs.fontFamily}', system-ui`,
    '--p': bs.primary, '--a': bs.accent, '--d': bs.danger,
    '--bg': bs.background, '--l1': bs.layer01,
    '--t1': bs.textPrimary, '--t2': bs.textSecondary,
    '--bs': bs.borderSubtle, '--bst': bs.borderStrong,
    '--r': bs.radius+'px', '--sp': bs.spacing+'px',
  };
  const h = {compact:32,regular:40,comfortable:48}[bs.density];
  const fs = bs.baseFontSize;
  const sc = bs.typeScale;
  const sizes = Array.from({length:5},(_,i)=>Math.round(fs * Math.pow(sc,i)));

  // Upload handler
  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setUploadFile(file);
    setUploadStage('parsing');
    setParseError('');

    const name = file.name.replace(/\.(zip|md|json|css)$/i,'').replace(/[-_]/g,' ');
    setDsName(name);

    // Read file as text for non-zip; for zip just use name/size heuristics
    const isZip = file.name.toLowerCase().endsWith('.zip');
    const isMd  = file.name.toLowerCase().endsWith('.md');
    const isJson= file.name.toLowerCase().endsWith('.json');
    const isCss = file.name.toLowerCase().endsWith('.css');

    let rawText = '';
    try {
      if (!isZip) rawText = await file.text();
    } catch(e) {}

    const sizeKB = Math.round(file.size/1024);

    // Build initial parse summary using Claude API
    setAiProcessing(true);
    try {
      const prompt = isZip
        ? `A designer uploaded a ZIP file named "${file.name}" (${sizeKB}KB) which is their design system. Based on the filename and size, provide a JSON summary of what we'd expect to find. The ZIP likely contains design system documentation structured as markdown files.`
        : `A designer uploaded a design system file named "${file.name}" (${sizeKB}KB). Here is its content (truncated):\n\n${rawText.slice(0,3000)}\n\nAnalyze this design system file and return ONLY a JSON object with these exact keys: { "name": string, "type": "zip|markdown|json|css", "detectedSections": string[], "detectedComponents": string[], "detectedTokens": string[], "missingVsCarbon": string[], "recommendations": string[], "confidence": "high|medium|low" }`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          messages:[{role:'user', content: prompt}]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||'').join('') || '';
      const clean = text.replace(/```json|```/g,'').trim();
      const parsed = JSON.parse(clean);
      setUploadSummary({ ...parsed, fileName: file.name, sizeKB, rawText: rawText.slice(0,5000) });
      setDsName(parsed.name || name);
      setUploadStage('review');
    } catch(e) {
      // Fallback: build heuristic summary
      const sections = [];
      if(rawText.includes('color') || rawText.includes('#')) sections.push('Color tokens');
      if(rawText.includes('spacing') || rawText.includes('padding')) sections.push('Spacing');
      if(rawText.includes('typography') || rawText.includes('font')) sections.push('Typography');
      if(rawText.includes('button') || rawText.includes('Button')) sections.push('Button');
      if(rawText.includes('input') || rawText.includes('Input')) sections.push('Input');
      if(isZip) sections.push('Multiple files detected');

      setUploadSummary({
        name, type: isZip?'zip':isMd?'markdown':isJson?'json':'css',
        detectedSections: sections.length ? sections : ['Content detected'],
        detectedComponents: [],
        detectedTokens: [],
        missingVsCarbon: ['Unable to auto-detect — review manually'],
        recommendations: ['Ensure your ZIP uses the Carbon-style folder structure: /tokens, /components, /patterns, /guidelines'],
        confidence:'low', fileName: file.name, sizeKB
      });
      setUploadStage('review');
    }
    setAiProcessing(false);
  }, []);

  const onDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };
  const onInputChange = (e) => handleFile(e.target.files[0]);

  const toggleComp = (id) => {
    setBs(p => ({
      ...p,
      selectedComponents: p.selectedComponents.includes(id)
        ? p.selectedComponents.filter(c=>c!==id)
        : [...p.selectedComponents, id]
    }));
  };

  const filteredComps = CARBON_COMPONENTS.filter(c =>
    (previewCategory === 'All' || c.category === previewCategory) &&
    c.name.toLowerCase().includes(compSearch.toLowerCase())
  );

  const exportContent = () => {
    const source = tab === 'upload' && uploadSummary ? { ...bs, name: dsName } : bs;
    if (exportFormat === 'markdown') return buildMarkdown(source);
    if (exportFormat === 'json') return JSON.stringify(buildTokensJSON(source), null, 2);
    if (exportFormat === 'css') return buildCSS(source);
    return buildMarkdown(source);
  };

  const copy = () => {
    navigator.clipboard.writeText(exportContent()).then(() => {
      setCopied(true); setTimeout(()=>setCopied(false),2000);
    });
  };

  const download = () => {
    const ext = exportFormat === 'json' ? 'json' : exportFormat === 'css' ? 'css' : 'md';
    const blob = new Blob([exportContent()], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(bs.name||'design-system').toLowerCase().replace(/\s+/g,'-')}.${ext}`;
    a.click();
  };

  // ── Styles ──
  const S = {
    app: {fontFamily:'var(--font-sans)',paddingBottom:'2rem'},
    tabs: {display:'flex',gap:4,borderBottom:'0.5px solid var(--color-border-tertiary)',marginBottom:'1.25rem'},
    tab: (active) => ({padding:'8px 16px',fontSize:13,cursor:'pointer',border:'none',background:'none',
      color: active?'var(--color-text-primary)':'var(--color-text-secondary)',
      borderBottom: active?'2px solid var(--color-text-primary)':'2px solid transparent',
      marginBottom:-1,fontWeight:active?500:400,transition:'color 0.15s'}),
    card: {background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)',
      borderRadius:'var(--border-radius-lg)',padding:'1rem 1.25rem',marginBottom:'1rem'},
    label: {fontSize:11,fontWeight:500,letterSpacing:'0.08em',color:'var(--color-text-tertiary)',
      textTransform:'uppercase',marginBottom:8,display:'block'},
    row: {display:'flex',alignItems:'center',gap:12,marginBottom:10},
    rowLabel: {fontSize:13,color:'var(--color-text-secondary)',minWidth:130},
    val: {fontSize:13,fontWeight:500,minWidth:44,color:'var(--color-text-primary)'},
    sectionHd: {fontSize:14,fontWeight:500,color:'var(--color-text-primary)',marginBottom:8},
    muted: {fontSize:12,color:'var(--color-text-tertiary)',lineHeight:1.6},
    grid2: {display:'grid',gridTemplateColumns:'1fr 1fr',gap:10},
    grid3: {display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8},
    chip: (active) => ({padding:'4px 12px',fontSize:12,border:`0.5px solid ${active?'var(--color-border-info)':'var(--color-border-secondary)'}`,
      borderRadius:'var(--border-radius-md)',cursor:'pointer',background:active?'var(--color-background-info)':'none',
      color:active?'var(--color-text-info)':'var(--color-text-secondary)'}),
    badge: (color) => ({padding:'2px 8px',borderRadius:'var(--border-radius-md)',fontSize:11,fontWeight:500,
      background:`var(--color-background-${color})`,color:`var(--color-text-${color})`}),
    input: {fontSize:13,padding:'6px 10px',border:'0.5px solid var(--color-border-secondary)',
      borderRadius:'var(--border-radius-md)',background:'var(--color-background-primary)',
      color:'var(--color-text-primary)',width:'100%'},
    monoBlock: {background:'var(--color-background-secondary)',border:'0.5px solid var(--color-border-tertiary)',
      borderRadius:'var(--border-radius-md)',padding:'1rem',fontFamily:'var(--font-mono)',fontSize:11,
      lineHeight:1.7,color:'var(--color-text-secondary)',whiteSpace:'pre-wrap',wordBreak:'break-all',
      maxHeight:320,overflowY:'auto',marginTop:8},
  };

  return (
    <div style={S.app}>
      {/* Tab bar */}
      <div style={S.tabs}>
        {[['upload','Upload Design System'],['bootstrap','Bootstrap Builder'],['export','Export for Claude']].map(([id,label])=>(
          <button key={id} style={S.tab(tab===id)} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>

      {/* ── UPLOAD TAB ── */}
      {tab==='upload' && (
        <div>
          {uploadStage==='idle' && (
            <>
              <div style={S.card}>
                <span style={S.label}>Upload your design system</span>
                <div
                  onClick={()=>fileRef.current.click()}
                  onDrop={onDrop}
                  onDragOver={e=>e.preventDefault()}
                  style={{border:'1px dashed var(--color-border-secondary)',borderRadius:'var(--border-radius-lg)',
                    padding:'2rem',textAlign:'center',cursor:'pointer',transition:'background 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--color-background-secondary)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                >
                  <div style={{fontSize:32,marginBottom:8}}>⬆</div>
                  <div style={{fontSize:14,fontWeight:500,color:'var(--color-text-primary)',marginBottom:4}}>Drop your file here or click to browse</div>
                  <div style={S.muted}>Supported formats: ZIP (recommended), .md, .json, .css</div>
                  <input ref={fileRef} type="file" accept=".zip,.md,.json,.css" style={{display:'none'}} onChange={onInputChange}/>
                </div>
              </div>

              <div style={S.card}>
                <span style={S.label}>Recommended file structure</span>
                <div style={S.muted}>For best results, structure your ZIP like this:</div>
                <div style={{...S.monoBlock, marginTop:8}}>
{`your-design-system/
├── CLAUDE.md          ← AI agent entry point (required)
├── tokens/
│   ├── color-tokens.md
│   ├── spacing-tokens.md
│   ├── type-tokens.md
│   └── motion-tokens.md
├── components/
│   ├── button.md
│   ├── text-input.md
│   └── modal.md  (+ any component)
├── patterns/
│   ├── forms.md
│   └── notifications.md
└── guidelines/
    ├── accessibility.md
    └── typography.md`}
                </div>
                <div style={{marginTop:12,...S.muted}}>
                  <strong style={{color:'var(--color-text-primary)'}}>CLAUDE.md</strong> is the most important file — it's the AI agent's entry point. It should describe your system, list rules, and explain how files relate. See the Carbon Design System ZIP included in this framework for a reference example.
                </div>
              </div>

              <div style={S.card}>
                <span style={S.label}>Don't have a structured file yet?</span>
                <div style={S.muted} >Use the <strong style={{color:'var(--color-text-primary)'}}>Bootstrap Builder</strong> tab to generate a fully structured design system from scratch — tokens, all 46 Carbon components pre-documented with your values, patterns, and guidelines included. Then export it as a ZIP-ready markdown file.</div>
              </div>
            </>
          )}

          {uploadStage==='parsing' && (
            <div style={{...S.card, textAlign:'center',padding:'3rem'}}>
              <div style={{fontSize:24,marginBottom:12}}>⟳</div>
              <div style={{fontSize:14,color:'var(--color-text-primary)',fontWeight:500}}>
                {aiProcessing ? 'Claude is analyzing your design system...' : 'Reading file...'}
              </div>
              <div style={{...S.muted,marginTop:4}}>{uploadFile?.name}</div>
            </div>
          )}

          {uploadStage==='review' && uploadSummary && (
            <>
              <div style={S.card}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                  <div>
                    <span style={S.label}>File analyzed</span>
                    <div style={{fontSize:16,fontWeight:500,color:'var(--color-text-primary)'}}>{uploadSummary.fileName}</div>
                    <div style={{...S.muted,marginTop:2}}>{uploadSummary.sizeKB}KB · {uploadSummary.type?.toUpperCase()}</div>
                  </div>
                  <span style={S.badge(uploadSummary.confidence==='high'?'success':uploadSummary.confidence==='medium'?'warning':'danger')}>
                    {uploadSummary.confidence} confidence
                  </span>
                </div>

                <div style={{marginBottom:4,...S.label}}>Name</div>
                <input style={{...S.input,marginBottom:12}} value={dsName} onChange={e=>setDsName(e.target.value)}/>

                <div style={S.grid2}>
                  <div>
                    <div style={{...S.label,marginBottom:6}}>Detected sections</div>
                    {(uploadSummary.detectedSections||[]).map(s=>(
                      <div key={s} style={{fontSize:12,color:'var(--color-text-secondary)',padding:'2px 0'}}>✓ {s}</div>
                    ))}
                  </div>
                  <div>
                    <div style={{...S.label,marginBottom:6}}>Detected components</div>
                    {uploadSummary.detectedComponents?.length
                      ? uploadSummary.detectedComponents.map(s=><div key={s} style={{fontSize:12,color:'var(--color-text-secondary)',padding:'2px 0'}}>✓ {s}</div>)
                      : <div style={S.muted}>None auto-detected</div>}
                  </div>
                </div>
              </div>

              {(uploadSummary.missingVsCarbon?.length > 0) && (
                <div style={{...S.card,borderColor:'var(--color-border-warning)'}}>
                  <span style={S.label}>Gaps vs. Carbon structure</span>
                  {uploadSummary.missingVsCarbon.map(m=>(
                    <div key={m} style={{fontSize:12,color:'var(--color-text-warning)',padding:'2px 0'}}>⚠ {m}</div>
                  ))}
                </div>
              )}

              {(uploadSummary.recommendations?.length > 0) && (
                <div style={S.card}>
                  <span style={S.label}>Recommendations</span>
                  {uploadSummary.recommendations.map(r=>(
                    <div key={r} style={{fontSize:12,color:'var(--color-text-secondary)',padding:'3px 0',borderBottom:'0.5px solid var(--color-border-tertiary)',lineHeight:1.5}}>→ {r}</div>
                  ))}
                </div>
              )}

              <div style={{display:'flex',gap:8}}>
                <button style={{...S.chip(true),flex:1,justifyContent:'center'}}
                  onClick={()=>{ setTab('export'); setBs(p=>({...p,name:dsName})); }}>
                  Looks good — go to Export →
                </button>
                <button style={{...S.chip(false)}} onClick={()=>{setUploadStage('idle');setUploadSummary(null);}}>
                  Upload different file
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── BOOTSTRAP BUILDER TAB ── */}
      {tab==='bootstrap' && (
        <div>
          <div style={S.card}>
            <span style={S.label}>System name</span>
            <input style={S.input} value={bs.name} onChange={e=>upd('name',e.target.value)} placeholder="My Design System"/>
          </div>

          <div style={S.card}>
            <span style={S.label}>Brand colors</span>
            <div style={S.grid2}>
              {[['primary','Primary'],['accent','Accent'],['danger','Danger'],['success','Success'],['warning','Warning'],
                ['background','Background'],['layer01','Layer 01'],['layer02','Layer 02'],
                ['textPrimary','Text primary'],['textSecondary','Text secondary'],
                ['borderSubtle','Border subtle'],['borderStrong','Border strong']].map(([key,label])=>(
                <div key={key} style={{...S.row,marginBottom:6}}>
                  <input type="color" value={bs[key]||'#000000'} onChange={e=>upd(key,e.target.value)}
                    style={{width:32,height:28,border:'0.5px solid var(--color-border-secondary)',borderRadius:4,padding:2,cursor:'pointer',background:'none'}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:'var(--color-text-secondary)'}}>{label}</div>
                    <input value={bs[key]||''} onChange={e=>/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)&&upd(key,e.target.value)}
                      style={{fontSize:11,fontFamily:'var(--font-mono)',width:'100%',border:'none',background:'transparent',color:'var(--color-text-tertiary)',padding:0}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={S.card}>
            <span style={S.label}>Typography</span>
            <div style={S.row}>
              <span style={S.rowLabel}>Font family</span>
              <select style={{...S.input,width:'auto',flex:1}} value={bs.fontFamily} onChange={e=>upd('fontFamily',e.target.value)}>
                {['IBM Plex Sans','Inter','DM Sans','Geist','Geist Mono','Helvetica Neue','system-ui'].map(f=>(
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Base size</span>
              <input type="range" min={12} max={18} step={1} value={bs.baseFontSize} onChange={e=>upd('baseFontSize',+e.target.value)} style={{flex:1}}/>
              <span style={S.val}>{bs.baseFontSize}px</span>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Scale ratio</span>
              <select style={{...S.input,width:'auto',flex:1}} value={bs.typeScale} onChange={e=>upd('typeScale',+e.target.value)}>
                <option value={1.125}>Minor second (1.125)</option>
                <option value={1.200}>Minor third (1.200)</option>
                <option value={1.250}>Major third (1.250)</option>
                <option value={1.333}>Perfect fourth (1.333)</option>
              </select>
            </div>
            <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}>
              {sizes.slice(0,5).reverse().map((sz,i)=>(
                <div key={i} style={{fontSize:sz,fontFamily:`'${bs.fontFamily}',system-ui`,color:'var(--color-text-primary)',lineHeight:1.2}}>{sz}px</div>
              ))}
            </div>
          </div>

          <div style={S.card}>
            <span style={S.label}>Spacing & shape</span>
            <div style={S.row}>
              <span style={S.rowLabel}>Base unit</span>
              <input type="range" min={4} max={16} step={4} value={bs.spacing} onChange={e=>upd('spacing',+e.target.value)} style={{flex:1}}/>
              <span style={S.val}>{bs.spacing}px</span>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Border radius</span>
              <input type="range" min={0} max={16} step={2} value={bs.radius} onChange={e=>upd('radius',+e.target.value)} style={{flex:1}}/>
              <span style={S.val}>{bs.radius}px</span>
            </div>
            <div style={S.row}>
              <span style={S.rowLabel}>Density</span>
              <select style={{...S.input,width:'auto',flex:1}} value={bs.density} onChange={e=>upd('density',e.target.value)}>
                <option value="compact">Compact (32px)</option>
                <option value="regular">Regular (40px)</option>
                <option value="comfortable">Comfortable (48px)</option>
              </select>
            </div>
          </div>

          <div style={S.card}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <span style={S.label}>Components ({bs.selectedComponents.length} / {CARBON_COMPONENTS.length})</span>
              <div style={{display:'flex',gap:6}}>
                <button style={S.chip(false)} onClick={()=>upd('selectedComponents',CARBON_COMPONENTS.map(c=>c.id))}>All</button>
                <button style={S.chip(false)} onClick={()=>upd('selectedComponents',[])}>None</button>
              </div>
            </div>
            <input style={{...S.input,marginBottom:10}} placeholder="Search components..." value={compSearch} onChange={e=>setCompSearch(e.target.value)}/>
            <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:10}}>
              {['All',...CATEGORIES].map(cat=>(
                <button key={cat} style={S.chip(previewCategory===cat)} onClick={()=>setPreviewCategory(cat)}>{cat}</button>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:6}}>
              {filteredComps.map(c=>{
                const sel = bs.selectedComponents.includes(c.id);
                return (
                  <div key={c.id} onClick={()=>toggleComp(c.id)}
                    style={{padding:'8px 10px',border:`0.5px solid ${sel?'var(--color-border-info)':'var(--color-border-tertiary)'}`,
                      borderRadius:'var(--border-radius-md)',cursor:'pointer',
                      background:sel?'var(--color-background-info)':'var(--color-background-primary)',
                      transition:'all 0.1s'}}>
                    <div style={{fontSize:12,fontWeight:500,color:sel?'var(--color-text-info)':'var(--color-text-primary)'}}>{c.name}</div>
                    <div style={{fontSize:10,color:'var(--color-text-tertiary)',marginTop:2}}>{c.category}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live preview */}
          <div style={S.card}>
            <span style={S.label}>Live preview</span>
            <div style={{background:bs.background,borderRadius:bs.radius,padding:bs.spacing*2,border:`1px solid ${bs.borderSubtle}`,fontFamily:`'${bs.fontFamily}',system-ui`}}>
              {sizes.slice(0,3).reverse().map((sz,i)=>(
                <div key={i} style={{fontSize:sz,color:bs.textPrimary,lineHeight:1.3,marginBottom:bs.spacing/2}}>
                  {['Heading','Subheading','Body'][i]} — {sz}px
                </div>
              ))}
              <div style={{fontSize:fs,color:bs.textSecondary,marginBottom:bs.spacing}}>Secondary text — descriptions and captions.</div>
              <div style={{height:'0.5px',background:bs.borderSubtle,marginBottom:bs.spacing}}/>
              <div style={{display:'flex',gap:bs.spacing/2,flexWrap:'wrap',marginBottom:bs.spacing}}>
                <button style={{height:h,padding:`0 ${bs.spacing*2}px`,background:bs.primary,color:'#fff',border:'none',borderRadius:bs.radius,fontSize:fs,cursor:'pointer',fontFamily:'inherit'}}>Primary</button>
                <button style={{height:h,padding:`0 ${bs.spacing*2}px`,background:'transparent',color:bs.primary,border:`1px solid ${bs.primary}`,borderRadius:bs.radius,fontSize:fs,cursor:'pointer',fontFamily:'inherit'}}>Secondary</button>
                <button style={{height:h,padding:`0 ${bs.spacing*2}px`,background:bs.accent,color:'#fff',border:'none',borderRadius:bs.radius,fontSize:fs,cursor:'pointer',fontFamily:'inherit'}}>Accent</button>
                <button style={{height:h,padding:`0 ${bs.spacing*2}px`,background:bs.danger,color:'#fff',border:'none',borderRadius:bs.radius,fontSize:fs,cursor:'pointer',fontFamily:'inherit'}}>Danger</button>
              </div>
              <div style={{marginBottom:bs.spacing}}>
                <div style={{fontSize:Math.round(fs*0.85),color:bs.textSecondary,marginBottom:4}}>Input label</div>
                <input placeholder="Enter value..." readOnly style={{height:h,width:'100%',padding:`0 ${bs.spacing}px`,border:`1px solid ${bs.borderStrong}`,borderRadius:bs.radius,fontSize:fs,background:bs.layer01,color:bs.textPrimary,fontFamily:'inherit',boxSizing:'border-box',outline:'none'}}/>
              </div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {[['Default',bs.layer01,bs.textSecondary],['Primary',bs.primary+'22',bs.primary],['Success',bs.success+'22',bs.success],['Warning',bs.warning+'33',bs.warning],['Error',bs.danger+'22',bs.danger]].map(([l,bg,c])=>(
                  <span key={l} style={{padding:`2px ${bs.spacing}px`,borderRadius:Math.max(bs.radius,12),background:bg,color:c,fontSize:Math.round(fs*0.78)}}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EXPORT TAB ── */}
      {tab==='export' && (
        <div>
          <div style={S.card}>
            <span style={S.label}>Export format</span>
            <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap'}}>
              {[['markdown','Markdown (CLAUDE.md)'],['json','tokens.json'],['css','tokens.css']].map(([f,label])=>(
                <button key={f} style={S.chip(exportFormat===f)} onClick={()=>setExportFormat(f)}>{label}</button>
              ))}
            </div>

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
              <div style={S.muted}>
                {exportFormat==='markdown' && 'Structured CLAUDE.md — the AI agent entry point. Paste into a Claude Project system prompt or upload alongside your design work.'}
                {exportFormat==='json' && 'Token values as structured JSON — use with Style Dictionary, Theo, or custom build pipelines.'}
                {exportFormat==='css' && 'CSS custom properties — drop into any codebase and reference via var(--color-primary) etc.'}
              </div>
              <div style={{display:'flex',gap:6}}>
                <button style={S.chip(false)} onClick={copy}>{copied?'Copied!':'Copy'}</button>
                <button style={S.chip(true)} onClick={download}>Download ↓</button>
              </div>
            </div>
            <div style={S.monoBlock}>{exportContent()}</div>
          </div>

          <div style={{...S.card,background:'var(--color-background-secondary)'}}>
            <span style={S.label}>How to use with Claude</span>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {[
                ['1','Copy or download the Markdown export above','This is your CLAUDE.md — the AI agent entry point for your design system.'],
                ['2','Paste into a Claude Project system prompt','Go to your Claude Project → Instructions → paste the full markdown block. Claude now has full token + component context.'],
                ['3','Or upload alongside your design files','Start a conversation, attach your CLAUDE.md, and design immediately.'],
                ['4','Design in Figma via MCP','Claude knows every token name, every component rule, every spacing value. Ask it to design in Figma — no back-and-forth on values.'],
              ].map(([n,title,desc])=>(
                <div key={n} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                  <div style={{width:24,height:24,borderRadius:'50%',background:'var(--color-background-info)',color:'var(--color-text-info)',fontSize:12,fontWeight:500,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{n}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:500,color:'var(--color-text-primary)',marginBottom:2}}>{title}</div>
                    <div style={{...S.muted}}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
