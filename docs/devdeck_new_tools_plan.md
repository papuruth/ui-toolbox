# DevDeck — New Tools Expansion Plan

## Goal
Add high-impact tools that increase daily usage, differentiation, and SEO surface area — while keeping the UX premium and coherent with the existing design system.

---

## Design System Reference

Before implementation, every tool must conform to these existing patterns:

### Component Kit (from `src/components/Shared/ToolKit/index.js`)
| Component | Usage |
|---|---|
| `ToolLayout` | Root split-panel wrapper for all tools |
| `Panel` | Left/right content panel |
| `PanelHeader` + `PanelLabel` | Section header with label + action area |
| `CodeArea` | Monospaced textarea (JetBrains Mono / Fira Code) |
| `InputArea` | Plain text textarea |
| `TabStrip` + `TabBtn` | Horizontal tab navigation |
| `ActionBar` + `ActionBtn` | Bottom action row per panel |
| `ActionBtnGroup` | Button cluster with gap |
| `EmptyState` | Centered empty state with icon + message |
| `ModeToggle` + `ModeBtn` | Encode/Decode or mode switcher |

### CSS Tokens (light + dark via `data-theme="dark"`)
```
--bg-page, --bg-surface, --bg-card, --bg-input
--text-primary, --text-secondary
--border-color
--shadow-panel: 0 8px 32px rgba(0,0,0,0.08)
--radius-panel: 12px, --radius-btn: 6px
```

### Brand Colors
- Primary: `#22cc99` — success/action
- Secondary: `#1f1e29` — dark surface
- Info: `#2299ff`, Error: `#ef4444`, Warning: `#fbbf24`
- All semantic badges use `rgba(color, 0.12)` background tint

### Typography
- UI: `Inter` (system stack)
- Code/output: `JetBrains Mono`, fallback `Fira Code`
- Responsive breakpoints: `xl:1200`, `lg:992`, `md:768`, `sm:576`, `xs:476`

### Tool Integration Checklist (for every new tool)
1. Add route entry in `src/routes/routes.js`
2. Add item in `GLOBAL_CONSTANTS.OPERATIONS_ITEMS` (globalConstants.js) with `label`, `route`, `description`, `category`, `badge`, `icon`
3. Add lazy import + switch case in `src/pages/Operations/index.js`
4. Add localization keys in `src/localization/languages/english.js`
5. Use `useToolChain` hook for chaining support
6. Use `useToolHistory` hook for recent inputs
7. Add `LocalBadge` to tools that process data client-side only
8. Add `SendToButton` on output panels where chaining makes sense
9. Update `src/utils/seoMeta.js` with SEO metadata
10. Extend `src/utils/inputDetector.js` if the tool can auto-detect pasted input

