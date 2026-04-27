import { IosShare } from "@mui/icons-material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "utils/toast";
import styled from "styled-components";
import {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    CodeArea,
    EmptyState,
    MetaText,
    Panel,
    PanelHeader,
    PanelLabel,
    ToolLayout
} from "components/Shared/ToolKit";
import { useToolChain } from "context/ToolChainContext";
import { useShareableURL } from "utils/hooks/useShareableURL.hooks";

const FLAGS_LIST = ["g", "i", "m", "s"];

const PRESETS = [
    { label: "Email", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}" },
    { label: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b[-a-zA-Z0-9()@:%_+.~#?&/=]*" },
    { label: "IPv4", pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b" },
    { label: "Date YYYY-MM-DD", pattern: "\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])" },
    { label: "Hex Color", pattern: "#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b" },
    { label: "UUID", pattern: "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}" },
    { label: "JWT", pattern: "eyJ[A-Za-z0-9_-]+\\.eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+" },
    { label: "HTML Tag", pattern: "<\\/?[a-zA-Z][^>]*>" },
    { label: "Number", pattern: "-?\\b\\d+(?:\\.\\d+)?\\b" }
];

function buildSegments(text, matches) {
    if (!matches.length) return [{ text, highlight: false }];
    const segments = [];
    let cursor = 0;
    matches.forEach((m) => {
        if (m.index > cursor) segments.push({ text: text.slice(cursor, m.index), highlight: false });
        segments.push({ text: m[0], highlight: true });
        cursor = m.index + m[0].length;
    });
    if (cursor < text.length) segments.push({ text: text.slice(cursor), highlight: false });
    return segments;
}

const PatternWrap = styled.div`
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-input);
    gap: 4px;
`;

const Slash = styled.span`
    font-size: 14px;
    font-family: "JetBrains Mono", monospace;
    color: var(--text-secondary);
    opacity: 0.5;
    flex-shrink: 0;
`;

const PatternInput = styled.input`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 12px 4px;
    font-size: 13px;
    font-family: "JetBrains Mono", "Fira Code", monospace;
    color: ${(p) => (p.$error ? "#ef4444" : "var(--text-primary)")};
    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.4;
    }
`;

const FlagStrip = styled.div`
    display: flex;
    gap: 4px;
    padding: 8px 16px;
    border-bottom: 1px solid var(--border-color);
    align-items: center;
`;

const FlagLabel = styled.span`
    font-size: 10px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-right: 4px;
`;

const FlagBtn = styled.button`
    background: ${(p) => (p.$active ? "rgba(34,204,153,0.15)" : "transparent")};
    color: ${(p) => (p.$active ? "#22cc99" : "var(--text-secondary)")};
    border: 1px solid ${(p) => (p.$active ? "rgba(34,204,153,0.4)" : "var(--border-color)")};
    border-radius: 4px;
    padding: 2px 7px;
    font-size: 11px;
    font-family: "JetBrains Mono", monospace;
    cursor: pointer;
    transition: all 0.15s;
    &:hover {
        color: #22cc99;
        border-color: rgba(34, 204, 153, 0.4);
    }
`;

const PresetStrip = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px 16px;
    border-bottom: 1px solid var(--border-color);
`;

const PresetBtn = styled.button`
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 10px;
    font-family: "Inter", sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    &:hover {
        color: #22cc99;
        border-color: rgba(34, 204, 153, 0.4);
        background: rgba(34, 204, 153, 0.05);
    }
`;

const SubHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    background: rgba(0, 0, 0, 0.04);
    min-height: 36px;
`;

const HighlightArea = styled.div`
    flex: 1;
    min-height: 200px;
    background: var(--bg-input);
    color: var(--text-primary);
    padding: 16px;
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 12px;
    line-height: 1.75;
    letter-spacing: 0.02em;
    white-space: pre-wrap;
    word-break: break-all;
    overflow: auto;
`;

const Highlight = styled.mark`
    background: rgba(34, 204, 153, 0.3);
    color: var(--text-primary);
    border-radius: 2px;
`;

const MatchList = styled.div`
    padding: 10px 16px;
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 140px;
    overflow-y: auto;
`;

const MatchItem = styled.div`
    font-size: 11px;
    font-family: "JetBrains Mono", monospace;
    color: var(--text-secondary);
    line-height: 1.5;
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

export default function RegexTester() {
    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
    const [testStr, setTestStr] = useState("");
    const { consumeChain } = useToolChain();
    const { initialValue: initialPattern } = useShareableURL("p");
    const { initialValue: initialTestStr } = useShareableURL("s");

    useEffect(() => {
        const chained = consumeChain("/regex-tester");
        if (chained) setTestStr(chained);
        else if (initialTestStr) setTestStr(initialTestStr);
    }, [consumeChain, initialTestStr]);

    useEffect(() => {
        if (initialPattern) setPattern(initialPattern);
    }, [initialPattern]);

    const handleShare = useCallback(() => {
        try {
            const url = new URL(window.location.href);
            if (pattern) url.searchParams.set("p", btoa(pattern));
            if (testStr) url.searchParams.set("s", btoa(testStr));
            navigator.clipboard.writeText(url.toString()).then(() => toast.success("Shareable link copied!"));
        } catch {
            toast.error("Failed to generate shareable link.");
        }
    }, [pattern, testStr]);

    const toggleFlag = (f) => setFlags((prev) => ({ ...prev, [f]: !prev[f] }));

    const { matches, segments, error } = useMemo(() => {
        if (!pattern || !testStr) return { matches: [], segments: [], error: "" };
        try {
            const activeFlags = FLAGS_LIST.filter((f) => flags[f]).join("");
            const globalFlags = activeFlags.includes("g") ? activeFlags : `${activeFlags}g`;
            const found = [...testStr.matchAll(new RegExp(pattern, globalFlags))];
            return { matches: found, segments: buildSegments(testStr, found), error: "" };
        } catch (e) {
            return { matches: [], segments: [], error: e.message };
        }
    }, [pattern, flags, testStr]);

    const matchCount = matches.length;

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>Pattern</PanelLabel>
                    {error && <ErrorBadge>Invalid regex</ErrorBadge>}
                </PanelHeader>
                <PatternWrap>
                    <Slash>/</Slash>
                    <PatternInput
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        placeholder="[a-z]+"
                        spellCheck={false}
                        $error={!!error}
                        autoFocus
                    />
                    <Slash>/</Slash>
                </PatternWrap>
                <FlagStrip>
                    <FlagLabel>Flags</FlagLabel>
                    {FLAGS_LIST.map((f) => (
                        <FlagBtn key={f} $active={flags[f]} onClick={() => toggleFlag(f)}>
                            {f}
                        </FlagBtn>
                    ))}
                </FlagStrip>
                <PresetStrip>
                    {PRESETS.map((p) => (
                        <PresetBtn key={p.label} onClick={() => setPattern(p.pattern)}>
                            {p.label}
                        </PresetBtn>
                    ))}
                </PresetStrip>
                <SubHeader>
                    <PanelLabel>Test String</PanelLabel>
                    {testStr && <MetaText>{testStr.length.toLocaleString()} chars</MetaText>}
                </SubHeader>
                <CodeArea
                    value={testStr}
                    onChange={(e) => setTestStr(e.target.value)}
                    placeholder="Paste test string here…"
                    spellCheck={false}
                    style={{ minHeight: 160 }}
                />
                {(pattern || testStr) && (
                    <ActionBar>
                        <ActionBtnGroup>
                            <ActionBtn onClick={handleShare}>
                                <IosShare style={{ fontSize: 11 }} /> Share
                            </ActionBtn>
                        </ActionBtnGroup>
                    </ActionBar>
                )}
            </Panel>

            <Panel>
                <PanelHeader>
                    <PanelLabel>Matches</PanelLabel>
                    {matchCount > 0 && (
                        <MetaText style={{ color: "#22cc99" }}>
                            {matchCount} match{matchCount !== 1 ? "es" : ""}
                        </MetaText>
                    )}
                    {!matchCount && pattern && testStr && !error && <MetaText>No matches</MetaText>}
                </PanelHeader>
                {testStr ? (
                    <>
                        <HighlightArea>
                            {segments.length > 0
                                ? segments.map((seg, i) =>
                                      seg.highlight ? (
                                          // eslint-disable-next-line react/no-array-index-key
                                          <Highlight key={i}>{seg.text}</Highlight>
                                      ) : (
                                          // eslint-disable-next-line react/no-array-index-key
                                          <span key={i}>{seg.text}</span>
                                      )
                                  )
                                : testStr}
                        </HighlightArea>
                        {matchCount > 0 && (
                            <MatchList>
                                {matches.map((m, i) => (
                                    <MatchItem key={m.index}>
                                        <span style={{ color: "#22cc99" }}>#{i + 1}</span> at {m.index}:{" "}
                                        <span style={{ color: "var(--text-primary)" }}>{m[0]}</span>
                                        {m.length > 1 && m.slice(1).some(Boolean) && (
                                            <span style={{ opacity: 0.6, marginLeft: 8 }}>[{m.slice(1).filter(Boolean).join(", ")}]</span>
                                        )}
                                    </MatchItem>
                                ))}
                            </MatchList>
                        )}
                    </>
                ) : (
                    <EmptyState>
                        <span style={{ fontSize: 22, fontFamily: "JetBrains Mono, monospace" }}>/.*/ </span>
                        <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>Enter a pattern and test string to see matches</span>
                    </EmptyState>
                )}
            </Panel>
        </ToolLayout>
    );
}
