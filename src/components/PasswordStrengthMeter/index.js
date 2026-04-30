import { Visibility, VisibilityOff } from "@mui/icons-material";
import localization from "localization";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { ActionBar, ActionBtn, ActionBtnGroup, EmptyState, Panel, PanelHeader, PanelLabel, ToolLayout } from "components/Shared/ToolKit";
import LocalBadge from "components/Shared/LocalBadge";

import zxcvbn from "zxcvbn";

const { passwordStrengthMeter: L, common: C } = localization;

function formatCrackTime(seconds) {
    const YEAR = 365.25 * 24 * 3600;
    const MONTH = 30 * 24 * 3600;
    const WEEK = 7 * 24 * 3600;
    const DAY = 24 * 3600;
    const HOUR = 3600;
    if (seconds >= YEAR) {
        const n = Math.round(seconds / YEAR);
        return `${n} ${n === 1 ? "year" : "years"}`;
    }
    if (seconds >= MONTH) {
        const n = Math.round(seconds / MONTH);
        return `${n} ${n === 1 ? "month" : "months"}`;
    }
    if (seconds >= WEEK) {
        const n = Math.round(seconds / WEEK);
        return `${n} ${n === 1 ? "week" : "weeks"}`;
    }
    if (seconds >= DAY) {
        const n = Math.round(seconds / DAY);
        return `${n} ${n === 1 ? "day" : "days"}`;
    }
    if (seconds >= HOUR) {
        const n = Math.round(seconds / HOUR);
        return `${n} ${n === 1 ? "hour" : "hours"}`;
    }
    const n = Math.round(seconds);
    return `${n} ${n === 1 ? "second" : "seconds"}`;
}

function getStrengthLabel(score) {
    if (score <= 1) return L.weak;
    if (score === 2) return "Fair";
    if (score === 3) return L.strong;
    return L.veryStrong;
}

function getStrengthColor(score) {
    if (score <= 1) return "#ef4444";
    if (score === 2) return "#f97316";
    if (score === 3) return "#fbbf24";
    return "#22cc99";
}

const TipText = styled.p`
    font-size: 13px;
    font-family: "Inter", sans-serif;
    color: var(--text-secondary);
    padding: 12px 16px;
    margin: 0;
    border-bottom: 1px solid var(--border-color);
    line-height: 1.5;
`;

const PasswordInputWrap = styled.div`
    display: flex;
    align-items: center;
    padding: 14px 16px;
    gap: 8px;
`;

const PasswordInput = styled.input`
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-family: "JetBrains Mono", monospace;
    font-size: 14px;
    letter-spacing: 0.05em;
    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.5;
    }
`;

const ShowToggle = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.15s ease;
    &:hover {
        color: var(--text-primary);
    }
`;

const ResultSection = styled.div`
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const MetaRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const MetaLabel = styled.span`
    font-size: 12px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
    min-width: 80px;
`;

const MetaValue = styled.span`
    font-size: 12px;
    font-family: "JetBrains Mono", monospace;
    color: ${(p) => p.$color || "var(--text-primary)"};
`;

const StrengthBar = styled.div`
    height: 4px;
    border-radius: 2px;
    background: var(--border-color);
    overflow: hidden;
    flex: 1;
`;

const StrengthFill = styled.div`
    height: 100%;
    border-radius: 2px;
    width: ${(p) => (p.$score + 1) * 20}%;
    background: ${(p) => getStrengthColor(p.$score)};
    transition: width 0.3s ease, background 0.3s ease;
`;

const CharTypeSection = styled.div`
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
`;

const CharTypeLabel = styled.span`
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
`;

const CharTypePills = styled.div`
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
`;

