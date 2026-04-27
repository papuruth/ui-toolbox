import { CheckCircle, ContentCopy, UploadFile } from "@mui/icons-material";
import { Box, Chip, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { StyledBoxContainer, StyledTextField } from "components/Shared/Styled-Components";
import HistoryDropdown from "components/Shared/HistoryDropdown";
import ShareButton from "components/Shared/ShareButton";
import CryptoJS from "crypto-js";
import localization from "localization";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useToolHistory } from "utils/hooks/useToolHistory.hooks";
import { useShareableURL } from "utils/hooks/useShareableURL.hooks";

const { hashGenerator: L, common: C } = localization;

const ALGORITHMS = [
    { id: "md5", label: "MD5", fn: (s) => CryptoJS.MD5(s).toString() },
    { id: "sha1", label: "SHA-1", fn: (s) => CryptoJS.SHA1(s).toString() },
    { id: "sha256", label: "SHA-256", fn: (s) => CryptoJS.SHA256(s).toString() },
    { id: "sha512", label: "SHA-512", fn: (s) => CryptoJS.SHA512(s).toString() }
];

function hashWordArray(algo, wordArray) {
    switch (algo) {
        case "md5":
            return CryptoJS.MD5(wordArray).toString();
        case "sha1":
            return CryptoJS.SHA1(wordArray).toString();
        case "sha256":
            return CryptoJS.SHA256(wordArray).toString();
        case "sha512":
            return CryptoJS.SHA512(wordArray).toString();
        default:
            return "";
    }
}

export default function HashGenerator() {
    const [input, setInput] = useState("");
    const [hashes, setHashes] = useState({});
    const [fileName, setFileName] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const { history: inputHistory, addHistory, clearHistory } = useToolHistory("hash-generator");
    const { initialValue, shareURL } = useShareableURL("hash");

    // pre-fill from shareable link
    useEffect(() => {
        if (initialValue) setInput(initialValue);
    }, [initialValue]);

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

    const onDrop = useCallback((accepted) => {
        const file = accepted[0];
        if (!file) return;
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
            const computed = {};
            ALGORITHMS.forEach(({ id }) => {
                computed[id] = hashWordArray(id, wordArray);
            });
            setHashes(computed);
            setInput("");
        };
        reader.readAsArrayBuffer(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false, noClick: false });

    const copyHash = (id, value) => {
        if (window?.navigator?.clipboard) {
            window.navigator.clipboard.writeText(value);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 1500);
        }
    };

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            <StyledTextField
                multiline
                rows={4}
                placeholder={L.inputPlaceholder}
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    setFileName(null);
                    if (e.target.value.trim()) addHistory(e.target.value.trim());
                }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5, mt: -2 }}>
                <HistoryDropdown history={inputHistory} onSelect={(v) => setInput(v)} onClear={clearHistory} />
                <ShareButton onShare={() => shareURL(input)} disabled={!input} />
            </Box>

            <Box
                {...getRootProps()}
                sx={{
                    borderColor: isDragActive ? "#22cc99" : "var(--border-color)",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    background: isDragActive ? "rgba(34,204,153,0.08)" : "var(--bg-card)",
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "#22cc99", background: "rgba(34,204,153,0.05)" }
                }}
            >
                <input {...getInputProps()} />
                <UploadFile sx={{ color: "#22cc99", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                    {isDragActive ? "Drop file here…" : "Drag & drop a file to hash, or click to browse"}
                </Typography>
                {fileName && <Chip label={fileName} size="small" sx={{ mt: 1, background: "rgba(34,204,153,0.15)", color: "#22cc99" }} />}
            </Box>

            {ALGORITHMS.map(({ id, label }) => (
                <Paper key={id} variant="outlined" sx={{ p: 2, background: "var(--bg-card)", borderLeft: "3px solid #22cc99" }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {label}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" sx={{ fontFamily: "monospace", wordBreak: "break-all", flexGrow: 1, color: "text.primary" }}>
                            {hashes[id] || "—"}
                        </Typography>
                        {hashes[id] && (
                            <Tooltip title={copiedId === id ? C.copiedToCP : C.copyToCP}>
                                <IconButton size="small" onClick={() => copyHash(id, hashes[id])}>
                                    {copiedId === id ? <CheckCircle fontSize="small" color="success" /> : <ContentCopy fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Paper>
            ))}
        </StyledBoxContainer>
    );
}
