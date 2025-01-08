import UpdateIcon from "@mui/icons-material/Update";
import { bool, func, string } from "prop-types";
import React from "react";
import { StyledBoxContainer, StyledButton, StyledPaperCenter, StyledText } from "../Styled-Components";

export default function AppUpdateUI({
    onClickYes,
    onClose,
    showCancel = true,
    title = window.document.title,
    description = "Are you sure?",
    noLabel = "No",
    yesLabel = "Yes"
}) {
    return (
        <StyledPaperCenter width={350} sx={{ p: 1 }}>
            <UpdateIcon fontSize="large" sx={{ m: 2 }} color="primary" />
            <StyledText component="h1" variant="h5">
                {title}
            </StyledText>
            <StyledText component="p" sx={{ mt: 1, minHeight: "50px" }}>
                {description}
            </StyledText>
            <StyledBoxContainer justifyContent="flex-end">
                {showCancel ? (
                    <StyledButton variant="outlined" onClick={onClose} sx={{ mr: 1 }}>
                        {noLabel}
                    </StyledButton>
                ) : null}
                <StyledButton variant="outlined" onClick={onClickYes}>
                    {yesLabel}
                </StyledButton>
            </StyledBoxContainer>
        </StyledPaperCenter>
    );
}

AppUpdateUI.defaultProps = {
    showCancel: true,
    title: "",
    description: "",
    noLabel: "",
    yesLabel: ""
};

AppUpdateUI.propTypes = {
    onClickYes: func.isRequired,
    onClose: func.isRequired,
    showCancel: bool,
    title: string,
    description: string,
    noLabel: string,
    yesLabel: string
};
