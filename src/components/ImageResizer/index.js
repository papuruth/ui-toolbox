import { CloudDownload, ContentCopy, CropOriginal, GridOn, Lock, LockOpen, RestartAlt, SwapHoriz } from "@mui/icons-material";
import { Typography } from "@mui/material";
import ImageDropZone from "components/ImageDropZone";
import localization from "localization";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    AspectChip,
    AspectGroup,
    AspectPreviewBox,
    CanvasWrap,
    ControlLabel,
    ControlRow,
    ControlValue,
    ControlsSection,
    CropContainer,
    CropWrap,
    DimInput,
    DimPair,
    DropWrap,
    EmptyState,
    FileInfoCard,
    FileInfoDims,
    FileInfoDot,
    FileInfoName,
    FormatBtn,
    FormatGroup,
    GridOverlay,
    LiveDimsBadge,
    LockBtn,
    MetaText,
    Panel,
    PanelHeader,
    PanelLabel,
    PreviewPanel,
    ReplaceBtn,
    ResizerLayout,
    ResultCanvas,
    ResultMetaBadge,
    ResultMetaRow,
    SliderWrap,
    WorkflowGuide,
    WorkflowNum,
    WorkflowStep,
    WorkflowStepBody,
    WorkflowStepDesc,
    WorkflowStepTitle,
    WorkflowTitle
} from "./styles";

const {
    imageResizer: L,
    common: { maxImageSizeText }
} = localization;

const ORIGINAL_ASPECT = "original";

const ASPECT_PRESETS = [
    { label: "Free", value: undefined, icon: null },
    { label: "Original", value: ORIGINAL_ASPECT, icon: null },
    { label: "1:1", value: 1, icon: { w: 8, h: 8 } },
    { label: "4:3", value: 4 / 3, icon: { w: 11, h: 8 } },
    { label: "3:2", value: 3 / 2, icon: { w: 12, h: 8 } },
    { label: "16:9", value: 16 / 9, icon: { w: 14, h: 8 } },
    { label: "9:16", value: 9 / 16, icon: { w: 5, h: 9 } }
];

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight), mediaWidth, mediaHeight);
}

