import { Check, ContentCopy, DeleteOutline, IosShare } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useShareableURL } from "utils/hooks/useShareableURL.hooks";
import styled from "styled-components";
import { styledMedia } from "styles/global";
import {
    ModeToggle,
    ModeBtn,
    Panel,
    PanelHeader,
    PanelLabel,
    MetaText,
    CodeArea as BaseCodeArea,
    ActionBar,
    ActionBtnGroup,
    ActionBtn
} from "components/Shared/ToolKit";

/* ─── Tool-specific Styles ───────────────────────────── */

const ToolWrap = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    margin-top: 4px;
`;

const Grid = styled(Box)`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    ${styledMedia.lessThan("md")`
        grid-template-columns: 1fr;
    `}
`;

/* BtnGroup: right-aligns buttons inside ActionBar */
const BtnGroup = styled(ActionBtnGroup)`
    margin-left: auto;
`;

/* ErrorBadge: inline error pill in PanelHeader */
const ErrorBadge = styled(Typography)`
    font-size: 11px !important;
    color: #ef4444 !important;
    font-weight: 600 !important;
    font-family: "Inter", sans-serif !important;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 4px;
    padding: 2px 8px;
    line-height: 1.5 !important;
`;

/* CodeArea extended: flex:1 + taller min-height for split-panel layout */
const CodeArea = styled(BaseCodeArea)`
    flex: 1;
    min-height: 300px;
    &:read-only {
        cursor: default;
    }
`;

/* ─── Component ──────────────────────────────────────── */

export default function Base64Text() {
    const [mode, setMode] = useState("encode");
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);
    const { initialValue, shareURL } = useShareableURL("enc");

    useEffect(() => {
        if (initialValue) setInput(initialValue);
    }, [initialValue]);

    const { output, error } = useMemo(() => {
        if (!input.trim()) return { output: "", error: "" };
        if (mode === "encode") {
            try {
                return { output: window.btoa(input), error: "" };
            } catch {
                return { output: "", error: "Contains characters outside Latin-1 range" };
            }
        }
        try {
            return { output: window.atob(input), error: "" };
        } catch {
            return { output: "", error: "Invalid Base64 string" };
        }
    }, [input, mode]);

    const handleModeSwitch = useCallback((newMode) => {
        setMode(newMode);
        setInput("");
    }, []);

    const handleCopy = useCallback(() => {
        if (!output || !window?.navigator?.clipboard) return;
        window.navigator.clipboard.writeText(output).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }, [output]);

    const handleShare = useCallback(() => {
        shareURL(input);
    }, [shareURL, input]);

    const inputLabel = mode === "encode" ? "Plain Text" : "Base64 String";
    const outputLabel = mode === "encode" ? "Base64 Output" : "Decoded Text";
    const inputPlaceholder = mode === "encode" ? "Type or paste plain text here…" : "Paste your Base64 encoded string here…";
    const outputPlaceholder = mode === "encode" ? "Base64 output will appear here…" : "Decoded plain text will appear here…";

    const inputMeta = input ? `${(input.length / 1024).toFixed(1)} KB · ${input.length.toLocaleString()} chars` : "";
    const outputMeta = output ? `${(output.length / 1024).toFixed(1)} KB · ${output.length.toLocaleString()} chars` : "";

    return (
        <ToolWrap>
            <ModeToggle>
                <ModeBtn $active={mode === "encode"} onClick={() => handleModeSwitch("encode")}>
                    Encode
                </ModeBtn>
                <ModeBtn $active={mode === "decode"} onClick={() => handleModeSwitch("decode")}>
                    Decode
                </ModeBtn>
            </ModeToggle>

            <Grid>
                {/* Input */}
                <Panel>
                    <PanelHeader>
                        <PanelLabel>{inputLabel}</PanelLabel>
                        {inputMeta && <MetaText>{inputMeta}</MetaText>}
                    </PanelHeader>
                    <CodeArea value={input} onChange={(e) => setInput(e.target.value)} placeholder={inputPlaceholder} spellCheck={false} autoFocus />
                    {input && (
                        <ActionBar>
                            <BtnGroup>
                                <ActionBtn $danger onClick={() => setInput("")}>
                                    <DeleteOutline style={{ fontSize: 12 }} />
                                    Clear
                                </ActionBtn>
                            </BtnGroup>
                        </ActionBar>
                    )}
                </Panel>

                {/* Output */}
                <Panel>
                    <PanelHeader>
                        <PanelLabel>{outputLabel}</PanelLabel>
                        {error ? <ErrorBadge>{error}</ErrorBadge> : outputMeta && <MetaText>{outputMeta}</MetaText>}
                    </PanelHeader>
                    <CodeArea value={output} readOnly placeholder={outputPlaceholder} spellCheck={false} />
                    {output && (
                        <ActionBar>
                            <BtnGroup>
                                {mode === "encode" && (
                                    <ActionBtn onClick={handleShare} disabled={!input}>
                                        <IosShare style={{ fontSize: 12 }} />
                                        Share
                                    </ActionBtn>
                                )}
                                <ActionBtn $success={copied} onClick={handleCopy}>
                                    {copied ? <Check style={{ fontSize: 12 }} /> : <ContentCopy style={{ fontSize: 12 }} />}
                                    {copied ? "Copied" : "Copy"}
                                </ActionBtn>
                            </BtnGroup>
                        </ActionBar>
                    )}
                </Panel>
            </Grid>
        </ToolWrap>
    );
}
