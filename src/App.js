import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import GlobalLayout from "components/GlobalLayout";
import AppUpdateUI from "components/Shared/AppUpdateUI";
import { assign } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useClearCache } from "react-clear-cache";
import { confirmAlert } from "react-confirm-alert";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyled from "styles/global";
import isPropValid from "@emotion/is-prop-valid";
import { StyleSheetManager } from "styled-components";
import ColorModeContext from "./context/ColorModeContext";
import store from "./store";
import localization from "./localization";

// This implements the default behavior from styled-components v5
function shouldForwardProp(propName, target) {
    if (typeof target === "string") {
        // For HTML elements, forward the prop if it is a valid HTML attribute
        return isPropValid(propName);
    }
    // For other elements, forward all props
    return true;
}

function App() {
    const [mode, setMode] = useState(() => localStorage.getItem("ui-toolbox-theme") || "light");
    const { isLatestVersion, emptyCacheStorage } = useClearCache();

    useEffect(() => {
        localStorage.setItem("ui-toolbox-theme", mode);
        document.documentElement.setAttribute("data-theme", mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            mode,
            toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light"))
        }),
        [mode]
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: { main: "#22cc99" },
                    secondary: { main: "#1f1e29" }
                },
                breakpoints: {
                    values: {
                        xs: 120,
                        sm: 600,
                        md: 900,
                        lg: 1200,
                        xl: 1536
                    }
                },
                components: {
                    MuiIconButton: {
                        styleOverrides: {
                            root: {
                                minWidth: 44,
                                minHeight: 44,
                                touchAction: "manipulation"
                            }
                        }
                    },
                    MuiButtonBase: {
                        styleOverrides: {
                            root: {
                                touchAction: "manipulation"
                            }
                        }
                    }
                }
            }),
        [mode]
    );

    useEffect(() => {
        const updateVersion = () => {
            const { appTitle, newVersionMessage, appUpdateCTALabel } = localization;
            const alertProps = {
                title: appTitle,
                description: newVersionMessage,
                yesLabel: appUpdateCTALabel,
                onClickYes: (e) => {
                    e?.preventDefault();
                    emptyCacheStorage();
                },
                showCancel: false
            };
            confirmAlert({
                customUI: ({ onClose }) => AppUpdateUI(assign(alertProps, { onClose })),
                closeOnClickOutside: false,
                closeOnEscape: false
            });
        };

        if (!isLatestVersion) {
            setTimeout(() => {
                if (process.env.NODE_ENV === "production") {
                    updateVersion();
                }
            }, 1000);
        }
    }, [isLatestVersion, emptyCacheStorage]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <Provider store={store}>
                <StyleSheetManager shouldForwardProp={shouldForwardProp}>
                    <CssBaseline />
                    <GlobalStyled />

                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={theme}>
                            <GlobalLayout />
                        </ThemeProvider>
                    </StyledEngineProvider>
                    <ToastContainer
                        position="top-center"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable={false}
                        pauseOnHover
                        theme="colored"
                        closeButton={false}
                    />
                </StyleSheetManager>
            </Provider>
        </ColorModeContext.Provider>
    );
}

export default App;