export default function ImageResizer() {
    const [imgSrc, setImgSrc] = useState("");
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState("");
    const [imgDims, setImgDims] = useState(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [cropDims, setCropDims] = useState(null);
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [aspect, setAspect] = useState(undefined);
    const [originalAspect, setOriginalAspect] = useState(null);
    const [selectedPresetLabel, setSelectedPresetLabel] = useState("Free");
    const [outW, setOutW] = useState("");
    const [outH, setOutH] = useState("");
    const [lockAR, setLockAR] = useState(true);
    const [showGrid, setShowGrid] = useState(false);
    const [scaleActive, setScaleActive] = useState(false);
    const [rotateActive, setRotateActive] = useState(false);
    const previewCanvasRef = useRef(null);
    const imgRef = useRef(null);
    const userEditedDimsRef = useRef(false);
    const dimTriggeredCropRef = useRef(false);
    const prevCropRef = useRef(null);
    const outWRef = useRef("");
    const outHRef = useRef("");

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
                const bytes = file.size;
                setFileSize(bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`);
                topLoader.show(true, loaderId);
                const result = await getDataUrl(file);
                if (result) {
                    setImgSrc(result);
                    setCompletedCrop(null);
                    setCropDims(null);
                    setOutW("");
                    setOutH("");
                    outWRef.current = "";
                    outHRef.current = "";
                    userEditedDimsRef.current = false;
                    dimTriggeredCropRef.current = false;
                    prevCropRef.current = null;
                    setScale(1);
                    setRotate(0);
                }
                topLoader.hide(true, loaderId);
            });
        } catch (error) {
            console.log("Image Load Error", error);
            topLoader.hide(true, loaderId);
        }
    }, []);

    const handleReplaceImage = useCallback(() => {
        setImgSrc("");
        setFileName("");
        setFileSize("");
        setActualFileSize(null);
        setImgDims(null);
        setOriginalAspect(null);
        setAspect(undefined);
        setSelectedPresetLabel("Free");
        setCrop(undefined);
        setCompletedCrop(null);
        setCropDims(null);
        setOutW("");
        setOutH("");
        outWRef.current = "";
        outHRef.current = "";
        userEditedDimsRef.current = false;
        dimTriggeredCropRef.current = false;
        prevCropRef.current = null;
        setScale(1);
        setRotate(0);
    }, []);

    const handleReset = useCallback(() => {
        setScale(1);
        setRotate(0);
        setCropDims(null);
        setOutW("");
        setOutH("");
        setShowGrid(false);
        outWRef.current = "";
        outHRef.current = "";
        userEditedDimsRef.current = false;
        dimTriggeredCropRef.current = false;
        prevCropRef.current = null;
        if (imgRef.current && originalAspect) {
            const { width, height } = imgRef.current;
            setAspect(originalAspect);
            setSelectedPresetLabel("Original");
            const newCrop = centerCrop(makeAspectCrop({ unit: "%", width: 100 }, originalAspect, width, height), width, height);
            setCrop(newCrop);
            // Use exact rendered dimensions (same as onImageLoad) to avoid float rounding
            setCompletedCrop({ unit: "px", x: 0, y: 0, width, height });
        } else {
            setCompletedCrop(null);
        }
    }, [originalAspect]);

    // Keyboard shortcut: R = Reset
    useEffect(() => {
        const handler = (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
            if ((e.key === "r" || e.key === "R") && !e.metaKey && !e.ctrlKey) handleReset();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [handleReset]);

    const onImageLoad = (e) => {
        const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
        setImgDims({ w: naturalWidth, h: naturalHeight });
        const origRatio = naturalWidth / naturalHeight;
        setOriginalAspect(origRatio);
        setAspect(origRatio);
        setSelectedPresetLabel("Original");
        const newCrop = centerCrop(makeAspectCrop({ unit: "%", width: 100 }, origRatio, width, height), width, height);
        setCrop(newCrop);
        userEditedDimsRef.current = false;
        // Use exact rendered dimensions to avoid floating-point rounding errors
        setCompletedCrop({ unit: "px", x: 0, y: 0, width, height });
    };

    const handleAspectSelect = (value) => {
        const preset = ASPECT_PRESETS.find((p) => p.value === value);
        setSelectedPresetLabel(preset?.label ?? "Free");
        const ratio = value === ORIGINAL_ASPECT ? originalAspect : value;
        setAspect(ratio);
        if (ratio !== undefined && imgRef.current) {
            const { width, height } = imgRef.current;
            userEditedDimsRef.current = false;
            if (value === ORIGINAL_ASPECT) {
                // Full-image crop — use exact rendered dims to show the true original dimensions
                const newCrop = centerCrop(makeAspectCrop({ unit: "%", width: 100 }, ratio, width, height), width, height);
                setCrop(newCrop);
                setCompletedCrop({ unit: "px", x: 0, y: 0, width, height });
            } else {
                const newCrop = centerAspectCrop(width, height, ratio);
                setCrop(newCrop);
                setCompletedCrop({
                    unit: "px",
                    x: Math.round((newCrop.x / 100) * width),
                    y: Math.round((newCrop.y / 100) * height),
                    width: Math.round((newCrop.width / 100) * width),
                    height: Math.round((newCrop.height / 100) * height)
                });
            }
        }
    };

    const handleOutW = (val) => {
        const raw = parseInt(val, 10);
        const w = imgDims && raw > imgDims.w ? imgDims.w : raw;
        const cappedVal = imgDims && raw > imgDims.w ? String(imgDims.w) : val;
        userEditedDimsRef.current = true;
        outWRef.current = cappedVal;
        setOutW(cappedVal);
        if (w > 0 && imgDims) {
            const wPct = Math.min((w / imgDims.w) * 100, 100);
            if (lockAR && cropDims?.w) {
                const newH = Math.min(Math.round((w * cropDims.h) / cropDims.w), imgDims.h);
                const computed = String(newH);
                outHRef.current = computed;
                setOutH(computed);
                const hPct = Math.min((newH / imgDims.h) * 100, 100);
                dimTriggeredCropRef.current = true;
                setCrop((prev) => ({
                    unit: "%",
                    x: Math.min(prev?.x ?? 0, 100 - wPct),
                    y: Math.min(prev?.y ?? 0, 100 - hPct),
                    width: wPct,
                    height: hPct
                }));
            } else {
                dimTriggeredCropRef.current = true;
                setCrop((prev) => ({
                    unit: "%",
                    x: Math.min(prev?.x ?? 0, 100 - wPct),
                    y: prev?.y ?? 0,
                    width: wPct,
                    height: prev?.height ?? wPct
                }));
            }
        }
    };

    const handleOutH = (val) => {
        const raw = parseInt(val, 10);
        const h = imgDims && raw > imgDims.h ? imgDims.h : raw;
        const cappedVal = imgDims && raw > imgDims.h ? String(imgDims.h) : val;
        userEditedDimsRef.current = true;
        outHRef.current = cappedVal;
        setOutH(cappedVal);
        if (h > 0 && imgDims) {
            const hPct = Math.min((h / imgDims.h) * 100, 100);
            if (lockAR && cropDims?.h) {
                const newW = Math.min(Math.round((h * cropDims.w) / cropDims.h), imgDims.w);
                const computed = String(newW);
                outWRef.current = computed;
                setOutW(computed);
                const wPct = Math.min((newW / imgDims.w) * 100, 100);
                dimTriggeredCropRef.current = true;
                setCrop((prev) => ({
                    unit: "%",
                    x: Math.min(prev?.x ?? 0, 100 - wPct),
                    y: Math.min(prev?.y ?? 0, 100 - hPct),
                    width: wPct,
                    height: hPct
                }));
            } else {
                dimTriggeredCropRef.current = true;
                setCrop((prev) => ({
                    unit: "%",
                    x: prev?.x ?? 0,
                    y: Math.min(prev?.y ?? 0, 100 - hPct),
                    width: prev?.width ?? hPct,
                    height: hPct
                }));
            }
        }
    };

    const handleDownloadFormat = useCallback(
        (format) => {
            if (!previewCanvasRef.current) return;
            const mimeMap = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" };
            const mime = mimeMap[format] || "image/png";
            previewCanvasRef.current.toBlob(
                (blob) => {
                    if (!blob) return;
                    downloadFile(URL.createObjectURL(blob), `${fileName || "cropped"}.${format}`);
                },
                mime,
                0.92
            );
        },
        [fileName]
    );

    const handleCopyImage = useCallback(async () => {
        if (!previewCanvasRef.current) return;
        try {
            previewCanvasRef.current.toBlob(async (blob) => {
                if (!blob) return;
                await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
                toast.success(L.copySuccessMsg);
            }, "image/png");
        } catch {
            toast.error(L.copyErrorMsg);
        }
    }, []);

    const dimError = useMemo(() => {
        if (aspect === undefined || !outW || !outH || lockAR) return null;
        const w = parseInt(outW, 10);
        const h = parseInt(outH, 10);
        if (!w || !h) return null;
        // Dims still match the crop output — system hasn't updated yet or user hasn't changed them
        if (cropDims && w === cropDims.w && h === cropDims.h) return null;
        if (Math.abs(w / h - aspect) > 0.02) return L.dimMismatchWarning;
        return null;
    }, [aspect, outW, outH, lockAR, cropDims]);

    const [actualFileSize, setActualFileSize] = useState(null);

    const updateActualSize = useCallback(() => {
        if (!previewCanvasRef.current) return;
        previewCanvasRef.current.toBlob((blob) => {
            if (!blob) return;
            const bytes = blob.size;
            setActualFileSize(bytes >= 1024 * 1024 ? `~${(bytes / 1024 / 1024).toFixed(1)} MB` : `~${Math.round(bytes / 1024)} KB`);
        }, "image/png");
    }, []);

    useDebounceEffect(
        async () => {
            if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
                const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
                const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
                const naturalW = Math.round(completedCrop.width * scaleX);
                const naturalH = Math.round(completedCrop.height * scaleY);
                const prev = prevCropRef.current;
                const cropMoved =
                    !prev ||
                    prev.x !== completedCrop.x ||
                    prev.y !== completedCrop.y ||
                    prev.width !== completedCrop.width ||
                    prev.height !== completedCrop.height;
                const wasDimTriggered = dimTriggeredCropRef.current;
                prevCropRef.current = completedCrop;
                dimTriggeredCropRef.current = false;
                setCropDims({ w: naturalW, h: naturalH });
                if (!wasDimTriggered && (cropMoved || !userEditedDimsRef.current)) {
                    outWRef.current = String(naturalW);
                    outHRef.current = String(naturalH);
                    setOutW(String(naturalW));
                    setOutH(String(naturalH));
                    userEditedDimsRef.current = false;
                }
                const tw = parseInt(outWRef.current, 10) || naturalW;
                const th = parseInt(outHRef.current, 10) || naturalH;
                canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate, tw, th);
                updateActualSize();
            }
        },
        100,
        [completedCrop, scale, rotate, updateActualSize]
    );

    // Re-renders canvas when user manually edits output dimensions
    useEffect(() => {
        if (!completedCrop?.width || !completedCrop?.height || !imgRef.current || !previewCanvasRef.current) return;
        const tw = parseInt(outW, 10) || null;
        const th = parseInt(outH, 10) || null;
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate, tw, th);
        updateActualSize();
    }, [outW, outH]); // eslint-disable-line react-hooks/exhaustive-deps

    const scaleFill = `${((scale - 1) / 9) * 100}%`;
    const rotateFill = `${(rotate / 180) * 100}%`;

    return (
        <ResizerLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.controlsLabel}</PanelLabel>
                    {imgDims && (
                        <MetaText>
                            {imgDims.w}×{imgDims.h}px
                        </MetaText>
                    )}
                </PanelHeader>

                {!imgSrc && (
                    <DropWrap>
                        <ImageDropZone handleOnDrop={handleSelectedFiles} maxImageSize={5} />
                    </DropWrap>
                )}

                {imgSrc && (
                    <FileInfoCard>
                        <FileInfoDot />
                        <FileInfoName>{fileName || "image"}</FileInfoName>
                        {imgDims && (
                            <FileInfoDims>
                                {imgDims.w}×{imgDims.h}
                            </FileInfoDims>
                        )}
                        {fileSize && <FileInfoDims>{fileSize}</FileInfoDims>}
                        <ReplaceBtn onClick={handleReplaceImage} title={L.replaceImageBtn}>
                            <SwapHoriz sx={{ fontSize: 12 }} />
                            {L.replaceImageBtn}
                        </ReplaceBtn>
                    </FileInfoCard>
                )}

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
                                style={{ "--fill": scaleFill }}
                                disabled={!imgSrc}
                                onChange={(e) => setScale(Number(e.target.value))}
                                onMouseDown={() => setScaleActive(true)}
                                onMouseUp={() => setScaleActive(false)}
                                onTouchStart={() => setScaleActive(true)}
                                onTouchEnd={() => setScaleActive(false)}
                            />
                        </SliderWrap>
                        <ControlValue $active={scaleActive}>{scale.toFixed(1)}×</ControlValue>
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
                                style={{ "--fill": rotateFill }}
                                disabled={!imgSrc}
                                onChange={(e) => {
                                    const raw = Math.min(180, Math.max(0, Number(e.target.value)));
                                    const snapped = [0, 90, 180].find((s) => Math.abs(raw - s) <= 4);
                                    setRotate(snapped !== undefined ? snapped : raw);
                                }}
                                onMouseDown={() => setRotateActive(true)}
                                onMouseUp={() => setRotateActive(false)}
                                onTouchStart={() => setRotateActive(true)}
                                onTouchEnd={() => setRotateActive(false)}
                            />
                        </SliderWrap>
                        <ControlValue $active={rotateActive}>{rotate}°</ControlValue>
                    </ControlRow>
                    <ControlRow>
                        <ControlLabel>{L.aspectRatioLabel}</ControlLabel>
                        <AspectGroup>
                            {ASPECT_PRESETS.map((p) => (
                                <AspectChip
                                    key={p.label}
                                    $active={selectedPresetLabel === p.label}
                                    disabled={!imgSrc}
                                    onClick={() => handleAspectSelect(p.value)}
                                >
                                    {p.icon && <AspectPreviewBox $w={p.icon.w} $h={p.icon.h} $active={selectedPresetLabel === p.label} />}
                                    {p.label}
                                </AspectChip>
                            ))}
                        </AspectGroup>
                    </ControlRow>
                    {cropDims && (
                        <ControlRow>
                            <ControlLabel>{L.outputSizeLabel}</ControlLabel>
                            <DimPair>
                                <DimInput
                                    type="number"
                                    min={1}
                                    max={imgDims?.w}
                                    value={outW}
                                    onChange={(e) => handleOutW(e.target.value)}
                                    placeholder="W"
                                />
                                <span>×</span>
                                <DimInput
                                    type="number"
                                    min={1}
                                    max={imgDims?.h}
                                    value={outH}
                                    onChange={(e) => handleOutH(e.target.value)}
                                    placeholder="H"
                                />
                                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>px</span>
                            </DimPair>
                            <LockBtn
                                $active={lockAR}
                                onClick={() => setLockAR((v) => !v)}
                                title={lockAR ? "Unlock aspect ratio" : "Lock aspect ratio"}
                            >
                                {lockAR ? <Lock sx={{ fontSize: 14 }} /> : <LockOpen sx={{ fontSize: 14 }} />}
                            </LockBtn>
                            {dimError && (
                                <Typography variant="caption" sx={{ color: "#ff5252", fontSize: 11, mt: 0.5, width: "100%" }}>
                                    {dimError}
                                </Typography>
                            )}
                        </ControlRow>
                    )}
                </ControlsSection>

                {!imgSrc && (
                    <WorkflowGuide>
                        <WorkflowTitle>How it works</WorkflowTitle>
                        <WorkflowStep>
                            <WorkflowNum>1</WorkflowNum>
                            <WorkflowStepBody>
                                <WorkflowStepTitle>Upload</WorkflowStepTitle>
                                <WorkflowStepDesc>Drag & drop or click to add a JPG, PNG, or JPEG image</WorkflowStepDesc>
                            </WorkflowStepBody>
                        </WorkflowStep>
                        <WorkflowStep>
                            <WorkflowNum>2</WorkflowNum>
                            <WorkflowStepBody>
                                <WorkflowStepTitle>Crop & Adjust</WorkflowStepTitle>
                                <WorkflowStepDesc>Select a region, pick an aspect ratio, scale or rotate as needed</WorkflowStepDesc>
                            </WorkflowStepBody>
                        </WorkflowStep>
                        <WorkflowStep>
                            <WorkflowNum>3</WorkflowNum>
                            <WorkflowStepBody>
                                <WorkflowStepTitle>Export</WorkflowStepTitle>
                                <WorkflowStepDesc>Set output dimensions and download the cropped result</WorkflowStepDesc>
                            </WorkflowStepBody>
                        </WorkflowStep>
                    </WorkflowGuide>
                )}
            </Panel>

            <PreviewPanel>
                <PanelHeader>
                    <PanelLabel>{L.previewLabel}</PanelLabel>
                    <ActionBtnGroup>
                        {fileName && <MetaText>{fileName}</MetaText>}
                        {imgSrc && (
                            <ActionBtn
                                $active={showGrid}
                                onClick={() => setShowGrid((v) => !v)}
                                title={L.gridOverlayLabel}
                                style={showGrid ? { color: "#22cc99", borderColor: "rgba(34,204,153,0.4)" } : {}}
                            >
                                <GridOn sx={{ fontSize: 13 }} />
                                {L.gridOverlayLabel}
                            </ActionBtn>
                        )}
                    </ActionBtnGroup>
                </PanelHeader>

                <CropWrap>
                    {imgSrc ? (
                        <CropContainer>
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
                                    style={{
                                        transform: `scale(${scale}) rotate(${rotate}deg)`,
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        display: "block"
                                    }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                            {showGrid && <GridOverlay />}
                            {completedCrop && cropDims && (
                                <LiveDimsBadge>
                                    {cropDims.w} × {cropDims.h} px
                                </LiveDimsBadge>
                            )}
                        </CropContainer>
                    ) : (
                        <EmptyState>
                            <CropOriginal sx={{ fontSize: 48 }} />
                            <Typography variant="body2" sx={{ fontSize: "13px" }}>
                                {L.emptyStateMessage}
                            </Typography>
                        </EmptyState>
                    )}
                </CropWrap>

                {completedCrop && (
                    <CanvasWrap>
                        <PanelHeader>
                            <PanelLabel>{L.croppedResultLabel}</PanelLabel>
                            {cropDims && (
                                <MetaText>
                                    {outW || cropDims.w}×{outH || cropDims.h}px
                                </MetaText>
                            )}
                        </PanelHeader>
                        <ResultCanvas
                            ref={previewCanvasRef}
                            style={{
                                width: completedCrop.width,
                                height: completedCrop.height
                            }}
                        />
                        {actualFileSize && (
                            <ResultMetaRow>
                                <ResultMetaBadge>{actualFileSize}</ResultMetaBadge>
                                {outW && outH && (
                                    <ResultMetaBadge>
                                        {outW}×{outH}px
                                    </ResultMetaBadge>
                                )}
                            </ResultMetaRow>
                        )}
                    </CanvasWrap>
                )}

                <ActionBar>
                    <ActionBtnGroup>
                        <ActionBtn onClick={handleReset} disabled={!imgSrc} title="Reset (R)">
                            <RestartAlt sx={{ fontSize: 13 }} />
                            {L.resetBtn}
                        </ActionBtn>
                        <ActionBtn onClick={handleCopyImage} disabled={!completedCrop}>
                            <ContentCopy sx={{ fontSize: 13 }} />
                            {L.copyImageBtn}
                        </ActionBtn>
                    </ActionBtnGroup>
                    <FormatGroup>
                        <FormatBtn $primary onClick={() => handleDownloadFormat("png")} disabled={!completedCrop}>
                            <CloudDownload sx={{ fontSize: 13 }} />
                            PNG
                        </FormatBtn>
                        <FormatBtn onClick={() => handleDownloadFormat("jpg")} disabled={!completedCrop}>
                            JPG
                        </FormatBtn>
                        <FormatBtn onClick={() => handleDownloadFormat("webp")} disabled={!completedCrop}>
                            WebP
                        </FormatBtn>
                    </FormatGroup>
                </ActionBar>
            </PreviewPanel>
        </ResizerLayout>
    );
}
