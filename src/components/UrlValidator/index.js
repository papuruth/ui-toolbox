import { IosShare, Language } from "@mui/icons-material";
import axios from "axios";
import localization from "localization";
import React, { useEffect, useMemo, useState } from "react";
import { useToolChain } from "context/ToolChainContext";
import styled from "styled-components";
import { styledMedia } from "styles/global";
import { ActionBar, ActionBtn, ActionBtnGroup, EmptyState, Panel, PanelHeader, PanelLabel } from "components/Shared/ToolKit";
import SendToButton from "components/Shared/SendToButton";
import { addParamsToURL, queriesToParamsObject } from "utils/helperFunctions";
import topLoader from "utils/topLoader";
import { useShareableURL } from "utils/hooks/useShareableURL.hooks";

const { urlValidator: L } = localization;

const URL_INFO_KEYS = ["protocol", "host", "hostname", "port", "pathname", "search", "hash", "origin", "username", "password"];

const PageWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

const SplitLayout = styled.div`
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 16px;
    align-items: start;
    ${styledMedia.lessThan("md")`
        grid-template-columns: 1fr;
    `}
`;

const UrlBar = styled.div`
    margin: 14px 16px;
    display: flex;
    align-items: center;
    background: var(--bg-input);
    border: 1.5px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.15s;
    &:focus-within {
        border-color: #22cc99;
        box-shadow: 0 0 0 3px rgba(34, 204, 153, 0.08);
    }
`;

const UrlPrefix = styled.div`
    padding: 0 6px 0 12px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

const UrlInput = styled.input`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    padding: 13px 8px;
    min-width: 0;
    &::placeholder {
        color: var(--text-secondary);
    }
`;

const UrlClearBtn = styled.button`
    padding: 0 12px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    font-size: 18px;
    line-height: 1;
    height: 100%;
    &:hover {
        color: var(--text-primary);
    }
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border-color);
    gap: 12px;
`;

const InfoKey = styled.span`
    font-size: 12px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
    min-width: 80px;
    flex-shrink: 0;
`;

const InfoValue = styled.span`
    font-size: 13px;
    font-family: "JetBrains Mono", monospace;
    color: var(--text-primary);
    flex: 1;
    word-break: break-all;
`;

const StatusBlock = styled.div`
    padding: 14px 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const CheckBtn = styled.button`
    width: 100%;
    background: rgba(34, 204, 153, 0.08);
    border: 1.5px solid rgba(34, 204, 153, 0.35);
    border-radius: 8px;
    color: #22cc99;
    font-family: "Inter", sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 11px 16px;
    cursor: pointer;
    transition: all 0.15s;
    &:hover:not(:disabled) {
        background: rgba(34, 204, 153, 0.16);
        border-color: rgba(34, 204, 153, 0.6);
    }
    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
`;

const StatusBadge = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 7px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 700;
    font-family: "JetBrains Mono", monospace;
    background: ${(p) => {
        if (p.$variant === "error") return "rgba(239,68,68,0.1)";
        if (p.$variant === "warning") return "rgba(251,191,36,0.1)";
        if (p.$variant === "success") return "rgba(34,204,153,0.1)";
        return "rgba(100,100,100,0.1)";
    }};
    color: ${(p) => {
        if (p.$variant === "error") return "#ef4444";
        if (p.$variant === "warning") return "#fbbf24";
        if (p.$variant === "success") return "#22cc99";
        return "var(--text-secondary)";
    }};
    border: 1px solid
        ${(p) => {
            if (p.$variant === "error") return "rgba(239,68,68,0.2)";
            if (p.$variant === "warning") return "rgba(251,191,36,0.2)";
            if (p.$variant === "success") return "rgba(34,204,153,0.2)";
            return "rgba(100,100,100,0.15)";
        }};
`;

const ActionItem = styled.button`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    padding: 12px 16px;
    background: none;
    border: none;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    text-align: left;
    transition: background 0.12s;
    &:hover:not(:disabled) {
        background: rgba(34, 204, 153, 0.05);
    }
    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
`;

const ActionTitle = styled.span`
    font-size: 12px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    color: var(--text-primary);
`;

const ActionDesc = styled.span`
    font-size: 12px;
    font-family: "Inter", sans-serif;
    color: var(--text-secondary);
    line-height: 1.5;
