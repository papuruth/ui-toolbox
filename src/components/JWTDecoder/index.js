import { Close, OpenInFull, Visibility, VisibilityOff } from "@mui/icons-material";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import localization from "localization";
import PropTypes from "prop-types";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useToolChain } from "context/ToolChainContext";
import styled from "styled-components";
import {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    EmptyState,
    Panel,
    PanelHeader,
    PanelLabel,
    TabBtn,
    TabStrip,
    ToolLayout
} from "components/Shared/ToolKit";
import LocalBadge from "components/Shared/LocalBadge";

const { jwtDecoder: L, common: C } = localization;

const CLAIM_META = {
    alg: { desc: "The algorithm used to sign the JWT." },
    typ: { desc: "The media type of this complete JWT." },
    kid: { desc: "Identifies the key used to sign the token." },
    iss: { desc: "Identifies the principal that issued the JWT." },
    sub: { desc: "The subject of the JWT (the user)." },
    aud: { desc: "Recipients this JWT is intended for." },
    exp: { desc: "The time after which the JWT expires.", note: "NumericDate" },
    nbf: { desc: "The time before which the JWT must not be accepted.", note: "NumericDate" },
    iat: { desc: "The time at which the JWT was issued.", note: "NumericDate" },
    jti: { desc: "Unique identifier for this token." }
};

const EXAMPLE_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
    ".eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ" +
    ".SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

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

function formatClaimValue(key, value) {
    const meta = CLAIM_META[key];
    if (meta?.note === "NumericDate" && typeof value === "number") {
        return `${value} (${new Date(value * 1000).toString()})`;
    }
    if (typeof value === "object" && value !== null) return JSON.stringify(value);
    return String(value);
}

async function verifyHmac(tokenStr, secret, alg, b64Encoded) {
    const algMap = { HS256: "SHA-256", HS384: "SHA-384", HS512: "SHA-512" };
    const hashName = algMap[alg];
    if (!hashName) return "unsupported";
    try {
        const parts = tokenStr.split(".");
        const signingInput = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
        let keyBytes;
        if (b64Encoded) {
            const normalized = secret.replace(/-/g, "+").replace(/_/g, "/");
            const bin = atob(normalized);
            keyBytes = new Uint8Array(bin.length).map((_, i) => bin.charCodeAt(i));
        } else {
            keyBytes = new TextEncoder().encode(secret);
        }
        const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: hashName }, false, ["sign"]);
        const sigBuf = await crypto.subtle.sign("HMAC", key, signingInput);
        const computed = btoa(String.fromCharCode(...new Uint8Array(sigBuf)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=/g, "");
        return computed === parts[2] ? "valid" : "invalid";
    } catch {
        return "error";
    }
}

// ─── Styled components ────────────────────────────────────────────────────────

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

const StatusBadge = styled.span`
    font-size: 12px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    padding: 3px 10px;
    border-radius: 4px;
    margin-left: auto;
    background: ${(p) => (p.$valid ? "rgba(34,204,153,0.12)" : "rgba(239,68,68,0.12)")};
    color: ${(p) => (p.$valid ? "#22cc99" : "#ef4444")};
`;

const BtnGroup = styled(ActionBtnGroup)`
    margin-left: auto;
`;

// Token overlay — font/padding/line-height must exactly match CodeArea
const TOKEN_LAYER = `
  font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
  font-size: 12px;
  line-height: 21px;
  letter-spacing: 0;
  margin: 0;
  padding: 16px;
  border: none;
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: break-word;
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
  width: 100%;
  box-sizing: border-box;
`;

const TokenWrapper = styled.div`
    position: relative;
    display: block;
    min-height: 260px;
    background: var(--bg-input);
    overflow: auto;
    transition: box-shadow 0.2s ease;
    &:focus-within {
        box-shadow: inset 0 0 0 2px rgba(34, 204, 153, 0.3);
    }
`;

const TokenHighlight = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    pointer-events: none;
    color: transparent;
    ${TOKEN_LAYER}
`;

const TokenTextarea = styled.textarea`
    display: block;
    position: relative;
    background: transparent;
    color: transparent;
    caret-color: var(--text-primary);
    outline: none;
    resize: none;
    overflow: hidden;
    -webkit-appearance: none;
    appearance: none;
    z-index: 1;
    ${TOKEN_LAYER}
`;

// Right-panel sections
const SectionBlock = styled.div`
    border-bottom: 1px solid var(--border-color);
    &:last-child {
        border-bottom: none;
    }
`;

const SectionTitle = styled.div`
    padding: 8px 16px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-secondary);
    background: rgba(0, 0, 0, 0.04);
    border-bottom: 1px solid var(--border-color);
