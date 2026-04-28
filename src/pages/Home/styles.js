import { Chip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { styledMedia } from "styles/global";

// ── Animations ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0);    }
`;

const slideDown = keyframes`
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0);    }
`;

const glowPulse = keyframes`
    0%,  100% { box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15), 0 0 20px  rgba(34, 197, 94, 0.15), 0 8px 32px rgba(0,0,0,0.3); }
    50%        { box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.25), 0 0 40px rgba(34, 197, 94, 0.25), 0 8px 32px rgba(0,0,0,0.3); }
`;

export const StyledContainer = styled.div`
    background-color: var(--bg-page);
    color: var(--text-primary);
    min-height: 100vh;
`;

// ── Hero ──────────────────────────────────────────────────────────────────────
export const StyledHero = styled.section`
    background: #0f172a;
    padding: 80px 24px 88px;
    text-align: center;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    /* subtle radial glow */
    &::before {
        content: "";
        position: absolute;
        top: -40%;
        left: 50%;
        transform: translateX(-50%);
        width: 700px;
        height: 700px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%);
        pointer-events: none;
    }

    ${styledMedia.lessThan("sm")`
        padding: 56px 16px 64px;
    `}
`;

export const StyledHeroTitle = styled(Typography)`
    font-weight: 800 !important;
    font-size: 3rem !important;
    letter-spacing: -1px !important;
    color: #f9fafb !important;
    animation: ${fadeUp} 0.5s ease both;
    ${styledMedia.lessThan("sm")`
        font-size: 2.2rem !important;
    `}
`;

export const StyledHeroSubtitle = styled(Typography)`
    color: #94a3b8 !important;
    margin-top: 12px !important;
    max-width: 480px;
    line-height: 1.6 !important;
    animation: ${fadeUp} 0.5s ease 0.1s both;
    ${styledMedia.lessThan("sm")`
        font-size: 1rem !important;
    `}
`;

export const StyledHeroBadge = styled(Chip)`
    margin-top: 20px !important;
    background-color: rgba(34, 197, 94, 0.12) !important;
    color: #4ade80 !important;
    border: 1px solid rgba(34, 197, 94, 0.3) !important;
    font-weight: 700 !important;
    font-size: 0.75rem !important;
    animation: ${fadeUp} 0.5s ease 0.15s both;
`;

export const HeroMicroText = styled.p`
    font-size: 0.78rem;
    color: #475569;
    margin-top: 8px;
    animation: ${fadeUp} 0.5s ease 0.12s both;
    letter-spacing: 0.02em;
`;

// ── Hero inline search ────────────────────────────────────────────────────────
export const HeroSearchWrapper = styled.div`
    position: relative;
    width: 100%;
    max-width: 560px;
    margin-top: 28px;
    animation: ${fadeUp} 0.5s ease 0.2s both;
    z-index: 10;
`;

export const HeroSearchBox = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    background: #111827;
    border: 1.5px solid ${({ $focused }) => ($focused ? "rgba(34, 197, 94, 0.5)" : "rgba(255, 255, 255, 0.1)")};
    border-radius: 14px;
    padding: 14px 16px;
    cursor: text;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    box-shadow: ${({ $focused }) => ($focused ? "0 0 0 2px rgba(34, 197, 94, 0.15), 0 0 8px rgba(34, 197, 94, 0.15), 0 8px 32px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.2)")};
    transform: ${({ $focused }) => ($focused ? "scale(1.01)" : "scale(1)")};
    ${({ $focused }) => $focused && css`animation: ${glowPulse} 2s ease-in-out infinite;`}
`;

export const HeroSearchIcon = styled.span`
    font-size: 1rem;
    flex-shrink: 0;
    line-height: 1;
`;

export const HeroInputField = styled.input`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.92rem;
    color: #e2e8f0;
    font-family: "Inter", sans-serif;
    min-width: 0;

    &::placeholder {
        color: #475569;
    }
`;

export const HeroInputHints = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;

    ${styledMedia.lessThan("xs")`
        display: none;
    `}
