import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import colors from "styles/colors";

export const StyledContainer = styled(Box)`
    padding-bottom: 4px;
`;

export const StyledLink = styled(Link)`
    font-weight: 500;
    color: ${colors.primary};
`;
