import { BrokenImage, Check, CloudDownload, ContentCopy, DeleteOutline, Image as ImageIcon } from "@mui/icons-material";
import { Typography } from "@mui/material";
import localization from "localization";
import React, { useCallback, useState } from "react";
import { downloadFile } from "utils/helperFunctions";
import toast from "utils/toast";
import {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    EmptyState,
    ErrorState,
    InputArea,
    MetaText,
    Panel,
    PanelHeader,
    PanelLabel,
    PreviewArea,
    PreviewImg,
    ToolLayout
} from "./styles";

export default function Base64ToImage() {
    const {
        common: { imageLoadError, downloadImageLabel },
        imageToBase64: { imagePreviewText },
        base64ToImage: { brokenImageLabel, enterBase64Label, base64StringLengthError }
    } = localization;

    const [imageBase64, setImageBase64] = useState("");
    const [imageError, setImageError] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleChange = useCallback(
        (e) => {
            const val = e?.target?.value || "";
            if (val.length > 2097152) {
                toast.error(base64StringLengthError);
                setImageBase64("");
                setImageError(false);
            } else {
                setImageBase64(val);
                setImageError(false);
            }
        },
        [base64StringLengthError]
    );

    const handleClear = useCallback(() => {
        setImageBase64("");
        setImageError(false);
    }, []);

    const handleCopy = useCallback(() => {
        if (window?.navigator?.clipboard) {
            window.navigator.clipboard.writeText(imageBase64).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            });
        }
    }, [imageBase64]);

    const handleDownload = useCallback(async () => {
        try {
            const downloadUrl = `${imageBase64.split(",")[0]},${encodeURIComponent(imageBase64.split(",")[1])}`;
            const downloadFilename = `untitled.${imageBase64.split(";")[0].split("/")[1]}`;
            const image = new Image();
            image.src = downloadUrl;
            image.crossOrigin = "anonymous";
            await image.decode();
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(image, 0, 0, image.width, image.height);
            canvas.toBlob((blob) => {
                downloadFile(URL.createObjectURL(blob), downloadFilename);
            });
        } catch (error) {
            console.log(imageLoadError, error.message);
        }
    }, [imageBase64, imageLoadError]);

    const sizeKB = imageBase64 ? (imageBase64.length / 1024).toFixed(1) : "0";

    const renderPreview = () => {
        if (imageBase64 && !imageError) {
            return <PreviewImg src={imageBase64} alt="preview" onError={() => setImageError(true)} onLoad={() => setImageError(false)} />;
        }
        if (imageError) {
            return (
                <ErrorState>
                    <BrokenImage sx={{ fontSize: 40 }} />
                    <Typography variant="body2" sx={{ fontSize: "13px" }}>
                        {brokenImageLabel}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: "11px", opacity: 0.7 }}>
                        Check that the Base64 string is valid
                    </Typography>
                </ErrorState>
            );
        }
        return (
            <EmptyState>
                <ImageIcon sx={{ fontSize: 40 }} />
                <Typography variant="body2" sx={{ fontSize: "13px" }}>
                    {imagePreviewText}
                </Typography>
            </EmptyState>
        );
    };

    return (
        <ToolLayout>
            {/* Left — Input */}
            <Panel>
                <PanelHeader>
                    <PanelLabel>{enterBase64Label}</PanelLabel>
                    {imageBase64 && (
                        <MetaText>
                            {sizeKB} KB · {imageBase64.length.toLocaleString()} chars
                        </MetaText>
                    )}
                </PanelHeader>

                <InputArea
                    value={imageBase64}
                    onChange={handleChange}
                    placeholder="Paste your Base64 string here…&#10;&#10;Example: data:image/png;base64,iVBOR..."
                    spellCheck={false}
                />

                {imageBase64 && (
                    <ActionBar>
                        <MetaText sx={{ opacity: "0.5 !important" }}>Base64 Input</MetaText>
                        <ActionBtnGroup>
                            <ActionBtn $success={copied} onClick={handleCopy}>
                                {copied ? <Check style={{ fontSize: 12 }} /> : <ContentCopy style={{ fontSize: 12 }} />}
                                {copied ? "Copied" : "Copy"}
                            </ActionBtn>
                            <ActionBtn $danger onClick={handleClear}>
                                <DeleteOutline style={{ fontSize: 12 }} />
                                Clear
                            </ActionBtn>
                        </ActionBtnGroup>
                    </ActionBar>
                )}
            </Panel>

            {/* Right — Preview */}
            <Panel>
                <PanelHeader>
                    <PanelLabel>Preview</PanelLabel>
                    {imageBase64 && !imageError && <MetaText>{imageBase64.split(";")[0]?.split(":")[1] || "image"}</MetaText>}
                </PanelHeader>

                <PreviewArea>{renderPreview()}</PreviewArea>

                {imageBase64 && !imageError && (
                    <ActionBar>
                        <MetaText sx={{ opacity: "0.5 !important" }}>Decoded Image</MetaText>
                        <ActionBtn onClick={handleDownload}>
                            <CloudDownload style={{ fontSize: 12 }} />
                            {downloadImageLabel}
                        </ActionBtn>
                    </ActionBar>
                )}
            </Panel>
        </ToolLayout>
    );
}