`;

const TabRow = styled.div`
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid var(--border-color);
    background: rgba(0, 0, 0, 0.04);
`;

const JsonOutput = styled.pre`
    background: var(--bg-input);
    color: var(--text-primary);
    padding: 16px;
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 12px;
    line-height: 1.75;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
    min-height: 80px;
`;

const ClaimsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    background: var(--bg-input);
`;

const ClaimsTh = styled.th`
    text-align: left;
    padding: 8px 12px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-surface);
`;

const ClaimsTr = styled.tr`
    &:last-child td {
        border-bottom: none;
    }
`;

const ClaimsTd = styled.td`
    padding: 8px 12px;
    vertical-align: top;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
    &.key {
        font-family: "JetBrains Mono", monospace;
        font-size: 11px;
        color: #818cf8;
        white-space: nowrap;
        width: 90px;
    }
    &.value {
        font-family: "JetBrains Mono", monospace;
        font-size: 11px;
        word-break: break-all;
    }
    &.desc {
        font-size: 11px;
        color: var(--text-secondary);
        font-style: italic;
        min-width: 140px;
    }
`;

const NumericNote = styled.div`
    padding: 6px 12px;
    font-size: 11px;
    color: var(--text-secondary);
    background: var(--bg-input);
    border-top: 1px solid var(--border-color);
    font-style: italic;
`;

const SigRaw = styled.div`
    padding: 12px 16px;
    font-size: 12px;
    font-family: "JetBrains Mono", monospace;
    color: #8b5cf6;
    background: var(--bg-input);
    word-break: break-all;
    line-height: 1.75;
    border-bottom: 1px solid var(--border-color);
`;

const VerifyForm = styled.div`
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--bg-surface);
`;

const VerifyFormLabel = styled.div`
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-secondary);
`;

const SecretInput = styled.input`
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    padding: 8px 10px;
    outline: none;
    width: 100%;
    &:focus {
        border-color: #818cf8;
    }
    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.5;
    }
`;

const SecretInputRow = styled.div`
    display: flex;
    gap: 0;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
    &:focus-within {
        border-color: #818cf8;
    }
`;

const B64ToggleBtn = styled.button`
    flex-shrink: 0;
    background: ${(p) => (p.$active ? "rgba(129,140,248,0.15)" : "rgba(0,0,0,0.04)")};
    color: ${(p) => (p.$active ? "#818cf8" : "var(--text-secondary)")};
    border: none;
    border-left: 1px solid var(--border-color);
    padding: 0 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s, color 0.15s;
    &:hover {
        background: rgba(129, 140, 248, 0.1);
        color: #818cf8;
    }
`;

const SigStatusBadge = styled.span`
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 4px;
    background: ${(p) => {
        if (p.$s === "valid") return "rgba(34,204,153,0.12)";
        if (p.$s === "invalid") return "rgba(239,68,68,0.12)";
        if (p.$s === "unsupported") return "rgba(251,191,36,0.12)";
        return "rgba(99,102,241,0.12)";
    }};
    color: ${(p) => {
        if (p.$s === "valid") return "#22cc99";
        if (p.$s === "invalid") return "#ef4444";
        if (p.$s === "unsupported") return "#fbbf24";
        return "#818cf8";
    }};
`;

// ─── ClaimsCard ───────────────────────────────────────────────────────────────

