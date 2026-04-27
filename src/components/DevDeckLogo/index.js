import React from "react";
import PropTypes from "prop-types";
import styled, { css, keyframes } from "styled-components";
import { Link } from "react-router-dom";

// ── Animations ────────────────────────────────────────────────────────────────
const pulse = keyframes`
    0%   { opacity: 0.8; }
    50%  { opacity: 1;   }
    100% { opacity: 0.8; }
`;

const lift = keyframes`
    0%   { transform: translateY(0);   }
    50%  { transform: translateY(-2px); }
    100% { transform: translateY(0);   }
`;

// ── Styled wrappers ───────────────────────────────────────────────────────────
const LogoLink = styled(Link)`
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
    gap: 0;
`;

const Bar = styled.rect`
    transition: filter 0.3s ease;
`;

const bar1Hover = css`
    filter: drop-shadow(0 0 6px #22c55e);
    animation: ${lift} 0.6s ease infinite, ${pulse} 1s ease infinite;
`;
const bar2Hover = css`
    filter: drop-shadow(0 0 6px #22c55e);
    animation: ${lift} 0.6s ease infinite 0.1s, ${pulse} 1s ease infinite 0.2s;
`;
const bar3Hover = css`
    filter: drop-shadow(0 0 6px #22c55e);
    animation: ${lift} 0.6s ease infinite 0.2s, ${pulse} 1s ease infinite 0.4s;
`;

const LogoSvg = styled.svg`
    display: block;

    .bar1 {
        fill: #22c55e;
    }
    .bar2 {
        fill: #16a34a;
    }
    .bar3 {
        fill: #4ade80;
    }

    &:hover .bar1 {
        ${bar1Hover}
    }
    &:hover .bar2 {
        ${bar2Hover}
    }
    &:hover .bar3 {
        ${bar3Hover}
    }
`;

// ── Component ────────────────────────────────────────────────────────────────
/**
 * @param {{ compact?: boolean }} props
 *   compact — hide the "DevDeck" text label (icon only, for small viewports)
 */
export default function DevDeckLogo({ compact = false }) {
    const width = compact ? 50 : 185;

    return (
        <LogoLink to="/" aria-label="DevDeck — go to home">
            <LogoSvg width={width} height="48" viewBox={`0 0 ${width} 48`} xmlns="http://www.w3.org/2000/svg">
                {/* Icon box */}
                <rect x="4" y="4" width="40" height="40" rx="10" fill="#111827" />

                {/* Animated bars */}
                <Bar className="bar1" x="11" y="13" width="26" height="6" rx="3" />
                <Bar className="bar2" x="11" y="21" width="26" height="6" rx="3" />
                <Bar className="bar3" x="11" y="29" width="26" height="6" rx="3" />

                {/* Wordmark — hidden in compact mode */}
                {!compact && (
                    <text x="52" y="32" fill="#f9fafb" fontSize="22" fontWeight="700" fontFamily="Ubuntu, Inter, sans-serif" letterSpacing="-0.3">
                        DevDeck
                    </text>
                )}
            </LogoSvg>
        </LogoLink>
    );
}

DevDeckLogo.propTypes = {
    compact: PropTypes.bool
};

DevDeckLogo.defaultProps = {
    compact: false
};
