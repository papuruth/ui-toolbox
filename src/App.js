import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import GlobalLayout from "components/GlobalLayout";
import UpdateBanner from "components/Shared/UpdateBanner";
import React, { useEffect, useMemo, useState } from "react";
import { useClearCache } from "react-clear-cache";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyled from "styles/global";
import isPropValid from "@emotion/is-prop-valid";
import { StyleSheetManager } from "styled-components";
import ColorModeContext from "./context/ColorModeContext";
import { ToolChainProvider } from "./context/ToolChainContext";
import store from "./store";

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
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem("devdeck-theme");
        if (saved) return saved;
        return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
    });
    const { isLatestVersion, emptyCacheStorage } = useClearCache();

    useEffect(() => {
        localStorage.setItem("devdeck-theme", mode);
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
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                background: mode === "dark" ? "rgba(15, 23, 42, 0.85)" : "linear-gradient(90deg, #0d9a68 0%, #059669 100%)",
                                backdropFilter: mode === "dark" ? "blur(12px)" : "none",
                                WebkitBackdropFilter: mode === "dark" ? "blur(12px)" : "none",
                                boxShadow:
                                    mode === "dark" ? "0 2px 16px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)" : "0 2px 10px rgba(0,0,0,0.15)",
                                borderBottom: mode === "dark" ? "1px solid rgba(255,255,255,0.07)" : "none"
                            }
                        }
                    }
                }
            }),
        [mode]
    );

    return (
        <HelmetProvider>
            <ColorModeContext.Provider value={colorMode}>
                <Provider store={store}>
                    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
                        <CssBaseline />
                        <GlobalStyled />
                        <StyledEngineProvider injectFirst>
                            <ThemeProvider theme={theme}>
                                <ToolChainProvider>
                                    <GlobalLayout />
                                </ToolChainProvider>
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
                        {!isLatestVersion && process.env.NODE_ENV === "production" && <UpdateBanner onUpdate={() => emptyCacheStorage()} />}
                    </StyleSheetManager>
                </Provider>
            </ColorModeContext.Provider>
        </HelmetProvider>
    );
}

export default App;
