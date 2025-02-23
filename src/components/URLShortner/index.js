import { StyledText } from "components/DecodeBase64/styles";
import { StyledBoxCenter, StyledButton, StyledTextField } from "components/Shared/Styled-Components";
import localization from "localization/index";
import { func, string } from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import toast from "utils/toast";
import { Chip, IconButton, Paper, Tooltip } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { getShortURL, reserURLShortenerReducerState } from "./URLShortnerActions";

const {
    urlShortner: { urlTextPlaceholder },
    common: { copyToCP, copiedToCP }
} = localization;

function URLShortner({ dispatch, shortenedLink }) {
    const [url, setURL] = useState("");
    const [copyTooltip, setCopyTooltip] = useState(copyToCP);
    const [isLoading, setisLoading] = useState(false);

    useEffect(() => {
        if (isLoading && shortenedLink) {
            setisLoading(!isLoading);
        }
    }, [shortenedLink, isLoading]);

    const shortenURL = async () => {
        try {
            const urlObj = new URL(url);
            const requestPayload = {
                long_url: urlObj.href
            };
            setisLoading(true);
            dispatch(getShortURL({ requestPayload }));
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
                <Paper sx={{ display: "flex", flexWrap: "wrap", width: { xs: "100%", sm: "100%", md: "50%" }, justifyContent: "center" }}>
                    <Chip
                        sx={{ m: 2, width: { xs: "100%", sm: "100%", md: "100%" }, maxWidth: 283 }}
                        color="info"
                        label={
                            <>
                                <b>Short Link: </b>
                                {shortenedLink}
                            </>
                        }
                    />
                    <Tooltip title={copyTooltip}>
                        <IconButton onClick={() => handleCopyToClipBoard()}>
                            <ContentCopy color="primary" />
                        </IconButton>
                    </Tooltip>
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
                        Shorten URL
                    </StyledButton>
                </StyledText>
                <StyledText component="div">
                    <StyledButton sx={{ width: 200 }} variant="outlined" onClick={resetState} disabled={isLoading || !url}>
                        Reset
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
    return {
        shortenedLink
    };
};

export default connect(mapStateToProps)(URLShortner);
