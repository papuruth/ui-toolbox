/**
 * ToolKit — Phase 1 Foundation
 *
 * Shared primitive components for all DevDeck tools.
 * Every tool imports from here — never duplicates these.
 *
 * Surface layers (dark / light):
 *   bg-page    → darkest  / most neutral  → body background
 *   bg-surface → lighter  / white         → panel / card
 *   bg-input   → between  / slightly gray → code areas, preview areas
 *
 * Fonts:
 *   Inter        → labels, buttons, tabs, navigation
 *   JetBrains Mono → code areas, outputs, meta text
 *
 * Interaction hierarchy:
 *   ModeBtn  → pill toggle (mode switches)
 *   TabBtn   → underline tab (view switching)
 *   ActionBtn → subtle border button (copy, download, clear)
 */

import { Box, Typography } from "@mui/material";
import styled from "styled-components";
import { styledMedia } from "styles/global";

/* ─── Layout ──────────────────────────────────────────── */

export const ToolLayout = styled(Box)`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    width: 100%;
    margin-top: 20px;
    align-items: start;
    ${styledMedia.lessThan("md")`
        grid-template-columns: 1fr;
    `}
`;

export const Panel = styled(Box)`
    background: var(--bg-surface);
    border-radius: var(--radius-panel);
    overflow: hidden;
    box-shadow: var(--shadow-panel);
    display: flex;
    flex-direction: column;
    > *:first-child {
        border-top-left-radius: calc(var(--radius-panel) - 1px);
        border-top-right-radius: calc(var(--radius-panel) - 1px);
    }
    > *:last-child {
        border-bottom-left-radius: calc(var(--radius-panel) - 1px);
        border-bottom-right-radius: calc(var(--radius-panel) - 1px);
    }
`;

export const PanelHeader = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    background: rgba(0, 0, 0, 0.04);
    min-height: 44px;
    flex-wrap: wrap;
    gap: 6px;
`;

export const DropWrap = styled(Box)`
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
`;

/* ─── Typography ──────────────────────────────────────── */

/* Panel section label — Inter 600, uppercase */
export const PanelLabel = styled(Typography)`
    font-size: 11px !important;
    font-weight: 600 !important;
    font-family: "Inter", sans-serif !important;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-secondary) !important;
    line-height: 1.5 !important;
    ${styledMedia.lessThan("sm")`
        font-size: 13px !important;
    `}
`;

/* Mono metadata — file size, char count, etc. */
export const MetaText = styled(Typography)`
    font-size: 11px !important;
    font-family: "JetBrains Mono", "Fira Code", monospace !important;
    color: var(--text-secondary) !important;
    opacity: 0.7;
    line-height: 1.5 !important;
    ${styledMedia.lessThan("sm")`
        font-size: 13px !important;
    `}
`;

/* ─── Code / Input Areas ──────────────────────────────── */

/**
 * CodeArea — mono textarea for outputs/inputs.
 * Add &:read-only { cursor: default; } locally when needed.
 * Add flex: 1; min-height override locally when needed.
 */
export const CodeArea = styled.textarea`
    width: 100%;
    min-height: 260px;
    background: var(--bg-input);
    color: var(--text-primary);
    border: none;
    outline: none;
    resize: none;
    padding: 16px;
    font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace;
    font-size: 12px;
    line-height: 1.75;
    letter-spacing: 0.02em;
    display: block;
    transition: box-shadow 0.2s ease;
    &:focus {
        box-shadow: inset 0 0 0 2px rgba(34, 204, 153, 0.3);
    }
    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.4;
    }
`;

/**
 * InputArea — editable mono textarea with focus ring.
 * Slightly taller default for single-purpose input panels.
 */
export const InputArea = styled.textarea`
    width: 100%;
    min-height: 280px;
    background: var(--bg-input);
    color: var(--text-primary);
    border: none;
    outline: none;
    resize: none;
    padding: 16px;
    font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace;
    font-size: 12px;
    line-height: 1.75;
    letter-spacing: 0.02em;
    display: block;
    transition: box-shadow 0.2s ease;
    &:focus {
        box-shadow: inset 0 0 0 2px rgba(34, 204, 153, 0.35);
    }
    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.4;
    }
`;

/* ─── Preview ─────────────────────────────────────────── */

export const PreviewArea = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-height: 280px;
    background: var(--bg-input);
    padding: 24px;
    ${styledMedia.lessThan("sm")`
        min-height: 200px;
        padding: 16px;
    `}
`;

export const PreviewImg = styled.img`
    max-width: 100%;
    max-height: 320px;
    border-radius: 8px;
    object-fit: contain;
    display: block;
`;

