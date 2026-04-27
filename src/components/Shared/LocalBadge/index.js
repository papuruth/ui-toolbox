import { Info, Lock } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Wrap = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 4px;
    background: rgba(34, 204, 153, 0.07);
    border: 1px solid rgba(34, 204, 153, 0.18);
    color: #22cc99;
    font-size: 10px;
    font-weight: 500;
    font-family: "Inter", sans-serif;
    letter-spacing: 0.04em;
    user-select: none;
    cursor: help;
    opacity: 0.8;
    transition: opacity 0.15s ease;
    &:hover {
        opacity: 1;
    }
`;

export default function LocalBadge() {
    return (
        <Tooltip
            title="All tools run locally in your browser. We do not store or send your data."
            placement="bottom"
            arrow
        >
            <Wrap>
                <Lock style={{ fontSize: 10 }} />
                Processed locally
                <Info style={{ fontSize: 10, opacity: 0.7 }} />
            </Wrap>
        </Tooltip>
    );
}
