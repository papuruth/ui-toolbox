import { GLOBAL_CONSTANTS } from "utils/globalConstants";
import storage from "utils/storage";

// ── Per-tool keyword arrays ───────────────────────────────────────────────────
const TOOL_KEYWORDS = {
    "/base64-image": ["base64", "image", "encode", "decode", "picture", "photo", "convert"],
    "/qr-generator": ["qr", "code", "qrcode", "generate", "scan", "barcode"],
    "/image-resizer": ["image", "resize", "crop", "scale", "rotate", "canvas", "photo"],
    "/aspect-ratio-calculator": ["aspect", "ratio", "width", "height", "dimension", "resolution"],
    "/base64-text": ["base64", "text", "encode", "decode", "string", "cipher", "convert"],
    "/url-validator": ["url", "http", "status", "validate", "link", "check", "http", "https"],
    "/url-shortener": ["url", "shorten", "short", "link", "tinyurl", "compact"],
    "/json-viewer": ["json", "format", "validate", "tree", "viewer", "parse", "pretty", "object"],
    "/password-tools": ["password", "generate", "strength", "secure", "random", "entropy"],
    "/color-converter": ["color", "hex", "rgb", "hsl", "palette", "picker", "convert"],
    "/text-case": ["text", "case", "upper", "lower", "camel", "snake", "title", "convert"],
    "/hash-generator": ["hash", "md5", "sha", "sha256", "sha512", "checksum", "digest", "encrypt"],
    "/regex-tester": ["regex", "regexp", "pattern", "test", "match", "expression", "rule"],
    "/jwt-decoder": ["jwt", "token", "decode", "auth", "bearer", "payload", "header", "json web"],
    "/uuid-generator": ["uuid", "guid", "unique", "id", "generate", "v4"],
    "/timestamp": ["timestamp", "unix", "date", "time", "convert", "epoch", "datetime"],
    "/number-base": ["number", "binary", "hex", "octal", "decimal", "base", "convert"],
    "/yaml-json": ["yaml", "json", "convert", "transform", "markup"],
    "/text-diff": ["diff", "compare", "text", "difference", "changes"],
    "/lorem-ipsum": ["lorem", "ipsum", "placeholder", "dummy", "text", "generate", "filler"],
    "/word-counter": ["word", "count", "character", "sentence", "paragraph", "reading", "analyze"],
    "/csv-json": ["csv", "json", "convert", "table", "parse", "spreadsheet", "data"]
};

// ── Enriched tools (OPERATIONS_ITEMS + keywords + kind) ──────────────────────
export const ENRICHED_TOOLS = GLOBAL_CONSTANTS.OPERATIONS_ITEMS.map((tool) => ({
    ...tool,
    kind: "tool",
    keywords: TOOL_KEYWORDS[tool.route] || []
}));

// ── Generate UUID (no external dep) ──────────────────────────────────────────
function generateUUID() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = Math.floor(Math.random() * 16);
        return (c === "x" ? r : (r % 4) + 8).toString(16);
    });
}

// ── Inline actions ────────────────────────────────────────────────────────────
// Pass callbacks so actions can close the palette and navigate.
export function buildActions({ onClose, navigateTo }) {
    return [
        {
            id: "generate-uuid",
            label: "Generate UUID",
            description: "Generate a UUID v4 and copy to clipboard",
            kind: "action",
            category: "utilities",
            keywords: ["uuid", "guid", "unique", "id", "generate", "create", "copy"]
        },
        {
            id: "go-home",
            label: "Go to Home",
            description: "Navigate back to the home page",
            kind: "action",
            category: "navigation",
            keywords: ["home", "start", "main", "navigate", "go", "back"]
        }
    ].map((action) => ({
        ...action,
        run:
            action.id === "generate-uuid"
                ? () => {
                      const id = generateUUID();
                      navigator.clipboard.writeText(id).catch(() => {});
                      onClose();
                  }
                : () => navigateTo("/")
    }));
}

// ── Recent tools ─────────────────────────────────────────────────────────────
export function getRecentToolEntries() {
    return storage
        .getRecentTools()
        .map((route) => ENRICHED_TOOLS.find((t) => t.route === route))
        .filter(Boolean)
        .map((t) => ({ ...t, kind: "recent" }));
}

// ── Category emojis ───────────────────────────────────────────────────────────
export const CATEGORY_EMOJI = {
    image: "🖼️",
    encoding: "🔤",
    url: "🔗",
    utilities: "🛠️",
    action: "⚡",
    navigation: "🧭",
    recent: "🕘"
};
