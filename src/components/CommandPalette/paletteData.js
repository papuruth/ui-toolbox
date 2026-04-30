import React from "react";
import { ContentCopy, DeleteOutline, Fingerprint, Home } from "@mui/icons-material";
import { GLOBAL_CONSTANTS } from "utils/globalConstants";
import storage from "utils/storage";

const ACTION_ICON_SX = { fontSize: "1.1rem" };

// ── Per-tool keyword arrays ───────────────────────────────────────────────────
const TOOL_KEYWORDS = {
    "/base64-image": ["base64", "image", "encode", "decode", "picture", "photo", "convert"],
    "/qr-generator": ["qr", "code", "qrcode", "generate", "scan", "barcode"],
    "/image-resizer": ["image", "resize", "crop", "scale", "rotate", "canvas", "photo"],
    "/aspect-ratio-calculator": ["aspect", "ratio", "width", "height", "dimension", "resolution"],
    "/base64-text": ["base64", "text", "encode", "decode", "string", "cipher", "convert"],
    "/url-validator": ["url", "http", "status", "validate", "link", "check", "http", "https"],
    "/url-shortener": ["url", "shorten", "short", "link", "short.io", "compact"],
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

// ── Blog guides (searchable in palette) ──────────────────────────────────────
export const BLOG_GUIDES = [
    {
        slug: "json-viewer",
        label: "JSON Viewer Guide",
        description: "How to format and validate JSON",
        keywords: ["json", "format", "guide", "blog", "viewer", "parse"]
    },
    {
        slug: "base64-text-encoder",
        label: "Base64 Encoding Guide",
        description: "Understand Base64 encoding and decoding",
        keywords: ["base64", "encode", "decode", "guide", "blog", "text"]
    },
    {
        slug: "regex-tester",
        label: "Regex Guide",
        description: "Learn regular expressions from scratch",
        keywords: ["regex", "regexp", "pattern", "guide", "blog", "match"]
    },
    {
        slug: "jwt-decoder",
        label: "JWT Decoded Guide",
        description: "How JSON Web Tokens work",
        keywords: ["jwt", "token", "auth", "guide", "blog", "decode"]
    },
    {
        slug: "password-generator",
        label: "Password Security Guide",
        description: "Create strong, secure passwords",
        keywords: ["password", "security", "guide", "blog", "generate"]
    },
    {
        slug: "hash-generator",
        label: "Hash Generator Guide",
        description: "MD5, SHA-256, SHA-512 explained",
        keywords: ["hash", "sha", "md5", "checksum", "guide", "blog"]
    },
    {
        slug: "uuid-generator",
        label: "UUID Generator Guide",
        description: "What is UUID and when to use it",
        keywords: ["uuid", "guid", "unique", "id", "guide", "blog"]
    },
    {
        slug: "timestamp-converter",
        label: "Timestamp Converter Guide",
        description: "Unix timestamps and date conversions",
        keywords: ["timestamp", "unix", "epoch", "date", "guide", "blog"]
    },
    {
        slug: "url-parser",
        label: "URL Parser Guide",
        description: "Anatomy of a URL explained",
        keywords: ["url", "parser", "href", "guide", "blog", "query"]
    },
    {
        slug: "color-converter",
        label: "Color Converter Guide",
        description: "HEX, RGB, HSL color formats",
        keywords: ["color", "hex", "rgb", "hsl", "guide", "blog"]
    },
    {
        slug: "text-diff-checker",
        label: "Text Diff Guide",
        description: "Compare text and find differences",
        keywords: ["diff", "compare", "text", "guide", "blog", "changes"]
    },
    {
        slug: "image-resizer",
        label: "Image Resizer Guide",
        description: "Resize images in the browser",
        keywords: ["image", "resize", "guide", "blog", "photo"]
    },
    {
        slug: "qr-code-generator",
        label: "QR Code Generator Guide",
        description: "Generate QR codes for any URL",
        keywords: ["qr", "code", "guide", "blog", "generate", "barcode"]
    },
    {
        slug: "csv-to-json-converter",
        label: "CSV to JSON Guide",
        description: "Convert spreadsheet data to JSON",
        keywords: ["csv", "json", "convert", "guide", "blog", "table"]
    },
    {
        slug: "yaml-to-json-converter",
        label: "YAML to JSON Guide",
        description: "Convert YAML configuration to JSON",
        keywords: ["yaml", "json", "convert", "guide", "blog"]
    },
    {
        slug: "number-base-converter",
        label: "Number Base Converter Guide",
        description: "Binary, hex, octal conversions",
        keywords: ["binary", "hex", "octal", "decimal", "guide", "blog"]
    },
    {
        slug: "lorem-ipsum-generator",
        label: "Lorem Ipsum Generator Guide",
        description: "Generate placeholder text",
        keywords: ["lorem", "ipsum", "placeholder", "guide", "blog"]
    },
    {
        slug: "word-counter",
        label: "Word Counter Guide",
        description: "Count words, characters, reading time",
        keywords: ["word", "count", "character", "guide", "blog"]
    },
    {
        slug: "text-case-converter",
        label: "Text Case Converter Guide",
        description: "camelCase, snake_case, Title Case",
        keywords: ["text", "case", "camel", "snake", "guide", "blog"]
    },
    {
        slug: "url-shortener",
        label: "URL Shortener Guide",
        description: "Shorten long URLs instantly",
        keywords: ["url", "shorten", "short", "guide", "blog"]
    },
    {
        slug: "aspect-ratio-calculator",
        label: "Aspect Ratio Guide",
        description: "Calculate image and screen ratios",
        keywords: ["aspect", "ratio", "width", "height", "guide", "blog"]
    },
    {
        slug: "base64-image-converter",
        label: "Base64 Image Guide",
        description: "Encode images to Base64 strings",
        keywords: ["base64", "image", "encode", "guide", "blog", "photo"]
    }
].map((g) => ({
    ...g,
    kind: "guide",
    route: `/blog/${g.slug}`,
    category: "guides"
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
            icon: <Fingerprint sx={ACTION_ICON_SX} />,
            keywords: ["uuid", "guid", "unique", "id", "generate", "create", "copy"]
        },
        {
            id: "go-home",
            label: "Go to Home",
            description: "Navigate back to the home page",
            kind: "action",
            category: "navigation",
            icon: <Home sx={ACTION_ICON_SX} />,
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

// ── Suggested tools (curated, shown in default state when no query) ───────────
export const SUGGESTED_TOOL_ROUTES = ["/json-viewer", "/jwt-decoder", "/uuid-generator", "/regex-tester", "/base64-text"];

export const SUGGESTED_TOOLS = SUGGESTED_TOOL_ROUTES.map((route) => ENRICHED_TOOLS.find((t) => t.route === route)).filter(Boolean);

// ── Recent tools (frequency × recency_decay ranked) ──────────────────────────
export function getRecentToolEntries() {
    const freq = storage.getToolFrequency();
    return storage
        .getRecentTools()
        .map((route, idx) => {
            const tool = ENRICHED_TOOLS.find((t) => t.route === route);
            if (!tool) return null;
            const frequency = freq[route] || 1;
            const recencyDecay = 1 / (idx + 1);
            return { ...tool, kind: "recent", _rankScore: frequency * recencyDecay };
        })
        .filter(Boolean)
        .sort((a, b) => b._rankScore - a._rankScore);
}

// ── Contextual suggestions (tools related to the current page) ────────────────
const RELATED_TOOLS = {
    "/json-viewer": ["/yaml-json", "/text-diff", "/jwt-decoder"],
    "/jwt-decoder": ["/json-viewer", "/base64-text", "/hash-generator"],
    "/base64-text": ["/base64-image", "/hash-generator", "/json-viewer"],
    "/base64-image": ["/image-resizer", "/base64-text"],
    "/regex-tester": ["/text-case", "/text-diff", "/word-counter"],
    "/yaml-json": ["/json-viewer", "/text-diff"],
    "/text-diff": ["/text-case", "/word-counter", "/regex-tester"],
    "/uuid-generator": ["/hash-generator", "/password-tools"],
    "/hash-generator": ["/uuid-generator", "/base64-text", "/password-tools"],
    "/url-validator": ["/url-shortener"],
    "/url-shortener": ["/url-validator", "/qr-generator"],
    "/timestamp": ["/number-base", "/uuid-generator"],
    "/number-base": ["/timestamp", "/hash-generator"],
    "/image-resizer": ["/base64-image", "/aspect-ratio-calculator"],
    "/aspect-ratio-calculator": ["/image-resizer"],
    "/qr-generator": ["/url-shortener", "/uuid-generator"],
    "/color-converter": ["/text-case"],
    "/password-tools": ["/hash-generator", "/uuid-generator"],
    "/text-case": ["/text-diff", "/word-counter", "/regex-tester"],
    "/word-counter": ["/text-diff", "/text-case", "/lorem-ipsum"],
    "/lorem-ipsum": ["/word-counter", "/text-case"],
    "/csv-json": ["/json-viewer", "/yaml-json"]
};

export function getRelatedToolEntries(currentRoute) {
    const routes = RELATED_TOOLS[currentRoute] || [];
    return routes.map((route) => ENRICHED_TOOLS.find((t) => t.route === route)).filter(Boolean);
}

// ── Command mode actions (only shown when user types ">") ─────────────────────
export function buildCommands({ onClose }) {
    return [
        {
            id: "cmd-clear-history",
            label: "Clear Recent History",
            description: "Remove all recently used tools from history",
            kind: "command",
            category: "command",
            icon: <DeleteOutline sx={{ fontSize: "1.1rem" }} />,
            keywords: ["clear", "history", "recent", "remove", "reset"],
            run: () => {
                storage.clearRecentTools();
                onClose();
            }
        },
        {
            id: "cmd-copy-url",
            label: "Copy Current URL",
            description: "Copy this page's URL to clipboard",
            kind: "command",
            category: "command",
            icon: <ContentCopy sx={{ fontSize: "1.1rem" }} />,
            keywords: ["copy", "url", "link", "clipboard", "page"],
            run: () => {
                navigator.clipboard.writeText(window.location.href).catch(() => {});
                onClose();
            }
        }
    ];
}

// ── Category emojis ───────────────────────────────────────────────────────────
export const CATEGORY_EMOJI = {
    image: "🖼️",
    encoding: "🔤",
    url: "🔗",
    utilities: "🛠️",
    action: "⚡",
    navigation: "🧭",
    recent: "🕘",
    command: "⌘",
    guides: "📘"
};
