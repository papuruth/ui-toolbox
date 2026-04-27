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
    Panel,
    PanelHeader,
    PanelLabel,
    ToolLayout
} from "components/Shared/ToolKit";

export const DimInputsRow = styled(Box)`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
`;

export const DimInput = styled.input`
    flex: 1;
    background: var(--bg-input);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 8px 12px;
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    &:focus {
        border-color: #22cc99;
        box-shadow: inset 0 0 0 2px rgba(34, 204, 153, 0.25);
    }
    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.5;
    }
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        opacity: 0.4;
    }
`;

export const PresetsSection = styled(Box)`
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const PresetLabel = styled.span`
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    line-height: 1.5;
`;

export const PresetsRow = styled(Box)`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

export const PresetBtn = styled.button`
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 8px 14px;
    min-height: 36px;
    font-size: 12px;
    font-weight: 500;
    font-family: "Inter", sans-serif;
    cursor: pointer;
    transition: all 0.15s ease;
    line-height: 1.5;
    &:hover {
        color: #22cc99;
        border-color: rgba(34, 204, 153, 0.4);
        background: rgba(34, 204, 153, 0.06);
    }
`;

export const AspectDisplay = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-height: 240px;
    background: var(--bg-input);
    padding: 32px 24px;
`;

export const AspectRatioLabel = styled.span`
    font-family: "JetBrains Mono", monospace;
    font-size: 48px;
    font-weight: 500;
    color: #22cc99;
    letter-spacing: 0.05em;
    line-height: 1.2;
    text-align: center;
    ${styledMedia.lessThan("sm")`
        font-size: 32px;
    `}
`;

export const DimSeparator = styled.span`
    font-family: "Inter", sans-serif;
    font-size: 12px;
    color: var(--text-secondary);
    flex-shrink: 0;
`;
