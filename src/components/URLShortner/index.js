import { Check, ContentCopy, Download, OpenInNew, Link as LinkIcon } from "@mui/icons-material";
import localization from "localization";
import QRCode from "qrcode";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { ActionBtn, EmptyState, Panel, PanelHeader, PanelLabel } from "components/Shared/ToolKit";
import ToolSkeleton from "components/Shared/ToolSkeleton";
import toast from "utils/toast";
import shortIOClient from "utils/shortIOLinkClient";
import { useToolChain } from "context/ToolChainContext";

const { urlShortner: L } = localization;

const PageWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

const ResultLayout = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 16px;
    align-items: start;
    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
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
    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
`;

const UrlClearBtn = styled.button`
    padding: 0 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    font-size: 18px;
    line-height: 1;
    flex-shrink: 0;
    &:hover {
        color: var(--text-primary);
    }
`;

const ShortenBtn = styled.button`
    flex-shrink: 0;
    margin: 6px 6px 6px 2px;
    background: rgba(34, 204, 153, 0.1);
    border: 1.5px solid rgba(34, 204, 153, 0.4);
    border-radius: 6px;
    color: #22cc99;
    font-family: "Inter", sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 7px 14px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
    &:hover:not(:disabled) {
        background: rgba(34, 204, 153, 0.18);
        border-color: rgba(34, 204, 153, 0.65);
    }
    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
`;

const ResultUrlBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 28px 20px 20px;
    border-bottom: 1px solid var(--border-color);
    text-align: center;
`;

const ResultUrl = styled.a`
    font-size: 17px;
    font-family: "JetBrains Mono", monospace;
    color: #22cc99;
    word-break: break-all;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const ResultActions = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
`;

const iconBtnStyles = `
    background: none;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    font-size: 11px;
    font-family: "Inter", sans-serif;
    font-weight: 500;
    transition: all 0.12s;
    &:hover {
        color: var(--text-primary);
        border-color: rgba(34, 204, 153, 0.4);
        background: rgba(34, 204, 153, 0.06);
    }
`;

const IconBtn = styled.button`
    ${iconBtnStyles}
`;

const IconLink = styled.a`
    ${iconBtnStyles}
    text-decoration: none;
`;

const ResetRow = styled.div`
    display: flex;
    justify-content: center;
    padding: 14px 16px;
`;

const QrWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 20px 16px;
`;

const QrLabel = styled.span`
    font-size: 10px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
`;

function URLShortner() {
    const [url, setURL] = useState("");
    const [copied, setCopied] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState(null);
    const [shortenedLink, setShortenedLink] = useState("");
    const { consumeChain } = useToolChain();

    useEffect(() => {
        const chained = consumeChain("/url-shortener");
        if (chained) setURL(chained);
    }, [consumeChain]);

    useEffect(() => {
        if (isLoading && shortenedLink) setisLoading(false);
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

    const handlePaste = async () => {
        try {
            const text = await window.navigator.clipboard.readText();
            if (text?.trim()) setURL(text.trim());
        } catch {
            /* ignore */
        }
    };

    const shortenURL = async () => {
        try {
            const urlObj = new URL(url);
            setisLoading(true);
            const res = await shortIOClient.createLink({
                originalURL: urlObj.href,
                domain: process.env.REACT_APP_SHORT_URL_DOMAIN
            });
            setShortenedLink(res.shortURL);
        } catch (error) {
            toast.error(error?.message);
        }
    };

    const resetState = () => {
        setURL("");
        setShortenedLink("");
        setQrDataUrl(null);
    };

    const handleCopyToClipBoard = useCallback(() => {
        if (!window?.navigator?.clipboard) return;
        window.navigator.clipboard.writeText(shortenedLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }, [shortenedLink]);

    const downloadQR = () => {
        if (!qrDataUrl) return;
        const a = document.createElement("a");
        a.href = qrDataUrl;
        a.download = "short-url-qr.png";
        a.click();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && url && !shortenedLink && !isLoading) shortenURL();
    };

    return (
        <PageWrap>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.longUrlLabel}</PanelLabel>
                    {!shortenedLink && <ActionBtn onClick={handlePaste}>{L.pasteBtn}</ActionBtn>}
                </PanelHeader>
                <UrlBar>
                    <UrlPrefix>
                        <LinkIcon style={{ fontSize: 16 }} />
                    </UrlPrefix>
                    <UrlInput
                        type="text"
                        value={url}
                        onChange={(e) => setURL(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="https://very-long-url.com/path?with=params"
                        autoComplete="off"
                        disabled={!!shortenedLink}
                        spellCheck={false}
                        autoFocus
                    />
                    {url && !shortenedLink && (
                        <UrlClearBtn onClick={() => setURL("")} title="Clear">
                            ×
                        </UrlClearBtn>
                    )}
                    <ShortenBtn onClick={shortenURL} disabled={isLoading || !url || !!shortenedLink}>
                        {isLoading ? L.shorteningLabel : L.shortenBtn}
                    </ShortenBtn>
                </UrlBar>
            </Panel>

            {shortenedLink ? (
                <ResultLayout>
                    <Panel>
                        <PanelHeader>
                            <PanelLabel>{L.shortUrlLabel}</PanelLabel>
                        </PanelHeader>
                        <ResultUrlBlock>
                            <ResultUrl href={shortenedLink} target="_blank" rel="noopener noreferrer">
                                {shortenedLink}
                            </ResultUrl>
                            <ResultActions>
                                <IconBtn onClick={handleCopyToClipBoard}>
                                    {copied ? (
                                        <>
                                            <Check style={{ fontSize: 12 }} /> {L.copiedLabel}
                                        </>
                                    ) : (
                                        <>
                                            <ContentCopy style={{ fontSize: 12 }} /> {L.copyBtn}
                                        </>
                                    )}
                                </IconBtn>
                                <IconLink href={shortenedLink} target="_blank" rel="noopener noreferrer">
                                    <OpenInNew style={{ fontSize: 12 }} /> {L.openBtn}
                                </IconLink>
                            </ResultActions>
                        </ResultUrlBlock>
                        <ResetRow>
                            <ActionBtn onClick={resetState}>{L.shortenAnotherBtn}</ActionBtn>
                        </ResetRow>
                    </Panel>

                    {qrDataUrl && (
                        <Panel>
                            <PanelHeader>
                                <PanelLabel>{L.qrCodeLabel}</PanelLabel>
                            </PanelHeader>
                            <QrWrap>
                                <img
                                    src={qrDataUrl}
                                    alt="QR code"
                                    style={{ width: 148, height: 148, borderRadius: 8, border: "1px solid var(--border-color)" }}
                                />
                                <QrLabel>{L.scanToOpenLabel}</QrLabel>
                                <ActionBtn onClick={downloadQR}>
                                    <Download style={{ fontSize: 11, marginRight: 4 }} />
                                    {L.downloadBtn}
                                </ActionBtn>
                            </QrWrap>
                        </Panel>
                    )}
                </ResultLayout>
            ) : (
                <Panel>
                    {isLoading ? (
                        <ToolSkeleton rows={3} />
                    ) : (
                        <EmptyState style={{ padding: "40px 20px" }}>
                            <LinkIcon style={{ fontSize: 28, opacity: 0.2 }} />
                            <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif" }}>{L.emptyStateMessage}</span>
                        </EmptyState>
                    )}
                </Panel>
            )}
        </PageWrap>
    );
}

export default URLShortner;
