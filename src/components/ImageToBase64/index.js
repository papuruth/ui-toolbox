import { CloudDownload, ContentCopy, Image } from "@mui/icons-material";
import { Box, IconButton, TextField, Toolbar, Tooltip } from "@mui/material";
import ImageDropZone from "components/ImageDropZone";
import React, { useCallback, useState } from "react";
import colors from "styles/colors";
import toast from "utils/toast";
import { StyledBoxCenter, StyledBoxContainer, StyledImagePreviewContainer, StyledImageRenderer } from "components/Shared/Styled-Components";
import { downloadFile, getDataUrl } from "utils/helperFunctions";
import topLoader from "utils/topLoader";
import localization from "localization";
import { StyledContainer, StyledText } from "./styles";

export default function ImageToBase64() {
    const {
        common: { maxImageSizeText, imageLoadError, copiedToCP, copyToCP, downloadLabel },
        imageToBase64: { imagePreviewText, htmlImgLabel, cssBGSourceLabel, base64StringsLabel }
    } = localization;
    const [imageBase64, setImageBase64] = useState("");
    const [htmlImageCode, setHTMLImageCode] = useState("");
    const [cssBgImage, setCSSBGImage] = useState("");
    const [copyTooltip, setCopyTooltip] = useState(copyToCP);
    const [filename, setFilename] = useState("");

    const handleSelectedFiles = useCallback(
        (acceptedFiles) => {
            const loaderId = Date.now();
            try {
                acceptedFiles.forEach(async (file) => {
                    if (Math.floor(file.size / 1024 / 1024) > 2) {
                        toast.error(maxImageSizeText);
                        return;
                    }
                    topLoader.show(true, loaderId);
                    let truncateName = file.name.split(".");
                    truncateName.pop();
                    truncateName = truncateName.join(".");
                    setFilename(truncateName);
                    const imageDataUrl = await getDataUrl(file);
                    setImageBase64(imageDataUrl);
                    const htmlIMG = `<img src='${imageDataUrl}' />`;
                    setHTMLImageCode(htmlIMG);
                    const cssBGCode = `background-image: url(${imageDataUrl})`;
                    setCSSBGImage(cssBGCode);
                    topLoader.hide(true, loaderId);
                });
            } catch (error) {
                console.log(imageLoadError, error);
                topLoader.hide(true, loaderId);
            }
        },
        [maxImageSizeText, imageLoadError]
    );

    const handleDownload = useCallback(
        (type) => {
            let downloadUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(imageBase64)}`;
            let downloadFilename = `${filename}.txt`;
            if (type === "html") {
                downloadUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlImageCode)}`;
                downloadFilename = `${filename}.html`;
            } else if (type === "css") {
                downloadUrl = `data:text/css;charset=utf-8,${encodeURIComponent(cssBgImage)}`;
                downloadFilename = `${filename}.css`;
            }
            downloadFile(downloadUrl, downloadFilename);
        },
        [filename, htmlImageCode, imageBase64, cssBgImage]
    );

    const handleCopyToClipBoard = useCallback(
        (type) => {
            let data = imageBase64;
            if (type === "html") {
                data = htmlImageCode;
            } else if (type === "css") {
                data = cssBgImage;
            }
            if (window && window.navigator.clipboard) {
                window.navigator.clipboard.writeText(data).then(() => {
                    setCopyTooltip(copiedToCP);
                    setTimeout(() => {
                        setCopyTooltip(copyToCP);
                    }, 1000);
                });
            }
        },
        [imageBase64, htmlImageCode, cssBgImage, copiedToCP, copyToCP]
    );

    return (
        <>
            <ImageDropZone handleOnDrop={handleSelectedFiles} />
            <StyledContainer>
                <StyledImagePreviewContainer borderRight borderBottom isPadding>
                    {imageBase64 ? (
                        <StyledImageRenderer src={imageBase64} alt="image-preview" />
                    ) : (
                        <StyledBoxCenter justifyContent="center" flexDirection="column">
                            <Image fontSize="large" />
                            <StyledText variant="h6">{imagePreviewText}</StyledText>
                        </StyledBoxCenter>
                    )}
                </StyledImagePreviewContainer>
                <StyledBoxContainer width="50%" padding="20px" display="block !important">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <StyledText component="p" color={colors.primary} fontWeight={700} flexGrow={1}>
                            {base64StringsLabel}
                        </StyledText>
                        <StyledText component="p" color={colors.secondary} fontWeight={400}>
                            Size: {imageBase64 ? (imageBase64.length / 1024).toFixed(2) : 0} KB, {imageBase64.length} chars
                        </StyledText>
                        {imageBase64.length > 0 ? (
                            <Toolbar>
                                <Tooltip title={downloadLabel}>
                                    <IconButton onClick={() => handleDownload("base64")}>
                                        <CloudDownload color="primary" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={copyTooltip}>
                                    <IconButton onClick={() => handleCopyToClipBoard("base64")}>
                                        <ContentCopy color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </Toolbar>
                        ) : null}
                    </Box>
                    <TextField
                        id="image-base64"
                        placeholder={base64StringsLabel}
                        multiline
                        rows={7}
                        sx={{ width: "100%", mb: 3 }}
                        value={imageBase64}
                        inputProps={{ readOnly: true }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <StyledText component="h5" color={colors.primary} fontWeight={700} flexGrow={1}>
                            {htmlImgLabel}
                        </StyledText>
                        <StyledText component="p" color={colors.secondary} fontWeight={400}>
                            Size: {imageBase64 ? (imageBase64.length / 1024).toFixed(2) : 0} KB, {htmlImageCode.length} chars
                        </StyledText>
                        {imageBase64.length > 0 ? (
                            <Toolbar>
                                <Tooltip title={downloadLabel}>
                                    <IconButton onClick={() => handleDownload("html")}>
                                        <CloudDownload color="primary" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={copyTooltip}>
                                    <IconButton onClick={() => handleCopyToClipBoard("html")}>
                                        <ContentCopy color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </Toolbar>
                        ) : null}
                    </Box>
                    <TextField
                        id="html-img"
                        placeholder={htmlImgLabel}
                        multiline
                        rows={7}
                        sx={{ width: "100%", mb: 3 }}
                        value={htmlImageCode}
                        inputProps={{ readOnly: true }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <StyledText component="h5" color={colors.primary} fontWeight={700} flexGrow={1}>
                            {cssBGSourceLabel}
                        </StyledText>
                        <StyledText component="p" color={colors.secondary} fontWeight={400}>
                            Size: {imageBase64 ? (imageBase64.length / 1024).toFixed(2) : 0} KB, {cssBgImage.length} chars
                        </StyledText>
                        {imageBase64.length > 0 ? (
                            <Toolbar>
                                <Tooltip title={downloadLabel}>
                                    <IconButton onClick={() => handleDownload("css")}>
                                        <CloudDownload color="primary" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={copyTooltip}>
                                    <IconButton onClick={() => handleCopyToClipBoard("css")}>
                                        <ContentCopy color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </Toolbar>
                        ) : null}
                    </Box>
                    <TextField
                        id="image-css"
                        placeholder={cssBGSourceLabel}
                        multiline
                        rows={7}
                        sx={{ width: "100%" }}
                        value={cssBgImage}
                        inputProps={{ readOnly: true }}
                    />
                </StyledBoxContainer>
            </StyledContainer>
        </>
    );
}
