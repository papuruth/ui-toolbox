import { Typography } from "@mui/material";
import styled from "styled-components";
import { styledMedia } from "styles/global";

export const StyledContainer = styled.div`
    width: 100%;
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
