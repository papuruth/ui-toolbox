import { Box, Chip, Paper, Typography } from "@mui/material";
import { StyledBoxContainer, StyledTextField } from "components/Shared/Styled-Components";
import localization from "localization";
import React, { useMemo, useState } from "react";

const { jwtDecoder: L } = localization;

function safeDecodeSegment(str) {
    try {
        const padded = str.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = atob(padded);
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

function formatRelative(unixSec) {
    const diff = unixSec - Math.floor(Date.now() / 1000);
    const abs = Math.abs(diff);
    if (abs < 60) return `${Math.abs(diff)}s`;
    if (abs < 3600) return `${Math.floor(abs / 60)}m`;
    if (abs < 86400) return `${Math.floor(abs / 3600)}h`;
    return `${Math.floor(abs / 86400)}d`;
}

export default function JWTDecoder() {
    const [token, setToken] = useState("");

    const { header, payload, error, badges } = useMemo(() => {
        if (!token.trim()) return { header: null, payload: null, error: "", badges: [] };
        const parts = token.trim().split(".");
        if (parts.length !== 3) return { header: null, payload: null, error: L.invalidJwtError, badges: [] };
        const h = safeDecodeSegment(parts[0]);
        const p = safeDecodeSegment(parts[1]);
        if (!h || !p) return { header: null, payload: null, error: L.decodeError, badges: [] };

        const now = Math.floor(Date.now() / 1000);
        const computed = [];

        if (h.alg) computed.push({ label: h.alg, color: "info" });

        if (p.exp) {
            const expired = now > p.exp;
            computed.push({
                label: expired ? `Expired ${formatRelative(p.exp)} ago` : `Expires in ${formatRelative(p.exp)}`,
                color: expired ? "error" : "success"
            });
        } else {
            computed.push({ label: "No Expiry", color: "warning" });
        }

        if (p.nbf && now < p.nbf) {
            computed.push({ label: `Not valid yet (in ${formatRelative(p.nbf)})`, color: "warning" });
        }
        if (p.iss) computed.push({ label: `iss: ${p.iss}`, color: "default" });
        if (p.sub) computed.push({ label: `sub: ${p.sub}`, color: "default" });

        return { header: h, payload: p, error: "", badges: computed };
    }, [token]);

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            <StyledTextField
                multiline
                rows={4}
                placeholder={L.placeholder}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                error={!!error}
                helperText={error || " "}
            />

            {badges.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {badges.map((b) => (
                        <Chip key={b.label} label={b.label} color={b.color} size="small" variant="outlined" />
                    ))}
                </Box>
            )}

            {header && (
                <Paper variant="outlined" sx={{ p: 2, background: "var(--bg-card)" }}>
                    <Typography variant="caption" fontWeight={600} color="primary.main">
                        {L.headerLabel}
                    </Typography>
                    <Typography
                        component="pre"
                        variant="body2"
                        sx={{ mt: 1, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                    >
                        {JSON.stringify(header, null, 2)}
                    </Typography>
                </Paper>
            )}
            {payload && (
                <Paper variant="outlined" sx={{ p: 2, background: "var(--bg-card)" }}>
                    <Typography variant="caption" fontWeight={600} color="success.main">
                        {L.payloadLabel}
                    </Typography>
                    <Typography
                        component="pre"
                        variant="body2"
                        sx={{ mt: 1, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                    >
                        {JSON.stringify(payload, null, 2)}
                    </Typography>
                </Paper>
            )}
        </StyledBoxContainer>
    );
}
