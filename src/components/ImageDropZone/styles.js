import styled from "styled-components";
import { styledMedia } from "styles/global";
import { Paper } from "@mui/material";

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
    background: ${(props) => (props.$isDragActive ? "rgba(34,204,153,0.06)" : "transparent")} !important;
    border-radius: 10px !important;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    box-shadow: ${(props) => (props.$isDragActive ? "0 0 0 3px rgba(34,204,153,0.15)" : "none")} !important;
    &:hover {
        border-color: #22cc99 !important;
        background: rgba(34, 204, 153, 0.04) !important;
        box-shadow: 0 0 0 3px rgba(34, 204, 153, 0.1) !important;
    }
`;
