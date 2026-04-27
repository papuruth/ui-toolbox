import { useState, useCallback } from "react";

/**
 * Returns `{ copied, copy }`.
 * `copy(text)` writes to clipboard and flips `copied` true for `timeout` ms.
 */
export function useCopyWithAnimation(timeout = 1500) {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(
        async (text) => {
            try {
                await window.navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), timeout);
                return true;
            } catch {
                return false;
            }
        },
        [timeout]
    );

    return { copied, copy };
}