`;

export default function UrlValidator() {
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("");
    const [statusText, setStatusText] = useState("");
    const [urlHistory, setUrlHistory] = useState([]);
    const [restoreEnable, setRestoreEnable] = useState(false);
    const [statusChecking, setStatusChecking] = useState(false);
    const { initialValue, shareURL } = useShareableURL("u");
    const { consumeChain } = useToolChain();

    useEffect(() => {
        if (initialValue) setUrl(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const chained = consumeChain("/url-validator");
        if (chained) setUrl(chained);
    }, [consumeChain]);

    const { isQueryAvailable, isHashAvailable } = useMemo(() => {
        try {
            const { search, hash } = new URL(url);
            return { isQueryAvailable: !!search, isHashAvailable: !!hash };
        } catch {
            return { isQueryAvailable: false, isHashAvailable: false };
        }
    }, [url]);

    const handlePaste = async () => {
        try {
            const text = await window.navigator.clipboard.readText();
            if (text?.trim()) setUrl(text.trim());
        } catch {
            /* ignore */
        }
    };

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
                        setStatusText(err.response?.status === 404 ? "Not Found" : err.response?.statusText);
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
                    if (queryObj?.ref) delete queryObj.ref;
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

    const getStatusVariant = () => {
        if (statusChecking) return "info";
        if (status >= 500) return "error";
        if (status >= 400) return "warning";
        if (status >= 300) return "secondary";
        if (status >= 200) return "success";
        return "info";
    };

    const infoRows = useMemo(() => {
        if (!url) return null;
        try {
            const urlInfo = new URL(url);
            const rows = [];
            URL_INFO_KEYS.forEach((key) => {
                const val = urlInfo[key];
                if (val) {
                    rows.push(
                        <InfoRow key={key}>
                            <InfoKey>{key.charAt(0).toUpperCase() + key.slice(1)}</InfoKey>
                            <InfoValue>{val}</InfoValue>
                        </InfoRow>
                    );
                }
            });
            return rows.length ? rows : null;
        } catch {
            return null;
        }
    }, [url]);

    const disabledCTAs = !url;

    return (
        <PageWrap>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.urlLabel}</PanelLabel>
                    <ActionBtnGroup>
                        {url && (
                            <ActionBtn onClick={() => shareURL(url)}>
                                <IosShare style={{ fontSize: 11 }} /> {L.shareBtn}
                            </ActionBtn>
                        )}
                        <ActionBtn onClick={handlePaste}>{L.pasteBtn}</ActionBtn>
                    </ActionBtnGroup>
                </PanelHeader>
                <UrlBar>
                    <UrlPrefix>
                        <Language style={{ fontSize: 16 }} />
                    </UrlPrefix>
                    <UrlInput
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={L.inputPlaceholder}
                        spellCheck={false}
                        autoComplete="off"
                        autoFocus
                    />
                    {url && (
                        <UrlClearBtn onClick={() => setUrl("")} title="Clear">
                            ×
                        </UrlClearBtn>
                    )}
                </UrlBar>
            </Panel>

            <SplitLayout>
                <Panel>
                    <PanelHeader>
                        <PanelLabel>{L.breakdownLabel}</PanelLabel>
                    </PanelHeader>
                    {infoRows && infoRows.length > 0 ? (
                        infoRows
                    ) : (
                        <EmptyState>
                            <Language style={{ fontSize: 28, opacity: 0.25 }} />
                            <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>{L.emptyBreakdownMessage}</span>
                        </EmptyState>
                    )}
                </Panel>

                <Panel>
                    <PanelHeader>
                        <PanelLabel>{L.actionsLabel}</PanelLabel>
                    </PanelHeader>

                    <StatusBlock>
                        <CheckBtn onClick={() => handleUrl("status")} disabled={disabledCTAs || statusChecking}>
                            {statusChecking ? L.checkingLabel : L.checkStatusBtn}
                        </CheckBtn>
                        {(status || statusChecking) && (
                            <StatusBadge $variant={getStatusVariant()}>{statusChecking ? "..." : `${status} ${statusText}`}</StatusBadge>
                        )}
                    </StatusBlock>

                    <ActionItem onClick={() => handleUrl("clean-ref")} disabled={disabledCTAs || !isQueryAvailable}>
                        <ActionTitle>{L.cleanRefTitle}</ActionTitle>
                        <ActionDesc>{L.cleanRefDesc}</ActionDesc>
                    </ActionItem>

                    <ActionItem onClick={() => handleUrl("remove-all")} disabled={disabledCTAs || !isQueryAvailable}>
                        <ActionTitle>{L.removeQueriesTitle}</ActionTitle>
                        <ActionDesc>{L.removeQueriesDesc}</ActionDesc>
                    </ActionItem>

                    <ActionItem onClick={() => handleUrl("short-url")} disabled={disabledCTAs || (!isQueryAvailable && !isHashAvailable)}>
                        <ActionTitle>{L.stripToOriginTitle}</ActionTitle>
                        <ActionDesc>{L.stripToOriginDesc}</ActionDesc>
                    </ActionItem>

                    {url && !url.includes("https") && (
                        <ActionItem onClick={() => handleUrl("protocol-replace")}>
                            <ActionTitle>{L.upgradeHttpsTitle}</ActionTitle>
                            <ActionDesc>{L.upgradeHttpsDesc}</ActionDesc>
                        </ActionItem>
                    )}

                    {restoreEnable && (
                        <ActionItem onClick={() => handleUrl("restore")} disabled={disabledCTAs}>
                            <ActionTitle>{L.restoreOriginalTitle}</ActionTitle>
                            <ActionDesc>{L.restoreOriginalDesc}</ActionDesc>
                        </ActionItem>
                    )}

                    {url && (
                        <ActionBar style={{ padding: "10px 16px" }}>
                            <SendToButton value={url} targets={[{ label: "URL Shortener", route: "/url-shortener" }]} />
                        </ActionBar>
                    )}
                </Panel>
            </SplitLayout>
        </PageWrap>
    );
}
