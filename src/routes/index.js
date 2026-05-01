import { map } from "lodash";
import React, { useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import routes from "./routes";

const REDIRECTS = [
    { from: "/image-to-base64", to: "/base64-image" },
    { from: "/base64-to-image", to: "/base64-image" },
    { from: "/encode-base64", to: "/base64-text" },
    { from: "/decode-base64", to: "/base64-text" },
    { from: "/password-gen", to: "/password-tools" },
    { from: "/password-strength-meter", to: "/password-tools" }
];

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0);   }
`;

const PageWrapper = styled.div`
    animation: ${fadeIn} 0.22s ease both;
`;

function Routes() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <PageWrapper key={location.pathname}>
            <Switch location={location}>
                {REDIRECTS.map(({ from, to }) => (
                    <Redirect key={from} exact from={from} to={to} />
                ))}
                {map(routes, (route) => (
                    <Route {...route} />
                ))}
            </Switch>
        </PageWrapper>
    );
}

export default Routes;
