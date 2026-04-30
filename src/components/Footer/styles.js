import styled from "styled-components";
import { Link } from "react-router-dom";

import colors from "styles/colors";

export const StyledContainer = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${colors.darker};
    color: ${colors.light};
    width: 100%;
    min-height: 44px;
    padding: 6px 16px;
    bottom: 0;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
`;

export const TrustLine = styled.span`
    font-size: 10px;
    font-family: "Inter", sans-serif;
    color: rgba(34, 204, 153, 0.7);
    letter-spacing: 0.04em;
    margin-top: 2px;
`;

export const GuidesRow = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 3px;
    font-size: 10px;
    font-family: "Inter", sans-serif;
    color: rgba(255, 255, 255, 0.35);
`;

export const GuideLink = styled(Link)`
    color: rgba(34, 204, 153, 0.55);
    font-size: 10px;
    font-family: "Inter", sans-serif;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.15s ease;
    &:hover {
        color: rgba(34, 204, 153, 0.9);
    }
`;
