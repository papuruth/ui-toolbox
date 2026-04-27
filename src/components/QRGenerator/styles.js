import { Box } from "@mui/material";
import styled from "styled-components";
import { styledMedia } from "styles/global";

export {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    DropWrap,
    EmptyState,
    MetaText,
    ModeBtn,
    ModeToggle,
    Panel,
    PanelHeader,
    PanelLabel,
    ToolLayout
} from "components/Shared/ToolKit";

export const QrInputWrap = styled(Box)`
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
`;

export const QrInput = styled.textarea`
    width: 100%;
    min-height: 100px;
    background: var(--bg-input);
    color: var(--text-primary);
    border: none;
    outline: none;
    resize: none;
    padding: 12px;
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 12px;
    line-height: 1.75;
    border-radius: 6px;
    box-sizing: border-box;
    transition: box-shadow 0.2s ease;
    &:focus {
        box-shadow: inset 0 0 0 2px rgba(34, 204, 153, 0.3);
    }
    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.4;
    }
`;

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
    }
`;

export const ControlValue = styled.span`
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    color: var(--text-secondary);
    min-width: 56px;
    text-align: right;
    line-height: 1.5;
`;

export const ColorInput = styled.input`
    width: 40px;
    height: 40px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 2px;
    background: none;
    cursor: pointer;
`;

export const QrPreviewArea = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-height: 320px;
    background: var(--bg-input);
    padding: 24px;
    ${styledMedia.lessThan("sm")`
        min-height: 220px;
        padding: 16px;
    `}
`;

export const QrPreviewImg = styled.img`
    max-width: 100%;
    max-height: 400px;
    border-radius: 8px;
    object-fit: contain;
    display: block;
`;
