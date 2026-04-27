import styled from "styled-components";

import { Paper } from "@mui/material";
import colors from "styles/colors";
import { styledMedia } from "styles/global";

export const StyledPaper = styled(Paper)`
    width: 100%;
    max-width: 500px;
    height: 200px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    border: 2px dashed ${(props) => (props.$isDragActive ? colors.primary : "var(--border-color)")} !important;
    background: ${(props) => (props.$isDragActive ? "rgba(34,204,153,0.06)" : "var(--bg-surface)")} !important;
    transition: border-color 0.2s ease, background 0.2s ease;
    box-shadow: none !important;
    ${styledMedia.lessThan("xs")`
      width: 100%;
    `}
`;
