import { Box } from "@mui/material";
import { Panel as BasePanel, ToolLayout as BaseToolLayout } from "components/Shared/ToolKit";
import styled, { css, keyframes } from "styled-components";
import { styledMedia } from "styles/global";

export {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    DropWrap,
    EmptyState,
    MetaText,
    PanelHeader,
    PanelLabel,
    ToolLayout
} from "components/Shared/ToolKit";

// ── Animations ────────────────────────────────────────────────────────────────

const fadeInUp = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0);    }
`;

const fadeIn = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }
`;

const glowPulse = keyframes`
    0%,100% { box-shadow: 0 0 0 3px rgba(34,204,153,0.15), 0 0 12px rgba(34,204,153,0.1); }
    50%      { box-shadow: 0 0 0 4px rgba(34,204,153,0.3),  0 0 20px rgba(34,204,153,0.2); }
`;

// ── Layout ────────────────────────────────────────────────────────────────────

export const Panel = styled(BasePanel)`
    overflow-y: auto;
    overflow-x: hidden;
`;

export const ResizerLayout = styled(BaseToolLayout)`
    align-items: stretch;
`;

export const PreviewPanel = styled(BasePanel)`
    height: calc(100vh - 200px);
    min-height: 500px;
    ${styledMedia.lessThan("md")`
        height: auto;
        min-height: 0;
    `}
`;

// ── Controls ──────────────────────────────────────────────────────────────────

export const ControlsSection = styled(Box)`
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const ControlRow = styled(Box)`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const ControlLabel = styled.span`
    font-family: "Inter", sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    min-width: 88px;
    line-height: 1.5;
`;

export const ControlValue = styled.span`
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    color: ${(p) => (p.$active ? "#22cc99" : "var(--text-secondary)")};
    min-width: 48px;
    text-align: right;
    line-height: 1.5;
    transition: color 0.15s ease;
    font-weight: ${(p) => (p.$active ? "600" : "400")};
`;

// ── Slider ────────────────────────────────────────────────────────────────────

export const SliderWrap = styled(Box)`
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;

    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: linear-gradient(
            to right,
            #22cc99 0%,
            #22cc99 var(--fill, 0%),
            rgba(255, 255, 255, 0.1) var(--fill, 0%),
            rgba(255, 255, 255, 0.1) 100%
        );
        cursor: pointer;
        outline: none;
        border: none;

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            margin-top: -5px;
            border-radius: 50%;
            background: #22cc99;
            cursor: pointer;
            box-shadow: 0 0 0 3px rgba(34, 204, 153, 0.2), 0 2px 4px rgba(0, 0, 0, 0.3);
            transition: box-shadow 0.15s ease, transform 0.1s ease;
        }

        &::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #22cc99;
            border: none;
            cursor: pointer;
            box-shadow: 0 0 0 3px rgba(34, 204, 153, 0.2), 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        &::-webkit-slider-runnable-track {
            height: 6px;
            border-radius: 3px;
        }

        &:hover::-webkit-slider-thumb {
            box-shadow: 0 0 0 5px rgba(34, 204, 153, 0.25), 0 2px 8px rgba(34, 204, 153, 0.3);
        }

        &:active::-webkit-slider-thumb {
            transform: scale(1.25);
            box-shadow: 0 0 0 7px rgba(34, 204, 153, 0.2), 0 0 16px rgba(34, 204, 153, 0.4);
        }

        &:disabled {
            opacity: 0.3;
            cursor: default;
        }
    }
`;

// ── Aspect Ratio ──────────────────────────────────────────────────────────────

export const AspectToggle = styled.button`
    background: ${(props) => (props.$active ? "rgba(34,204,153,0.12)" : "transparent")};
    color: ${(props) => (props.$active ? "#22cc99" : "var(--text-secondary)")};
    border: 1px solid ${(props) => (props.$active ? "rgba(34,204,153,0.4)" : "var(--border-color)")};
    border-radius: 6px;
    padding: 8px 14px;
    min-height: 36px;
    font-size: 12px;
    font-weight: 500;
    font-family: "Inter", sans-serif;
    cursor: pointer;
    transition: all 0.15s ease;
    &:disabled {
        opacity: 0.35;
        cursor: default;
    }
`;

