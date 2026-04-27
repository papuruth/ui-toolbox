import { Check, ContentCopy } from "@mui/icons-material";
import localization from "localization";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Panel, PanelHeader, PanelLabel, ToolLayout } from "components/Shared/ToolKit";

const { colorConverter: L } = localization;

function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    if (clean.length !== 6) return null;
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return `#${[r, g, b].map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl(r, g, b) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        else if (max === gn) h = ((bn - rn) / d + 2) / 6;
        else h = ((rn - gn) / d + 4) / 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
    const hn = h / 360;
    const sn = s / 100;
    const ln = l / 100;
    if (sn === 0) {
        const v = Math.round(ln * 255);
        return { r: v, g: v, b: v };
    }
    const hue2rgb = (p, q, t) => {
        const tt = ((t % 1) + 1) % 1;
        if (tt < 1 / 6) return p + (q - p) * 6 * tt;
        if (tt < 0.5) return q;
        if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
        return p;
    };
    const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
    const p = 2 * ln - q;
    return { r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255), g: Math.round(hue2rgb(p, q, hn) * 255), b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255) };
}

function relativeLuminance(r, g, b) {
    const chan = [r, g, b].map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
}

function contrastRatio(r1, g1, b1, r2, g2, b2) {
    const l1 = relativeLuminance(r1, g1, b1);
    const l2 = relativeLuminance(r2, g2, b2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

function getContrastLabel(ratio) {
    if (ratio >= 7) return { label: "AAA", type: "success" };
    if (ratio >= 4.5) return { label: "AA", type: "success" };
    if (ratio >= 3) return { label: "AA Large", type: "warning" };
    return { label: "Fail", type: "error" };
}

const InputSection = styled.div`
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const SectionLabel = styled.span`
    font-size: 12px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
`;

const InputRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const StyledInput = styled.input`
    flex: 1;
    background: var(--bg-input);
    border: 1px solid ${(p) => (p.$error ? "#ef4444" : "var(--border-color)")};
    border-radius: 4px;
    color: var(--text-primary);
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    padding: 6px 10px;
    outline: none;
    min-width: 0;
    &:focus {
        border-color: ${(p) => (p.$error ? "#ef4444" : "#22cc99")};
    }
`;

const ChannelInput = styled.input`
    width: 60px;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    padding: 6px 8px;
    text-align: center;
    outline: none;
    &:focus {
        border-color: #22cc99;
    }
`;

const ChannelLabel = styled.span`
    font-size: 12px;
    font-family: "Inter", sans-serif;
    color: var(--text-secondary);
    font-weight: 600;
    min-width: 14px;
`;

const ColorPickerInput = styled.input.attrs({ type: "color" })`
    width: 40px;
    height: 36px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: none;
    padding: 0;
    flex-shrink: 0;
`;

const Swatch = styled.div`
    height: 80px;
    background: ${(p) => p.$color};
    border-bottom: 1px solid var(--border-color);
    transition: background 0.2s;
`;

const ResultRow = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    gap: 12px;
`;

const ResultLabel = styled.span`
    font-size: 12px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
    min-width: 40px;
`;

const ResultValue = styled.span`
    font-size: 12px;
    font-family: "JetBrains Mono", monospace;
    color: var(--text-primary);
    flex: 1;
`;

const RowCopyBtn = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    padding: 8px;
    min-width: 36px;
    min-height: 36px;
    justify-content: center;
    border-radius: 3px;
    &:hover {
        color: var(--text-primary);
        background: rgba(255, 255, 255, 0.05);
    }
`;

const ContrastSection = styled.div`
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid var(--border-color);
`;

const ContrastRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const ContrastSwatch = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background: ${(p) => p.$color};
    border: 2px solid ${(p) => p.$border};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    color: ${(p) => p.$textColor};
    flex-shrink: 0;
    font-family: "Inter", sans-serif;
`;

const ContrastMeta = styled.span`
    font-size: 13px;
    font-family: "Inter", sans-serif;
    color: var(--text-secondary);
    min-width: 70px;
`;

const ContrastValue = styled.span`
    font-size: 12px;
    font-family: "JetBrains Mono", monospace;
    color: var(--text-primary);
    flex: 1;
`;

const WcagBadge = styled.span`
    font-size: 12px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    padding: 2px 8px;
    border-radius: 4px;
    background: ${(p) => {
        if (p.$type === "error") return "rgba(239,68,68,0.12)";
        if (p.$type === "warning") return "rgba(251,191,36,0.12)";
        return "rgba(34,204,153,0.12)";
    }};
    color: ${(p) => {
        if (p.$type === "error") return "#ef4444";
        if (p.$type === "warning") return "#fbbf24";
        return "#22cc99";
    }};
