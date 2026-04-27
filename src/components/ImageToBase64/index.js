import { Check, CloudDownload, ContentCopy, Image as ImageIcon } from "@mui/icons-material";
import { Typography } from "@mui/material";
import ImageDropZone from "components/ImageDropZone";
import React, { useCallback, useState } from "react";
import localization from "localization";
import toast from "utils/toast";
import { downloadFile, getDataUrl } from "utils/helperFunctions";
import topLoader from "utils/topLoader";
import {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    CodeArea,
    DropWrap,
    EmptyState,
    ImagePreviewArea,
    MetaText,
    Panel,
    PanelHeader,
    PanelLabel,
    PreviewImg,
    TabBtn,
    TabStrip,
    ToolLayout
} from "./styles";

const TABS = [
    { key: "base64", label: "Base64" },
    { key: "html", label: "HTML" },
    { key: "css", label: "CSS" }
];

export default function ImageToBase64() {
    const {
        common: { maxImageSizeText, imageLoadError, downloadLabel },
        imageToBase64: { imagePreviewText, htmlImgLabel, cssBGSourceLabel, base64StringsLabel }
    } = localization;

    const [imageBase64, setImageBase64] = useState("");
    const [htmlImageCode, setHTMLImageCode] = useState("");
    const [cssBgImage, setCSSBGImage] = useState("");
    const [filename, setFilename] = useState("");
    const [activeTab, setActiveTab] = useState("base64");
    const [copiedTab, setCopiedTab] = useState(null);

    const handleSelectedFiles = useCallback(
        (acceptedFiles) => {
            const loaderId = Date.now();
            try {
                acceptedFiles.forEach(async (file) => {
                    if (Math.floor(file.size / 1024 / 1024) > 5) {
                        toast.error(maxImageSizeText);
                        return;
                    }
                    topLoader.show(true, loaderId);
                    const name = file.name.split(".");
                    name.pop();
                    setFilename(name.join("."));
                    const dataUrl = await getDataUrl(file);
                    setImageBase64(dataUrl);
                    setHTMLImageCode(`<img src='${dataUrl}' />`);
                    setCSSBGImage(`background-image: url(${dataUrl})`);
                    topLoader.hide(true, loaderId);
                });
            } catch (error) {
                console.log(imageLoadError, error);
                topLoader.hide(true, loaderId);
            }
        },
        [maxImageSizeText, imageLoadError]
    );

    const getActiveValue = useCallback(() => {
        if (activeTab === "html") return htmlImageCode;
        if (activeTab === "css") return cssBgImage;
        return imageBase64;
    }, [activeTab, imageBase64, htmlImageCode, cssBgImage]);

    const handleCopy = useCallback(
        (tab) => {
            let data = imageBase64;
            if (tab === "html") data = htmlImageCode;
            else if (tab === "css") data = cssBgImage;
            if (window?.navigator?.clipboard) {
                window.navigator.clipboard.writeText(data).then(() => {
                    setCopiedTab(tab);
                    setTimeout(() => setCopiedTab(null), 1500);
                });
            }
        },
        [imageBase64, htmlImageCode, cssBgImage]
    );

    const handleDownload = useCallback(
        (tab) => {
            let value = imageBase64;
            let ext = "txt";
            let mime = "text/plain";
            if (tab === "html") {
                value = htmlImageCode;
                ext = "html";
                mime = "text/html";
            } else if (tab === "css") {
                value = cssBgImage;
                ext = "css";
                mime = "text/css";
            }
            downloadFile(`data:${mime};charset=utf-8,${encodeURIComponent(value)}`, `${filename || "output"}.${ext}`);
        },
        [imageBase64, htmlImageCode, cssBgImage, filename]
    );

    const activeValue = getActiveValue();
    const getTabLabel = () => {
        if (activeTab === "html") return htmlImgLabel;
        if (activeTab === "css") return cssBGSourceLabel;
        return base64StringsLabel;
    };
    const tabLabel = getTabLabel();

    return (
        <ToolLayout>
            {/* Left — Source + Preview */}
            <Panel>
                <PanelHeader>
                    <PanelLabel>Source Image</PanelLabel>
                    {filename && <MetaText>{filename}</MetaText>}
                </PanelHeader>

                <DropWrap>
                    <ImageDropZone handleOnDrop={handleSelectedFiles} fullWidth />
                </DropWrap>

                <ImagePreviewArea>
                    {imageBase64 ? (
                        <PreviewImg src={imageBase64} alt="preview" />
                    ) : (
                        <EmptyState>
                            <ImageIcon sx={{ fontSize: 40 }} />
                            <Typography variant="body2" sx={{ fontSize: "13px" }}>
                                {imagePreviewText}
                            </Typography>
                        </EmptyState>
                    )}
                </ImagePreviewArea>
            </Panel>

            {/* Right — Output */}
            <Panel>
                <PanelHeader>
                    <PanelLabel>Output</PanelLabel>
                    {activeValue && (
                        <MetaText>
                            {(activeValue.length / 1024).toFixed(1)} KB · {activeValue.length.toLocaleString()} chars
                        </MetaText>
                    )}
                </PanelHeader>

                <TabStrip>
                    {TABS.map((tab) => (
                        <TabBtn key={tab.key} $active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
                            {tab.label}
                        </TabBtn>
                    ))}
                </TabStrip>

                <CodeArea
                    value={activeValue}
                    readOnly
                    placeholder={activeTab === "html" ? "HTML <img /> tag will appear here…" : "Base64 / CSS will appear here…"}
                />

                {activeValue && (
                    <ActionBar>
                        <MetaText sx={{ opacity: "0.6 !important" }}>{tabLabel}</MetaText>
                        <ActionBtnGroup>
                            <ActionBtn $success={copiedTab === activeTab} onClick={() => handleCopy(activeTab)}>
                                {copiedTab === activeTab ? <Check style={{ fontSize: 12 }} /> : <ContentCopy style={{ fontSize: 12 }} />}
                                {copiedTab === activeTab ? "Copied" : "Copy"}
                            </ActionBtn>
                            <ActionBtn onClick={() => handleDownload(activeTab)}>
                                <CloudDownload style={{ fontSize: 12 }} />
                                {downloadLabel}
                            </ActionBtn>
                        </ActionBtnGroup>
                    </ActionBar>
                )}
            </Panel>
        </ToolLayout>
    );
}
