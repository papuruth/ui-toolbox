import React from "react";
import Header from "components/Header";
import Footer from "components/Footer";
import Routes from "routes";
import { ConnectedRouter } from "connected-react-router";
import { Switch } from "react-router-dom";
import history from "routes/history";
import { StyledContainer, StyledMainViewContainer } from "./styles";

export default function GlobalLayout() {
    return (
        <StyledContainer>
            <StyledMainViewContainer>
                <ConnectedRouter history={history}>
                    <Header />
                    <Switch>
                        <Routes />
                    </Switch>
                </ConnectedRouter>
            </StyledMainViewContainer>
            <Footer />
        </StyledContainer>
    );
}
