import React from "react";
import { Typography } from "@mui/material";
import localization from "localization";
import { GLOBAL_CONSTANTS } from "utils/globalConstants";
import { StyledContainer, TrustLine } from "./styles";

export default function Footer() {
    const startYear = GLOBAL_CONSTANTS.APP_CREATED_YEAR;
    const currentYear = new Date().getFullYear();
    return (
        <StyledContainer>
            <Typography component="p" className="text-center" variant="h6">
                {localization.appTitle} &copy; {startYear} {startYear !== currentYear ? `- ${currentYear}` : ""}
            </Typography>
            <TrustLine>100% client-side &bull; No data leaves your browser</TrustLine>
        </StyledContainer>
    );
}
