import { CloudDownload } from "@mui/icons-material";
import { Button, Slider, Typography } from "@mui/material";
import ImageDropZone from "components/ImageDropZone";
import { StyledBoxCenter, StyledImageRenderer } from "components/Shared/Styled-Components";
import StyledSwitch from "components/Shared/StyledSwitch";
import React, { useCallback, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { downloadFile, getDataUrl } from "utils/helperFunctions";
import { useDebounceEffect } from "utils/hooks/useDebounceEffects.hooks";
import toast from "utils/toast";
import topLoader from "utils/topLoader";
import { canvasPreview } from "./canvasPreview";
import { StyledContainer } from "./styles";

export default function ImageResizer() {
    const [imgSrc, setImgSrc] = useState("");
    const previewCanvasRef = useRef(null);
    const imgRef = useRef(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [aspect, setAspect] = useState(16 / 9);
    const [fileName, setFilename] = useState("");

    const centerAspectCrop = (mediaWidth, mediaHeight, aspect) =>
        centerCrop(
            makeAspectCrop(
                {
                    unit: "%",
                    width: 90
                },
                aspect,
                mediaWidth,
                mediaHeight
            ),
            mediaWidth,
            mediaHeight
        );

    const handleSelectedFiles = useCallback((acceptedFiles) => {
        const loaderId = Date.now();
        try {
            acceptedFiles.forEach(async (file) => {
                if (Math.floor(file.size / 1024 / 1024) > 2) {
                    toast.error("Maximum image size allowed is 2MB");
                    return;
                }

                let truncateName = file.name.split(".");
                truncateName.pop();
                truncateName = truncateName.join(".");
                setFilename(truncateName);
                topLoader.show(true, loaderId);
                const result = await getDataUrl(file);
                if (result) {
                    setImgSrc(result);
                }
                topLoader.hide(true, loaderId);
            });
        } catch (error) {
            console.log("Image Load Error", error);
            topLoader.hide(true, loaderId);
        }
    }, []);

    const onImageLoad = (e) => {
        if (aspect) {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspect));
        }
    };

    const onDownloadCropClick = () => {
        if (!previewCanvasRef.current) {
            throw new Error("Crop canvas does not exist");
        }

        previewCanvasRef.current.toBlob((blob) => {
            if (!blob) {
                throw new Error("Failed to create blob");
            }
            downloadFile(URL.createObjectURL(blob), fileName);
        });
    };

    useDebounceEffect(
        async () => {
            if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
            }
        },
        100,
        [completedCrop, scale, rotate]
    );

    const handleToggleAspectClick = () => {
        if (aspect) {
            setAspect(undefined);
        } else if (imgRef.current) {
            const { width, height } = imgRef.current;
            setAspect(16 / 9);
            setCrop(centerAspectCrop(width, height, 16 / 9));
        }
    };

    return (
        <StyledContainer>
            <StyledBoxCenter flexDirection="column" justifyContent="center">
                <ImageDropZone handleOnDrop={handleSelectedFiles} />
                <StyledBoxCenter marginTop={2} flexDirection="column" justifyContent="center">
                    <StyledBoxCenter width={400} justifyContent="center">
                        <Typography marginRight={4} width={155} fontWeight={500}>
                            Scale Image
                        </Typography>
                        <Slider
                            id="scale-input"
                            aria-label="Scale Image"
                            value={scale}
                            getAriaValueText={(value) => `Image scaled by ${value}`}
                            valueLabelDisplay="auto"
                            step={0.1}
                            marks
                            min={1}
                            max={10}
                            color="secondary"
                            size="large"
                            sx={{ width: "100%" }}
                            onChange={(e) => setScale(Number(e.target.value))}
                            disabled={!imgSrc}
                        />
                    </StyledBoxCenter>
                    <StyledBoxCenter width={400} marginTop={2} justifyContent="center">
                        <Typography marginRight={4} width={155} fontWeight={500}>
                            Rotate Image
                        </Typography>
                        <Slider
                            id="rotate-input"
                            aria-label="Rotate Image"
                            value={rotate}
                            getAriaValueText={(value) => `Image rotated by ${value}°`}
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={180}
                            color="secondary"
                            size="large"
                            sx={{ width: "100%" }}
                            onChange={(e) => setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))}
                            disabled={!imgSrc}
                        />
                    </StyledBoxCenter>
                    <StyledBoxCenter width={400} marginTop={2} justifyContent="flex-start">
                        <StyledSwitch label="Toggle Aspect" checked={!!aspect} onChange={handleToggleAspectClick} disabled={!imgSrc} />
                    </StyledBoxCenter>
                    {imgSrc ? (
                        <StyledBoxCenter marginTop={5} justifyContent="center">
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspect}
                            >
                                <StyledImageRenderer
                                    width={600}
                                    src={imgSrc}
                                    ref={imgRef}
                                    alt="Crop me"
                                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                            {completedCrop ? (
                                <StyledBoxCenter flexDirection="column" width={500} marginLeft={10} justifyContent="center">
                                    <Typography variant="h6">Crop Preview</Typography>
                                    <canvas
                                        ref={previewCanvasRef}
                                        style={{
                                            border: "1px solid black",
                                            objectFit: "contain",
                                            width: completedCrop.width,
                                            height: completedCrop.height
                                        }}
                                    />
                                    <Button variant="outlined" endIcon={<CloudDownload />} onClick={onDownloadCropClick} sx={{ mt: 2 }}>
                                        Download Image
                                    </Button>
                                </StyledBoxCenter>
                            ) : null}
                        </StyledBoxCenter>
                    ) : null}
                </StyledBoxCenter>
            </StyledBoxCenter>
        </StyledContainer>
    );
}
