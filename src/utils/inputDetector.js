/**
 * Detect the semantic type of pasted input and return the best matching tool.
 *
 * @param {string} text
 * @returns {{ type: string, label: string, route: string } | null}
 */
export function detectInputType(text) {
    const trimmed = (text || "").trim();

    // Need at least 8 chars to be worth detecting
    if (trimmed.length < 8) return null;

    // ── JWT ──────────────────────────────────────────────────────────────────
    // Three dot-separated base64url segments, first starts with "eyJ" ({"...)
    const jwtParts = trimmed.split(".");
    if (jwtParts.length === 3 && /^eyJ/i.test(jwtParts[0]) && jwtParts.every((p) => /^[A-Za-z0-9_-]+=*$/.test(p))) {
        return { type: "jwt", label: "JWT Token", route: "/jwt-decoder" };
    }

    // ── JSON ─────────────────────────────────────────────────────────────────
    if (/^\s*[{[]/.test(trimmed)) {
        try {
            JSON.parse(trimmed);
            return { type: "json", label: "JSON", route: "/json-viewer" };
        } catch {
            if (trimmed.length > 20) {
                return { type: "json", label: "JSON (malformed)", route: "/json-viewer" };
            }
        }
    }

    // ── URL ──────────────────────────────────────────────────────────────────
    if (/^https?:\/\//i.test(trimmed)) {
        return { type: "url", label: "URL", route: "/url-validator" };
    }

    // ── UUID ─────────────────────────────────────────────────────────────────
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) {
        return { type: "uuid", label: "UUID", route: "/uuid-generator" };
    }

    // ── Hash (hex string of known length) ────────────────────────────────────
    if (/^[0-9a-f]+$/i.test(trimmed)) {
        const len = trimmed.length;
        if (len === 32) return { type: "hash", label: "MD5 Hash", route: "/hash-generator" };
        if (len === 40) return { type: "hash", label: "SHA-1 Hash", route: "/hash-generator" };
        if (len === 64) return { type: "hash", label: "SHA-256 Hash", route: "/hash-generator" };
        if (len === 128) return { type: "hash", label: "SHA-512 Hash", route: "/hash-generator" };
    }

    // ── Base64 ───────────────────────────────────────────────────────────────
    // Standard base64: A-Z a-z 0-9 + / with = padding, length multiple of 4
    if (trimmed.length > 20 && trimmed.length % 4 === 0 && /^[A-Za-z0-9+/]+=*$/.test(trimmed)) {
        return { type: "base64", label: "Base64", route: "/base64-text" };
    }

    return null;
}
