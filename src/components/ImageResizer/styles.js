import { Box } from "@mui/material";
import styled from "styled-components";

export {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    DropWrap,
    EmptyState,
    MetaText,
    Panel,
    PanelHeader,
    PanelLabel,
    ToolLayout
} from "components/Shared/ToolKit";

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

export const SliderWrap = styled(Box)`
    flex: 1;
    display: flex;
    align-items: center;
    input[type="range"] {
        width: 100%;
        accent-color: #22cc99;
        cursor: pointer;
        &:disabled {
            opacity: 0.3;
            cursor: default;
        }
    }
`;

export const ControlValue = styled.span`
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    color: var(--text-secondary);
    min-width: 48px;
    text-align: right;
    line-height: 1.5;
`;

export const AspectToggle = styled.button`
    background: ${(props) => (props.$active ? "rgba(34,204,153,0.12)" : "transparent")};
    color: ${(props) => (props.$active ? "#22cc99" : "var(--text-secondary)")};
    border: 1px solid ${(props) => (props.$active ? "rgba(34,204,153,0.4)" : "var(--border-color)")};
    border-radius: 6px;
    padding: 5px 12px;
    font-size: 11px;
    font-weight: 500;
    font-family: "Inter", sans-serif;
    cursor: pointer;
    transition: all 0.15s ease;
    &:disabled {
        opacity: 0.35;
        cursor: default;
    }
`;

export const CropWrap = styled(Box)`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    min-height: 280px;
    background: var(--bg-input);
    padding: 16px;
    overflow: auto;
`;

export const CanvasWrap = styled(Box)`
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    overflow: auto;
    background: var(--bg-input);
`;
