import { Check, ContentCopy } from "@mui/icons-material";
import { filter, keys, reduce } from "lodash";
import localization from "localization";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { ActionBar, ActionBtn, ActionBtnGroup, EmptyState, Panel, PanelHeader, PanelLabel, ToolLayout } from "components/Shared/ToolKit";
import LocalBadge from "components/Shared/LocalBadge";

import SendToButton from "components/Shared/SendToButton";
import { GLOBAL_CONSTANTS } from "utils/globalConstants";
import { getRandomNumbers, passwordGenerator } from "utils/helperFunctions";
import zxcvbn from "zxcvbn";

const { passwordGen: L } = localization;

const { PASSWORD_GEN_LIST } = GLOBAL_CONSTANTS;

const CHAR_TYPES = [
    { key: "upperCase", label: L.uppercaseLabel },
    { key: "lowerCase", label: L.lowercaseLabel },
    { key: "numbers", label: L.numbersLabel },
    { key: "symbols", label: L.symbolsLabel }
];

const ControlRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border-color);
`;

const ControlLabel = styled.span`
    font-size: 11px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    min-width: 80px;
`;

const LengthInput = styled.input`
    width: 64px;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    padding: 4px 8px;
    text-align: center;
    outline: none;
    &:focus {
        border-color: #22cc99;
    }
`;

const RuleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    border-bottom: 1px solid var(--border-color);
`;

const StyledCheckbox = styled.input.attrs({ type: "checkbox" })`
    width: 15px;
    height: 15px;
    accent-color: #22cc99;
    cursor: pointer;
    flex-shrink: 0;
`;

const RuleLabel = styled.span`
    font-size: 12px;
    font-family: "Inter", sans-serif;
    color: var(--text-primary);
    flex: 1;
`;

const MinLabel = styled.span`
    font-size: 10px;
    font-family: "Inter", sans-serif;
    color: var(--text-secondary);
`;

const MinSelect = styled.select`
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-family: "Inter", sans-serif;
    font-size: 11px;
    padding: 3px 6px;
    cursor: pointer;
    outline: none;
    &:focus {
        border-color: #22cc99;
    }
`;

const PasswordDisplay = styled.div`
    padding: 20px 16px;
    font-size: 18px;
    font-family: "JetBrains Mono", monospace;
    color: #22cc99;
    word-break: break-all;
    line-height: 1.6;
    flex: 1;
    background: var(--bg-input);
    min-height: 80px;
`;

const MetaSection = styled.div`
    padding: 10px 16px;
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const MetaRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const MetaLabel = styled.span`
    font-size: 10px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
    min-width: 70px;
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
    background: ${(p) => {
        if (p.$score <= 1) return "#ef4444";
        if (p.$score === 2) return "#f97316";
        if (p.$score === 3) return "#fbbf24";
        return "#22cc99";
    }};
    transition: width 0.3s ease, background 0.3s ease;
`;

const BtnGroup = styled(ActionBtnGroup)`
    margin-left: auto;
