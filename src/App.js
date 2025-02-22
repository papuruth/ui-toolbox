import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import GlobalLayout from "components/GlobalLayout";
import AppUpdateUI from "components/Shared/AppUpdateUI";
import { assign } from "lodash";
import React, { useEffect } from "react";
import { useClearCache } from "react-clear-cache";
import { confirmAlert } from "react-confirm-alert";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyled from "styles/global";
import store from "./store";
import localization from "./localization";

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 120,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536
        }
    }
});

function App() {
    const { isLatestVersion, emptyCacheStorage } = useClearCache();

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
        <Provider store={store}>
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
        </Provider>
    );
}

export default App;
