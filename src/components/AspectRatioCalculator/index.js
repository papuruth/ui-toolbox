import { ContentCopy, Delete, Settings } from "@mui/icons-material";
import { Button, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import ImageDropZone from "components/ImageDropZone";
import { StyledBoxCenter, StyledDivider } from "components/Shared/Styled-Components";
import React, { useCallback, useState } from "react";
import { getDataUrl, getImageAspectRatio } from "utils/helperFunctions";
import toast from "utils/toast";
import topLoader from "utils/topLoader";
import { StyledContainer } from "./styles";

export default function AspectRatioCalculator() {
    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);
    const [aspectRatio, setAspectRatio] = useState(null);
    const [copyTooltip, setCopyTooltip] = useState("Copy to clipboard");

    const handleSelectedFiles = useCallback((acceptedFiles) => {
        const loaderId = Date.now();
        try {
            acceptedFiles.forEach(async (file) => {
                if (Math.floor(file.size / 1024 / 1024) > 4) {
                    toast.error("Maximum image size allowed is 4MB");
                    return;
                }
                topLoader.show(true, loaderId);
                const result = await getDataUrl(file);
                if (result) {
                    const imageMeta = await getImageMeta(result);
                    if (imageMeta) {
                        const [ratioInWidth, ratioInHeight] = getImageAspectRatio(imageMeta.width, imageMeta.height);
                        setAspectRatio(`${ratioInWidth}:${ratioInHeight}`);
                        setImageWidth(imageMeta.width);
                        setImageHeight(imageMeta.height);
                    }
                }
                topLoader.hide(true, loaderId);
            });
        } catch (error) {
            console.log("Image Load Error", error);
            topLoader.hide(true, loaderId);
        }
    }, []);

    const getImageMeta = async (dataUrl) => {
        try {
            const image = new Image();
            image.src = dataUrl;
            await image.decode();
            const { width, height } = image;
            return { width, height };
        } catch (error) {
            toast.error("Error decoding image.");
            return null;
        }
    };

    const handleCopyToClipBoard = useCallback(() => {
        if (window && window.navigator.clipboard) {
            window.navigator.clipboard.writeText(aspectRatio).then(() => {
                setCopyTooltip("Copied!");
                setTimeout(() => {
                    setCopyTooltip("Copy to clipboard");
                }, 1000);
            });
        }
    }, [aspectRatio]);

    const calculateRatio = useCallback(() => {
        if (imageWidth && imageHeight) {
            const [ratioInWidth, ratioInHeight] = getImageAspectRatio(imageWidth, imageHeight);
            setAspectRatio(`${ratioInWidth}:${ratioInHeight}`);
        }
    }, [imageWidth, imageHeight]);

    return (
        <StyledContainer>
            <StyledBoxCenter flexDirection="column" justifyContent="center">
                <ImageDropZone handleOnDrop={handleSelectedFiles} maxImageSize={4} />
            </StyledBoxCenter>
            <StyledBoxCenter flexDirection="column" justifyContent="center" marginTop={4}>
                <StyledDivider variant="middle" width={300}>
                    or
                </StyledDivider>
            </StyledBoxCenter>
            <StyledBoxCenter flexDirection="column" justifyContent="center" marginTop={4}>
                <Typography variant="h6" fontWeight={500}>
                    Image Dimensions in PX
                </Typography>
                <StyledBoxCenter
                    justifyContent="center"
                    marginTop={2}
                    sx={{
                        "& .MuiTextField-root": { m: 1, width: "15ch" }
                    }}
                >
                    <TextField
                        label="Image Width"
                        type="number"
                        id="image-width"
                        value={imageWidth}
                        onChange={(e) => setImageWidth(Number(e.currentTarget.value))}
                        variant="outlined"
                    />
                    <TextField
                        label="Image Height"
                        type="number"
                        id="image-width"
                        value={imageHeight}
                        onChange={(e) => setImageHeight(Number(e.currentTarget.value))}
                        variant="outlined"
                    />
                    <Button variant="outlined" endIcon={<Settings />} onClick={calculateRatio} disabled={!imageWidth || !imageHeight}>
                        Calculate
                    </Button>
                </StyledBoxCenter>
            </StyledBoxCenter>
            {aspectRatio ? (
                <StyledBoxCenter justifyContent="center" marginTop={4}>
                    <Typography variant="h6" fontWeight={500}>
                        Image Aspect Ratio:
                    </Typography>
                    <Typography variant="h6" fontWeight={500} marginLeft={2} color="blueviolet">
                        {aspectRatio}
                    </Typography>
                    <Tooltip title={copyTooltip}>
                        <IconButton sx={{ ml: 2 }} onClick={handleCopyToClipBoard}>
                            <ContentCopy color="primary" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Reset">
                        <IconButton
                            onClick={() => {
                                setImageWidth(0);
                                setImageHeight(0);
                                setAspectRatio(null);
                            }}
                        >
                            <Delete color="error" />
                        </IconButton>
                    </Tooltip>
                </StyledBoxCenter>
            ) : null}
        </StyledContainer>
    );
}