### Categories (existing)
- `image` — Image Tools (#22cc99)
- `encoding` — Encoding & Text (#2299ff)
- `url` — URL & Web (#ff9800)
- `utilities` — Utilities (#9c27b0)
- **New for Phase 1+:** `developer` — Developer Tools (#e91e63)

---

## Duplicate & Merge Analysis

Before building anything new, audit the 7 planned tools against what already exists:

| Planned Tool | Existing Tool | Decision |
|---|---|---|
| JWT Generator | JWT Decoder (`/jwt-decoder`) | **MERGE** — add Generate tab to JWT Decoder → rename to "JWT Toolkit" |
| UUID Inspector | UUID Generator (`/uuid-generator`) | **MERGE** — add Inspector tab → rename to "UUID Tools" |
| Regex Generator (Ph3) | Regex Tester (`/regex-tester`) | **MERGE** — add Generator tab → rename to "Regex Toolkit" |
| JSON Schema Validator (Ph2) | JSON Viewer (`/json-viewer`) | **MERGE** — add Schema tab inside JSON Viewer (no new route) |
| Universal Encoder/Decoder (Ph2) | Base64 Text (`/base64-text`) | **EXPAND** — keep `/base64-text`, add new `/encoder-decoder` hub with Base64 + URL + HTML + Unicode tabs |
| Tool Chaining (Ph3) | `ToolChainContext.js` (already implemented) | **ENHANCE VISIBILITY** — not a new tool; wire `SendToButton` to more panels, add chain breadcrumb in header |
| Smart Formatter (Ph1) | `inputDetector.js` + `smartInput` localization (scaffolded) | **BUILD** — the detection logic exists; build the dedicated UI around it |

**Net result:** 4 tools eliminated/merged, 3 expansions of existing tools, 5 genuinely new standalone tools.

---

# Phase 1 — Core Expansion (High ROI)
**Timeline: ~2 weeks | Goal: Ship tools that drive daily usage and return visits**

---

## 1.1 API Request Builder — NEW (`/api-builder`)

**Why:** The single most-requested developer utility. Drives repeat usage every time a dev tests an endpoint.

### Category
`developer` (new category, color `#e91e63`, icon `Http`)

### UX Layout
```
┌─────────────────────────────┬──────────────────────────────┐
│  REQUEST                    │  RESPONSE                    │
│  ─────────────────────      │  ──────────────────────      │
│  [GET][POST][PUT][DELETE]   │  ● 200 OK  ·  124ms          │
│  [PATCH]                    │  ─────────────────────       │
│  ─────────────────────      │  {                           │
│  URL  [________________]    │    "id": 1,                  │
│  ─────────────────────      │    "name": "…"               │
│  Headers  [+ Add]           │  }                           │
│  key: value  [×]            │                              │
│  ─────────────────────      │  [Copy Response] [Chain →]   │
│  Body (JSON / Form)         │                              │
│  [CodeArea]                 │                              │
│  ─────────────────────      │                              │
│  [Send]    [Clear]          │                              │
└─────────────────────────────┴──────────────────────────────┘
```

### Implementation Details
- **Method selector:** Chip-style toggle strip (GET/POST/PUT/DELETE/PATCH), each method has a semantic color (GET=green, POST=blue, PUT=orange, DELETE=red, PATCH=yellow)
- **URL input:** `InputArea` with paste button and recent history via `useToolHistory`
- **Headers table:** Dynamic key-value rows with add/remove. Pre-populate `Content-Type: application/json` for POST/PUT/PATCH
- **Body panel:** Hidden for GET/DELETE; shown for POST/PUT/PATCH. `CodeArea` with JSON/Form toggle `ModeToggle`
- **Send:** Uses `window.fetch()` — no backend required. Display CORS notice inline if request fails with a network error
- **Response panel:** Syntax-highlighted JSON via `<pre>` with custom tokenizer, status badge (2xx=green, 3xx=blue, 4xx=orange, 5xx=red), response time in ms, response headers collapsible section
- **Error states:** CORS blocked → specific message; Network offline → offline badge; Timeout → configurable 10s default
- **Chain output:** `SendToButton` on response panel → chains JSON to JSON Viewer
- **Recent requests:** Store last 5 {method, url, headers, body} in localStorage via `useToolHistory`
- **LocalBadge:** N/A (makes external requests by design)
- **CORS limitation notice:** Subtle inline info badge "Some APIs may block browser requests due to CORS"

### New Files
- `src/components/APIRequestBuilder/index.js`
- `src/components/APIRequestBuilder/styles.js`

### Localization Keys
```js
apiRequestBuilder: {
  pageTitle: "API Request Builder",
  urlPlaceholder: "https://api.example.com/endpoint",
  headersLabel: "Headers",
  addHeaderBtn: "Add Header",
  bodyLabel: "Request Body",
  sendBtn: "Send",
  sendingLabel: "Sending…",
  responseLabel: "Response",
  statusLabel: "Status",
  timeLabel: "Time",
  copyResponseBtn: "Copy Response",
  corsNotice: "Some APIs block browser requests due to CORS",
  errorNetwork: "Network error — check CORS or connectivity",
  emptyStateMessage: "Enter a URL and press Send",
  methodLabel: "Method",
  jsonTabLabel: "JSON",
  formTabLabel: "Form Data",
  responseHeadersLabel: "Response Headers"
}
```

---

## 1.2 JWT Toolkit — EXPAND existing (`/jwt-decoder`)

**Why:** JWT Decoder already exists and is well-used. Adding generation makes it a complete JWT workbench with zero new SEO cost.

### Change
Add a top-level `ModeToggle` — "Decode" (existing) and "Generate" (new tab).

### Generate Tab Layout
```
┌────────────────────────┬───────────────────────────────────┐
│  SETTINGS              │  TOKEN OUTPUT                     │
│  ────────────────      │  ─────────────────────────────    │
│  Algorithm             │  [eyJhbGciOiJIUzI1NiIsIn...]     │
│  [HS256 ▼]             │                                   │
│  ────────────────      │  [Copy Token] [Send to Decoder]   │
│  Header (JSON)         │                                   │
│  [CodeArea]            │  Badges: HS256 · expires in 1h    │
│  ────────────────      │                                   │
│  Payload (JSON)        │                                   │
│  [CodeArea]            │                                   │
│  ────────────────      │                                   │
│  Secret / Key          │                                   │
│  [InputArea] [👁]      │                                   │
└────────────────────────┴───────────────────────────────────┘
```

### Implementation Details
- **Algorithm selector:** `ModeToggle` or `Select` — HS256, HS384, HS512, RS256 (RS256 needs PEM key — show appropriate key input)
- **Header CodeArea:** Pre-filled with `{"alg": "HS256", "typ": "JWT"}` — editable
- **Payload CodeArea:** Pre-filled with template: `{"sub": "user_id", "iat": <now>, "exp": <now+3600>}`
- **Secret input:** Password field with show/hide toggle, LocalBadge since all processing is in-browser
- **Live generation:** Debounced 300ms — token regenerates as user types
- **Output:** Full token string in `CodeArea` (readonly), same `BadgeRow` as Decoder showing alg + expiry
- **"Send to Decoder" button:** Uses `useToolChain` to chain generated token → Decode tab
- **Library:** `jose` (pure JS JOSE implementation) — lightweight, browser-compatible
- **Error handling:** Invalid JSON in header/payload → inline ErrorBadge; missing secret → warning badge

### New Localization Keys (append to `jwtDecoder` section)
```js
generateTab: "Generate",
decodeTab: "Decode",
algorithmLabel: "Algorithm",
headerJsonLabel: "Header (JSON)",
payloadJsonLabel: "Payload (JSON)",
secretLabel: "Secret / Key",
showSecretLabel: "Show",
hideSecretLabel: "Hide",
tokenOutputLabel: "Token Output",
sendToDecoderBtn: "Test in Decoder",
invalidHeaderJson: "Invalid JSON in header",
invalidPayloadJson: "Invalid JSON in payload",
generateEmptyState: "Fill in the form to generate a token"
```

---

## 1.3 CSS → Tailwind Converter — NEW (`/css-tailwind`)

**Why:** High SEO value ("css to tailwind"), unique in the DevDeck catalog, useful for React/Next.js devs daily.

### Category
`developer`

### UX Layout
```
┌──────────────────────────────┬───────────────────────────────┐
│  CSS INPUT                   │  TAILWIND OUTPUT              │
│  ──────────────────────      │  ──────────────────────       │
│  .btn {                      │  flex items-center            │
│    display: flex;            │  justify-center               │
│    align-items: center;      │  px-4 py-2                    │
│    padding: 8px 16px;        │  rounded-lg                   │
│    border-radius: 8px;       │  font-bold                    │
│    font-weight: 700;         │  text-white                   │
│    color: #fff;              │  bg-[#22cc99]                 │
│  }                           │  /* gap: 12px — no mapping */ │
│  ──────────────────────      │  ──────────────────────       │
│  [Clear]                     │  [Copy]     [Stats]           │
└──────────────────────────────┴───────────────────────────────┘
```

### Implementation Details
- **Parser:** Custom CSS property tokenizer — extract property:value pairs from input (handle multi-rule, nested comments, pseudo-selectors)
- **Mapping table:** ~120 CSS property → Tailwind class mappings covering:
  - Spacing: `margin`, `padding` → `m-`, `p-` with size scale
  - Layout: `display`, `flex-*`, `grid-*`, `position`
  - Typography: `font-*`, `text-*`, `line-height`
  - Colors: `color`, `background-color` → named Tailwind colors or `bg-[hex]` / `text-[hex]` JIT syntax
  - Borders: `border-*`, `border-radius`
  - Sizing: `width`, `height`, `min-*`, `max-*`
  - Shadows, transitions, opacity
- **Unmapped properties:** Output as `/* property: value — no Tailwind class */` comment in gray
- **Stats badge:** Show "X mapped / Y total" counts in the output action bar
- **Copy button:** Copies only the class list (no comments), cleaned for direct use in JSX `className`
- **LocalBadge:** Yes — pure in-browser
- **Icon:** `Brush` from MUI

### New Files
- `src/components/CSSToTailwind/index.js`
- `src/components/CSSToTailwind/cssToTailwindMap.js` (the mapping table)
- `src/components/CSSToTailwind/cssParser.js` (tokenizer)

### Localization Keys
```js
cssToTailwind: {
  pageTitle: "CSS → Tailwind",
  cssInputLabel: "CSS Input",
  tailwindOutputLabel: "Tailwind Classes",
  cssInputPlaceholder: ".selector {\n  display: flex;\n  padding: 16px;\n}",
  copyClassesBtn: "Copy Classes",
  copyAllBtn: "Copy All",
  statsLabel: "[MAPPED] / [TOTAL] properties mapped",
  unmappedComment: "no Tailwind class",
  emptyStateMessage: "Paste CSS above to convert to Tailwind"
}
```

---

## 1.4 Smart Formatter — NEW (`/smart-formatter`)

**Why:** The `inputDetector.js` and `smartInput` localization already exist — this is the dedicated UI that exposes them as a tool. Drives discovery of other tools.

### Category
`utilities`, badge: `"smart"`

### UX Layout
```
┌───────────────────────────────────────────────────────────────┐
│  SMART INPUT                                           [LOCAL] │
│  ─────────────────────────────────────────────────────────    │
│  [Paste anything — JSON, JWT, Base64, URL, timestamp…]       │
│                                                               │
│  ● JSON detected                                              │
│  ─────────────────────────────────────────────────────────    │
│  FORMATTED OUTPUT                                             │
│  {                                                            │
│    "id": 42,                                                  │
│    "name": "Alice"                                            │
│  }                                                            │
│  ─────────────────────────────────────────────────────────    │
│  [Copy]  [Open in JSON Viewer →]  [Clear]                     │
└───────────────────────────────────────────────────────────────┘
```

### Implementation Details
- **Single input:** Large `CodeArea` with prominent paste placeholder. Auto-triggers on every keystroke (debounced 200ms)
- **Detection engine:** Uses existing `detectInputType()` — extend to also detect: YAML (`key: value` pattern), Unix timestamps (10/13 digit numbers), CSV (comma + newline structure), HTML (starts with `<`)
- **Detected type badge:** Colored `Badge` (same pattern as JWT Decoder's BadgeRow) showing detected type + confidence
- **Formatted output:** Switch on detected type:
  - JSON → `JSON.stringify(parsed, null, 2)` with error line highlighted
  - Base64 → decoded UTF-8 text (or "binary — cannot display" for non-text)
  - JWT → decoded header + payload JSON blocks
  - URL → broken-down params table
  - Unix timestamp → human-readable date + timezone
  - CSV → row/column count + first 3 rows preview
  - YAML → converted JSON
  - HTML → pretty-printed with indentation
  - Unknown → raw text with character count
- **Actions:** Copy formatted output, "Open in [Tool]" button that routes to the best tool with prefill via `ToolChainContext`
- **LocalBadge:** Yes — pure in-browser
- **Icon:** `AutoFixHigh` from MUI

### New Files
- `src/components/SmartFormatter/index.js`

### Localization Keys
(extend existing `smartInput` section or create `smartFormatter`)
```js
smartFormatter: {
  pageTitle: "Smart Formatter",
  inputPlaceholder: "Paste anything — JSON, JWT, Base64, URL, timestamp…",
  detectedLabel: "detected",
  openInToolBtn: "Open in [TOOL] →",
  noDetectionLabel: "Unknown format",
  formattedOutputLabel: "Formatted Output",
  emptyStateMessage: "Paste any data above — we'll format and identify it",
  binaryDataLabel: "Binary data — cannot display as text",
  copyFormattedBtn: "Copy Formatted"
}
```

---

# Phase 2 — Differentiation
**Timeline: ~3 weeks | Goal: Tools that set DevDeck apart from generic toolboxes**

---

## 2.1 Encoder / Decoder Hub — NEW (`/encoder-decoder`)

**Why:** Base64 Text covers one encoding. This hub covers the full spectrum — a reference tool devs bookmark permanently.

### Category
`encoding`, badge: `"new"`

### UX Layout
Six tabs: `Base64` | `URL` | `HTML Entities` | `Unicode Escape` | `Hex` | `Binary`

Each tab has identical internal layout:
```
┌─────────────────────────────┬──────────────────────────────┐
│  [Encode] [Decode]          │                              │
│  ─────────────────          │  OUTPUT                      │
│  INPUT                      │  ─────────────────────       │
│  [CodeArea]                 │  [CodeArea readonly]         │
│  ─────────────────          │  ─────────────────────       │
│  [Clear] [Paste]            │  [Copy] [Chain →]            │
└─────────────────────────────┴──────────────────────────────┘
```

### Per-Tab Implementation
| Tab | Encode | Decode |
|---|---|---|
| Base64 | `btoa()` | `atob()` |
| URL | `encodeURIComponent()` | `decodeURIComponent()` |
| HTML Entities | Replace `<>&"'` + extended chars | Parse HTML entities |
| Unicode Escape | `\uXXXX` sequences | Unescape `\uXXXX` |
| Hex | UTF-8 bytes → hex pairs | Hex pairs → UTF-8 |
| Binary | UTF-8 bytes → 8-bit binary | Binary string → UTF-8 |

- Real-time encoding/decoding (debounced 200ms)
- Error states: invalid Base64 → red error badge inline
- `LocalBadge` on all tabs
- Keep `/base64-text` route working — no breaking change
- Chain output to Hash Generator, JSON Viewer

### New Files
- `src/components/EncoderDecoder/index.js`

### Localization Keys
```js
encoderDecoder: {
  pageTitle: "Encoder / Decoder",
  base64Tab: "Base64",
  urlTab: "URL",
  htmlEntitiesTab: "HTML Entities",
  unicodeTab: "Unicode",
  hexTab: "Hex",
  binaryTab: "Binary",
  encodeMode: "Encode",
  decodeMode: "Decode",
  inputLabel: "Input",
  outputLabel: "Output",
  emptyStateMessage: "Enter text above to encode or decode"
}
```

---

## 2.2 JSON Schema Validator — EXPAND JSON Viewer (`/json-viewer`)

**Why:** JSON Viewer already validates syntax. Adding schema validation is one tab away from a complete JSON development tool.

### Change
Add a third tab "Schema" to the existing `TabStrip` in JSON Viewer (alongside existing Editor and Viewer tabs).

### Schema Tab Layout
```
┌──────────────────────────────┬───────────────────────────────┐
│  JSON DATA                   │  VALIDATION RESULT            │
│  ──────────────────────      │  ──────────────────────       │
│  (reuse editor state)        │  ● Valid  /  ✕ 2 errors       │
│                              │  ──────────────────────       │
│  JSON SCHEMA                 │  Line 3: "name" is required   │
│  ──────────────────────      │  Line 7: must be integer       │
│  [CodeArea]                  │                               │
│  ──────────────────────      │                               │
│  [Validate]                  │                               │
└──────────────────────────────┴───────────────────────────────┘
```

### Implementation Details
- **Library:** `ajv` (Ajv JSON schema validator) — install as dependency
- **JSON data panel:** Shared with Editor tab state — no re-input needed
- **Schema panel:** Separate `CodeArea` with schema template pre-loaded
- **Validation result:** Formatted error list with path + message. Each error is a colored row (red bg tint). Valid state shows large green checkmark badge
- **Schema templates:** Dropdown to load common schema templates (empty object, user profile, API response)
- **No new route** — transparent enhancement to existing tool

### New Localization Keys (append to `jsonViewer`)
```js
schemaTab: "Schema",
schemaInputLabel: "JSON Schema",
jsonDataLabel: "JSON Data",
validateBtn: "Validate",
validLabel: "Valid",
invalidLabel: "Invalid",
errorsLabel: "[N] error(s)",
schemaPlaceholder: '{\n  "$schema": "http://json-schema.org/draft-07/schema",\n  "type": "object"\n}',
schemaEmptyState: "Enter JSON data and a schema to validate"
```

---

## 2.3 HTML → JSX Converter — NEW (`/html-jsx`)

**Why:** React devs constantly paste HTML from design tools and need to fix `class` → `className`, inline styles, etc. Unique to DevDeck.

### Category
`developer`

### UX Layout
```
┌──────────────────────────────┬───────────────────────────────┐
│  HTML INPUT                  │  JSX OUTPUT                   │
│  ──────────────────────      │  ──────────────────────       │
│  <div class="card"           │  <div className="card"        │
│    style="color: red">       │    style={{ color: "red" }}>  │
│    <label for="name">        │    <label htmlFor="name">     │
│      Name                    │      Name                     │
│    </label>                  │    </label>                   │
│  </div>                      │  </div>                       │
│  ──────────────────────      │  ──────────────────────       │
│  [Clear] [Paste]             │  [Copy JSX]                   │
└──────────────────────────────┴───────────────────────────────┘
```

### Implementation Details
- **Pure JS transformer** — no external library:
  - `class` → `className`
  - `for` → `htmlFor`
  - `tabindex` → `tabIndex`
  - `onclick`, `onchange`, etc. → camelCase equivalents
  - `style="color: red; font-size: 14px"` → `style={{ color: "red", fontSize: "14px" }}`
  - `<br>`, `<img>`, `<input>`, `<hr>` → self-closing `<br />`, `<img />`
  - Boolean attributes: `disabled` → `disabled={true}`
  - `<!--comment-->` → `{/* comment */}`
  - Remove `xmlns` attributes
- **Real-time conversion** (debounced 200ms)
- **Error handling:** Invalid HTML → yellow warning badge, partial conversion shown
- **LocalBadge:** Yes
- **Icon:** `IntegrationInstructions` from MUI
- **Chain output:** HTML output → chain to other tools

### New Files
- `src/components/HTMLToJSX/index.js`
- `src/components/HTMLToJSX/htmlToJsxTransformer.js`

### Localization Keys
```js
htmlToJsx: {
  pageTitle: "HTML → JSX",
  htmlInputLabel: "HTML Input",
  jsxOutputLabel: "JSX Output",
  htmlInputPlaceholder: "<div class=\"container\">\n  <p>Hello World</p>\n</div>",
  copyJsxBtn: "Copy JSX",
  emptyStateMessage: "Paste HTML above to convert to JSX",
  partialConversionWarning: "HTML may be malformed — conversion is partial"
}
```

---

## 2.4 UUID Tools — EXPAND UUID Generator (`/uuid-generator`)

**Why:** UUID Generator already exists. An Inspector tab makes it a complete UUID workbench. Zero new routing.

### Change
Add an "Inspect" tab alongside existing Generate tab in UUID Generator.

### Inspector Tab Layout
```
┌──────────────────────────────────────────────────────────────┐
│  UUID INPUT                                                  │
│  ──────────────────────────────────────────────────────      │
│  [550e8400-e29b-41d4-a716-446655440000________________]      │
│  ──────────────────────────────────────────────────────      │
│  Badges: ● v4 · Random · Valid · Standard form               │
│  ──────────────────────────────────────────────────────      │
│  DETAILS                                                     │
│  Version      v4 (Random)                                    │
│  Variant      RFC 4122                                       │
│  Format       Standard (lowercase, hyphens)                  │
│  Nil UUID?    No                                             │
│  Max UUID?    No                                             │
└──────────────────────────────────────────────────────────────┘
```

### Implementation Details
- **UUID input:** Single `InputArea` line — auto-validates on change
- **Version detection:** Parse bits 12-15 of time_hi field for version (1–5)
- **v1 extras:** Extract timestamp → display as ISO date, show clock sequence, note MAC address field
- **v4:** Confirm random (variant bits check)
- **v3/v5:** Note namespace-based, show namespace hint
- **Nil UUID:** `00000000-0000-0000-0000-000000000000` → special badge
- **Max UUID:** `ffffffff-ffff-ffff-ffff-ffffffffffff` → special badge
- **Format normalization:** Show uppercase/lowercase/no-hyphens variants with copy buttons
- **Validation badge:** Large green ✓ Valid / red ✕ Invalid badge
- **Library:** Manual bit parsing (no library) — UUID structure is simple enough

### New Localization Keys (append to `uuidGenerator`)
```js
generateTab: "Generate",
inspectTab: "Inspect",
uuidInputLabel: "UUID to Inspect",
uuidInputPlaceholder: "550e8400-e29b-41d4-a716-446655440000",
validLabel: "Valid",
invalidLabel: "Invalid UUID",
versionLabel: "Version",
variantLabel: "Variant",
formatLabel: "Format",
nilLabel: "Nil UUID",
maxLabel: "Max UUID",
detailsLabel: "Details",
normalizedLabel: "Normalized Forms",
upperCaseLabel: "Uppercase",
lowerCaseLabel: "Lowercase",
noHyphensLabel: "No Hyphens"
```

---

# Phase 3 — Wow Features
**Timeline: ~4 weeks | Goal: Features that make DevDeck memorable and shareable**

---

## 3.1 Regex Toolkit — EXPAND Regex Tester (`/regex-tester`)

**Why:** Regex Tester already has a solid UI. A Generator tab turns it into a complete regex workstation. Differentiated from every other toolbox.

### Change
Add a "Generate" tab alongside existing Tester tab.

### Generator Tab Layout
```
┌──────────────────────────────────────────────────────────────┐
│  DESCRIBE IN PLAIN ENGLISH                                   │
│  ──────────────────────────────────────────────────────      │
│  [email address___________________________________________]  │
│                                                              │
│  Common patterns: [Email] [Phone] [URL] [Date] [IP] [UUID]  │
│  ──────────────────────────────────────────────────────      │
│  GENERATED REGEX                                             │
│  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/        │
│  ──────────────────────────────────────────────────────      │
│  EXPLANATION                                                 │
│  ^ — start of string                                         │
│  [a-zA-Z0-9._%+-]+ — one or more valid email chars          │
│  @ — literal @ symbol                                        │
│  …                                                           │
│  ──────────────────────────────────────────────────────      │
│  [Copy Regex]  [Test it →]                                   │
└──────────────────────────────────────────────────────────────┘
```

### Implementation Details
- **Approach:** Curated deterministic map of ~60 common pattern descriptions → regex + human explanation. No AI or network call needed for v1. Covers the 90% case.
- **Pattern library** (initial set):
  - Email, phone (US/intl), URL, domain, IP (v4/v6), MAC address
  - Date formats (YYYY-MM-DD, MM/DD/YYYY, DD.MM.YYYY)
  - Time (HH:mm, 12h/24h)
  - Credit card (16 digits, spaced/unspaced)
  - UUID (v4), slugs, hashtags, Twitter/X handles
  - Hex colors (#RGB/#RRGGBB), CSS units
  - Postal codes (US ZIP, UK, CA)
  - Semantic version (v1.2.3), Git commit SHA
- **Fuzzy match:** Use existing `fuzzySearch` utility to match user's description to pattern keys
- **Explanation:** Per-segment explanation shown as a list with `code` snippets
- **Quick-select chips:** Common patterns shown as clickable chips below input
- **"Test it →" button:** Uses `useToolChain` to send generated regex → Tester tab with prefill
- **Copy Regex:** Copies `/pattern/flags` format

### New Localization Keys (append to `regexTester`)
```js
generateTab: "Generate",
testerTab: "Tester",
descriptionInputLabel: "Describe the pattern",
descriptionPlaceholder: "e.g. email address, phone number, URL…",
generatedRegexLabel: "Generated Regex",
explanationLabel: "Explanation",
commonPatternsLabel: "Common Patterns",
copyRegexBtn: "Copy Regex",
testItBtn: "Test it →",
noPatternMatch: "No matching pattern — try a more specific description",
emptyStateMessage: "Describe what you want to match"
```

---

## 3.2 Command Playground — NEW (`/command-playground`)

**Why:** A dedicated discovery layer for DevDeck tools. The Command Palette (Cmd+K) is for navigation; the Playground is for data-first discovery. Different use case. Drives exploration.

### Category
`utilities`, badge: `"wow"`

### UX Layout
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│             Paste anything. We'll know what to do.            │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Paste JSON, JWT, URL, Base64, timestamp, CSS, UUID…     │ │
│  │                                                          │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  SUGGESTIONS                                                   │
│  ──────────────────────────────────────────────────────────   │
│  ● JSON Viewer           ████████░░  89% match  [Open →]      │
│  ● Smart Formatter       ██████░░░░  67% match  [Open →]      │
│  ● YAML ↔ JSON           ████░░░░░░  40% match  [Open →]      │
│                                                                │
│  RECENTLY USED                                                 │
│  [JWT Decoder]  [JSON Viewer]  [Hash Generator]               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Implementation Details
- **Large textarea:** Centered, prominent, full-width `CodeArea` with the paste-anything message
- **Detection pipeline:** On input change (debounced 300ms):
  1. Run `detectInputType()` → primary match
  2. Run `fuzzySearch()` on the raw text against all tool descriptions → secondary matches
  3. Score and rank top 3 suggestions
- **Suggestion rows:** Tool name, icon, confidence progress bar (color-coded: >80% green, 50-80% yellow, <50% gray), "Open →" button
- **Open in tool:** `history.push(route, { prefill: inputText })` — tool receives pre-filled input via `location.state.prefill` (already supported by JWT Decoder and others)
- **Recently used:** Read from `storage.getRecentTools()` — shown as clickable chip pills
- **Empty state (on load):** Animated prompt showing rotating examples: "Try pasting a JWT…" → "Try a URL…" → "Try JSON data…"
- **LocalBadge:** Yes — all detection is client-side
- **Icon:** `Terminal` from MUI

### New Files
- `src/components/CommandPlayground/index.js`

### Localization Keys
```js
commandPlayground: {
  pageTitle: "Command Playground",
  headline: "Paste anything. We'll know what to do.",
  inputPlaceholder: "Paste JSON, JWT, URL, Base64, timestamp, CSS, UUID…",
  suggestionsLabel: "Suggestions",
  recentlyUsedLabel: "Recently Used",
  openBtn: "Open →",
  matchLabel: "match",
  noSuggestionsMessage: "No suggestions yet — paste some data above",
  emptyStateHint: "Try pasting a JWT token, a JSON object, or a URL"
}
```

---

## 3.3 Tool Chaining — ENHANCE VISIBILITY (no new route)

**Why:** `ToolChainContext.js` is fully implemented but invisible to users. Making chaining discoverable is a Phase 3 differentiator.

### Changes (no new component files needed)

**3.3.1 Wire SendToButton to more tools:**
- API Request Builder → JSON Viewer, Smart Formatter
- Smart Formatter → detected tool
- Encoder/Decoder → Hash Generator, JSON Viewer
- HTML → JSX → (none, terminal tool)
- Text Diff → (none)

**3.3.2 Chain indicator in header:**
- When `toolChain` is set (i.e., a tool has chained output), show a subtle breadcrumb pill in the Header: `"JSON Viewer ← API Builder"` using a small `Chip` with ChevronRight separators
- Clear indicator: small `×` on the chip calls `clearChain()`
- Add to `src/components/Header/index.js`

**3.3.3 Chain History in SmartFormatter:**
- The Smart Formatter "Open in Tool" button is the most prominent chaining trigger — ensure it feeds `ToolChainContext` so the target tool receives `prefill` on mount

**3.3.4 Documentation:**
- Add a `Tooltip` to `SendToButton` with text "Send output to another tool" for discoverability

---

# Implementation Order Within Each Phase

### Phase 1 Sequence (do in this order to minimize conflicts)
1. **Add `developer` category** to `TOOL_CATEGORIES` in `globalConstants.js`
2. **Smart Formatter** — depends only on `inputDetector.js` (already exists), lowest risk
3. **JWT Toolkit expansion** — modify existing component, add `jose` dependency
4. **CSS → Tailwind** — self-contained, new component
5. **API Request Builder** — self-contained, new component, most complex

### Phase 2 Sequence
1. **UUID Inspector** — expand existing, zero-risk
2. **JSON Schema Validator** — add tab to existing JSON Viewer, add `ajv` dependency
3. **HTML → JSX** — new self-contained component
4. **Encoder/Decoder Hub** — new component, most standalone

### Phase 3 Sequence
1. **Tool Chaining visibility** — quick wins, enhances all Phase 1+2 tools
2. **Regex Generator** — expand existing, moderate effort
3. **Command Playground** — most complex, depends on all detection + routing being solid

---

# Dependencies to Add

| Package | Used By | Why |
|---|---|---|
| `jose` | JWT Toolkit Generator | Pure JS JOSE — signing HS256/HS384/HS512/RS256 in browser |
| `ajv` | JSON Schema Validator | Industry-standard JSON schema validator, tree-shakes well |

No other new dependencies required — all other conversions use browser-native APIs or pure JS.

---

# Category Update

Add to `TOOL_CATEGORIES` in `globalConstants.js`:
```js
{ id: "developer", label: "Developer Tools", color: "#e91e63" }
```

New tools in `developer` category: API Request Builder, CSS→Tailwind, HTML→JSX

---

# SEO Surface Area Added

| Route | Title | Primary Keywords |
|---|---|---|
| `/api-builder` | API Request Builder | api tester, http client, test api online |
| `/css-tailwind` | CSS → Tailwind | css to tailwind converter, tailwind classes |
| `/smart-formatter` | Smart Formatter | format json online, auto format code |
| `/encoder-decoder` | Encoder / Decoder | base64 url html encode decode online |
| `/html-jsx` | HTML → JSX | html to jsx converter, react jsx |
| `/command-playground` | Command Playground | developer tools playground |

Expansions that boost existing pages' keywords:
- `/jwt-decoder` gains "jwt generator", "jwt sign online"
- `/uuid-generator` gains "uuid validator", "uuid inspector"
- `/json-viewer` gains "json schema validator online"
- `/regex-tester` gains "regex generator", "generate regex from text"

---

# Success Metrics

- **Phase 1 target:** API Builder and CSS→Tailwind become top-5 most-visited tools within 30 days of launch
- **Phase 2 target:** Encoder/Decoder Hub surpasses Base64 Text in daily unique usage
- **Phase 3 target:** Command Playground is used as an entry point by >15% of sessions
- **Cross-phase:** Tool Chaining usage (SendToButton clicks) appears in analytics — target >5% of tool sessions include a chain action
- **Return users:** Weekly active users +20% by end of Phase 3
- **SEO:** 6 new routes indexed; existing expanded tools see keyword count increase

---

## Vision

DevDeck = a smart, premium developer workspace where tools talk to each other and data finds its own home.
