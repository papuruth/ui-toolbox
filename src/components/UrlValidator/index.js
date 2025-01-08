import { Check, Warning } from "@mui/icons-material";
import { Chip, CircularProgress, Paper, Tooltip } from "@mui/material";
import axios from "axios";
import { StyledBoxCenter, StyledBoxContainer, StyledButton, StyledText, StyledTextField } from "components/Shared/Styled-Components";
import localization from "localization";
import { capitalize, forEach } from "lodash";
import React, { useEffect, useState } from "react";
import { addParamsToURL, queriesToParamsObject } from "utils/helperFunctions";
import topLoader from "utils/topLoader";

export default function UrlValidator() {
    const [url, setUrl] = useState(`${window.location.origin}?ref=referrer&foo=bar#tag`);
    const [status, setStatus] = useState("");
    const [statusText, setStatusText] = useState("");
    const [urlHistory, setUrlHistory] = useState([]);
    const [isQueryAvailable, setIsQueryAvailable] = useState(false);
    const [restoreEnable, setRestoreEnable] = useState(false);
    const [isHashAvailable, setIsHashAvailable] = useState(false);
    const [statusChecking, setStatusChecking] = useState(false);

    useEffect(() => {
        if (url) {
            const urlInfo = new URL(url);
            const { search, hash } = urlInfo || {};
            if (search) {
                setIsQueryAvailable(true);
            } else {
                setIsQueryAvailable(false);
            }
            if (hash) {
                setIsHashAvailable(true);
            } else {
                setIsHashAvailable(false);
            }
        }
    }, [url]);

    const handleUrl = (type) => {
        switch (type) {
            case "status":
                topLoader.show(true, type);
                setStatusChecking(true);
                axios
                    .get(url)
                    .then((res) => {
                        setStatus(res?.status);
                        setStatusText(res?.statusText || "OK");
                        topLoader.hide(true, type);
                        setStatusChecking(false);
                    })
                    .catch((err) => {
                        setStatus(err.response?.status);
                        setStatusText(err.response?.statusText);
                        if (err.response?.status === 404) {
                            setStatusText("Not Found");
                        }
                        topLoader.hide(true, type);
                        setStatusChecking(false);
                    });
                break;
            case "remove-all":
                {
                    setUrlHistory((prevState) => [...new Set([...prevState, url])]);
                    const urlInfo = new URL(url);
                    setUrl(`${urlInfo.origin}${urlInfo.pathname}${urlInfo?.hash}`);
                    setRestoreEnable(true);
                }
                break;
            case "clean-ref":
                {
                    setUrlHistory((prevState) => [...new Set([...prevState, url])]);
                    const urlInfo = new URL(url);
                    let mergedUrl = `${urlInfo.origin}${urlInfo.pathname}`;
                    const queryObj = queriesToParamsObject(urlInfo.search);
                    if (queryObj?.ref) {
                        delete queryObj.ref;
                    }
                    mergedUrl = addParamsToURL(mergedUrl, queryObj);
                    mergedUrl += urlInfo?.hash ?? "";
                    setUrl(mergedUrl);
                    setRestoreEnable(true);
                }
                break;
            case "restore":
                setUrl(urlHistory[0]);
                setRestoreEnable(false);
                break;
            case "protocol-replace":
                setUrl(url.replace("http", "https"));
                break;
            case "short-url":
                {
                    setUrlHistory((prevState) => [...new Set([...prevState, url])]);
                    const urlInfo = new URL(url);
                    setUrl(`${urlInfo.origin}${urlInfo.pathname}`);
                    setRestoreEnable(true);
                }
                break;
            default:
                break;
        }
    };

    const getStatusColor = () => {
        if (statusChecking) {
            return "info";
        }
        if (status >= 500) {
            return "error";
        }
        if (status >= 400) {
            return "warning";
        }
        if (status >= 300) {
            return "secondary";
        }
        if (status >= 200) {
            return "success";
        }
        return "info";
    };

    const getURLInfo = () => {
        if (!url) return null;
        const urlInfo = new URL(url);
        const { hash, host, hostname, href, origin, password, pathname, port, protocol, search, username } = urlInfo || {};
        const data = { hash, host, hostname, href, origin, password, pathname, port, protocol, search, username };
        const urlInfoJSX = [];
        forEach(data, (val, key) => {
            urlInfoJSX.push(
                val ? (
                    <Chip
                        key={key}
                        sx={{ m: 2 }}
                        color="info"
                        label={
                            <StyledText>
                                <b>{capitalize(key)}: </b>
                                {val}
                            </StyledText>
                        }
                    />
                ) : null
            );
        });
        return urlInfoJSX;
    };
    const {
        urlValidator: { urlTextPlaceholder }
    } = localization;

    const disabledCTAs = !url;

    return (
        <StyledBoxCenter flexDirection="column" justifyContent="center" marginTop={4}>
            <StyledTextField
                type="text"
                id="url"
                name="url"
                onChange={(e) => setUrl(e?.target?.value)}
                autoComplete="off"
                value={url}
                fullWidth
                placeholder={urlTextPlaceholder}
            />
            {url ? <Paper sx={{ mt: 2 }}>{getURLInfo()}</Paper> : null}
            <StyledBoxContainer marginTop={4} justifyContent="center">
                <StyledText component="div" marginRight={2}>
                    <StyledButton variant="outlined" onClick={() => handleUrl("status")} disabled={disabledCTAs}>
                        Check Status
                    </StyledButton>
                    {status || statusChecking ? (
                        <Chip
                            icon={statusChecking ? <CircularProgress size={20} /> : <Check />}
                            label={statusChecking ? "Checking..." : `${status} ${statusText}`}
                            variant="outlined"
                            color={getStatusColor()}
                            size="medium"
                            sx={{ ml: 2 }}
                        />
                    ) : null}
                </StyledText>
                <StyledText component="div" marginRight={2}>
                    <StyledButton variant="outlined" onClick={() => handleUrl("clean-ref")} disabled={disabledCTAs || !isQueryAvailable}>
                        URL Cleaner
                    </StyledButton>
                </StyledText>
                <StyledText component="div" marginRight={2}>
                    <StyledButton variant="outlined" onClick={() => handleUrl("remove-all")} disabled={disabledCTAs || !isQueryAvailable}>
                        Queries Remover
                    </StyledButton>
                </StyledText>
                <StyledText component="div" marginRight={2}>
                    <StyledButton
                        variant="outlined"
                        onClick={() => handleUrl("short-url")}
                        disabled={disabledCTAs || (!isQueryAvailable && !isHashAvailable)}
                    >
                        Unshort URL
                    </StyledButton>
                </StyledText>
                {url && url?.indexOf("https") === -1 ? (
                    <StyledText component="div" marginRight={2}>
                        <Tooltip title="http link, consider using https">
                            <StyledButton variant="outlined" onClick={() => handleUrl("protocol-replace")} endIcon={<Warning color="warning" />}>
                                Replace Protocol
                            </StyledButton>
                        </Tooltip>
                    </StyledText>
                ) : null}
                {restoreEnable ? (
                    <StyledText component="div" marginRight={2}>
                        <StyledButton variant="outlined" onClick={() => handleUrl("restore")} disabled={disabledCTAs}>
                            Restore Original URL
                        </StyledButton>
                    </StyledText>
                ) : null}
            </StyledBoxContainer>
        </StyledBoxCenter>
    );
}
