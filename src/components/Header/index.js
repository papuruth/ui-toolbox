import { Clear, DarkMode, GitHub, LightMode } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Divider, IconButton, Tooltip } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import gearIcon from "assets/images/gear.svg";
import { StyledBoxContainer, StyledImageRenderer } from "components/Shared/Styled-Components";
import localization from "localization";
import { func } from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import colors from "styles/colors";
import { GLOBAL_CONSTANTS } from "utils/globalConstants";
import ColorModeContext, { useColorMode } from "../../context/ColorModeContext";
import { handleSearchAction } from "./HeaderAction";
import { ClearIconWrapper, Search, SearchIconWrapper, StyledContainer, StyledInputBase } from "./styles";

function Header({ dispatch }) {
    const [searchText, setSearchText] = useState("");
    const { mode, toggleColorMode } = useColorMode(ColorModeContext);

    const handleInputChange = (event) => {
        setSearchText(event.target.value);
        dispatch(handleSearchAction(event.target.value));
    };

    const handleSearchClear = () => {
        setSearchText("");
        dispatch(handleSearchAction(""));
    };

    return (
        <StyledContainer sx={{ flexGrow: 1, minWidth: 320 }}>
            <AppBar position="fixed">
                <Toolbar sx={{ padding: { xs: "0 10px", sm: "0 16px" } }}>
                    <StyledBoxContainer sx={{ flexGrow: 1, width: { sm: "calc(50% - 24px)!important" } }}>
                        <Typography variant="h6" noWrap component="div" sx={{ display: { sm: "flex" }, alignItems: "center", lineHeight: 1 }}>
                            <Link to="/" style={{ color: colors.white }}>
                                <StyledImageRenderer src={gearIcon} alt="web-logo" />
                            </Link>
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ ml: 2 }} />
                        <Typography variant="h6" noWrap component="div" sx={{ display: { sm: "flex" }, alignItems: "center", ml: 2 }}>
                            <Link to="/" style={{ color: colors.white }}>
                                {localization.appTitle}
                            </Link>
                        </Typography>
                    </StyledBoxContainer>
                    <StyledBoxContainer sx={{ width: { sm: "calc(50% - 24px)!important" }, justifyContent: "flex-end", alignItems: "center" }}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ "aria-label": "search" }}
                                onChange={handleInputChange}
                                value={searchText}
                            />
                            {searchText ? (
                                <ClearIconWrapper>
                                    <IconButton onClick={handleSearchClear}>
                                        <Clear htmlColor={colors.white} />
                                    </IconButton>
                                </ClearIconWrapper>
                            ) : null}
                        </Search>
                        <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
                            <IconButton onClick={toggleColorMode} sx={{ ml: 1, color: colors.white }}>
                                {mode === "dark" ? <LightMode /> : <DarkMode />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View source on GitHub">
                            <IconButton
                                component="a"
                                href={GLOBAL_CONSTANTS.GIT_REPO_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ ml: 0.5, color: colors.white }}
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
