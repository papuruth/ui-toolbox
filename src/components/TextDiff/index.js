import { diffWords } from "diff";
import localization from "localization";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { ActionBtn, EmptyState, InputArea, MetaText, Panel, PanelHeader, PanelLabel, ToolLayout } from "components/Shared/ToolKit";

const { textDiff: L } = localization;

const ToolWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    margin-top: 4px;
`;

const DiffArea = styled.div`
    flex: 1;
    min-height: 180px;
    background: var(--bg-input);
    padding: 16px;
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 12px;
    line-height: 1.75;
    white-space: pre-wrap;
    word-break: break-word;
    overflow: auto;
`;

const Added = styled.mark`
    background: rgba(34, 204, 153, 0.25);
    color: var(--text-primary);
    border-radius: 2px;
`;

const Removed = styled.mark`
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    text-decoration: line-through;
    border-radius: 2px;
`;

export default function TextDiff() {
    const [original, setOriginal] = useState("");
    const [modified, setModified] = useState("");

    const { parts, stats } = useMemo(() => {
        if (!original && !modified) return { parts: [], stats: null };
        const result = diffWords(original, modified);
        const added = result.filter((p) => p.added).reduce((n, p) => n + (p.count || 0), 0);
        const removed = result.filter((p) => p.removed).reduce((n, p) => n + (p.count || 0), 0);
        return { parts: result, stats: { added, removed } };
    }, [original, modified]);

    return (
        <ToolWrap>
            <ToolLayout style={{ marginTop: 0 }}>
                <Panel>
                    <PanelHeader>
                        <PanelLabel>{L.originalLabel}</PanelLabel>
                        {original && <MetaText>{original.length.toLocaleString()} chars</MetaText>}
                    </PanelHeader>
                    <InputArea
                        value={original}
                        onChange={(e) => setOriginal(e.target.value)}
                        placeholder={L.originalPlaceholder}
                        spellCheck={false}
                        autoFocus
                    />
                </Panel>

                <Panel>
                    <PanelHeader>
                        <PanelLabel>{L.modifiedLabel}</PanelLabel>
                        {modified && <MetaText>{modified.length.toLocaleString()} chars</MetaText>}
                    </PanelHeader>
                    <InputArea
                        value={modified}
                        onChange={(e) => setModified(e.target.value)}
                        placeholder={L.modifiedPlaceholder}
                        spellCheck={false}
                    />
                </Panel>
            </ToolLayout>

            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.diffLabel}</PanelLabel>
                    {(original || modified) && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {stats && (
                                <MetaText>
                                    <span style={{ color: "#22cc99" }}>+{stats.added}</span>
                                    {" / "}
                                    <span style={{ color: "#ef4444" }}>-{stats.removed}</span> {L.wordsLabel}
                                </MetaText>
                            )}
                            <ActionBtn
                                $danger
                                onClick={() => {
                                    setOriginal("");
                                    setModified("");
                                }}
                            >
                                {L.clearAllBtn}
                            </ActionBtn>
                        </div>
                    )}
                </PanelHeader>
                {parts.length > 0 ? (
                    <DiffArea>
                        {parts.map((part, i) => {
                            if (part.added) {
                                // eslint-disable-next-line react/no-array-index-key
                                return <Added key={i}>{part.value}</Added>;
                            }
                            if (part.removed) {
                                // eslint-disable-next-line react/no-array-index-key
                                return <Removed key={i}>{part.value}</Removed>;
                            }
                            // eslint-disable-next-line react/no-array-index-key
                            return <span key={i}>{part.value}</span>;
                        })}
                    </DiffArea>
                ) : (
                    <EmptyState>
                        <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>{L.emptyStateMessage}</span>
                    </EmptyState>
                )}
            </Panel>
        </ToolWrap>
    );
}