export const AspectGroup = styled(Box)`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex: 1;
`;

export const AspectPreviewBox = styled.span`
    display: inline-block;
    width: ${(p) => p.$w}px;
    height: ${(p) => p.$h}px;
    border: 1.5px solid currentColor;
    border-radius: 1.5px;
    flex-shrink: 0;
    opacity: ${(p) => (p.$active ? 0.9 : 0.45)};
`;

export const AspectChip = styled.button`
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid ${(p) => (p.$active ? "rgba(34,204,153,0.5)" : "var(--border-color)")};
    background: ${(p) => (p.$active ? "rgba(34,204,153,0.15)" : "transparent")};
    color: ${(p) => (p.$active ? "#22cc99" : "var(--text-secondary)")};
    font-size: 11px;
    font-weight: ${(p) => (p.$active ? "700" : "500")};
    font-family: "Inter", sans-serif;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: all 0.15s ease;
    white-space: nowrap;
    box-shadow: ${(p) => (p.$active ? "0 0 0 1px rgba(34,204,153,0.2), inset 0 1px 0 rgba(34,204,153,0.1)" : "none")};

    &:hover:not(:disabled) {
        border-color: rgba(34, 204, 153, 0.35);
        color: #22cc99;
        background: rgba(34, 204, 153, 0.07);
    }
    &:active:not(:disabled) {
        transform: scale(0.94);
    }
    &:disabled {
        opacity: 0.35;
        cursor: default;
    }
`;

// ── Output Size ───────────────────────────────────────────────────────────────

export const DimPair = styled(Box)`
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    font-size: 12px;
    color: var(--text-secondary);
`;

export const DimInput = styled.input`
    width: 68px;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 5px 8px;
    font-size: 12px;
    font-family: "JetBrains Mono", monospace;
    color: var(--text-primary);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    &:focus {
        border-color: #22cc99;
        box-shadow: 0 0 0 3px rgba(34, 204, 153, 0.12);
    }
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        opacity: 0.4;
    }
`;

export const LockBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    border: 1px solid ${(p) => (p.$active ? "rgba(34,204,153,0.5)" : "var(--border-color)")};
    background: ${(p) => (p.$active ? "rgba(34,204,153,0.12)" : "transparent")};
    color: ${(p) => (p.$active ? "#22cc99" : "var(--text-secondary)")};
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease;
    box-shadow: ${(p) => (p.$active ? "0 0 8px rgba(34,204,153,0.2)" : "none")};

    &:hover {
        border-color: rgba(34, 204, 153, 0.4);
        color: #22cc99;
        background: rgba(34, 204, 153, 0.08);
    }
    &:active {
        transform: scale(0.92);
    }
`;

// ── Crop Preview ──────────────────────────────────────────────────────────────

export const CropWrap = styled(Box)`
    display: flex;
    flex: 1;
    min-height: 0;
    background: var(--bg-input);
    padding: 16px;
    overflow: auto;
    position: relative;
    > * { margin: auto; }
    ${styledMedia.lessThan("md")`
        min-height: 280px;
        flex: none;
    `}
`;

export const CropContainer = styled(Box)`
    position: relative;
    display: inline-flex;

    img {
        animation: ${fadeIn} 0.3s ease;
    }
`;

export const GridOverlay = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
    background-image:
        linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px);
    background-size: 33.333% 33.333%;
    border: 1px solid rgba(255,255,255,0.15);
    animation: ${fadeIn} 0.2s ease;
`;

export const LiveDimsBadge = styled.div`
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(6px);
    color: #22cc99;
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    border: 1px solid rgba(34, 204, 153, 0.3);
    white-space: nowrap;
    pointer-events: none;
    z-index: 20;
    animation: ${fadeIn} 0.15s ease;
`;

// ── Result Section ────────────────────────────────────────────────────────────

export const CanvasWrap = styled(Box)`
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    overflow: auto;
    background: linear-gradient(180deg, var(--bg-input) 0%, rgba(34,204,153,0.02) 100%);
    animation: ${fadeInUp} 0.3s ease;
`;

export const ResultCanvas = styled.canvas`
    object-fit: contain;
    display: block;
    margin: 12px auto;
    max-width: 100%;
    max-height: 160px;
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.06);
    animation: ${fadeInUp} 0.35s ease;
`;

