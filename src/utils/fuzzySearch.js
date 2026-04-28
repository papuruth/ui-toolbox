/**
 * Score how well `query` matches `text` as a fuzzy subsequence.
 * Returns -1 when query is not a subsequence of text.
 * Higher score = better match.
 *
 * Scoring bonuses:
 *   - Exact equality         → 1000
 *   - text starts with query → 800
 *   - text contains query    → 600
 *   - Subsequence match      → sum of per-char bonuses
 *     - start-of-word char   → +10
 *     - consecutive char     → accumulating +5 per step
 *     - any other match      → +1
 */
export function fuzzyScore(text, query) {
    if (!query) return 0;
    const t = text.toLowerCase();
    const q = query.toLowerCase();

    if (t === q) return 1000;
    if (t.startsWith(q)) return 800;
    if (t.includes(q)) return 600;

    let score = 0;
    let qi = 0;
    let lastMatch = -1;
    let consecutive = 0;

    let i = 0;
    while (i < t.length && qi < q.length) {
        if (t[i] === q[qi]) {
            const isWordStart = i === 0 || t[i - 1] === " " || t[i - 1] === "-" || t[i - 1] === "_";
            const isConsecutive = i === lastMatch + 1;

            if (isWordStart) score += 10;

            if (isConsecutive) {
                consecutive += 5;
                score += consecutive;
            } else {
                consecutive = 0;
                score += 1;
            }

            lastMatch = i;
            qi += 1;
        }
        i += 1;
    }

    return qi === q.length ? score : -1;
}

/**
 * Return the character positions in `text` that match `query`.
 * Mirrors the strategy priority of fuzzyScore:
 *   contains  → contiguous range at the match index
 *   subsequence → greedy left-to-right positions
 * Returns [] when there is no match.
 */
export function fuzzyPositions(text, query) {
    if (!query || !text) return [];
    const t = text.toLowerCase();
    const q = query.toLowerCase();

    // Contiguous match (exact / startsWith / contains) — highlight the substring
    const idx = t.indexOf(q);
    if (idx !== -1) {
        return Array.from({ length: q.length }, (_, i) => idx + i);
    }

    // Subsequence — collect positions greedily
    const positions = [];
    let qi = 0;
    for (let i = 0; i < t.length && qi < q.length; i += 1) {
        if (t[i] === q[qi]) {
            positions.push(i);
            qi += 1;
        }
    }
    return qi === q.length ? positions : [];
}

/**
 * Filter and sort `items` by fuzzy match against multiple text fields.
 *
 * @param {Array}    items     - list of objects
 * @param {string}   query     - user query string
 * @param {Function} getFields - (item) => string[]  — fields to score against
 * @returns {Array} items that match, sorted best-first
 */
export function fuzzyFilter(items, query, getFields) {
    if (!query.trim()) return items;

    return items
        .map((item) => {
            const fields = getFields(item);
            const score = Math.max(...fields.map((f) => fuzzyScore(f || "", query)));
            return { item, score };
        })
        .filter(({ score }) => score >= 0)
        .sort((a, b) => b.score - a.score)
        .map(({ item }) => item);
}

/**
 * Like fuzzyFilter, but also returns score and label highlight positions for each item.
 * Positions are computed against the first field returned by getFields (the label).
 *
 * @param {Array}    items     - list of objects
 * @param {string}   query     - user query string
 * @param {Function} getFields - (item) => string[]  — first field is used for highlight positions
 * @returns {{ item, score: number, positions: number[] }[]} sorted best-first
 */
export function fuzzyFilterWithPositions(items, query, getFields) {
    if (!query.trim()) return items.map((item) => ({ item, score: 0, positions: [] }));

    const t0 = process.env.NODE_ENV === "development" ? performance.now() : 0;

    const result = items
        .map((item) => {
            const fields = getFields(item);
            const scores = fields.map((f) => fuzzyScore(f || "", query));
            const score = Math.max(...scores);
            // Always compute highlight positions against the label (first field)
            const positions = score >= 0 ? fuzzyPositions(fields[0] || "", query) : [];
            return { item, score, positions };
        })
        .filter(({ score }) => score >= 0)
        .sort((a, b) => b.score - a.score);

    if (process.env.NODE_ENV === "development") {
        const elapsed = performance.now() - t0;
        if (elapsed > 16) {
            // eslint-disable-next-line no-console
            console.warn(`[fuzzySearch] ${elapsed.toFixed(1)}ms for ${items.length} items — target is <16ms`);
        }
    }

    return result;
}
