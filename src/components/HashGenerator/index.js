import { Check, ContentCopy, IosShare, UploadFile } from "@mui/icons-material";
import CryptoJS from "crypto-js";
import localization from "localization";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    DropWrap,
    EmptyState,
    InputArea,
    MetaText,
    Panel,
    PanelHeader,
    PanelLabel,
    ToolLayout
} from "components/Shared/ToolKit";
import LocalBadge from "components/Shared/LocalBadge";
import { useToolChain } from "context/ToolChainContext";
import { useShareableURL } from "utils/hooks/useShareableURL.hooks";

const { hashGenerator: L, common: C } = localization;

const ALGOS = [
    { id: "md5", label: "MD5", fn: (s) => CryptoJS.MD5(s).toString() },
    { id: "sha1", label: "SHA-1", fn: (s) => CryptoJS.SHA1(s).toString() },
    { id: "sha256", label: "SHA-256", fn: (s) => CryptoJS.SHA256(s).toString() },
    { id: "sha512", label: "SHA-512", fn: (s) => CryptoJS.SHA512(s).toString() }
];

function hashWordArray(id, wa) {
    switch (id) {
        case "md5":
            return CryptoJS.MD5(wa).toString();
        case "sha1":
            return CryptoJS.SHA1(wa).toString();
        case "sha256":
            return CryptoJS.SHA256(wa).toString();
        case "sha512":
            return CryptoJS.SHA512(wa).toString();
        default:
            return "";
    }
}

const DropTarget = styled.div`
    border: 1px dashed ${(p) => (p.$active ? "#22cc99" : "var(--border-color)")};
    border-radius: 6px;
    padding: 16px;
    text-align: center;
    cursor: pointer;
    background: ${(p) => (p.$active ? "rgba(34,204,153,0.08)" : "transparent")};
    transition: all 0.2s ease;
    &:hover {
        border-color: #22cc99;
        background: rgba(34, 204, 153, 0.05);
    }
`;

const DropHint = styled.span`
    display: block;
    margin-top: 4px;
    font-size: 12px;
    font-family: "Inter", sans-serif;
    color: var(--text-secondary);
`;

const FileName = styled.span`
    display: block;
    margin-top: 4px;
    font-size: 13px;
    font-family: "JetBrains Mono", monospace;
    color: #22cc99;
`;

const HashRow = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 16px;
    gap: 12px;
    border-bottom: 1px solid var(--border-color);
    &:last-child {
        border-bottom: none;
    }
`;

const AlgoLabel = styled.span`
    font-size: 12px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    min-width: 56px;
    flex-shrink: 0;
`;

const HashValue = styled.span`
    font-size: 12px;
    font-family: "JetBrains Mono", "Fira Code", monospace;
    color: var(--text-primary);
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export default function HashGenerator() {
    const [input, setInput] = useState("");
    const [fileHashes, setFileHashes] = useState({});
    const [fileName, setFileName] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const { consumeChain } = useToolChain();
    const { initialValue, shareURL } = useShareableURL("q");

    useEffect(() => {
        const chained = consumeChain("/hash-generator");
        if (chained) setInput(chained);
        else if (initialValue) setInput(initialValue);
    }, [consumeChain, initialValue]);

    const textHashes = useMemo(() => {
        if (!input || fileName) return {};
        const computed = {};
        ALGOS.forEach(({ id, fn }) => {
            computed[id] = fn(input);
        });
        return computed;
    }, [input, fileName]);

    const hashes = fileName ? fileHashes : textHashes;

    const onDrop = useCallback((accepted) => {
        const file = accepted[0];
        if (!file) return;
        setFileName(file.name);
        setInput("");
        const reader = new FileReader();
        reader.onload = (e) => {
            const wa = CryptoJS.lib.WordArray.create(e.target.result);
            const computed = {};
            ALGOS.forEach(({ id }) => {
                computed[id] = hashWordArray(id, wa);
            });
            setFileHashes(computed);
        };
        reader.readAsArrayBuffer(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

    const handleCopy = useCallback((id, value) => {
        if (!window?.navigator?.clipboard) return;
        window.navigator.clipboard.writeText(value).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 1500);
        });
    }, []);

    const hasOutput = Object.keys(hashes).length > 0;

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.inputLabel}</PanelLabel>
                    <ActionBtnGroup>
                        {fileName ? <MetaText>{fileName}</MetaText> : input && <MetaText>{input.length.toLocaleString()} chars</MetaText>}
                        <LocalBadge />
                    </ActionBtnGroup>
                </PanelHeader>
                <InputArea
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setFileName(null);
                        setFileHashes({});
                    }}
                    placeholder={L.inputPlaceholder}
                    spellCheck={false}
                    autoFocus
                />
                <DropWrap>
                    <DropTarget {...getRootProps()} $active={isDragActive}>
                        <input {...getInputProps()} />
                        <UploadFile style={{ fontSize: 20, color: "#22cc99" }} />
                        <DropHint>{isDragActive ? L.dropActiveHint : L.dropzoneHint}</DropHint>
                        {fileName && <FileName>{fileName}</FileName>}
                    </DropTarget>
                </DropWrap>
                {(input || fileName) && (
                    <ActionBar>
                        <ActionBtnGroup>
                            <ActionBtn
                                $danger
                                onClick={() => {
                                    setInput("");
                                    setFileName(null);
                                    setFileHashes({});
                                }}
                            >
                                {C.clearBtn}
                            </ActionBtn>
                        </ActionBtnGroup>
                    </ActionBar>
                )}
            </Panel>

            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.hashesLabel}</PanelLabel>
                    {hasOutput && <MetaText>{L.algorithmsCount}</MetaText>}
                </PanelHeader>
                {hasOutput ? (
                    <>
                        {ALGOS.map(({ id, label }) => (
                            <HashRow key={id}>
                                <AlgoLabel>{label}</AlgoLabel>
                                <HashValue title={hashes[id]}>{hashes[id] || "—"}</HashValue>
                                {hashes[id] && (
                                    <ActionBtn $success={copiedId === id} onClick={() => handleCopy(id, hashes[id])}>
                                        {copiedId === id ? <Check style={{ fontSize: 11 }} /> : <ContentCopy style={{ fontSize: 11 }} />}
                                        {copiedId === id ? L.copiedLabel : L.copyBtn}
                                    </ActionBtn>
                                )}
                            </HashRow>
                        ))}
                        {!fileName && (
                            <ActionBar>
                                <ActionBtnGroup>
                                    <ActionBtn onClick={() => shareURL(input)}>
                                        <IosShare style={{ fontSize: 11 }} /> {L.shareBtn}
                                    </ActionBtn>
                                </ActionBtnGroup>
                            </ActionBar>
                        )}
                    </>
                ) : (
                    <EmptyState>
                        <span style={{ fontSize: 26, fontFamily: "JetBrains Mono, monospace" }}>#</span>
                        <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>{L.emptyStateMessage}</span>
                    </EmptyState>
                )}
            </Panel>
        </ToolLayout>
    );
}
