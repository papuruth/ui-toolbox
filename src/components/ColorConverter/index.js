import { ContentCopy } from "@mui/icons-material";
import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
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
    return {
        r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
        g: Math.round(hue2rgb(p, q, hn) * 255),
        b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255)
    };
}

function copyText(text) {
    if (window?.navigator?.clipboard) {
        window.navigator.clipboard.writeText(text);
        toast.success("Copied!");
    }
}

export default function ColorConverter() {
    const [hex, setHex] = useState("#22cc99");
    const [rgb, setRgb] = useState({ r: 34, g: 204, b: 153 });
    const [hsl, setHsl] = useState({ h: 160, s: 71, l: 47 });
    const [hexError, setHexError] = useState("");

    const updateFromHex = useCallback((value) => {
        setHex(value);
        setHexError("");
        const rgbVal = hexToRgb(value);
        if (rgbVal) {
            setRgb(rgbVal);
            setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
        } else if (value.replace("#", "").length > 0) {
            setHexError(L.invalidHexError);
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

    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    return (
        <StyledBoxContainer flexDirection="column" gap={3}>
            <Box
                sx={{
                    width: "100%",
                    height: 80,
                    borderRadius: 2,
                    background: hexError ? "#ccc" : hex,
                    border: "1px solid var(--border-color)",
                    transition: "background 0.3s"
                }}
            />

            <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    {L.hexLabel}
                </Typography>
                <StyledBoxCenter gap={1}>
                    <TextField
                        value={hex}
                        onChange={(e) => updateFromHex(e.target.value)}
                        size="small"
                        error={!!hexError}
                        helperText={hexError || " "}
                        sx={{ width: 180 }}
                    />
                    <Tooltip title={L.copyHex}>
                        <IconButton onClick={() => copyText(hex)}>
                            <ContentCopy fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </StyledBoxCenter>
            </Box>

            <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    {L.rgbLabel}
                </Typography>
                <StyledBoxCenter gap={1} flexWrap="wrap">
                    {["r", "g", "b"].map((ch) => (
                        <TextField
                            key={ch}
                            label={ch.toUpperCase()}
                            value={rgb[ch]}
                            type="number"
                            onChange={(e) => updateFromRgb(ch, e.target.value)}
                            inputProps={{ min: 0, max: 255 }}
                            size="small"
                            sx={{ width: 90 }}
                        />
                    ))}
                    <Tooltip title={L.copyRgb}>
                        <IconButton onClick={() => copyText(rgbStr)}>
                            <ContentCopy fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </StyledBoxCenter>
            </Box>

            <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    {L.hslLabel}
                </Typography>
                <StyledBoxCenter gap={1} flexWrap="wrap">
                    {[
                        { k: "h", max: 360, label: "H°" },
                        { k: "s", max: 100, label: "S%" },
                        { k: "l", max: 100, label: "L%" }
                    ].map(({ k, label }) => (
                        <TextField
                            key={k}
                            label={label}
                            value={hsl[k]}
                            type="number"
                            onChange={(e) => updateFromHsl(k, e.target.value)}
                            size="small"
                            sx={{ width: 90 }}
                        />
                    ))}
                    <Tooltip title={L.copyHsl}>
                        <IconButton onClick={() => copyText(hslStr)}>
                            <ContentCopy fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </StyledBoxCenter>
            </Box>
        </StyledBoxContainer>
    );
}
