import { useCallback, useState } from "react";

const MAX_ITEMS = 10;
const PREFIX = "@devdeck:history:";

function readFromStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(PREFIX + key) || "[]");
    } catch {
        return [];
    }
}

function writeToStorage(key, items) {
    try {
        localStorage.setItem(PREFIX + key, JSON.stringify(items));
    } catch {
        // ignore storage errors
    }
}

/**
 * M6 — Per-tool history.
 * @param {string} toolId  Unique key for this tool (e.g. "hash-generator")
 * @param {number} maxItems Max history entries to keep
 * @returns {{ history: Array, addHistory: Function, clearHistory: Function }}
 */
export function useToolHistory(toolId, maxItems = MAX_ITEMS) {
    const [history, setHistory] = useState(() => readFromStorage(toolId));

    const addHistory = useCallback(
        (entry) => {
            if (!entry || String(entry).trim() === "") return;
            setHistory((prev) => {
                const deduplicated = [entry, ...prev.filter((e) => e !== entry)].slice(0, maxItems);
                writeToStorage(toolId, deduplicated);
                return deduplicated;
            });
        },
        [toolId, maxItems]
    );

    const clearHistory = useCallback(() => {
        writeToStorage(toolId, []);
        setHistory([]);
    }, [toolId]);

    return { history, addHistory, clearHistory };
}