/* ─── States ──────────────────────────────────────────── */

export const EmptyState = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 40px 20px;
    color: var(--text-secondary);
    opacity: 0.45;
    text-align: center;
`;

export const ErrorState = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #ef4444;
    opacity: 0.7;
    text-align: center;
`;

/* ─── Tabs (view switching) ───────────────────────────── */

/* Tabs ≠ Buttons: lightweight underline style, no background fill */
export const TabStrip = styled(Box)`
    display: flex;
    border-bottom: 1px solid var(--border-color);
    background: rgba(0, 0, 0, 0.04);
`;

export const TabBtn = styled.button`
    background: transparent;
    color: ${(props) => (props.$active ? "#22cc99" : "var(--text-secondary)")};
    border: none;
    border-bottom: 2px solid ${(props) => (props.$active ? "#22cc99" : "transparent")};
    padding: 10px 18px;
    font-size: 12px;
    font-weight: ${(props) => (props.$active ? "500" : "400")};
    font-family: "Inter", sans-serif;
    line-height: 1.5;
    cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease;
    &:hover {
        color: #22cc99;
    }
    &:disabled {
        opacity: 0.35;
        cursor: default;
        pointer-events: none;
    }
    ${styledMedia.lessThan("sm")`
        padding: 12px 16px;
        min-height: 44px;
    `}
`;

/* ─── Actions ─────────────────────────────────────────── */

export const ActionBar = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    border-top: 1px solid var(--border-color);
    background: rgba(0, 0, 0, 0.04);
    gap: 8px;
    flex-wrap: wrap;
`;

export const ActionBtnGroup = styled(Box)`
    display: flex;
    gap: 6px;
    align-items: center;
`;

const getActionBtnColor = (props) => {
    if (props.$success) return "#22cc99";
    if (props.$danger) return "#ef4444";
    return "var(--text-secondary)";
};

const getActionBtnBorder = (props) => {
    if (props.$success) return "rgba(34,204,153,0.5)";
    if (props.$danger) return "rgba(239,68,68,0.4)";
    return "var(--border-color)";
};

const getActionBtnBg = (props) => {
    if (props.$success) return "rgba(34,204,153,0.1)";
    if (props.$danger) return "rgba(239,68,68,0.06)";
    return "transparent";
};

const getActionBtnHoverColor = (props) => (props.$danger ? "#ef4444" : "#22cc99");
const getActionBtnHoverBorder = (props) => (props.$danger ? "rgba(239,68,68,0.6)" : "rgba(34,204,153,0.5)");
const getActionBtnHoverBg = (props) => (props.$danger ? "rgba(239,68,68,0.1)" : "rgba(34,204,153,0.08)");

/* Actions ≠ Tabs ≠ Toggles: subtle border + uppercase label */
export const ActionBtn = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: ${getActionBtnColor};
    border: 1px solid ${getActionBtnBorder};
    background: ${getActionBtnBg};
    border-radius: var(--radius-btn);
    padding: 8px 14px;
    min-height: 36px;
    font-size: 11px;
    font-weight: 500;
    font-family: "Inter", sans-serif;
    line-height: 1.5;
    cursor: pointer;
    transition: all 0.15s ease;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    &:hover {
        color: ${getActionBtnHoverColor};
        border-color: ${getActionBtnHoverBorder};
        background: ${getActionBtnHoverBg};
    }
    &:disabled {
        opacity: 0.35;
        cursor: default;
        pointer-events: none;
    }
    ${styledMedia.lessThan("sm")`
        padding: 10px 16px;
        min-height: 44px;
    `}
`;

/* ─── Mode Toggle (Pill) ──────────────────────────────── */

/* Toggles ≠ Tabs ≠ Buttons: filled pill for mode switches */
export const ModeToggle = styled(Box)`
    display: inline-flex;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 3px;
    gap: 2px;
    align-self: flex-start;
`;

const getModeBtnBg = (props) => (props.$active ? "#22cc99" : "transparent");
const getModeBtnColor = (props) => (props.$active ? "#0b1220" : "var(--text-secondary)");
const getModeBtnHoverColor = (props) => (props.$active ? "#0b1220" : "#22cc99");

export const ModeBtn = styled.button`
    background: ${getModeBtnBg};
    color: ${getModeBtnColor};
    border: none;
    border-radius: 6px;
    padding: 6px 20px;
    font-size: 12px;
    font-weight: 500;
    font-family: "Inter", sans-serif;
    line-height: 1.5;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s ease;
    &:hover {
        color: ${getModeBtnHoverColor};
    }
    ${styledMedia.lessThan("sm")`
        padding: 8px 16px;
        min-height: 36px;
    `}
`;
