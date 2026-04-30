import React from "react";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import localization from "localization";
import { GLOBAL_CONSTANTS } from "utils/globalConstants";
import { StyledContainer, TrustLine, GuidesRow, GuideLink } from "./styles";

const FOOTER_GUIDES = [
    { slug: "json-viewer", label: "JSON Viewer" },
    { slug: "base64-text-encoder", label: "Base64 Guide" },
    { slug: "regex-tester", label: "Regex Guide" },
    { slug: "jwt-decoder", label: "JWT Decoded" },
    { slug: "password-generator", label: "Password Security" }
];

export default function Footer() {
    const dispatch = useDispatch();
    const startYear = GLOBAL_CONSTANTS.APP_CREATED_YEAR;
    const currentYear = new Date().getFullYear();
    return (
        <StyledContainer>
            <Typography component="p" className="text-center" variant="h6">
                {localization.appTitle} &copy; {startYear} {startYear !== currentYear ? `- ${currentYear}` : ""}
            </Typography>
            <TrustLine>100% client-side &bull; No data leaves your browser</TrustLine>
            <GuidesRow>
                <span>Guides:</span>
                {FOOTER_GUIDES.map((g, i) => (
                    <React.Fragment key={g.slug}>
                        <GuideLink onClick={() => dispatch(push(`/blog/${g.slug}`))}>{g.label}</GuideLink>
                        {i < FOOTER_GUIDES.length - 1 && <span>·</span>}
                    </React.Fragment>
                ))}
            </GuidesRow>
        </StyledContainer>
    );
}