function ClaimsCard({ title, data, showDetails, onToggleDetails }) {
    const [tab, setTab] = useState("json");
    const [expanded, setExpanded] = useState(false);

    const hasNumericDate = Object.keys(data).some((k) => CLAIM_META[k]?.note === "NumericDate");

    const renderTable = () => (
        <>
            <ClaimsTable>
                <thead>
                    <tr>
                        <ClaimsTh>{L.claimCol}</ClaimsTh>
                        <ClaimsTh>{L.valueCol}</ClaimsTh>
                        {showDetails && <ClaimsTh>{L.descriptionCol}</ClaimsTh>}
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data).map(([k, v]) => (
                        <ClaimsTr key={k}>
                            <ClaimsTd className="key">{k}</ClaimsTd>
                            <ClaimsTd className="value">{formatClaimValue(k, v)}</ClaimsTd>
                            {showDetails && <ClaimsTd className="desc">{CLAIM_META[k]?.desc ?? "—"}</ClaimsTd>}
                        </ClaimsTr>
                    ))}
                </tbody>
            </ClaimsTable>
            {hasNumericDate && <NumericNote>{L.numericDateNote}</NumericNote>}
        </>
    );

    const renderContent = () =>
        tab === "json" ? (
            <JsonOutput>{JSON.stringify(data, null, 2)}</JsonOutput>
        ) : (
            renderTable()
        );

    const renderTabRow = (inDialog) => (
        <TabRow>
            <TabStrip style={{ flex: 1, borderBottom: "none" }}>
                <TabBtn $active={tab === "json"} onClick={() => setTab("json")}>
                    {L.jsonTab}
                </TabBtn>
                <TabBtn $active={tab === "claims"} onClick={() => setTab("claims")}>
                    {L.claimsBreakdownTab}
                </TabBtn>
            </TabStrip>
            <IconButton
                size="small"
                onClick={onToggleDetails}
                title={showDetails ? L.hideDetailsLabel : L.showDetailsLabel}
                sx={{ color: "var(--text-secondary)", borderRadius: 1, px: 1 }}
            >
                {showDetails ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
            {inDialog ? (
                <IconButton
                    size="small"
                    onClick={() => setExpanded(false)}
                    sx={{ color: "var(--text-secondary)", borderRadius: 1, px: 1 }}
                >
                    <Close fontSize="small" />
                </IconButton>
            ) : (
                <IconButton
                    size="small"
                    onClick={() => setExpanded(true)}
                    sx={{ color: "var(--text-secondary)", borderRadius: 1, px: 1 }}
                >
                    <OpenInFull fontSize="small" />
                </IconButton>
            )}
        </TabRow>
    );

    return (
        <SectionBlock>
            <SectionTitle>{title}</SectionTitle>
            {renderTabRow(false)}
            {renderContent()}

            <Dialog
                open={expanded}
                onClose={() => setExpanded(false)}
                fullWidth
                maxWidth="md"
                PaperProps={{ sx: { background: "var(--bg-surface)", color: "var(--text-primary)" } }}
            >
                <SectionTitle>{title}</SectionTitle>
                {renderTabRow(true)}
                <DialogContent sx={{ p: 0, overflow: "auto" }}>{renderContent()}</DialogContent>
            </Dialog>
        </SectionBlock>
    );
}

ClaimsCard.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({}).isRequired,
    showDetails: PropTypes.bool.isRequired,
    onToggleDetails: PropTypes.func.isRequired
};

// ─── SigVerify ────────────────────────────────────────────────────────────────

function SigVerify({ token, alg, signature }) {
    const [secret, setSecret] = useState("");
    const [b64, setB64] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        let timer;
        if (secret.trim()) {
            timer = setTimeout(async () => {
                const result = await verifyHmac(token, secret.trim(), alg, b64);
                setStatus(result);
            }, 300);
        } else {
            setStatus(null);
        }
        return () => clearTimeout(timer);
    }, [token, secret, alg, b64]);

    const STATUS_LABELS = {
        valid: L.sigValidLabel,
        invalid: L.sigInvalidLabel,
        unsupported: L.sigUnsupportedLabel,
        error: "Verification error"
    };

    return (
        <SectionBlock>
            <SectionTitle>{L.signatureLabel}</SectionTitle>
            <SigRaw>{signature}</SigRaw>
            <VerifyForm>
                <VerifyFormLabel>{L.signatureVerifyLabel}</VerifyFormLabel>
                <SecretInputRow>
                    <SecretInput
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder={L.secretKeyPlaceholder}
                        style={{ border: "none", borderRadius: 0 }}
                    />
                    <B64ToggleBtn $active={b64} onClick={() => setB64((v) => !v)}>
                        {L.base64EncodedToggle}
                    </B64ToggleBtn>
                </SecretInputRow>
                {status && <SigStatusBadge $s={status}>{STATUS_LABELS[status]}</SigStatusBadge>}
            </VerifyForm>
        </SectionBlock>
    );
}

SigVerify.propTypes = {
    token: PropTypes.string.isRequired,
    alg: PropTypes.string,
    signature: PropTypes.string
};

