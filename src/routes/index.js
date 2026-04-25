import { map } from "lodash";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import routes from "./routes";

const REDIRECTS = [
    { from: "/image-to-base64", to: "/base64-image" },
    { from: "/base64-to-image", to: "/base64-image" },
    { from: "/encode-base64", to: "/base64-text" },
    { from: "/decode-base64", to: "/base64-text" },
    { from: "/password-gen", to: "/password-tools" },
    { from: "/password-strength-meter", to: "/password-tools" }
];

function Routes() {
    return (
        <Switch>
            {REDIRECTS.map(({ from, to }) => (
                <Redirect key={from} exact from={from} to={to} />
            ))}
            {map(routes, (route) => (
                <Route {...route} />
            ))}
        </Switch>
    );
}

export default Routes;