`;

export const HeroInputKbd = styled.span`
    font-size: 0.68rem;
    color: #334155;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 5px;
    padding: 2px 7px;
    font-family: monospace;
    white-space: nowrap;
`;

export const HeroEnterHint = styled.span`
    font-size: 0.68rem;
    color: #334155;
`;

export const HeroSuggestionsList = styled.div`
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: #111827;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
    animation: ${slideDown} 0.15s ease;
    z-index: 100;
`;

export const HeroSuggestionItem = styled.div`
    padding: 10px 16px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    background: ${({ $active }) => ($active ? "rgba(34, 197, 94, 0.08)" : "transparent")};
    transition: background 0.1s ease;

    &:last-child {
        border-bottom: none;
    }
`;

export const HeroSuggestionLabel = styled.div`
    font-size: 0.88rem;
    font-weight: 600;
    color: #e2e8f0;
`;

export const HeroHighlight = styled.mark`
    background: transparent;
    color: #4ade80;
    font-weight: 700;
`;

export const HeroSuggestionDesc = styled.div`
    font-size: 0.73rem;
    color: #475569;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const HeroSmartBanner = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    cursor: pointer;
    background: ${({ $active }) => ($active ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.05)")};
    border-bottom: 1px solid rgba(34, 197, 94, 0.1);
    font-size: 0.82rem;
    color: #94a3b8;
    transition: background 0.1s ease;

    strong {
        color: #4ade80;
    }
`;

export const HeroSuggestionFooter = styled.div`
    padding: 8px 16px;
    font-size: 0.72rem;
    color: #334155;
    cursor: pointer;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    transition: color 0.1s ease;

    &:hover {
        color: #4ade80;
    }
`;

/* CTA buttons row */
export const HeroCTARow = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 28px;
    flex-wrap: wrap;
    justify-content: center;
    animation: ${fadeUp} 0.5s ease 0.3s both;
`;

export const HeroCTAPrimary = styled.button`
    padding: 12px 28px;
    border-radius: 12px;
    border: none;
    background: #22c55e;
    color: #0f172a;
    font-weight: 700;
    font-size: 0.92rem;
    font-family: "Inter", sans-serif;
    cursor: pointer;
    transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;

    &:hover {
        background: #16a34a;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
    }
    &:active {
        transform: translateY(0);
    }
`;

export const HeroCTASecondary = styled.button`
    padding: 12px 28px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #cbd5e1;
    font-weight: 600;
    font-size: 0.92rem;
    font-family: "Inter", sans-serif;
    cursor: pointer;
    transition: background 0.18s ease, border-color 0.18s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.09);
        border-color: rgba(255, 255, 255, 0.2);
    }
`;

/* Feature pills row */
export const HeroFeatureRow = styled.div`
    display: flex;
    gap: 24px;
    margin-top: 40px;
    flex-wrap: wrap;
    justify-content: center;
    animation: ${fadeUp} 0.5s ease 0.4s both;
`;

export const HeroFeature = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    color: #64748b;
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid transparent;
    cursor: default;
    transition: background 0.2s ease, border-color 0.2s ease;

    &:hover {
        background: rgba(34, 197, 94, 0.05);
        border-color: rgba(34, 197, 94, 0.2);
    }

    span.icon {
        font-size: 1.5rem;
        transition: transform 0.2s ease;
    }
    &:hover span.icon {
        transform: scale(1.2);
    }
    span.label {
        color: #94a3b8;
        font-weight: 600;
    }
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
    transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
    position: relative;
    overflow: hidden;
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0px 8px 28px rgba(0, 0, 0, 0.2), 0 0 0 1px ${(props) => props.$accentColor || "#22cc99"}44;
        border-color: ${(props) => props.$accentColor || "#22cc99"};
    }
    &::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 10px;
        background: radial-gradient(circle at 30% 50%, ${(props) => props.$accentColor || "#22cc99"}0a, transparent 70%);
        opacity: 0;
        transition: opacity 300ms ease;
        pointer-events: none;
    }
    &:hover::after {
        opacity: 1;
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
