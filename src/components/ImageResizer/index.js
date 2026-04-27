import { CloudDownload, CropOriginal } from "@mui/icons-material";
import { Typography } from "@mui/material";
import ImageDropZone from "components/ImageDropZone";
import localization from "localization";
import React, { useCallback, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { downloadFile, getDataUrl } from "utils/helperFunctions";
import { useDebounceEffect } from "utils/hooks/useDebounceEffects.hooks";
import toast from "utils/toast";
import topLoader from "utils/topLoader";
import { canvasPreview } from "./canvasPreview";
import {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    AspectToggle,
    CanvasWrap,
    ControlLabel,
    ControlRow,
    ControlValue,
    ControlsSection,
    CropWrap,
    DropWrap,
    EmptyState,
    MetaText,
    Panel,
    PanelHeader,
    PanelLabel,
    SliderWrap,
    ToolLayout
} from "./styles";

const {
    imageResizer: L,
    common: { maxImageSizeText }
} = localization;

const DEFAULT_ASPECT = 16 / 9;

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight), mediaWidth, mediaHeight);
}

export default function ImageResizer() {
    const [imgSrc, setImgSrc] = useState("");
    const [fileName, setFileName] = useState("");
    const [imgDims, setImgDims] = useState(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [cropDims, setCropDims] = useState(null);
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [aspect, setAspect] = useState(DEFAULT_ASPECT);
    const previewCanvasRef = useRef(null);
    const imgRef = useRef(null);

    const handleSelectedFiles = useCallback((acceptedFiles) => {
        const loaderId = Date.now();
        try {
            acceptedFiles.forEach(async (file) => {
                if (Math.floor(file.size / 1024 / 1024) > 5) {
                    toast.error(maxImageSizeText);
                    return;
                }
                const nameParts = file.name.split(".");
                nameParts.pop();
                setFileName(nameParts.join("."));
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
        const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
        setImgDims({ w: naturalWidth, h: naturalHeight });
        if (aspect) {
            setCrop(centerAspectCrop(width, height, aspect));
        }
    };

    const handleAspectToggle = () => {
        if (aspect) {
            setAspect(undefined);
        } else if (imgRef.current) {
            const { width, height } = imgRef.current;
            setAspect(DEFAULT_ASPECT);
            setCrop(centerAspectCrop(width, height, DEFAULT_ASPECT));
        }
    };

    const onDownloadCropClick = () => {
        if (!previewCanvasRef.current) return;
        previewCanvasRef.current.toBlob((blob) => {
            if (!blob) return;
            downloadFile(URL.createObjectURL(blob), fileName || "cropped");
        });
    };

    useDebounceEffect(
        async () => {
            if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
                canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
                const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
                const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
                setCropDims({
                    w: Math.round(completedCrop.width * scaleX),
                    h: Math.round(completedCrop.height * scaleY)
                });
            }
        },
        100,
        [completedCrop, scale, rotate]
    );

    const aspectLabel = aspect ? L.aspectLockedLabel : L.aspectFreeLabel;

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.controlsLabel}</PanelLabel>
                    {imgDims && (
                        <MetaText>
                            {imgDims.w}×{imgDims.h}px
                        </MetaText>
                    )}
                </PanelHeader>
                <DropWrap>
                    <ImageDropZone handleOnDrop={handleSelectedFiles} />
                </DropWrap>
                <ControlsSection>
                    <ControlRow>
                        <ControlLabel>{L.scaleLabel}</ControlLabel>
                        <SliderWrap>
                            <input
                                type="range"
                                min={1}
                                max={10}
                                step={0.1}
                                value={scale}
                                disabled={!imgSrc}
                                onChange={(e) => setScale(Number(e.target.value))}
                            />
                        </SliderWrap>
                        <ControlValue>{scale.toFixed(1)}×</ControlValue>
                    </ControlRow>
                    <ControlRow>
                        <ControlLabel>{L.rotateLabel}</ControlLabel>
                        <SliderWrap>
                            <input
                                type="range"
                                min={0}
                                max={180}
                                step={1}
                                value={rotate}
                                disabled={!imgSrc}
                                onChange={(e) => setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))}
                            />
                        </SliderWrap>
                        <ControlValue>{rotate}°</ControlValue>
                    </ControlRow>
                    <ControlRow>
                        <ControlLabel>Aspect Ratio</ControlLabel>
                        <AspectToggle $active={!!aspect} onClick={handleAspectToggle} disabled={!imgSrc}>
                            {aspectLabel}
                        </AspectToggle>
                    </ControlRow>
                    {cropDims && (
                        <ControlRow>
                            <ControlLabel>Crop Output</ControlLabel>
                            <MetaText>
                                {cropDims.w}×{cropDims.h}px
                            </MetaText>
                        </ControlRow>
                    )}
                </ControlsSection>
            </Panel>

            <Panel>
                <PanelHeader>
                    <PanelLabel>Preview</PanelLabel>
                    {fileName && <MetaText>{fileName}</MetaText>}
                </PanelHeader>
                <CropWrap>
                    {imgSrc ? (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                        >
                            <img
                                ref={imgRef}
                                src={imgSrc}
                                alt="Crop me"
                                style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, maxWidth: "100%", display: "block" }}
                                onLoad={onImageLoad}
                            />
                        </ReactCrop>
                    ) : (
                        <EmptyState>
                            <CropOriginal sx={{ fontSize: 48 }} />
                            <Typography variant="body2" sx={{ fontSize: "13px" }}>
                                Upload an image to start cropping
                            </Typography>
                        </EmptyState>
                    )}
                </CropWrap>
                {completedCrop && (
                    <CanvasWrap>
                        <PanelHeader>
                            <PanelLabel>Cropped Result</PanelLabel>
                            {cropDims && (
                                <MetaText>
                                    {cropDims.w}×{cropDims.h}px
                                </MetaText>
                            )}
                        </PanelHeader>
                        <canvas
                            ref={previewCanvasRef}
                            style={{
                                objectFit: "contain",
                                width: completedCrop.width,
                                height: completedCrop.height,
                                display: "block",
                                margin: "16px auto",
                                maxWidth: "100%"
                            }}
                        />
                    </CanvasWrap>
                )}
                <ActionBar>
                    <ActionBtnGroup>
                        <ActionBtn onClick={onDownloadCropClick} disabled={!completedCrop}>
                            <CloudDownload sx={{ fontSize: 13 }} /> {L.downloadImageBtn}
                        </ActionBtn>
                    </ActionBtnGroup>
                </ActionBar>
            </Panel>
        </ToolLayout>
    );
}