`;

function getPasswordStrengthLabel(score) {
    if (score <= 2) return L.weakLabel;
    if (score === 3) return L.strongLabel;
    return L.veryStrongLabel;
}

export default function PasswordGenerator() {
    const [password, setPassword] = useState("");
    const [passwordLength, setPasswordLength] = useState(8);
    const [passwordScore, setPasswordScore] = useState(0);
    const [copied, setCopied] = useState(false);
    const [compositionRule, setCompositionRule] = useState({
        upperCase: { min: 2, forbidden: false },
        lowerCase: { min: 2, forbidden: false },
        numbers: { min: 2, forbidden: false },
        symbols: { min: 2, forbidden: false }
    });

    const getUpdatedCompositionRules = (value, rules) => {
        const updatedCompositionRules = { ...rules };
        const compositionKeys = filter(keys(updatedCompositionRules), (key) => !updatedCompositionRules[key].forbidden);
        const flagEnabledLen = reduce(
            compositionKeys,
            (acc, curr) => {
                if (!updatedCompositionRules[curr].forbidden) {
                    // eslint-disable-next-line no-param-reassign
                    acc += 1;
                }
                return acc;
            },
            0
        );
        const factor = value / flagEnabledLen;
        const randomIndex = getRandomNumbers(0, 3);
        for (let i = 0; i < flagEnabledLen; i += 1) {
            if (value % flagEnabledLen !== 0 && randomIndex === i) {
                updatedCompositionRules[compositionKeys[i]].min = Math.floor(factor) + (value % flagEnabledLen);
            } else {
                updatedCompositionRules[compositionKeys[i]].min = Math.floor(factor);
            }
        }
        return updatedCompositionRules;
    };

    const handlePasswordLength = useCallback(
        (e) => {
            const value = Math.max(8, Math.min(32, Number(e.target.value) || 8));
            const updatedCompositionRules = getUpdatedCompositionRules(value, compositionRule);
            setCompositionRule(updatedCompositionRules);
            setPasswordLength(value);
        },
        [compositionRule]
    );

    const handleCompositionChange = useCallback(
        ({ target: { name, checked } }) => {
            setCompositionRule((prevState) => {
                prevState[name].forbidden = !checked;
                const updatedCompositionRules = getUpdatedCompositionRules(passwordLength, prevState);
                return { ...updatedCompositionRules };
            });
        },
        [passwordLength]
    );

    const handleCompositionLength = useCallback(({ target: { name, value } }) => {
        setCompositionRule((prevState) => {
            prevState[name].min = Number(value);
            return { ...prevState };
        });
    }, []);

    const handleGenerate = useCallback(() => {
        const pswdString = passwordGenerator(passwordLength, compositionRule, PASSWORD_GEN_LIST);
        setPassword(pswdString);
        const { score } = zxcvbn(pswdString);
        setPasswordScore(score);
    }, [passwordLength, compositionRule]);

    const handleCopy = useCallback(() => {
        if (!password || !window?.navigator?.clipboard) return;
        window.navigator.clipboard.writeText(password).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }, [password]);

    let charsetSize = 0;
    if (!compositionRule.upperCase.forbidden) charsetSize += 26;
    if (!compositionRule.lowerCase.forbidden) charsetSize += 26;
    if (!compositionRule.numbers.forbidden) charsetSize += 10;
    if (!compositionRule.symbols.forbidden) charsetSize += 32;
    const entropy = password && charsetSize > 0 ? Math.round(password.length * Math.log2(charsetSize)) : 0;
    let entropyLabel = L.strongLabel;
    if (entropy < 40) entropyLabel = L.weakLabel;
    else if (entropy < 60) entropyLabel = L.fairLabel;
    else if (entropy < 80) entropyLabel = "Good";
    let entropyColor = "#22cc99";
    if (entropy < 60) entropyColor = "#ef4444";
    else if (entropy < 80) entropyColor = "#f97316";

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.settingsLabel}</PanelLabel>
                    <LocalBadge />
                </PanelHeader>
                <ControlRow>
                    <ControlLabel>{L.lengthLabel}</ControlLabel>
                    <LengthInput type="number" min={8} max={32} value={passwordLength} onChange={handlePasswordLength} />
                </ControlRow>
                {CHAR_TYPES.map(({ key, label }) => (
                    <RuleRow key={key}>
                        <StyledCheckbox name={key} checked={!compositionRule[key].forbidden} onChange={handleCompositionChange} />
                        <RuleLabel>{label}</RuleLabel>
                        {!compositionRule[key].forbidden && (
                            <>
                                <MinLabel>{L.minLabel}</MinLabel>
                                <MinSelect name={key} value={compositionRule[key].min} onChange={handleCompositionLength}>
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </MinSelect>
                            </>
                        )}
                    </RuleRow>
                ))}
                <ActionBar>
                    <BtnGroup>
                        <ActionBtn onClick={handleGenerate}>{L.generateBtn}</ActionBtn>
                    </BtnGroup>
                </ActionBar>
            </Panel>

            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.passwordLabel}</PanelLabel>
                </PanelHeader>
                {password ? (
                    <>
                        <PasswordDisplay>{password}</PasswordDisplay>
                        <MetaSection>
                            <MetaRow>
                                <MetaLabel>{L.strengthLabel}</MetaLabel>
                                <StrengthBar>
                                    <StrengthFill $score={passwordScore} />
                                </StrengthBar>
                                <MetaValue>{getPasswordStrengthLabel(passwordScore)}</MetaValue>
                            </MetaRow>
                            <MetaRow>
                                <MetaLabel>{L.entropyLabel}</MetaLabel>
                                <MetaValue $color={entropyColor}>
                                    {entropy} bits ({entropyLabel})
                                </MetaValue>
                            </MetaRow>
                        </MetaSection>
                        <ActionBar>
                            <BtnGroup>
                                <ActionBtn $success={copied} onClick={handleCopy}>
                                    {copied ? <Check style={{ fontSize: 11 }} /> : <ContentCopy style={{ fontSize: 11 }} />}
                                    {copied ? L.copiedLabel : L.copyBtn}
                                </ActionBtn>
                                <SendToButton
                                    value={password}
                                    targets={[
                                        { label: "Hash Generator", route: "/hash-generator" },
                                        { label: "Base64 Text", route: "/base64-text" }
                                    ]}
                                />
                            </BtnGroup>
                        </ActionBar>
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
