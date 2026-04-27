import { Check, ContentCopy } from "@mui/icons-material";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { EmptyState, ModeBtn, ModeToggle, Panel, PanelHeader, PanelLabel, ToolLayout } from "components/Shared/ToolKit";

const BASES = [
    { value: 2, label: "Bin" },
    { value: 8, label: "Oct" },
    { value: 10, label: "Dec" },
    { value: 16, label: "Hex" }
];

const OUTPUTS = [
    { base: 2, label: "Binary", prefix: "0b" },
    { base: 8, label: "Octal", prefix: "0o" },
    { base: 10, label: "Decimal", prefix: "" },
    { base: 16, label: "Hexadecimal", prefix: "0x" }
];

const NumberInput = styled.input`
    width: 100%;
    background: var(--bg-input);
    border: none;
    outline: none;
    color: var(--text-primary);
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 13px;
    padding: 14px 16px;
    box-sizing: border-box;
    &::placeholder {
        color: var(--text-secondary);
    }
`;

const ResultRows = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const ResultRow = styled.div`
    display: flex;
    align-items: center;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border-color);
    gap: 12px;
`;

const ResultLabel = styled.span`
    font-size: 10px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
    min-width: 100px;
`;

const ResultValue = styled.span`
    font-size: 12px;
    font-family: "JetBrains Mono", monospace;
    color: var(--text-primary);
    flex: 1;
    word-break: break-all;
`;

const RowCopyBtn = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    padding: 2px 4px;
    border-radius: 3px;
    &:hover {
        color: var(--text-primary);
        background: rgba(255, 255, 255, 0.05);
    }
`;

const ErrorBadge = styled.span`
    font-size: 11px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 4px;
    padding: 2px 8px;
`;

export default function NumberBaseConverter() {
    const [input, setInput] = useState("");
    const [sourceBase, setSourceBase] = useState(10);
    const [copiedLabel, setCopiedLabel] = useState(null);

    const { results, error } = useMemo(() => {
        if (!input.trim()) return { results: null, error: "" };
        const decimal = parseInt(input.trim(), sourceBase);
        if (Number.isNaN(decimal)) return { results: null, error: `Invalid input "${input}" for base ${sourceBase}` };
        return {
            results: OUTPUTS.map(({ base, label, prefix }) => ({
                label,
                value: prefix + decimal.toString(base).toUpperCase()
            })),
            error: ""
        };
    }, [input, sourceBase]);

    const handleCopy = useCallback((label, value) => {
        if (!window?.navigator?.clipboard) return;
        window.navigator.clipboard.writeText(value).then(() => {
            setCopiedLabel(label);
            setTimeout(() => setCopiedLabel(null), 1500);
        });
    }, []);

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>Input</PanelLabel>
                    {error && <ErrorBadge>{error}</ErrorBadge>}
                </PanelHeader>
                <ModeToggle>
                    {BASES.map(({ value, label }) => (
                        <ModeBtn key={value} $active={sourceBase === value} onClick={() => setSourceBase(value)}>
                            {label}
                        </ModeBtn>
                    ))}
                </ModeToggle>
                <NumberInput value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter a number…" spellCheck={false} autoFocus />
            </Panel>

            <Panel>
                <PanelHeader>
                    <PanelLabel>Conversions</PanelLabel>
                </PanelHeader>
                {results ? (
                    <ResultRows>
                        {results.map(({ label, value }) => (
                            <ResultRow key={label}>
                                <ResultLabel>{label}</ResultLabel>
                                <ResultValue>{value}</ResultValue>
                                <RowCopyBtn onClick={() => handleCopy(label, value)} title="Copy">
                                    {copiedLabel === label ? <Check style={{ fontSize: 13 }} /> : <ContentCopy style={{ fontSize: 13 }} />}
                                </RowCopyBtn>
                            </ResultRow>
                        ))}
                    </ResultRows>
                ) : (
                    <EmptyState>
                        <span style={{ fontSize: 22, fontFamily: "JetBrains Mono, monospace" }}>0x</span>
                        <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>Enter a number to convert between bases</span>
                    </EmptyState>
                )}
            </Panel>
        </ToolLayout>
    );
}
