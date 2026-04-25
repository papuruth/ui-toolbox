import { Paper, Typography } from "@mui/material";
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

export default function JWTDecoder() {
    const [token, setToken] = useState("");

    const { header, payload, error } = useMemo(() => {
        if (!token.trim()) return { header: null, payload: null, error: "" };
        const parts = token.trim().split(".");
        if (parts.length !== 3) return { header: null, payload: null, error: L.invalidJwtError };
        const h = safeDecodeSegment(parts[0]);
        const p = safeDecodeSegment(parts[1]);
        if (!h || !p) return { header: null, payload: null, error: L.decodeError };
        return { header: h, payload: p, error: "" };
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
