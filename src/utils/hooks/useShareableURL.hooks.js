import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import toast from "utils/toast";

/**
 * M8 — Shareable URLs.
 * Encodes tool state into URL search params as base64.
 * @param {string} paramKey  The URL search param name (default "data")
 * @returns {{ initialValue: string|null, shareURL: Function }}
 */
export function useShareableURL(paramKey = "data") {
    const location = useLocation();

    const initialValue = useMemo(() => {
        const params = new URLSearchParams(location.search);
        const encoded = params.get(paramKey);
        if (!encoded) return null;
        try {
            return atob(encoded);
        } catch {
            return null;
        }
    }, [location.search, paramKey]);

    const shareURL = useCallback(
        (value) => {
            try {
                const encoded = btoa(String(value));
                const url = new URL(window.location.href);
                url.searchParams.set(paramKey, encoded);
                const shareableURL = url.toString();
                navigator.clipboard.writeText(shareableURL).then(() => {
                    toast.success("Shareable link copied!");
                });
            } catch {
                toast.error("Failed to generate shareable link.");
            }
        },
        [paramKey]
    );

    return { initialValue, shareURL };
}