SigVerify.defaultProps = {
    alg: "",
    signature: ""
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function JWTDecoder() {
    const { state } = useLocation();
    const [token, setToken] = useState("");
    const [showDetails, setShowDetails] = useState(true);
    const { consumeChain } = useToolChain();
    const textareaRef = useRef(null);
    const selectionRef = useRef({ start: 0, end: 0 });
    const shouldFocusRef = useRef(false);

    // Restore cursor after every render — React controlled textarea resets it on each commit
    useLayoutEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
        if (shouldFocusRef.current) {
            shouldFocusRef.current = false;
            el.focus();
        }
        el.setSelectionRange(selectionRef.current.start, selectionRef.current.end);
    });

    const handleTokenChange = (e) => {
        selectionRef.current = { start: e.target.selectionStart, end: e.target.selectionEnd };
        setToken(e.target.value);
    };

    const handleTokenDoubleClick = () => {
        if (!token || !textareaRef.current) return;
        const parts = token.split(".");
        if (parts.length !== 3) return;
        requestAnimationFrame(() => {
            if (!textareaRef.current) return;
            const pos = textareaRef.current.selectionStart;
            const end0 = parts[0].length;
            const end1 = end0 + 1 + parts[1].length;
            let start;
            let end;
            if (pos <= end0) { start = 0; end = end0; }
            else if (pos <= end1) { start = end0 + 1; end = end1; }
            else { start = end1 + 1; end = token.length; }
            selectionRef.current = { start, end };
            textareaRef.current.setSelectionRange(start, end);
        });
    };

    const setTokenEnd = (value) => {
        selectionRef.current = { start: value.length, end: value.length };
        shouldFocusRef.current = true;
        setToken(value);
    };

    useEffect(() => {
        if (state?.prefill) setTokenEnd(state.prefill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state?.prefill]);

    useEffect(() => {
        const chained = consumeChain("/jwt-decoder");
        if (chained) setTokenEnd(chained);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [consumeChain]);

    const { header, payload, signature, badges, error } = useMemo(() => {
        if (!token.trim()) return { header: null, payload: null, signature: null, badges: [], error: "" };
        const parts = token.trim().split(".");
        if (parts.length !== 3) return { header: null, payload: null, signature: null, badges: [], error: L.invalidJwtError };
        const h = safeDecodeSegment(parts[0]);
        const p = safeDecodeSegment(parts[1]);
        if (!h || !p) return { header: null, payload: null, signature: null, badges: [], error: L.decodeError };
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

    const renderHighlight = (raw) => {
        const parts = raw.split(".");
        if (parts.length !== 3) {
            return <span style={{ color: "var(--text-primary)" }}>{raw}</span>;
        }
        return (
            <>
                <span style={{ color: "#d97706" }}>{parts[0]}</span>
                <span style={{ color: "var(--text-secondary)", opacity: 0.5 }}>.</span>
                <span style={{ color: "#3b82f6" }}>{parts[1]}</span>
                <span style={{ color: "var(--text-secondary)", opacity: 0.5 }}>.</span>
                <span style={{ color: "#8b5cf6" }}>{parts[2]}</span>
            </>
        );
    };

    const isValid = !!header && !error;

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.jwtTokenLabel}</PanelLabel>
                    <BtnGroup>
                        <ActionBtn onClick={() => setTokenEnd(EXAMPLE_TOKEN)}>{L.generateExampleBtn}</ActionBtn>
                        <LocalBadge />
                    </BtnGroup>
                </PanelHeader>
                <TokenWrapper>
                    <TokenHighlight aria-hidden="true">
                        {token ? (
                            renderHighlight(token)
                        ) : (
                            <span style={{ color: "var(--text-secondary)", opacity: 0.4 }}>{L.placeholder}</span>
                        )}
                    </TokenHighlight>
                    <TokenTextarea
                        ref={textareaRef}
                        value={token}
                        onChange={handleTokenChange}
                        onDoubleClick={handleTokenDoubleClick}
                        spellCheck={false}
                        autoFocus
                    />
                </TokenWrapper>
                {token && (
                    <ActionBar>
                        <ActionBtn $danger onClick={() => setToken("")}>
                            {C.clearBtn}
                        </ActionBtn>
                        {isValid ? (
                            <StatusBadge $valid>{L.validJwtLabel}</StatusBadge>
                        ) : (
                            error && <StatusBadge>{error}</StatusBadge>
                        )}
                    </ActionBar>
                )}
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

            <Panel style={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}>
                {header ? (
                    <>
                        <ClaimsCard
                            title={L.decodedHeaderLabel}
                            data={header}
                            showDetails={showDetails}
                            onToggleDetails={() => setShowDetails((v) => !v)}
                        />
                        <ClaimsCard
                            title={L.decodedPayloadLabel}
                            data={payload}
                            showDetails={showDetails}
                            onToggleDetails={() => setShowDetails((v) => !v)}
                        />
                        <SigVerify token={token.trim()} alg={header?.alg} signature={signature} />
                    </>
                ) : (
                    <EmptyState>
                        <span style={{ fontSize: 22, fontFamily: "JetBrains Mono, monospace" }}>{}</span>
                        <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>{L.emptyStateMessage}</span>
                    </EmptyState>
                )}
            </Panel>
        </ToolLayout>
    );
}
