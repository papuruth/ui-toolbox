import { Paper } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import colors from "styles/colors";
import { styledMedia } from "styles/global";

export const StyledContainer = styled(Paper)`
    padding: 10px 40px;
    margin: 0 40px;
    ${styledMedia.lessThan("sm")`
        padding: 10px 20px
        margin: 20px;
    `}
    ${styledMedia.lessThan("xs")`
        padding: 10px 10px;
        margin: 10px;
    `}
`;

export const StyledLink = styled(Link)`
    font-weight: 500;
    color: ${colors.primary};
`;