`;

export default function ColorConverter() {
    const [hex, setHex] = useState("#22cc99");
    const [rgb, setRgb] = useState({ r: 34, g: 204, b: 153 });
    const [hsl, setHsl] = useState({ h: 160, s: 71, l: 47 });
    const [hexError, setHexError] = useState("");
    const [copiedKey, setCopiedKey] = useState(null);

    const updateFromHex = useCallback((value) => {
        setHex(value);
        setHexError("");
        const rgbVal = hexToRgb(value);
        if (rgbVal) {
            setRgb(rgbVal);
            setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
        } else if (value.replace("#", "").length > 0) {
            setHexError(L.invalidHexColorError);
        }
    }, []);

    const updateFromRgb = useCallback(
        (field, raw) => {
            const val = Math.min(255, Math.max(0, parseInt(raw, 10) || 0));
            const newRgb = { ...rgb, [field]: val };
            setRgb(newRgb);
            setHexError("");
            setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
            setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
        },
        [rgb]
    );

    const updateFromHsl = useCallback(
        (field, raw) => {
            const max = field === "h" ? 360 : 100;
            const val = Math.min(max, Math.max(0, parseInt(raw, 10) || 0));
            const newHsl = { ...hsl, [field]: val };
            setHsl(newHsl);
            setHexError("");
            const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
            setRgb(newRgb);
            setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        },
        [hsl]
    );

    const handleCopy = useCallback((key, value) => {
        if (!window?.navigator?.clipboard) return;
        window.navigator.clipboard.writeText(value).then(() => {
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 1500);
        });
    }, []);

    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    const displayHex = hexError ? "#cccccc" : hex;

    const contrastWhite = contrastRatio(rgb.r, rgb.g, rgb.b, 255, 255, 255);
    const contrastBlack = contrastRatio(rgb.r, rgb.g, rgb.b, 0, 0, 0);
    const wLabel = getContrastLabel(contrastWhite);
    const bLabel = getContrastLabel(contrastBlack);

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.colorLabel}</PanelLabel>
                    {hexError && <span style={{ fontSize: 11, color: "#ef4444" }}>{hexError}</span>}
                </PanelHeader>

                <InputSection>
                    <InputRow>
                        <ColorPickerInput value={displayHex} onChange={(e) => updateFromHex(e.target.value)} />
                        <SectionLabel style={{ minWidth: 36 }}>HEX</SectionLabel>
                        <StyledInput
                            value={hex}
                            onChange={(e) => updateFromHex(e.target.value)}
                            $error={!!hexError}
                            spellCheck={false}
                            placeholder="#rrggbb"
                        />
                    </InputRow>
                </InputSection>

                <InputSection>
                    <SectionLabel>RGB</SectionLabel>
                    <InputRow>
                        {["r", "g", "b"].map((ch) => (
                            <React.Fragment key={ch}>
                                <ChannelLabel>{ch.toUpperCase()}</ChannelLabel>
                                <ChannelInput type="number" min={0} max={255} value={rgb[ch]} onChange={(e) => updateFromRgb(ch, e.target.value)} />
                            </React.Fragment>
                        ))}
                    </InputRow>
                </InputSection>

                <InputSection>
                    <SectionLabel>HSL</SectionLabel>
                    <InputRow>
                        {[
                            { k: "h", label: "H" },
                            { k: "s", label: "S" },
                            { k: "l", label: "L" }
                        ].map(({ k, label }) => (
                            <React.Fragment key={k}>
                                <ChannelLabel>{label}</ChannelLabel>
                                <ChannelInput
                                    type="number"
                                    min={0}
                                    max={k === "h" ? 360 : 100}
                                    value={hsl[k]}
                                    onChange={(e) => updateFromHsl(k, e.target.value)}
                                />
                            </React.Fragment>
                        ))}
                    </InputRow>
                </InputSection>
            </Panel>

            <Panel>
                <Swatch $color={displayHex} />
                <ResultRow>
                    <ResultLabel>HEX</ResultLabel>
                    <ResultValue>{hex}</ResultValue>
                    <RowCopyBtn onClick={() => handleCopy("hex", hex)} title="Copy">
                        {copiedKey === "hex" ? <Check style={{ fontSize: 13 }} /> : <ContentCopy style={{ fontSize: 13 }} />}
                    </RowCopyBtn>
                </ResultRow>
                <ResultRow>
                    <ResultLabel>RGB</ResultLabel>
                    <ResultValue>{rgbStr}</ResultValue>
                    <RowCopyBtn onClick={() => handleCopy("rgb", rgbStr)} title="Copy">
                        {copiedKey === "rgb" ? <Check style={{ fontSize: 13 }} /> : <ContentCopy style={{ fontSize: 13 }} />}
                    </RowCopyBtn>
                </ResultRow>
                <ResultRow>
                    <ResultLabel>HSL</ResultLabel>
                    <ResultValue>{hslStr}</ResultValue>
                    <RowCopyBtn onClick={() => handleCopy("hsl", hslStr)} title="Copy">
                        {copiedKey === "hsl" ? <Check style={{ fontSize: 13 }} /> : <ContentCopy style={{ fontSize: 13 }} />}
                    </RowCopyBtn>
                </ResultRow>

                <ContrastSection>
                    <PanelLabel>{L.wcagContrastLabel}</PanelLabel>
                    <ContrastRow>
                        <ContrastSwatch $color={displayHex} $border="#fff" $textColor="#fff">
                            A
                        </ContrastSwatch>
                        <ContrastMeta>{L.vsWhiteLabel}</ContrastMeta>
                        <ContrastValue>{contrastWhite.toFixed(2)}:1</ContrastValue>
                        <WcagBadge $type={wLabel.type}>{wLabel.label}</WcagBadge>
                    </ContrastRow>
                    <ContrastRow>
                        <ContrastSwatch $color={displayHex} $border="#333" $textColor="#000">
                            A
                        </ContrastSwatch>
                        <ContrastMeta>{L.vsBlackLabel}</ContrastMeta>
                        <ContrastValue>{contrastBlack.toFixed(2)}:1</ContrastValue>
                        <WcagBadge $type={bLabel.type}>{bLabel.label}</WcagBadge>
                    </ContrastRow>
                </ContrastSection>
            </Panel>
        </ToolLayout>
    );
}
