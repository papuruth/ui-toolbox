import { Paper } from "@mui/material";
import styled, { keyframes } from "styled-components";
import { styledMedia } from "styles/global";

const bounce = keyframes`
    0%, 100% { transform: translateY(0);    }
    40%       { transform: translateY(-5px); }
    70%       { transform: translateY(-2px); }
`;

export const StyledPaper = styled(Paper)`
    width: 100%;
    max-width: ${(props) => (props.$fullWidth ? "none" : "500px")};
    height: 160px;
    ${styledMedia.lessThan("sm")`
        max-width: 100%;
    `}
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 6px;
    cursor: pointer;
    border: 1.5px dashed ${(props) => (props.$isDragActive ? "#22cc99" : "var(--border-color)")} !important;
    background: ${(props) => (props.$isDragActive ? "rgba(34,204,153,0.08)" : "transparent")} !important;
    border-radius: 10px !important;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease !important;
    box-shadow: ${(props) =>
        props.$isDragActive
            ? "0 0 0 4px rgba(34,204,153,0.2), inset 0 0 24px rgba(34,204,153,0.05)"
            : "none"} !important;
    transform: ${(props) => (props.$isDragActive ? "scale(1.02)" : "scale(1)")};

    &:hover {
        border-color: #22cc99 !important;
        background: rgba(34, 204, 153, 0.04) !important;
        box-shadow: 0 0 0 3px rgba(34, 204, 153, 0.1) !important;
        transform: scale(1.015);
    }

    &:hover .upload-icon,
    &[data-drag-active="true"] .upload-icon {
        animation: ${bounce} 0.6s ease;
    }
`;