export const ResultMetaRow = styled(Box)`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
    margin-bottom: 4px;
    flex-wrap: wrap;
    justify-content: center;
`;

export const ResultMetaBadge = styled.span`
    font-family: "JetBrains Mono", monospace;
    font-size: 10px;
    font-weight: 600;
    color: var(--text-secondary);
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 2px 7px;
    opacity: 0.7;
`;

// ── Format Download Buttons ───────────────────────────────────────────────────

export const FormatGroup = styled(Box)`
    display: flex;
    gap: 5px;
    align-items: center;
`;

export const FormatBtn = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 7px 12px;
    border-radius: 7px;
    font-size: 11px;
    font-weight: 700;
    font-family: "Inter", sans-serif;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.18s ease;

    ${(p) =>
        p.$primary
            ? css`
                  background: linear-gradient(135deg, #22cc99 0%, #1ab885 100%);
                  color: #0a1a14;
                  border: 1px solid rgba(34, 204, 153, 0.6);
                  box-shadow: 0 2px 8px rgba(34, 204, 153, 0.25), 0 0 0 0 rgba(34, 204, 153, 0);

                  &:hover:not(:disabled) {
                      box-shadow: 0 4px 16px rgba(34, 204, 153, 0.4), 0 2px 6px rgba(0, 0, 0, 0.2);
                      transform: translateY(-1px);
                  }
                  &:active:not(:disabled) {
                      transform: translateY(0);
                      box-shadow: 0 2px 8px rgba(34, 204, 153, 0.2);
                  }
              `
            : css`
                  background: transparent;
                  color: var(--text-secondary);
                  border: 1px solid var(--border-color);

                  &:hover:not(:disabled) {
                      border-color: rgba(34, 204, 153, 0.4);
                      color: #22cc99;
                      background: rgba(34, 204, 153, 0.07);
                  }
                  &:active:not(:disabled) {
                      transform: scale(0.96);
                  }
              `}

    &:disabled {
        opacity: 0.3;
        cursor: default;
        pointer-events: none;
    }
`;

// ── File Info ─────────────────────────────────────────────────────────────────

export const FileInfoCard = styled(Box)`
    margin: 0 16px 4px;
    padding: 10px 14px;
    background: rgba(34, 204, 153, 0.06);
    border-radius: 8px;
    border: 1px solid rgba(34, 204, 153, 0.18);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: ${fadeIn} 0.25s ease;
`;

export const FileInfoDot = styled.span`
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22cc99;
    flex-shrink: 0;
    box-shadow: 0 0 6px rgba(34, 204, 153, 0.6);
    animation: ${glowPulse} 2.5s ease-in-out infinite;
`;

export const FileInfoName = styled.span`
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    font-family: "Inter", sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
`;

export const FileInfoDims = styled.span`
    font-size: 11px;
    font-family: "JetBrains Mono", monospace;
    color: #22cc99;
    opacity: 0.8;
    white-space: nowrap;
    flex-shrink: 0;
`;

export const ReplaceBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 10px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease;

    &:hover {
        border-color: rgba(34, 204, 153, 0.35);
        color: #22cc99;
        background: rgba(34, 204, 153, 0.06);
    }
    &:active {
        transform: scale(0.93);
    }
`;

// ── Workflow Guide ────────────────────────────────────────────────────────────

export const WorkflowGuide = styled(Box)`
    margin-top: auto;
    padding: 20px 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 0;
    border-top: 1px solid var(--border-color);
`;

export const WorkflowTitle = styled.div`
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-secondary);
    opacity: 0.45;
    margin-bottom: 14px;
`;

export const WorkflowStep = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border-color);
    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
`;

export const WorkflowNum = styled.div`
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1.5px solid rgba(34, 204, 153, 0.35);
    color: #22cc99;
    font-size: 11px;
    font-weight: 700;
    font-family: "JetBrains Mono", monospace;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
`;

export const WorkflowStepBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

export const WorkflowStepTitle = styled.div`
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    font-family: "Inter", sans-serif;
    line-height: 1.4;
`;

export const WorkflowStepDesc = styled.div`
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.6;
    line-height: 1.5;
    font-family: "Inter", sans-serif;
`;
