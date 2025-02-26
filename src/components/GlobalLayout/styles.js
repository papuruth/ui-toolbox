import { Box } from "@mui/material";
import styled from "styled-components";
import { styledMedia } from "styles/global";

export const StyledContainer = styled.div`
    width: 100%;
    min-width: 320px !important;
`;

export const StyledMainViewContainer = styled(Box)`
    width: 100%;
    margin-top: 80px;
    ${styledMedia.lessThan("sm")`
      margin-top:65px;
      margin-bottom:25px;
    `}
`;
