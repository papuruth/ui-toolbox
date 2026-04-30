import { Box, Paper } from "@mui/material";
import styled from "styled-components";
import { styledMedia } from "styles/global";

// ── Page wrapper ─────────────────────────────────────────────────────────────
export const BlogPageWrapper = styled(Box)`
    width: 100%;
    max-width: 860px;
    margin: 0 auto;
    padding: 0 24px 64px;
    box-sizing: border-box;
    ${styledMedia.lessThan("sm")`
        padding: 0 16px 48px;
    `}
    ${styledMedia.lessThan("xs")`
        padding: 0 12px 40px;
    `}
`;

// ── Hero (matches tool hero style) ───────────────────────────────────────────
export const BlogHero = styled(Box)`
    width: 100%;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border-color);
    border-left: 4px solid #22cc99;
    padding: 24px 32px 28px;
    box-sizing: border-box;
    margin-bottom: 40px;
    ${styledMedia.lessThan("sm")`
        padding: 16px 20px 20px;
        margin-bottom: 28px;
    `}
    ${styledMedia.lessThan("xs")`
        padding: 12px 12px 16px;
        border-left-width: 3px;
        margin-bottom: 20px;
    `}
`;

export const BlogTitle = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.25;
    margin: 0 0 12px;
    font-family: "Inter", sans-serif;
    ${styledMedia.lessThan("sm")`
        font-size: 1.5rem;
    `}
    ${styledMedia.lessThan("xs")`
        font-size: 1.25rem;
    `}
`;

export const BlogIntro = styled.p`
    font-size: 1.0625rem;
    line-height: 1.75;
    color: var(--text-secondary);
    margin: 0;
    max-width: 680px;
    ${styledMedia.lessThan("sm")`
        font-size: 1rem;
    `}
`;

// ── Content sections ──────────────────────────────────────────────────────────
export const BlogSection = styled(Box)`
    margin-top: 40px;
    ${styledMedia.lessThan("sm")`
        margin-top: 28px;
    `}
`;

export const BlogH2 = styled.h2`
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 14px;
    padding-left: 12px;
    border-left: 3px solid #22cc99;
    font-family: "Inter", sans-serif;
    ${styledMedia.lessThan("xs")`
        font-size: 1.125rem;
    `}
`;

export const BlogBody = styled.p`
    font-size: 1rem;
    line-height: 1.8;
    color: var(--text-secondary);
    margin: 0;
`;

export const BlogList = styled.ul`
    margin: 0;
    padding-left: 20px;
    list-style: disc;

    li {
        font-size: 1rem;
        line-height: 1.75;
        color: var(--text-secondary);
        margin-bottom: 6px;

        &:last-child {
            margin-bottom: 0;
        }
    }
`;

export const BlogSteps = styled.ol`
    margin: 0;
    padding-left: 22px;

    li {
        font-size: 1rem;
        line-height: 1.75;
        color: var(--text-secondary);
        margin-bottom: 8px;
        padding-left: 4px;

        &::marker {
            color: #22cc99;
            font-weight: 600;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }
`;

// ── CTA box ───────────────────────────────────────────────────────────────────
export const BlogCTABox = styled(Box)`
    margin-top: 48px;
    padding: 32px;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-panel, 12px);
    text-align: center;
    box-shadow: var(--shadow-panel);
    ${styledMedia.lessThan("sm")`
        padding: 24px 16px;
        margin-top: 36px;
    `}
`;

export const BlogCTAHeading = styled.p`
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 16px;
`;

// ── Related tools grid ────────────────────────────────────────────────────────
export const BlogRelatedWrapper = styled(Box)`
    margin-top: 48px;
    ${styledMedia.lessThan("sm")`
        margin-top: 36px;
    `}
`;

export const BlogRelatedTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 20px;
    font-family: "Inter", sans-serif;
`;

export const BlogRelatedGrid = styled(Box)`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    ${styledMedia.lessThan("md")`
        grid-template-columns: repeat(2, 1fr);
    `}
    ${styledMedia.lessThan("xs")`
        grid-template-columns: 1fr;
    `}
`;

export const BlogRelatedCard = styled(Paper)`
    padding: 18px 20px !important;
    border-radius: 10px !important;
    background: var(--bg-card) !important;
    border: 1px solid var(--border-color) !important;
    cursor: pointer;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

    &:hover {
        border-color: #22cc99 !important;
        box-shadow: 0 4px 16px rgba(34, 204, 153, 0.12) !important;
        transform: translateY(-2px);
    }
`;

export const BlogRelatedCardTitle = styled.p`
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px;
    line-height: 1.3;
`;

export const BlogRelatedCardDesc = styled.p`
    font-size: 0.8125rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
`;

// ── FAQ ───────────────────────────────────────────────────────────────────────
export const BlogFAQWrapper = styled(Box)`
    margin-top: 48px;
    ${styledMedia.lessThan("sm")`
        margin-top: 36px;
    `}
`;

export const BlogFAQTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 20px;
    font-family: "Inter", sans-serif;
`;

// ── Blog index page ───────────────────────────────────────────────────────────
export const BlogIndexWrapper = styled(Box)`
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px 64px;
    box-sizing: border-box;
    ${styledMedia.lessThan("sm")`
        padding: 0 16px 48px;
    `}
    ${styledMedia.lessThan("xs")`
        padding: 0 12px 40px;
    `}
`;

export const BlogIndexHero = styled(Box)`
    width: 100%;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border-color);
    border-left: 4px solid #22cc99;
    padding: 24px 32px 28px;
    box-sizing: border-box;
    margin-bottom: 40px;
    ${styledMedia.lessThan("sm")`
        padding: 16px 20px 20px;
        margin-bottom: 28px;
    `}
`;

export const BlogIndexTitle = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 8px;
    font-family: "Inter", sans-serif;
    ${styledMedia.lessThan("sm")`
        font-size: 1.5rem;
    `}
`;

export const BlogIndexSubtitle = styled.p`
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0;
`;

export const BlogIndexGrid = styled(Box)`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    ${styledMedia.lessThan("md")`
        grid-template-columns: repeat(2, 1fr);
    `}
    ${styledMedia.lessThan("xs")`
        grid-template-columns: 1fr;
    `}
`;

export const BlogIndexCard = styled(Paper)`
    padding: 22px 24px !important;
    border-radius: 12px !important;
    background: var(--bg-card) !important;
    border: 1px solid var(--border-color) !important;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

    &:hover {
        border-color: #22cc99 !important;
        box-shadow: 0 4px 20px rgba(34, 204, 153, 0.12) !important;
        transform: translateY(-2px);
    }
`;

export const BlogIndexCardTitle = styled.h2`
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 8px;
    line-height: 1.35;
    font-family: "Inter", sans-serif;
`;

export const BlogIndexCardSnippet = styled.p`
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0 0 16px;
    line-height: 1.6;
    flex: 1;
`;

export const BlogIndexCardLink = styled.span`
    font-size: 0.875rem;
    font-weight: 600;
    color: #22cc99;
    margin-top: auto;
`;
