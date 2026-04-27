import { Check, ContentCopy, DeleteOutline, IosShare } from "@mui/icons-material";
import { camelCase, kebabCase, snakeCase, startCase } from "lodash";
import localization from "localization";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
    ActionBtn,
    ActionBar,
    ActionBtnGroup,
    EmptyState,
    InputArea,
    MetaText,
    Panel,
    PanelHeader,
    PanelLabel,
    ToolLayout
} from "components/Shared/ToolKit";
import SendToButton from "components/Shared/SendToButton";
import { useToolChain } from "context/ToolChainContext";
import { useShareableURL } from "utils/hooks/useShareableURL.hooks";

const { textCaseConverter: L } = localization;

const CASES = [
    { id: "upper", label: "UPPERCASE", fn: (s) => s.toUpperCase() },
    { id: "lower", label: "lowercase", fn: (s) => s.toLowerCase() },
    { id: "title", label: "Title Case", fn: (s) => startCase(s.toLowerCase()) },
    { id: "camel", label: "camelCase", fn: (s) => camelCase(s) },
    { id: "pascal", label: "PascalCase", fn: (s) => startCase(camelCase(s)).replace(/\s/g, "") },
    { id: "snake", label: "snake_case", fn: (s) => snakeCase(s) },
    { id: "kebab", label: "kebab-case", fn: (s) => kebabCase(s) },
    { id: "constant", label: "CONSTANT_CASE", fn: (s) => snakeCase(s).toUpperCase() }
];

const FormatRow = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 16px;
    gap: 12px;
    border-bottom: 1px solid var(--border-color);
    &:last-child {
        border-bottom: none;
    }
`;

const FormatLabel = styled.span`
    font-size: 10px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    min-width: 108px;
    flex-shrink: 0;
`;

const FormatValue = styled.span`
    font-size: 12px;
    font-family: "JetBrains Mono", "Fira Code", monospace;
    color: var(--text-primary);
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const BtnGroup = styled(ActionBtnGroup)`
    margin-left: auto;
`;

export default function TextCaseConverter() {
    const [input, setInput] = useState("");
    const [copiedId, setCopiedId] = useState(null);
    const { consumeChain } = useToolChain();
    const { initialValue, shareURL } = useShareableURL("q");

    useEffect(() => {
        const chained = consumeChain("/text-case");
        if (chained) setInput(chained);
        else if (initialValue) setInput(initialValue);
    }, [consumeChain, initialValue]);

    const results = useMemo(() => {
        if (!input.trim()) return [];
        return CASES.map(({ id, label, fn }) => ({ id, label, value: fn(input) }));
    }, [input]);

    const handleCopy = useCallback((id, value) => {
        if (!window?.navigator?.clipboard) return;
        window.navigator.clipboard.writeText(value).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 1500);
        });
    }, []);

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.inputTextLabel}</PanelLabel>
                    {input && <MetaText>{input.length.toLocaleString()} chars</MetaText>}
                </PanelHeader>
                <InputArea value={input} onChange={(e) => setInput(e.target.value)} placeholder={L.inputPlaceholder} spellCheck={false} autoFocus />
                {input && (
                    <ActionBar>
                        <BtnGroup>
                            <ActionBtn onClick={() => shareURL(input)}>
                                <IosShare style={{ fontSize: 11 }} /> {L.shareBtn}
                            </ActionBtn>
                            <SendToButton
                                value={input}
                                targets={[
                                    { label: "Word Counter", route: "/word-counter" },
                                    { label: "Hash Generator", route: "/hash-generator" }
                                ]}
                            />
                            <ActionBtn $danger onClick={() => setInput("")}>
                                <DeleteOutline style={{ fontSize: 12 }} />
                                {L.clearBtn}
                            </ActionBtn>
                        </BtnGroup>
                    </ActionBar>
                )}
            </Panel>

            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.allFormatsLabel}</PanelLabel>
                    {results.length > 0 && <MetaText>{L.formatsCount}</MetaText>}
                </PanelHeader>
                {results.length > 0 ? (
                    results.map(({ id, label, value }) => (
                        <FormatRow key={id}>
                            <FormatLabel>{label}</FormatLabel>
                            <FormatValue title={value}>{value}</FormatValue>
                            <ActionBtn $success={copiedId === id} onClick={() => handleCopy(id, value)}>
                                {copiedId === id ? <Check style={{ fontSize: 11 }} /> : <ContentCopy style={{ fontSize: 11 }} />}
                                {copiedId === id ? L.copiedLabel : L.copyBtn}
                            </ActionBtn>
                        </FormatRow>
                    ))
                ) : (
                    <EmptyState>
                        <span style={{ fontSize: 28, fontFamily: "JetBrains Mono, monospace" }}>Aa</span>
                        <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>{L.emptyStateMessage}</span>
                    </EmptyState>
                )}
            </Panel>
        </ToolLayout>
    );
}
