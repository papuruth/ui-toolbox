import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import PropTypes from "prop-types";
import localization from "localization";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const { updateBanner: L } = localization;

const slideUp = keyframes`
    from { transform: translateY(16px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
`;

const Wrap = styled.div`
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    width: 300px;
    @media (max-width: 576px) {
        left: 12px;
        right: 12px;
        bottom: 16px;
        width: auto;
    }
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.12);
    animation: ${slideUp} 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    overflow: hidden;
`;

const Accent = styled.div`
    height: 3px;
    background: linear-gradient(90deg, #22cc99, #059669);
`;

const Body = styled.div`
    padding: 14px 16px 10px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
`;

const IconWrap = styled.div`
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: rgba(34, 204, 153, 0.12);
    border: 1px solid rgba(34, 204, 153, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #22cc99;
`;

const Text = styled.div`
    flex: 1;
    min-width: 0;
`;

const Title = styled.div`
    font-size: 13px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    color: var(--text-primary);
    line-height: 1.4;
`;

const Subtitle = styled.div`
    font-size: 11px;
    font-family: "Inter", sans-serif;
    color: var(--text-secondary);
    margin-top: 3px;
    line-height: 1.5;
`;

const Actions = styled.div`
    display: flex;
    gap: 6px;
    padding: 10px 16px 14px;
    justify-content: flex-end;
`;

const UpdateBtn = styled.button`
    background: #22cc99;
    color: #0a0f0d;
    border: none;
    border-radius: var(--radius-btn, 6px);
    padding: 6px 14px;
    font-size: 11px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    cursor: pointer;
    transition: opacity 0.15s;
    &:hover {
        opacity: 0.85;
    }
`;

const LaterBtn = styled.button`
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-btn, 6px);
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 500;
    font-family: "Inter", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    cursor: pointer;
    transition: all 0.15s;
    &:hover {
        color: var(--text-primary);
        border-color: rgba(255, 255, 255, 0.25);
    }
`;

export default function UpdateBanner({ onUpdate }) {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    return (
        <Wrap>
            <Accent />
            <Body>
                <IconWrap>
                    <SystemUpdateAltIcon sx={{ fontSize: 18 }} />
                </IconWrap>
                <Text>
                    <Title>{L.title}</Title>
                    <Subtitle>{L.subtitle}</Subtitle>
                </Text>
            </Body>
            <Actions>
                <LaterBtn onClick={() => setDismissed(true)}>{L.laterBtn}</LaterBtn>
                <UpdateBtn onClick={onUpdate}>{L.updateNowBtn}</UpdateBtn>
            </Actions>
        </Wrap>
    );
}

UpdateBanner.propTypes = {
    onUpdate: PropTypes.func.isRequired
};
