import styled, { keyframes } from "styled-components";
import { styledMedia } from "styles/global";

const fadeIn = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }
`;

const slideDown = keyframes`
    from { opacity: 0; transform: translateY(-16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const itemAppear = keyframes`
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const borderPulse = keyframes`
    0%, 100% { border-color: rgba(34,204,153,0.18); }
    50%       { border-color: rgba(34,204,153,0.55); }
`;

// ── Palette always uses its own dark theme for premium feel ──────────────────
const P = {
    bg: "#0f172a",
    surface: "#1e293b",
    border: "rgba(255,255,255,0.09)",
    borderActive: "rgba(34,204,153,0.35)",
    text: "#e2e8f0",
    textMuted: "#64748b",
    textSub: "#94a3b8",
    accent: "#22cc99",
    activeRow: "rgba(34,204,153,0.1)",
    kbd: "#1e293b",
    kbdBorder: "#334155",
    scrollbar: "#334155"
};

export const Backdrop = styled.div`
    position: fixed;
    inset: 0;
    z-index: 1300;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 72px;
    animation: ${fadeIn} 0.15s ease;
    ${styledMedia.lessThan("sm")`
        padding-top: 40px;
        align-items: flex-start;
    `}
`;

export const PaletteBox = styled.div`
    width: 100%;
    max-width: 660px;
    max-height: calc(100vh - 140px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: ${P.bg};
    border: 1px solid ${P.border};
    border-radius: 16px;
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.04);
    animation: ${slideDown} 0.2s cubic-bezier(0.22, 1, 0.36, 1);
    ${styledMedia.lessThan("sm")`
        border-radius: 12px;
        width: calc(100% - 24px);
        margin: 0 auto;
    `}
`;

export const SearchBar = styled.div`
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 10px;
    border-bottom: 1px solid ${P.border};
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    flex-shrink: 0;

    &:focus-within {
        border-bottom-color: ${P.accent};
        box-shadow: 0 1px 0 0 rgba(34, 204, 153, 0.25);
    }
`;

export const SearchIconWrap = styled.span`
    display: flex;
    align-items: center;
    color: ${P.textMuted};
    flex-shrink: 0;
`;

export const SearchInput = styled.input`
    flex: 1;
    padding: 18px 0;
    font-size: 1rem;
    font-family: "Inter", sans-serif;
    background: transparent;
    border: none;
    color: ${P.text};
    outline: none;

    &::placeholder {
        color: ${P.textMuted};
        transition: opacity 0.25s ease;
        opacity: ${({ $placeholderFading }) => ($placeholderFading ? 0 : 1)};
    }
`;

export const CategoryFilterChip = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 8px 2px 6px;
    border-radius: 6px;
    background: rgba(34, 204, 153, 0.15);
    border: 1px solid rgba(34, 204, 153, 0.35);
    color: ${P.accent};
    font-size: 0.72rem;
    font-weight: 700;
    flex-shrink: 0;
    cursor: pointer;
    user-select: none;
    transition: background 0.1s ease;

    &:hover {
        background: rgba(34, 204, 153, 0.24);
    }
`;

export const ChipX = styled.span`
    display: inline-flex;
    align-items: center;
    font-size: 0.85rem;
    line-height: 1;
    opacity: 0.55;
    margin-left: 2px;

    &:hover {
        opacity: 1;
    }
`;

export const KbdHint = styled.span`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 3px;

    kbd {
        padding: 2px 7px;
        border: 1px solid ${P.kbdBorder};
        border-radius: 5px;
        background: ${P.kbd};
        color: ${P.textMuted};
        font-size: 0.68rem;
        font-family: monospace;
        line-height: 1.6;
    }
`;

export const ResultsList = styled.div`
    max-height: 420px;
    overflow-y: auto;
    padding: 6px 0 8px;

    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
        background: ${P.scrollbar};
        border-radius: 4px;
    }
`;

export const SectionHeader = styled.div`
    padding: 10px 16px 4px;
    font-size: 0.67rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${P.textMuted};
`;

export const ResultItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 12px;
    cursor: pointer;
    margin: 1px 6px;
    border-radius: 8px;
    position: relative;
    transition: background 0.1s ease, border-color 0.1s ease;
    background: ${({ $active }) => ($active ? P.activeRow : "transparent")};
    border: 1px solid ${({ $active }) => ($active ? P.borderActive : "transparent")};
    animation: ${itemAppear} 0.18s ease both;
    animation-delay: ${({ $delay }) => $delay || 0}ms;

    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 4px;
        bottom: 4px;
        width: 2px;
        border-radius: 2px;
        background: ${P.accent};
        opacity: ${({ $active }) => ($active ? 1 : 0)};
        transform: ${({ $active }) => ($active ? "scaleY(1)" : "scaleY(0.4)")};
        transition: opacity 0.12s ease, transform 0.12s ease;
    }
`;

const categoryBg = (cat) => {
    if (cat === "image") return "rgba(34,204,153,0.12)";
    if (cat === "encoding") return "rgba(34,153,255,0.12)";
    if (cat === "url") return "rgba(255,152,0,0.12)";
    if (cat === "utilities") return "rgba(180,122,230,0.12)";
    if (cat === "navigation") return "rgba(34,204,153,0.12)";
    if (cat === "command") return "rgba(245,158,11,0.12)";
    return "rgba(255,255,255,0.06)";
};

const categoryColor = (cat) => {
    if (cat === "image") return "#22cc99";
    if (cat === "encoding") return "#2299ff";
    if (cat === "url") return "#ff9800";
    if (cat === "utilities") return "#b47ae6";
    if (cat === "navigation") return "#22cc99";
    if (cat === "command") return "#f59e0b";
    return P.textMuted;
};

export const ItemIconWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    flex-shrink: 0;
    font-size: 1rem;
    line-height: 1;
    background: ${({ $kind, $category }) => ($kind === "recent" ? "rgba(34,204,153,0.1)" : categoryBg($category))};
    color: ${({ $kind, $category }) => ($kind === "recent" ? "#22cc99" : categoryColor($category))};

    & svg {
        font-size: 1.1rem !important;
        width: 1.1rem !important;
        height: 1.1rem !important;
    }
`;

export const ItemContent = styled.div`
    flex: 1;
    min-width: 0;
`;

export const ItemLabel = styled.span`
    display: block;
    font-size: 0.88rem;
    font-weight: 600;
    color: ${({ $dimmed }) => ($dimmed ? P.textSub : P.text)};
    opacity: ${({ $dimmed }) => ($dimmed ? 0.6 : 1)};
    transition: opacity 0.1s ease;
`;

export const MatchChar = styled.span`
    color: ${P.accent};
    font-weight: 700;
`;

export const ItemDescription = styled.span`
    display: block;
    font-size: 0.74rem;
    color: ${P.textMuted};
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const CategoryBadge = styled.span`
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 0.64rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
    color: ${({ $cat }) => {
        if ($cat === "image" || $cat === "navigation") return "#22cc99";
        if ($cat === "encoding") return "#2299ff";
        if ($cat === "url") return "#ff9800";
        if ($cat === "utilities") return "#b47ae6";
        if ($cat === "command") return "#f59e0b";
        return "#ff9800";
    }};
    background: ${({ $cat }) => {
        if ($cat === "image" || $cat === "navigation") return "rgba(34,204,153,0.1)";
        if ($cat === "encoding") return "rgba(34,153,255,0.1)";
        if ($cat === "url") return "rgba(255,152,0,0.1)";
        if ($cat === "utilities") return "rgba(180,122,230,0.1)";
        if ($cat === "command") return "rgba(245,158,11,0.1)";
        return "rgba(255,152,0,0.1)";
    }};
    border: 1px solid currentColor;
`;

export const SmartBanner = styled.div`
    margin: 8px 6px 4px;
    padding: 10px 14px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: border-color 0.1s ease, background 0.1s ease;
    background: ${({ $active }) => ($active ? P.activeRow : "rgba(34,204,153,0.07)")};
    border: 1px solid ${({ $active }) => ($active ? P.borderActive : "rgba(34,204,153,0.18)")};
    animation: ${borderPulse} 2s ease-in-out infinite;
`;

export const SmartBannerText = styled.span`
    flex: 1;
    font-size: 0.8rem;
    color: ${P.textSub};

    strong {
        color: ${P.accent};
        font-weight: 700;
    }
`;

export const SmartBannerArrow = styled.span`
    font-size: 0.75rem;
    color: ${P.accent};
    font-weight: 600;
`;

export const EmptyMessage = styled.div`
    padding: 44px 20px;
    text-align: center;
    color: ${P.textMuted};
    font-size: 0.88rem;
`;

export const Footer = styled.div`
    display: flex;
    gap: 16px;
    padding: 10px 16px;
    border-top: 1px solid ${P.border};
    font-size: 0.7rem;
    color: ${P.textMuted};

    kbd {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 1px 5px;
        border: 1px solid ${P.kbdBorder};
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.67rem;
        margin-right: 3px;
        color: ${P.textMuted};
        background: ${P.kbd};
        line-height: 1.6;
    }
`;
