import { bool, func } from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { ActionBtn } from "components/Shared/ToolKit";
import { useToolHistory } from "utils/hooks/useToolHistory.hooks";
import api from "services/api";
import toast from "utils/toast";

// ─── Helpers ──────────────────────────────────────────────

function getURLBorderColor(state) {
    if (state === "valid") return "#22cc99";
    if (state === "invalid") return "#ef4444";
    return "var(--border-color)";
}

function getURLState(val) {
    if (!val) return "empty";
    try {
        const u = new URL(val);
        return u.protocol === "http:" || u.protocol === "https:" ? "valid" : "invalid";
    } catch {
        return "invalid";
    }
}

// ─── Styles ───────────────────────────────────────────────

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(3px);
    z-index: 1300;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
`;

const ModalPanel = styled.div`
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px 12px;
    border-bottom: 1px solid var(--border-color);
`;

const ModalTitle = styled.span`
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--text-primary);
`;

const CloseBtn = styled.button`
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    opacity: 0.55;
    transition: opacity 0.15s, color 0.15s;
    &:hover {
        opacity: 1;
        color: var(--text-primary);
    }
`;

const ModalTabStrip = styled.div`
    display: flex;
    border-bottom: 1px solid var(--border-color);
    background: rgba(0, 0, 0, 0.04);
`;

const ModalTab = styled.button`
    background: transparent;
    border: none;
    border-bottom: 2px solid ${(p) => (p.$active ? "#22cc99" : "transparent")};
    color: ${(p) => (p.$active ? "#22cc99" : "var(--text-secondary)")};
    padding: 9px 18px;
    font-size: 12px;
    font-weight: ${(p) => (p.$active ? "500" : "400")};
    font-family: "Inter", sans-serif;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    &:hover {
        color: #22cc99;
    }
`;

const Body = styled.div`
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 150px;
`;

const InputWrap = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const URLInput = styled.input`
    width: 100%;
    background: var(--bg-input);
    border: 1px solid ${(p) => getURLBorderColor(p.$state)};
    border-radius: 5px;
    color: var(--text-primary);
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    padding: 9px 80px 9px 12px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s;
    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.4;
    }
    &:focus {
        border-color: ${(p) => (p.$state === "invalid" ? "#ef4444" : "#22cc99")};
    }
`;

const InputActions = styled.div`
    position: absolute;
    right: 8px;
    display: flex;
    align-items: center;
    gap: 5px;
`;

const ValidationMark = styled.span`
    font-size: 12px;
    font-weight: 600;
    color: ${(p) => (p.$valid ? "#22cc99" : "#ef4444")};
    line-height: 1;
`;

const InlineBtn = styled.button`
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 10px;
    font-family: "Inter", sans-serif;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 2px 5px;
    border-radius: 3px;
    opacity: 0.55;
    transition: opacity 0.15s, color 0.15s;
    &:hover {
        opacity: 1;
        color: #22cc99;
    }
`;

const RecentSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const RecentLabel = styled.span`
    font-size: 10px;
    font-family: "Inter", sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-secondary);
    opacity: 0.55;
`;

const ChipsRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
`;

const Chip = styled.button`
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-secondary);
    font-family: "JetBrains Mono", monospace;
    font-size: 10px;
    padding: 3px 8px;
    cursor: pointer;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: all 0.15s;
    &:hover {
        border-color: rgba(34, 204, 153, 0.5);
        color: #22cc99;
        background: rgba(34, 204, 153, 0.06);
    }
`;

const DropZone = styled.div`
    border: 2px dashed ${(p) => (p.$active ? "#22cc99" : "var(--border-color)")};
    border-radius: 6px;
    padding: 36px 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    background: ${(p) => (p.$active ? "rgba(34,204,153,0.06)" : "var(--bg-input)")};
    color: var(--text-secondary);
    font-family: "Inter", sans-serif;
    font-size: 13px;
    user-select: none;
    &:hover {
        border-color: rgba(34, 204, 153, 0.5);
        background: rgba(34, 204, 153, 0.04);
    }
`;

const DropHint = styled.div`
    font-size: 11px;
    margin-top: 5px;
    opacity: 0.45;
`;

const SelectedFilePill = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    color: #22cc99;
    background: rgba(34, 204, 153, 0.08);
    border: 1px solid rgba(34, 204, 153, 0.3);
    border-radius: 4px;
    padding: 6px 10px;
`;

const FileSizeHint = styled.span`
    margin-left: auto;
    opacity: 0.5;
    font-size: 10px;
`;

const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 20px 16px;
    border-top: 1px solid var(--border-color);
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

const Spinner = styled.span`
    width: 10px;
    height: 10px;
    border: 1.5px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    display: inline-block;
    animation: ${spin} 0.55s linear infinite;
    flex-shrink: 0;
