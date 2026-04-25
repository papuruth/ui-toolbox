import { ContentCopy } from "@mui/icons-material";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { StyledBoxContainer, StyledTextField } from "components/Shared/Styled-Components";
import CryptoJS from "crypto-js";
import localization from "localization";
import React, { useEffect, useState } from "react";
import toast from "utils/toast";

const { hashGenerator: L, common: C } = localization;

const ALGORITHMS = [
    { id: "md5", label: "MD5", fn: (s) => CryptoJS.MD5(s).toString() },
    { id: "sha1", label: "SHA-1", fn: (s) => CryptoJS.SHA1(s).toString() },
    { id: "sha256", label: "SHA-256", fn: (s) => CryptoJS.SHA256(s).toString() },
    { id: "sha512", label: "SHA-512", fn: (s) => CryptoJS.SHA512(s).toString() }
];

export default function HashGenerator() {
    const [input, setInput] = useState("");
    const [hashes, setHashes] = useState({});

    useEffect(() => {
        if (!input) {
            setHashes({});
            return;
        }
        const computed = {};
        ALGORITHMS.forEach(({ id, fn }) => {
            computed[id] = fn(input);
        });
        setHashes(computed);
    }, [input]);

    const copyHash = (value) => {
        if (window?.navigator?.clipboard) {
            window.navigator.clipboard.writeText(value);
            toast.success("Copied!");
        }
    };

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            <StyledTextField multiline rows={4} placeholder={L.inputPlaceholder} value={input} onChange={(e) => setInput(e.target.value)} />
            {ALGORITHMS.map(({ id, label }) => (
                <Paper key={id} variant="outlined" sx={{ p: 2, background: "var(--bg-card)" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {label}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" sx={{ fontFamily: "monospace", wordBreak: "break-all", flexGrow: 1, color: "text.primary" }}>
                            {hashes[id] || "—"}
                        </Typography>
                        {hashes[id] && (
                            <Tooltip title={C.copyToCP}>
                                <IconButton size="small" onClick={() => copyHash(hashes[id])}>
                                    <ContentCopy fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Paper>
            ))}
        </StyledBoxContainer>
    );
}
