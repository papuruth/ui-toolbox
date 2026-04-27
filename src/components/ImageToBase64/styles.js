import { Box, Typography } from "@mui/material";
import styled from "styled-components";
import { styledMedia } from "styles/global";

export const StyledContainer = styled(Box)`
    display: flex;
    width: 100%;
    border: 1px solid var(--border-color);
    border-radius: 2px;
    margin-top: 24px;
    ${styledMedia.lessThan("md")`
        flex-direction: column;
    `}
`;

export const StyledText = styled(Typography)`
    font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "")};
    ${styledMedia.lessThan("sm")`
      font-size: 1rem;
    `}
    ${styledMedia.lessThan("xs")`
      font-size: 14px;
    `}
`;
