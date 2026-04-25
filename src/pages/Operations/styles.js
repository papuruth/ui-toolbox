import { Box, Paper } from "@mui/material";
import styled from "styled-components";
import colors from "styles/colors";
import { styledMedia } from "styles/global";

export const StyledToolPage = styled(Box)`
    width: 100%;
`;

export const StyledToolHero = styled(Box)`
    width: 100%;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border-color);
    border-left: 4px solid ${(props) => props.$categoryColor || colors.primary};
    padding: 12px 40px 20px;
    box-sizing: border-box;
    ${styledMedia.lessThan("sm")`
        padding: 10px 20px 16px;
    `}
    ${styledMedia.lessThan("xs")`
        padding: 8px 12px 14px;
        border-left-width: 3px;
    `}
`;

export const StyledHeroContent = styled(Box)`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
`;

export const StyledToolBody = styled(Box)`
    width: 100%;
    padding: 28px 40px 0;
    box-sizing: border-box;
    ${styledMedia.lessThan("sm")`
        padding: 20px 20px 0;
    `}
    ${styledMedia.lessThan("xs")`
        padding: 14px 12px 0;
    `}
`;

export const StyledToolCard = styled(Paper)`
    padding: 28px 32px !important;
    border-radius: 12px !important;
    background: var(--bg-card) !important;
    ${styledMedia.lessThan("sm")`
        padding: 20px 16px !important;
    `}
    ${styledMedia.lessThan("xs")`
        padding: 14px 12px !important;
    `}
`;
