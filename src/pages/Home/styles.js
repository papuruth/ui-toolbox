import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import colors from "styles/colors";
import { styledMedia } from "styles/global";

const getStyles = (props) => {
    if (props.search && props.dataLength > 0) {
        return "flex-start";
    }
    if (props.dataLength > 0) {
        return "space-between";
    }
    return "center";
};

export const StyledContainer = styled.div`
    background-color: ${colors.background};
    color: ${colors.primary};
    justify-content: ${(props) => getStyles(props)};
`;

export const StyledCard = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: 10px;
    flex-direction: column;
    & > svg {
        margin-bottom: 10px;
    }
`;
export const StyledText = styled(Typography)`
    font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "")};
    ${styledMedia.lessThan("sm")`
      font-size: 1rem;
    `}
    ${styledMedia.lessThan("xs")`
      font-size: 11px;
    `}
`;

export const StyledLink = styled(Link)``;

export const StyledGridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    background: ${colors.background};
`;

export const StyledGridItem = styled.div`
    width: 23%;
    margin-bottom: 2%;
    background: gold;
    aspect-ratio: 1/1;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.87);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 4px;
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    ${styledMedia.lessThan("desktop")`
      width: 31%;
    `}
    ${styledMedia.lessThan("tablet")`
      width: 48%;
    `}
`;
