import { DarkMode, GitHub, LightMode } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Tooltip } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import DevDeckLogo from "components/DevDeckLogo";
import { StyledBoxContainer } from "components/Shared/Styled-Components";
import localization from "localization";
import { func } from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import colors from "styles/colors";
import { GLOBAL_CONSTANTS } from "utils/globalConstants";
import { isMac } from "utils/helperFunctions";
import ColorModeContext, { useColorMode } from "../../context/ColorModeContext";
import { toggleCommandPaletteAction } from "./HeaderAction";
import { PaletteTrigger, StyledContainer, TriggerKbd, TriggerKbdGroup, TriggerPlaceholder } from "./styles";

function Header({ dispatch }) {
    const { mode, toggleColorMode } = useColorMode(ColorModeContext);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <StyledContainer sx={{ flexGrow: 1, minWidth: 320 }}>
            <AppBar
                position="fixed"
                sx={{
                    transition: "box-shadow 0.25s ease, background 0.25s ease",
                    ...(scrolled && { boxShadow: mode === "dark" ? "0 4px 24px rgba(0,0,0,0.6)" : "0 4px 16px rgba(0,0,0,0.2)" })
                }}
            >
                <Toolbar
                    sx={{
                        padding: { xs: "0 10px", sm: "0 16px" },
                        minHeight: scrolled ? "52px !important" : "64px !important",
                        transition: "min-height 0.25s ease"
                    }}
                >
                    {/* Logo — full wordmark on sm+, icon-only on xs */}
                    <StyledBoxContainer sx={{ flexGrow: 1, width: { sm: "calc(50% - 24px)!important" } }}>
                        <DevDeckLogo compact={false} />
                    </StyledBoxContainer>

                    <StyledBoxContainer sx={{ width: { sm: "calc(50% - 24px)!important" }, justifyContent: "flex-end", alignItems: "center" }}>
                        <PaletteTrigger onClick={() => dispatch(toggleCommandPaletteAction())} aria-label="Open command palette" tabIndex={0}>
                            <SearchIcon sx={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", flexShrink: 0 }} />
                            <TriggerPlaceholder>{localization.commandPalette.placeholder}</TriggerPlaceholder>
                            <TriggerKbdGroup aria-hidden>
                                <TriggerKbd>{isMac ? "⌘" : "Ctrl"}</TriggerKbd>
                                <TriggerKbd>K</TriggerKbd>
                            </TriggerKbdGroup>
                        </PaletteTrigger>
                        <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
                            <IconButton
                                onClick={toggleColorMode}
                                sx={{
                                    ml: 1,
                                    color: colors.white,
                                    transition: "transform 0.15s ease, opacity 0.15s ease",
                                    "&:hover": { transform: "scale(1.1)", opacity: 0.85 }
                                }}
                            >
                                {mode === "dark" ? <LightMode /> : <DarkMode />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View source on GitHub">
                            <IconButton
                                component="a"
                                href={GLOBAL_CONSTANTS.GIT_REPO_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    ml: 0.5,
                                    color: colors.white,
                                    transition: "transform 0.15s ease, opacity 0.15s ease",
                                    "&:hover": { transform: "scale(1.1)", opacity: 0.85 }
                                }}
                                aria-label="View source on GitHub"
                            >
                                <GitHub />
                            </IconButton>
                        </Tooltip>
                    </StyledBoxContainer>
                </Toolbar>
            </AppBar>
        </StyledContainer>
    );
}

Header.propTypes = {
    dispatch: func.isRequired
};

export default connect()(Header);