const CharPill = styled.span`
    font-size: 13px;
    font-family: "Inter", sans-serif;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 20px;
    border: 1px solid ${(p) => (p.$active ? "rgba(34,204,153,0.4)" : "var(--border-color)")};
    color: ${(p) => (p.$active ? "#22cc99" : "var(--text-secondary)")};
    background: ${(p) => (p.$active ? "rgba(34,204,153,0.08)" : "transparent")};
    opacity: ${(p) => (p.$active ? 1 : 0.4)};
    transition: all 0.15s ease;
`;

const SYMBOLS_RE = /[!#$%&*+\-.@^_~%()=`[\]{}|\\/.,<>:;"'+=?]/;

export default function PasswordStrengthMeter() {
    const [password, setPassword] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const analyze = useCallback(() => {
        if (!password) {
            setAnalysis(null);
            return;
        }
        const result = zxcvbn(password);
        const secs = result.crack_times_seconds?.online_no_throttling_10_per_second ?? 0;
        setAnalysis({
            score: result.score,
            crackTime: formatCrackTime(secs),
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumbers: /[0-9]/.test(password),
            hasSymbols: SYMBOLS_RE.test(password)
        });
    }, [password]);

    useEffect(() => {
        const timer = setTimeout(analyze, 300);
        return () => clearTimeout(timer);
    }, [analyze]);

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.passwordInputLabel}</PanelLabel>
                    <LocalBadge />
                </PanelHeader>
                <TipText>
                    <b>{L.tipLabel}</b> {L.tipFullText}
                </TipText>
                <PasswordInputWrap>
                    <PasswordInput
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={L.passwordFieldPlaceholderText}
                        autoComplete="new-password"
                        spellCheck={false}
                    />
                    <ShowToggle onClick={() => setShowPassword((v) => !v)} title={showPassword ? L.hideLabel : L.showLabel}>
                        {showPassword ? <VisibilityOff style={{ fontSize: 16 }} /> : <Visibility style={{ fontSize: 16 }} />}
                    </ShowToggle>
                </PasswordInputWrap>
                {password && (
                    <ActionBar>
                        <ActionBtnGroup>
                            <ActionBtn $danger onClick={() => setPassword("")}>
                                {C.clearBtn}
                            </ActionBtn>
                        </ActionBtnGroup>
                    </ActionBar>
                )}
            </Panel>

            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.analysisLabel}</PanelLabel>
                </PanelHeader>
                {analysis ? (
                    <>
                        <ResultSection>
                            <MetaRow>
                                <MetaLabel>{L.strengthLabel}</MetaLabel>
                                <StrengthBar>
                                    <StrengthFill $score={analysis.score} />
                                </StrengthBar>
                                <MetaValue $color={getStrengthColor(analysis.score)}>{getStrengthLabel(analysis.score)}</MetaValue>
                            </MetaRow>
                            <MetaRow>
                                <MetaLabel>{L.crackTimeLabel}</MetaLabel>
                                <MetaValue>{analysis.crackTime}</MetaValue>
                            </MetaRow>
                            <MetaRow>
                                <MetaLabel>{L.lengthLabel}</MetaLabel>
                                <MetaValue>{password.length} characters</MetaValue>
                            </MetaRow>
                        </ResultSection>
                        <CharTypeSection>
                            <CharTypeLabel>{L.containsLabel}</CharTypeLabel>
                            <CharTypePills>
                                <CharPill $active={analysis.hasUpperCase}>{L.uppercaseLabel}</CharPill>
                                <CharPill $active={analysis.hasLowerCase}>{L.lowercaseLabel}</CharPill>
                                <CharPill $active={analysis.hasNumbers}>{L.numbersLabel}</CharPill>
                                <CharPill $active={analysis.hasSymbols}>{L.symbolsLabel}</CharPill>
                            </CharTypePills>
                        </CharTypeSection>
                    </>
                ) : (
                    <EmptyState>
                        <span style={{ fontSize: 22, fontFamily: "JetBrains Mono, monospace" }}>••••••••</span>
                        <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>{L.emptyStateMessage}</span>
                    </EmptyState>
                )}
            </Panel>
        </ToolLayout>
    );
}
