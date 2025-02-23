import { Box, Button, Divider, Paper, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { styled as muiStyled } from "@mui/material/styles";
import { styledMedia } from "styles/global";

export const StyledImagePreviewContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    padding: ${(props) => (props?.isPadding ? "20px" : "0")};
    text-align: center;
    border-right: ${(props) => (props.borderRight ? "1px solid #000" : "")};
    ${styledMedia.lessThan("sm")`
      width: 100%;
      border-right: 0;
      border-bottom: ${(props) => (props.borderBottom ? "1px solid #000" : "")};
    `}
    ${styledMedia.lessThan("md")`
      width: 100%;
      border-right: 0;
      border-bottom: ${(props) => (props.borderBottom ? "1px solid #000" : "")};
    `}
`;

const getBoxWidth = (props) => {
    const { width } = props || {};
    if (typeof width === "number") {
        return `${width}px`;
    }
    if (typeof width === "string") {
        return width;
    }
    return "100%";
};

export const StyledBoxCenter = styled(Box)`
    display: flex;
    align-items: center;
    width: ${(props) => getBoxWidth(props)};
    height: 100%;
    margin: auto;
    margin-top: ${(props) => (props.marginTop ? `${props.marginTop * 8}px` : "auto")};
    ${styledMedia.lessThan("md")`
      width: 100%;
      height: 100%;
      padding: ${(props) => (props?.$isLeftRightPadding ? "0 16px" : "")}
    `}
`;

export const StyledPaperCenter = styled(Paper)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => (props.width ? `${props.width}px` : "100%")};
    height: ${(props) => (props.height ? `${props.height}px` : "100%")};
    flex-direction: column;
    aspect-ratio: ${(props) => (props?.$isAspectRatio ? 1 / 1 : "")};
    ${styledMedia.lessThan("md")`
      width: 100%;
      height: 100%;
    `}
`;

const getImageHeight = (props) => {
    if (props.sameDimensions && props.width) {
        return `${props.width}px`;
    }
    if (props.height) {
        return `${props.height}px`;
    }
    return "100%";
};

export const StyledImageRenderer = styled.img`
    width: ${(props) => (props.width ? `${props.width}px` : "100%")};
    height: ${(props) => getImageHeight(props)};
    object-fit: scale-down;
    ${styledMedia.lessThan("md")`
      width: 100%;
      height: 100%;
    `}
`;

export const StyledDivider = styled(Divider)`
    width: ${(props) => (props.width ? `${props.width}px` : "100%")};
`;

export const StyledTextField = muiStyled(TextField)({
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
        borderWidth: "1px"
    },
    "&[readonly=\"read-only\"]": {
        pointerEvents: "none"
    }
});

export const StyledText = styled(Typography)`
    font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "")};
    ${styledMedia.lessThan("md")`
      font-size: 2rem;
    `}
    ${styledMedia.lessThan("sm")`
      font-size: 1rem;
    `}
    ${styledMedia.lessThan("xs")`
      font-size: 14px;
    `}
`;

export const StyledButton = styled(Button)``;

export const StyledBoxContainer = styled(Box)`
    display: flex;
    width: ${(props) => getBoxWidth(props)};
    height: 100%;
    margin: auto;
    margin-top: ${(props) => (props.marginTop ? `${props.marginTop * 8}px` : "auto")};
    ${styledMedia.lessThan("md")`
      width: 100%;
    `}
`;

export const StyledSpacer = styled(Typography).attrs({ component: "div" })`
    display: block;
`;
