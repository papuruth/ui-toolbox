import { StyledBoxCenter, StyledButton, StyledText, StyledTextField } from "components/Shared/Styled-Components";
import localization from "localization/index";
import { func, string } from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import toast from "utils/toast";
import { Box, Chip, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { ContentCopy, Download } from "@mui/icons-material";
import QRCode from "qrcode";
import { getShortURL, reserURLShortenerReducerState } from "./URLShortnerActions";

const {
    urlShortner: { urlTextPlaceholder, shortLinkLabel, shortenBtn, resetBtn },
    common: { copyToCP, copiedToCP }
} = localization;

function URLShortner({ dispatch, shortenedLink }) {
    const [url, setURL] = useState("");
    const [copyTooltip, setCopyTooltip] = useState(copyToCP);
    const [isLoading, setisLoading] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (isLoading && shortenedLink) setisLoading(!isLoading);
    }, [shortenedLink, isLoading]);

    useEffect(() => {
        if (shortenedLink) {
            QRCode.toDataURL(shortenedLink, { width: 200, margin: 2, color: { dark: "#000000", light: "#ffffff" } })
                .then((dataUrl) => setQrDataUrl(dataUrl))
                .catch(() => setQrDataUrl(null));
        } else {
            setQrDataUrl(null);
        }
    }, [shortenedLink]);

    const shortenURL = async () => {
        try {
            const urlObj = new URL(url);
            setisLoading(true);
            dispatch(getShortURL({ longUrl: urlObj.href }));
        } catch (error) {
            toast.error(error?.message);
        }
    };

    const resetState = () => {
        setURL("");
        dispatch(reserURLShortenerReducerState());
    };

    const handleCopyToClipBoard = useCallback(() => {
        if (window && window.navigator.clipboard) {
            window.navigator.clipboard.writeText(shortenedLink).then(() => {
                setCopyTooltip(copiedToCP);
                setTimeout(() => {
                    setCopyTooltip(copyToCP);
                }, 1000);
            });
        }
    }, [shortenedLink]);

    const downloadQR = () => {
        if (!qrDataUrl) return;
        const a = document.createElement("a");
        a.href = qrDataUrl;
        a.download = "short-url-qr.png";
        a.click();
    };

    return (
        <StyledBoxCenter flexDirection="column" justifyContent="center" marginTop={4} gap={3}>
            <StyledTextField
                type="text"
                id="url"
                name="url"
                onChange={(e) => setURL(e?.target?.value)}
                autoComplete="off"
                value={url}
                sx={{ width: { xs: "100%", sm: "100%", md: "90%" } }}
                placeholder={urlTextPlaceholder}
                disabled={!!shortenedLink}
            />
            {shortenedLink ? (
                <Paper
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        width: { xs: "100%", sm: "100%", md: "60%" },
                        justifyContent: "center",
                        p: 2,
                        gap: 2,
                        background: "var(--bg-card)"
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                            sx={{ m: 1, maxWidth: 300 }}
                            color="info"
                            label={
                                <>
                                    <b>{shortLinkLabel} </b>
                                    {shortenedLink}
                                </>
                            }
                        />
                        <Tooltip title={copyTooltip}>
                            <IconButton onClick={() => handleCopyToClipBoard()}>
                                <ContentCopy color="primary" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    {qrDataUrl && (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                            <img
                                ref={canvasRef}
                                src={qrDataUrl}
                                alt="QR code"
                                style={{ width: 160, height: 160, borderRadius: 8, border: "1px solid var(--border-color)" }}
                            />
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Scan to open
                                </Typography>
                                <Tooltip title="Download QR">
                                    <IconButton size="small" onClick={downloadQR}>
                                        <Download fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    )}
                </Paper>
            ) : null}
            <StyledBoxCenter justifyContent="center" sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }} gap={1}>
                <StyledText component="div">
                    <StyledButton
                        sx={{ width: 200 }}
                        variant="outlined"
                        onClick={shortenURL}
                        disabled={isLoading || !url || !!shortenedLink}
                        loading={isLoading}
                        loadingPosition="end"
                    >
                        {shortenBtn}
                    </StyledButton>
                </StyledText>
                <StyledText component="div">
                    <StyledButton sx={{ width: 200 }} variant="outlined" onClick={resetState} disabled={isLoading || !url}>
                        {resetBtn}
                    </StyledButton>
                </StyledText>
            </StyledBoxCenter>
        </StyledBoxCenter>
    );
}

URLShortner.propTypes = {
    dispatch: func.isRequired,
    shortenedLink: string.isRequired
};

const mapStateToProps = (state) => {
    const { shortenedLink } = state.urlShortenerReducer;
    return { shortenedLink };
};

export default connect(mapStateToProps)(URLShortner);
