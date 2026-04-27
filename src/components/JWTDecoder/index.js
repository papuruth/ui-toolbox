import { Check, ContentCopy } from "@mui/icons-material";
import localization from "localization";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    CodeArea,
    EmptyState,
    Panel,
    PanelHeader,
    PanelLabel,
    TabBtn,
    TabStrip,
    ToolLayout
} from "components/Shared/ToolKit";

const { jwtDecoder: L } = localization;

function safeDecodeSegment(str) {
    try {
        const padded = str.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(padded));
    } catch {
        return null;
    }
}

function formatRelative(unixSec) {
    const diff = unixSec - Math.floor(Date.now() / 1000);
    const abs = Math.abs(diff);
    const expired = diff < 0;
    if (abs < 60) return `${expired ? "expired" : "expires in"} ${abs}s`;
    if (abs < 3600) return `${expired ? "expired" : "expires in"} ${Math.floor(abs / 60)}m`;
    if (abs < 86400) return `${expired ? "expired" : "expires in"} ${Math.floor(abs / 3600)}h`;
    return `${expired ? "expired" : "expires in"} ${Math.floor(abs / 86400)}d`;
}

const BadgeRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border-color);
`;

const Badge = styled.span`
    font-size: 12px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    padding: 3px 8px;
    border-radius: 4px;
    background: ${(p) => {
        if (p.$type === "error") return "rgba(239,68,68,0.12)";
        if (p.$type === "success") return "rgba(34,204,153,0.12)";
        if (p.$type === "warning") return "rgba(251,191,36,0.12)";
        return "rgba(99,102,241,0.12)";
    }};
    color: ${(p) => {
        if (p.$type === "error") return "#ef4444";
        if (p.$type === "success") return "#22cc99";
        if (p.$type === "warning") return "#fbbf24";
        return "#818cf8";
    }};
`;

const JsonOutput = styled.pre`
    flex: 1;
    min-height: 260px;
    background: var(--bg-input);
    color: var(--text-primary);
    padding: 16px;
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 12px;
    line-height: 1.75;
    margin: 0;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-all;
`;

const SigValue = styled.div`
    padding: 16px;
    font-size: 13px;
    font-family: "JetBrains Mono", monospace;
    color: var(--text-secondary);
    background: var(--bg-input);
    word-break: break-all;
    line-height: 1.75;
    flex: 1;
`;

const ErrorBadge = styled.span`
    font-size: 13px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 4px;
    padding: 2px 8px;
`;

const BtnGroup = styled(ActionBtnGroup)`
    margin-left: auto;
`;

const TABS = ["header", "payload", "signature"];

export default function JWTDecoder() {
    const [token, setToken] = useState("");
    const [tab, setTab] = useState("header");
    const [copied, setCopied] = useState(false);

    const { header, payload, signature, badges, error } = useMemo(() => {
        if (!token.trim()) return { header: null, payload: null, signature: null, badges: [], error: "" };
        const parts = token.trim().split(".");
        if (parts.length !== 3) return { header: null, payload: null, signature: null, badges: [], error: L.invalidJwtError };
        const h = safeDecodeSegment(parts[0]);
        const p = safeDecodeSegment(parts[1]);
        if (!h || !p) return { header: null, payload: null, signature: null, badges: [], error: "Failed to decode JWT segments" };
        const now = Math.floor(Date.now() / 1000);
        const computed = [];
        if (h.alg) computed.push({ label: h.alg, type: "info" });
        if (p.exp) {
            computed.push({ label: formatRelative(p.exp), type: now > p.exp ? "error" : "success" });
        } else {
            computed.push({ label: "No expiry", type: "warning" });
        }
        if (p.nbf && now < p.nbf) computed.push({ label: "Not valid yet", type: "warning" });
        if (p.iss) computed.push({ label: `iss: ${p.iss}`, type: "info" });
        if (p.sub) computed.push({ label: `sub: ${p.sub}`, type: "info" });
        return { header: h, payload: p, signature: parts[2], badges: computed, error: "" };
    }, [token]);

    const handleCopy = useCallback(() => {
        let value;
        if (tab === "signature") value = signature;
        else if (tab === "header") value = header ? JSON.stringify(header, null, 2) : null;
        else value = payload ? JSON.stringify(payload, null, 2) : null;
        if (!value || !window?.navigator?.clipboard) return;
        window.navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }, [tab, signature, header, payload]);

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>JWT Token</PanelLabel>
                    {error && <ErrorBadge>{error}</ErrorBadge>}
                </PanelHeader>
                <CodeArea
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste your JWT token here…"
                    spellCheck={false}
                    autoFocus
                />
                {badges.length > 0 && (
                    <BadgeRow>
                        {badges.map((b) => (
                            <Badge key={b.label} $type={b.type}>
                                {b.label}
                            </Badge>
                        ))}
                    </BadgeRow>
                )}
            </Panel>

            <Panel>
                <TabStrip>
                    {TABS.map((t) => (
                        <TabBtn key={t} $active={tab === t} onClick={() => setTab(t)}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </TabBtn>
                    ))}
                </TabStrip>
                {header ? (
                    <>
                        {tab === "signature" ? (
                            <SigValue>{signature}</SigValue>
                        ) : (
                            <JsonOutput>{JSON.stringify(tab === "header" ? header : payload, null, 2)}</JsonOutput>
                        )}
                        <ActionBar>
                            <BtnGroup>
                                <ActionBtn $success={copied} onClick={handleCopy}>
                                    {copied ? <Check style={{ fontSize: 11 }} /> : <ContentCopy style={{ fontSize: 11 }} />}
                                    {copied ? "Copied" : "Copy"}
                                </ActionBtn>
                            </BtnGroup>
                        </ActionBar>
                    </>
                ) : (
                    <EmptyState>
                        <span style={{ fontSize: 22, fontFamily: "JetBrains Mono, monospace" }}>{}</span>
                        <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>Paste a JWT token to decode it</span>
                    </EmptyState>
                )}
            </Panel>
        </ToolLayout>
    );
}
