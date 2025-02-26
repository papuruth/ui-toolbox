import { Box } from "@mui/material";
import styled from "styled-components";
import colors from "styles/colors";

export const StyledPasswordInputContainer = styled(Box)`
    display: flex;
    margin: auto;
    margin-top: ${(props) => (props.$marginTop ? `${props.$marginTop * 8}px` : "auto")};
    padding: 5px;
    margin-bottom: 10px;
    color: ${colors.white};
    .MuiFilledInput-root {
        background: ${colors.white};
        &:after {
            border: 0;
        }
    }
`;
