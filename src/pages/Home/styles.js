import { Chip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { styledMedia } from "styles/global";

export const StyledContainer = styled.div`
    background-color: var(--bg-page);
    color: var(--text-primary);
    min-height: 100vh;
`;

export const StyledHero = styled.div`
    background: var(--hero-gradient);
    padding: 48px 24px 56px;
    text-align: center;
    color: #fff;
    ${styledMedia.lessThan("sm")`
      padding: 32px 16px 40px;
    `}
`;

export const StyledHeroTitle = styled(Typography)`
    font-weight: 700 !important;
    letter-spacing: -0.5px !important;
    ${styledMedia.lessThan("sm")`
      font-size: 2rem !important;
    `}
`;

export const StyledHeroSubtitle = styled(Typography)`
    opacity: 0.85;
    margin-top: 8px !important;
    ${styledMedia.lessThan("sm")`
      font-size: 1rem !important;
    `}
`;

export const StyledHeroBadge = styled(Chip)`
    margin-top: 16px !important;
    background-color: rgba(255, 255, 255, 0.15) !important;
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    font-weight: 600 !important;
`;

export const StyledSectionWrapper = styled.div`
    padding: 24px 20px 0;
    max-width: 1400px;
    margin: 0 auto;
    ${styledMedia.lessThan("sm")`
      padding: 16px 12px 0;
    `}
`;

export const StyledSectionHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 14px;
    margin-top: 24px;
    gap: 10px;
`;

export const StyledSectionTitle = styled(Typography)`
    font-weight: 700 !important;
    color: var(--text-primary);
    ${styledMedia.lessThan("sm")`
      font-size: 1.1rem !important;
    `}
`;

export const StyledSectionAccent = styled.div`
    width: 4px;
    height: 24px;
    border-radius: 2px;
    background-color: ${(props) => props.$color || "#22cc99"};
    flex-shrink: 0;
`;

export const StyledGridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 12px;
`;

export const StyledGridItem = styled.div`
    width: calc(25% - 12px);
    background-color: var(--bg-card);
    color: var(--text-primary);
    border-radius: 10px;
    border-left: 4px solid ${(props) => props.$accentColor || "#22cc99"};
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
    transition: transform 200ms ease, box-shadow 200ms ease;
    position: relative;
    overflow: hidden;
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
    }
    ${styledMedia.lessThan("lg")`
      width: calc(33.33% - 11px);
    `}
    ${styledMedia.lessThan("md")`
      width: calc(50% - 8px);
    `}
    ${styledMedia.lessThan("xs")`
      width: 100%;
    `}
`;

export const StyledCard = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 16px;
    flex-direction: row;
    gap: 14px;
`;

export const StyledCardIconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background-color: ${(props) => props.$accentColor || "#22cc99"}22;
    flex-shrink: 0;
    color: ${(props) => props.$accentColor || "#22cc99"};
    & svg {
        font-size: 1.6rem !important;
        width: 1.6rem !important;
        height: 1.6rem !important;
    }
`;

export const StyledCardContent = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
`;

export const StyledCardTitle = styled(Typography)`
    font-weight: 600 !important;
    color: var(--text-primary) !important;
    line-height: 1.3 !important;
    ${styledMedia.lessThan("sm")`
      font-size: 0.9rem !important;
    `}
`;

export const StyledCardDescription = styled(Typography)`
    color: var(--text-secondary) !important;
    margin-top: 4px !important;
    line-height: 1.4 !important;
    ${styledMedia.lessThan("sm")`
      font-size: 0.75rem !important;
    `}
`;

export const StyledBadge = styled(Chip)`
    position: absolute !important;
    top: 10px !important;
    right: 10px !important;
    height: 20px !important;
    font-size: 10px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    pointer-events: none;
`;

export const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    display: block;
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
