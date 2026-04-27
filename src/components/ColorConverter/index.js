import { ContentCopy } from "@mui/icons-material";
import { Box, Chip, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { StyledBoxCenter, StyledBoxContainer } from "components/Shared/Styled-Components";
import localization from "localization";
import React, { useCallback, useState } from "react";
import toast from "utils/toast";

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
    const rn = r / 255; const gn = g / 255; const bn = b / 255;
    const max = Math.max(rn, gn, bn); const min = Math.min(rn, gn, bn);
    let h = 0; let s = 0;
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
    const hn = h / 360; const sn = s / 100; const ln = l / 100;
    if (sn === 0) { const v = Math.round(ln * 255); return { r: v, g: v, b: v }; }
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

// WCAG relative luminance
function relativeLuminance(r, g, b) {
    const chan = [r, g, b].map((c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
}

function contrastRatio(r1, g1, b1, r2, g2, b2) {
    const l1 = relativeLuminance(r1, g1, b1);
    const l2 = relativeLuminance(r2, g2, b2);
    const lighter = Math.max(l1, l2); const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

function copyText(text) {
    if (window?.navigator?.clipboard) { window.navigator.clipboard.writeText(text); toast.success("Copied!"); }
}

export default function ColorConverter() {
    const [hex, setHex] = useState("#22cc99");
    const [rgb, setRgb] = useState({ r: 34, g: 204, b: 153 });
    const [hsl, setHsl] = useState({ h: 160, s: 71, l: 47 });
    const [hexError, setHexError] = useState("");

    const updateFromHex = useCallback((value) => {
        setHex(value); setHexError("");
        const rgbVal = hexToRgb(value);
        if (rgbVal) { setRgb(rgbVal); setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b)); }
        else if (value.replace("#", "").length > 0) setHexError(L.invalidHexError);
    }, []);

    const updateFromRgb = useCallback((field, raw) => {
        const val = Math.min(255, Math.max(0, parseInt(raw, 10) || 0));
        const newRgb = { ...rgb, [field]: val };
        setRgb(newRgb); setHexError("");
        setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    }, [rgb]);

    const updateFromHsl = useCallback((field, raw) => {
        const max = field === "h" ? 360 : 100;
        const val = Math.min(max, Math.max(0, parseInt(raw, 10) || 0));
        const newHsl = { ...hsl, [field]: val }; setHsl(newHsl); setHexError("");
        const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l); setRgb(newRgb);
        setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }, [hsl]);

    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    // Contrast against white and black
    const contrastWhite = contrastRatio(rgb.r, rgb.g, rgb.b, 255, 255, 255);
    const contrastBlack = contrastRatio(rgb.r, rgb.g, rgb.b, 0, 0, 0);
    const getContrastLabel = (ratio) => {
        if (ratio >= 7) return { label: "AAA", color: "success" };
        if (ratio >= 4.5) return { label: "AA", color: "success" };
        if (ratio >= 3) return { label: "AA Large", color: "warning" };
        return { label: "Fail", color: "error" };
    };
    const wLabel = getContrastLabel(contrastWhite);
    const bLabel = getContrastLabel(contrastBlack);

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            {/* Color picker + preview */}
            <StyledBoxCenter gap={2} alignItems="flex-start" flexWrap="wrap">
                <Box sx={{ width: "100%", height: 80, borderRadius: 2, background: hexError ? "#ccc" : hex, border: "1px solid var(--border-color)", transition: "background 0.3s", flexShrink: 0, minWidth: 200 }} />
                <Box>
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>Color Picker</Typography>
                    <input
                        type="color"
                        value={hexError ? "#cccccc" : hex}
                        onChange={(e) => updateFromHex(e.target.value)}
                        style={{ width: 60, height: 40, border: "none", borderRadius: 6, cursor: "pointer", background: "none" }}
                    />
                </Box>
            </StyledBoxCenter>

            <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>{L.hexLabel}</Typography>
                <StyledBoxCenter gap={1}>
                    <TextField value={hex} onChange={(e) => updateFromHex(e.target.value)} size="small" error={!!hexError} helperText={hexError || " "} sx={{ width: 180 }} />
                    <Tooltip title={L.copyHex}><IconButton onClick={() => copyText(hex)}><ContentCopy fontSize="small" /></IconButton></Tooltip>
                </StyledBoxCenter>
            </Box>

            <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>{L.rgbLabel}</Typography>
                <StyledBoxCenter gap={1} flexWrap="wrap">
                    {["r", "g", "b"].map((ch) => (
                        <TextField key={ch} label={ch.toUpperCase()} value={rgb[ch]} type="number" onChange={(e) => updateFromRgb(ch, e.target.value)} inputProps={{ min: 0, max: 255 }} size="small" sx={{ width: 90 }} />
                    ))}
                    <Tooltip title={L.copyRgb}><IconButton onClick={() => copyText(rgbStr)}><ContentCopy fontSize="small" /></IconButton></Tooltip>
                </StyledBoxCenter>
            </Box>

            <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>{L.hslLabel}</Typography>
                <StyledBoxCenter gap={1} flexWrap="wrap">
                    {[{ k: "h", label: "H°" }, { k: "s", label: "S%" }, { k: "l", label: "L%" }].map(({ k, label }) => (
                        <TextField key={k} label={label} value={hsl[k]} type="number" onChange={(e) => updateFromHsl(k, e.target.value)} size="small" sx={{ width: 90 }} />
                    ))}
                    <Tooltip title={L.copyHsl}><IconButton onClick={() => copyText(hslStr)}><ContentCopy fontSize="small" /></IconButton></Tooltip>
                </StyledBoxCenter>
            </Box>

            {/* Contrast checker */}
            <Paper variant="outlined" sx={{ p: 2, background: "var(--bg-card)" }}>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>WCAG Contrast</Typography>
                <StyledBoxCenter gap={3} flexWrap="wrap">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: 1, background: hex, border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>A</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">vs White</Typography>
                            <StyledBoxCenter gap={0.5}>
                                <Typography variant="body2" fontWeight={600}>{contrastWhite.toFixed(2)}:1</Typography>
                                <Chip label={wLabel.label} color={wLabel.color} size="small" />
                            </StyledBoxCenter>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: 1, background: hex, border: "2px solid #333", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography sx={{ color: "#000", fontWeight: 700, fontSize: 14 }}>A</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">vs Black</Typography>
                            <StyledBoxCenter gap={0.5}>
                                <Typography variant="body2" fontWeight={600}>{contrastBlack.toFixed(2)}:1</Typography>
                                <Chip label={bLabel.label} color={bLabel.color} size="small" />
                            </StyledBoxCenter>
                        </Box>
                    </Box>
                </StyledBoxCenter>
            </Paper>
        </StyledBoxContainer>
    );
}
