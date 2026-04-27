import { AutoFixHigh, OpenInNew } from "@mui/icons-material";
import { Box, Button, Chip, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { detectInputType } from "utils/inputDetector";
import storage from "utils/storage";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
`;

const TextArea = styled.textarea`
    width: 100%;
    min-height: 110px;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1.5px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-primary);
    font-size: 0.9rem;
    font-family: monospace;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
    &:focus {
        border-color: #22cc99;
        box-shadow: 0 0 0 2px rgba(34, 204, 153, 0.15);
    }
    &::placeholder {
        color: var(--text-secondary);
    }
`;

const DetectedBanner = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    padding: 10px 14px;
    border-radius: 8px;
    background: rgba(34, 204, 153, 0.08);
    border: 1px solid rgba(34, 204, 153, 0.25);
    animation: ${fadeIn} 0.2s ease both;
`;

/**
 * M3 — SmartInput: paste any data, get type detection + direct route to the right tool.
 */
export default function SmartInput() {
    const dispatch = useDispatch();
    const [value, setValue] = useState("");

    const detected = useMemo(() => detectInputType(value), [value]);

    const openInTool = () => {
        if (!detected) return;
        storage.setRecentTool(detected.route);
        dispatch(push(detected.route, { prefill: value }));
    };

    return (
        <Wrapper>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <AutoFixHigh sx={{ color: "#22cc99", fontSize: "1.1rem" }} />
                <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                    Smart Paste
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    — paste anything and we'll detect what it is
                </Typography>
            </Box>

            <TextArea placeholder="Paste JSON, JWT, Base64, URL, UUID, hash…" value={value} onChange={(e) => setValue(e.target.value)} />

            {detected && (
                <DetectedBanner>
                    <span>🧠</span>
                    <Chip label={detected.label} size="small" sx={{ background: "rgba(34,204,153,0.2)", color: "#22cc99", fontWeight: 700 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                        detected
                    </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        endIcon={<OpenInNew fontSize="small" />}
                        onClick={openInTool}
                        sx={{ background: "#22cc99", color: "#000", "&:hover": { background: "#1ab585" }, fontWeight: 700, fontSize: "0.78rem" }}
                    >
                        Open in Tool →
                    </Button>
                </DetectedBanner>
            )}
        </Wrapper>
    );
}