`;

// ─── Component ────────────────────────────────────────────

LoadJSONModal.propTypes = {
    open: bool.isRequired,
    onClose: func.isRequired,
    onLoad: func.isRequired
};

export default function LoadJSONModal({ open, onClose, onLoad }) {
    const [tab, setTab] = useState("url");
    const [urlValue, setUrlValue] = useState("");
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const urlInputRef = useRef(null);

    const { history: urlHistory, addHistory: addUrlHistory, clearHistory: clearUrlHistory } = useToolHistory("json-viewer-urls", 5);

    const urlState = getURLState(urlValue);

    useEffect(() => {
        if (open && tab === "url") {
            const t = setTimeout(() => urlInputRef.current?.focus(), 60);
            return () => clearTimeout(t);
        }
        return undefined;
    }, [open, tab]);

    useEffect(() => {
        if (!open) {
            setUrlValue("");
            setFile(null);
            setDragActive(false);
            setLoading(false);
            setTab("url");
        }
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const handlePasteClipboard = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text?.trim()) setUrlValue(text.trim());
        } catch {
            /* ignore */
        }
    }, []);

    const handleURLLoad = useCallback(async () => {
        if (urlState !== "valid" || loading) return;
        try {
            setLoading(true);
            const response = await api.get(new URL(urlValue).href);
            if (response.data) {
                addUrlHistory(urlValue);
                onLoad(JSON.stringify(response.data));
                onClose();
            }
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
    }, [urlState, urlValue, loading, addUrlHistory, onLoad, onClose]);

    const handleFileLoad = useCallback(() => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                JSON.parse(e.target.result);
                onLoad(e.target.result);
                onClose();
            } catch {
                toast.error("File does not contain valid JSON");
            }
        };
        reader.readAsText(file);
    }, [file, onLoad, onClose]);

    const handleFileDrop = useCallback((e) => {
        e.preventDefault();
        setDragActive(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped && (dropped.type === "application/json" || dropped.name.endsWith(".json"))) {
            setFile(dropped);
        } else {
            toast.error("Please drop a .json file");
        }
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && tab === "url" && urlState === "valid" && !loading) {
            handleURLLoad();
        }
    };

    const canLoad = (tab === "url" && urlState === "valid") || (tab === "file" && !!file);
    const handlePrimary = tab === "url" ? handleURLLoad : handleFileLoad;

    if (!open) return null;

    return (
        <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
            <ModalPanel onKeyDown={handleKeyDown}>
                <ModalHeader>
                    <ModalTitle>Load JSON Data</ModalTitle>
                    <CloseBtn onClick={onClose} aria-label="Close">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    </CloseBtn>
                </ModalHeader>

                <ModalTabStrip>
                    <ModalTab $active={tab === "url"} onClick={() => setTab("url")}>
                        URL
                    </ModalTab>
                    <ModalTab $active={tab === "file"} onClick={() => setTab("file")}>
                        File
                    </ModalTab>
                </ModalTabStrip>

                <Body>
                    {tab === "url" && (
                        <>
                            <InputWrap>
                                <URLInput
                                    ref={urlInputRef}
                                    $state={urlState}
                                    value={urlValue}
                                    onChange={(e) => setUrlValue(e.target.value)}
                                    placeholder="https://api.example.com/data.json"
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                                <InputActions>
                                    {urlValue && <ValidationMark $valid={urlState === "valid"}>{urlState === "valid" ? "✓" : "✕"}</ValidationMark>}
                                    <InlineBtn type="button" onClick={handlePasteClipboard}>
                                        Paste
                                    </InlineBtn>
                                </InputActions>
                            </InputWrap>

                            {urlHistory.length > 0 && (
                                <RecentSection>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <RecentLabel>Recent</RecentLabel>
                                        <InlineBtn type="button" onClick={clearUrlHistory}>
                                            Clear
                                        </InlineBtn>
                                    </div>
                                    <ChipsRow>
                                        {urlHistory.map((url) => (
                                            <Chip key={url} onClick={() => setUrlValue(url)} title={url}>
                                                {url}
                                            </Chip>
                                        ))}
                                    </ChipsRow>
                                </RecentSection>
                            )}
                        </>
                    )}

                    {tab === "file" && (
                        <>
                            <DropZone
                                $active={dragActive}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragActive(true);
                                }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={handleFileDrop}
                            >
                                {dragActive ? "Drop it here" : "Drop a .json file here"}
                                <DropHint>or click to browse</DropHint>
                            </DropZone>

                            {file && (
                                <SelectedFilePill>
                                    <span>{file.name}</span>
                                    <FileSizeHint>{(file.size / 1024).toFixed(1)} KB</FileSizeHint>
                                </SelectedFilePill>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json,application/json"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const f = e.target.files[0];
                                    if (f) setFile(f);
                                    e.target.value = "";
                                }}
                            />
                        </>
                    )}
                </Body>

                <Footer>
                    <ActionBtn onClick={onClose}>Cancel</ActionBtn>
                    <ActionBtn $success disabled={!canLoad || loading} onClick={handlePrimary}>
                        {loading ? (
                            <>
                                <Spinner />
                                Loading…
                            </>
                        ) : (
                            "Load Data"
                        )}
                    </ActionBtn>
                </Footer>
            </ModalPanel>
        </Overlay>
    );
}
