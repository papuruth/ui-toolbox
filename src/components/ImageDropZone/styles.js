import styled from "styled-components";

import { Paper } from "@mui/material";
import { styledMedia } from "styles/global";

export const StyledPaper = styled(Paper)`
    width: 500px;
    height: 200px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    ${styledMedia.lessThan("sm")`
      width: 400px;
    `}
    ${styledMedia.lessThan("xs")`
      width: 100%;
    `}
`;
