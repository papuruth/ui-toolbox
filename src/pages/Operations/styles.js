import { Box, Paper } from "@mui/material";
import styled from "styled-components";
import { styledMedia } from "styles/global";

export const StyledLayoutContainer = styled(Paper)`
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 10px 40px;
    margin: 40px;
    ${styledMedia.lessThan("sm")`
        padding: 10px 20px
        margin: 20px;
    `}
    ${styledMedia.lessThan("xs")`
        padding: 10px 10px;
        margin: 10px;
    `}
`;

export const StyledContainer = styled(Box)`
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 10px 40px;
    width: 100%;
    ${styledMedia.lessThan("sm")`
        padding: 10px 20px;
        margin: 20px;
    `}
    ${styledMedia.lessThan("xs")`
        padding: 10px 10px;
        margin: 10px;
    `}
`;
