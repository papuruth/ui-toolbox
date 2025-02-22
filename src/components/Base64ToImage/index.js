import { BrokenImage, CloudDownload, ContentCopy, Delete, Image as ImageIcon } from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { StyledImagePreviewContainer, StyledImageRenderer } from "components/Shared/Styled-Components";
import localization from "localization";
import React, { useCallback, useState } from "react";
import colors from "styles/colors";
import { downloadFile } from "utils/helperFunctions";
import toast from "utils/toast";

export default function Base64ToImage() {
    const {
        common: { imageLoadError, copiedToCP, copyToCP, downloadImageLabel },
        imageToBase64: { imagePreviewText },
        base64ToImage: { brokenImageLabel, enterBase64Label, base64StringLengthError }
    } = localization;
    const [imageBase64, setImageBase64] = useState("");
    const [imageError, setImageError] = useState(false);
    const [copyTooltip, setCopyTooltip] = useState(copyToCP);

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

    const loadPreviewImage = () => {
        if (imageBase64 && !imageError) {
            return <StyledImageRenderer src={imageBase64} onError={() => setImageError(true)} onLoad={() => setImageError(false)} />;
        }
        if (imageError) {
            return (
                <>
                    <BrokenImage fontSize="large" />
                    <Typography component="div">{brokenImageLabel}</Typography>
                </>
            );
        }
        return (
            <>
                <ImageIcon fontSize="large" />
                <Typography variant="h6">{imagePreviewText}</Typography>
            </>
        );
    };

    const handleCopyToClipBoard = useCallback(() => {
        if (window && window.navigator.clipboard) {
            window.navigator.clipboard.writeText(imageBase64).then(() => {
                setCopyTooltip(copiedToCP);
                setTimeout(() => {
                    setCopyTooltip(copyToCP);
                }, 1000);
            });
        }
    }, [imageBase64, copiedToCP, copyToCP]);

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", width: { xs: "100%", sm: "100%", md: "50%" }, minHeight: 64 }}>
                <Typography component="p" color={colors.primary} fontWeight={700} flexGrow={1}>
                    {enterBase64Label}
                </Typography>
                <Typography component="p" color={colors.secondary} fontWeight={400}>
                    Size: {imageBase64 ? (imageBase64.length / 1024).toFixed(2) : 0} KB, {imageBase64.length} chars
                </Typography>
                {imageBase64.length > 0 ? (
                    <Toolbar>
                        <Tooltip title="Clear">
                            <IconButton
                                onClick={() => {
                                    setImageBase64("");
                                    setImageError(false);
                                }}
                            >
                                <Delete color="error" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={copyTooltip}>
                            <IconButton onClick={handleCopyToClipBoard}>
                                <ContentCopy color="primary" />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                ) : null}
            </Box>
            <TextField
                id="image-base64"
                placeholder="Base64 String"
                multiline
                rows={10}
                sx={{ width: { xs: "100%", sm: "100%", md: "50%" }, mb: 3 }}
                value={imageBase64}
                onChange={(event) => {
                    if (event?.target?.value?.length > 2097152) {
                        toast.error(base64StringLengthError);
                        setImageBase64("");
                        setImageError(false);
                    } else {
                        setImageBase64(event.target.value);
                        setImageError(false);
                    }
                }}
            />
            <StyledImagePreviewContainer>
                <Box sx={{ border: "1px solid #000", borderRadius: 2, p: 5, width: "100%" }}>{loadPreviewImage()} </Box>
            </StyledImagePreviewContainer>
            {imageBase64.length > 0 && !imageError ? (
                <Toolbar>
                    <Button onClick={handleDownload} variant="outlined" endIcon={<CloudDownload color="primary" />}>
                        {downloadImageLabel}
                    </Button>
                </Toolbar>
            ) : null}
        </>
    );
}
