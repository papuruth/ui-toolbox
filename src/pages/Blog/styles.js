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
    opacity: 0;
    animation: cardFadeIn 0.32s ease-out forwards;
    animation-delay: ${(p) => p.$delay || 0}ms;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

    @keyframes cardFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    &:hover {
        border-color: #22cc99 !important;
        box-shadow: 0 4px 20px rgba(34, 204, 153, 0.12) !important;
        transform: translateY(-2px);
    }
`;

export const BlogIndexCardTitle = styled.h2`
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 8px;
    line-height: 1.35;
    font-family: "Inter", sans-serif;
`;

export const BlogIndexCardSnippet = styled.p`
    font-size: 0.875rem;
    color: var(--text-secondary);
    opacity: 0.72;
    margin: 0 0 16px;
    line-height: 1.6;
    flex: 1;
`;

export const BlogIndexCardLink = styled.span`
    font-size: 0.9rem;
    font-weight: 700;
    color: #22cc99;
    margin-top: auto;
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: text-decoration-color 0.15s ease, letter-spacing 0.15s ease;
    ${BlogIndexCard}:hover & {
        text-decoration-color: #22cc99;
        letter-spacing: 0.02em;
    }
`;

// ── Blog index search ─────────────────────────────────────────────────────────
export const BlogIndexSearchWrapper = styled(Box)`
    margin-top: 14px;
    max-width: 320px;
    ${styledMedia.lessThan("xs")`
        max-width: 100%;
    `}
`;

export const BlogIndexSearchInput = styled.input`
    width: 100%;
    box-sizing: border-box;
    background: var(--bg-input);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 13px;
    font-family: "Inter", sans-serif;
    outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    &:focus {
        border-color: rgba(34, 204, 153, 0.5);
        box-shadow: 0 0 0 3px rgba(34, 204, 153, 0.08);
    }
    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.5;
    }
`;

// ── Section label ─────────────────────────────────────────────────────────────
export const SectionLabel = styled.p`
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #22cc99;
    margin: 0 0 14px;
    font-family: "Inter", sans-serif;
`;

// ── Featured section ──────────────────────────────────────────────────────────
export const FeaturedSection = styled(Box)`
    margin-bottom: 48px;
    ${styledMedia.lessThan("sm")`
        margin-bottom: 32px;
    `}
`;

export const FeaturedGrid = styled(Box)`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 16px;
    ${styledMedia.lessThan("sm")`
        grid-template-columns: 1fr;
        grid-template-rows: auto;
    `}
`;

export const FeaturedHeroCard = styled(Paper)`
    padding: 28px !important;
    border-radius: 14px !important;
    background: var(--bg-card) !important;
    border: 1px solid var(--border-color) !important;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    grid-row: 1 / 3;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #22cc99, #2299ff);
    }

    &:hover {
        border-color: rgba(34, 204, 153, 0.5) !important;
        box-shadow: 0 8px 32px rgba(34, 204, 153, 0.14) !important;
        transform: translateY(-3px);
    }

    ${styledMedia.lessThan("sm")`
        grid-row: auto;
        padding: 20px !important;
    `}
`;

export const FeaturedHeroLabel = styled.span`
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #22cc99;
    background: rgba(34, 204, 153, 0.1);
    border: 1px solid rgba(34, 204, 153, 0.2);
    border-radius: 4px;
    padding: 3px 8px;
    display: inline-block;
    margin-bottom: 14px;
    width: fit-content;
`;

export const FeaturedHeroTitle = styled.h2`
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 12px;
    line-height: 1.3;
    font-family: "Inter", sans-serif;
    ${styledMedia.lessThan("sm")`
        font-size: 1.125rem;
    `}
`;

export const FeaturedHeroSnippet = styled.p`
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin: 0 0 20px;
    line-height: 1.65;
    flex: 1;
`;

export const FeaturedHeroCTA = styled.span`
    font-size: 0.875rem;
    font-weight: 600;
    color: #22cc99;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: gap 0.15s ease;
`;

export const FeaturedSideCard = styled(Paper)`
    padding: 20px 22px !important;
    border-radius: 12px !important;
    background: var(--bg-card) !important;
    border: 1px solid var(--border-color) !important;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

    &:hover {
        border-color: rgba(34, 204, 153, 0.5) !important;
        box-shadow: 0 4px 16px rgba(34, 204, 153, 0.12) !important;
        transform: translateY(-2px);
    }
`;

export const FeaturedSideTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 8px;
    line-height: 1.3;
    font-family: "Inter", sans-serif;
`;

export const FeaturedSideSnippet = styled.p`
    font-size: 0.8125rem;
    color: var(--text-secondary);
    margin: 0 0 14px;
    line-height: 1.55;
    flex: 1;
`;

// ── Category bar ──────────────────────────────────────────────────────────────
export const CategoryBar = styled(Box)`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 24px;
`;

export const CategoryChip = styled.button`
    padding: 5px 14px;
    border-radius: 20px;
    border: 1px solid ${(p) => (p.$active ? "rgba(34,204,153,0.5)" : "var(--border-color)")};
    background: ${(p) => (p.$active ? "rgba(34,204,153,0.12)" : "transparent")};
    color: ${(p) => (p.$active ? "#22cc99" : "var(--text-secondary)")};
    font-size: 12px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    &:hover {
        border-color: rgba(34, 204, 153, 0.4);
        color: #22cc99;
        background: rgba(34, 204, 153, 0.07);
    }
`;

// ── Popular guides list ───────────────────────────────────────────────────────
export const PopularList = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 40px;
`;

export const PopularRow = styled(Paper)`
    padding: 13px 18px !important;
    border-radius: 10px !important;
    background: var(--bg-card) !important;
    border: 1px solid var(--border-color) !important;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

    &:hover {
        border-color: rgba(34, 204, 153, 0.4) !important;
        box-shadow: 0 3px 12px rgba(34, 204, 153, 0.1) !important;
        transform: translateX(3px);
    }
`;

function rankColor(n) {
    if (n <= 1) return "#22cc99";
    if (n <= 3) return "#2299ff";
    return "var(--text-secondary)";
}

function rankOpacity(n) {
    if (n <= 1) return 1;
    if (n <= 3) return 0.8;
    return 0.45;
}

export const PopularRank = styled.span`
    font-size: 0.7rem;
    font-weight: 700;
    font-family: "Inter", sans-serif;
    color: ${(p) => rankColor(p.$n)};
    opacity: ${(p) => rankOpacity(p.$n)};
    min-width: 22px;
    text-align: center;
    flex-shrink: 0;
`;

export const PopularRowContent = styled(Box)`
    flex: 1;
    min-width: 0;
`;

export const PopularRowTitle = styled.p`
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: "Inter", sans-serif;
`;

// ── Card meta (tags + read time) ──────────────────────────────────────────────
export const CardMetaRow = styled(Box)`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    flex-wrap: wrap;
`;

export const CardTag = styled.span`
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: ${(p) => p.$color || "#22cc99"};
    background: ${(p) => p.$bg || "rgba(34,204,153,0.1)"};
    border-radius: 4px;
    padding: 2px 7px;
`;

export const CardReadTime = styled.span`
    font-size: 0.72rem;
    color: var(--text-secondary);
    opacity: 0.55;
    font-family: "Inter", sans-serif;
`;
