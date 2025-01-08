import React from "react";
import { Typography } from "@mui/material";
import localization from "localization";
import { StyledContainer } from "./styles";

export default function Footer() {
    const startYear = 2023;
    const currentYear = new Date().getFullYear();
    return (
        <StyledContainer>
            <Typography component="p" className="text-center" variant="h6">
                {localization.appTitle} &copy; {startYear} {startYear !== currentYear ? `- ${currentYear}` : ""}
            </Typography>
        </StyledContainer>
    );
}
