import { Box } from "@mui/material";
import styled from "styled-components";
import { styledMedia } from "styles/global";

export const StyledContainer = styled.div`
    width: 100%;
    min-width: 0;
`;

export const StyledMainViewContainer = styled(Box)`
    width: 100%;
    margin-top: 80px;
    padding-bottom: 60px;
    background-color: var(--bg-page);
    ${styledMedia.lessThan("sm")`
      margin-top:65px;
      padding-bottom:60px;
    `}
`;
