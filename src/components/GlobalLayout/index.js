import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "components/Header";
import Footer from "components/Footer";
import Routes from "routes";
import { ConnectedRouter } from "connected-react-router";
import history from "routes/history";
import CommandPalette from "components/CommandPalette";
import { closeCommandPaletteAction, toggleCommandPaletteAction } from "components/Header/HeaderAction";
import { StyledContainer, StyledMainViewContainer } from "./styles";

export default function GlobalLayout() {
    const dispatch = useDispatch();
    const paletteOpen = useSelector((state) => state.headerReducer.commandPaletteOpen);

    const handleKeyDown = useCallback(
        (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                dispatch(toggleCommandPaletteAction());
            }
        },
        [dispatch]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <StyledContainer>
            <StyledMainViewContainer>
                <ConnectedRouter history={history}>
                    <Header />
                    <Routes />
                </ConnectedRouter>
            </StyledMainViewContainer>
            <Footer />
            <CommandPalette open={paletteOpen} onClose={() => dispatch(closeCommandPaletteAction())} />
        </StyledContainer>
    );
}
