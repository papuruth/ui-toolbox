import { ContentCopy, Done } from "@mui/icons-material";
import { Typography } from "@mui/material";
import ImageDropZone from "components/ImageDropZone";
import localization from "localization";
import React, { useCallback, useState } from "react";
import { getDataUrl, getImageAspectRatio } from "utils/helperFunctions";
import toast from "utils/toast";
import topLoader from "utils/topLoader";
import {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    AspectDisplay,
    AspectRatioLabel,
    DimInput,
    DimInputsRow,
    DimSeparator,
    DropWrap,
    EmptyState,
    MetaText,
    Panel,
    PanelHeader,
    PanelLabel,
    PresetBtn,
    PresetLabel,
    PresetsRow,
    PresetsSection,
    ToolLayout
} from "./styles";

const {
    aspectRatioCalculator: L,
    common: { maxImageSizeText }
} = localization;

const PRESETS = [
    { label: "16:9", w: 1920, h: 1080 },
    { label: "4:3", w: 1600, h: 1200 },
    { label: "1:1", w: 1000, h: 1000 },
    { label: "21:9", w: 2560, h: 1080 }
];

function computeRatio(w, h) {
    const nw = Number(w);
    const nh = Number(h);
    if (!nw || !nh) return null;
    const [rw, rh] = getImageAspectRatio(nw, nh);
    return `${rw}:${rh}`;
}

export default function AspectRatioCalculator() {
    const [imageWidth, setImageWidth] = useState("");
    const [imageHeight, setImageHeight] = useState("");
    const [aspectRatio, setAspectRatio] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleWidthChange = (e) => {
        const val = e.target.value;
        setImageWidth(val);
        setAspectRatio(computeRatio(val, imageHeight));
    };

    const handleHeightChange = (e) => {
        const val = e.target.value;
        setImageHeight(val);
        setAspectRatio(computeRatio(imageWidth, val));
    };

    const applyPreset = useCallback((preset) => {
        setImageWidth(String(preset.w));
        setImageHeight(String(preset.h));
        setAspectRatio(computeRatio(preset.w, preset.h));
    }, []);

    const getImageMeta = async (dataUrl) => {
        try {
            const image = new Image();
            image.src = dataUrl;
            await image.decode();
            return { width: image.width, height: image.height };
        } catch (error) {
            toast.error("Error decoding image.");
            return null;
        }
    };

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
                    const result = await getDataUrl(file);
                    if (result) {
                        const imageMeta = await getImageMeta(result);
                        if (imageMeta) {
                            setImageWidth(String(imageMeta.width));
                            setImageHeight(String(imageMeta.height));
                            setAspectRatio(computeRatio(imageMeta.width, imageMeta.height));
                        }
                    }
                    topLoader.hide(true, loaderId);
                });
            } catch (error) {
                console.log("Image Load Error", error);
                topLoader.hide(true, loaderId);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const handleCopy = useCallback(() => {
        if (!aspectRatio) return;
        if (window?.navigator?.clipboard) {
            window.navigator.clipboard.writeText(aspectRatio).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            });
        }
    }, [aspectRatio]);

    const handleReset = useCallback(() => {
        setImageWidth("");
        setImageHeight("");
        setAspectRatio(null);
        setCopied(false);
    }, []);

    const hasInput = imageWidth || imageHeight;
    const copyIcon = copied ? <Done sx={{ fontSize: 13 }} /> : <ContentCopy sx={{ fontSize: 13 }} />;
    const copyLabel = copied ? "Copied!" : "Copy";

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.imageDimensionsLabel}</PanelLabel>
                </PanelHeader>
                <DropWrap>
                    <ImageDropZone handleOnDrop={handleSelectedFiles} maxImageSize={4} />
                </DropWrap>
                <DimInputsRow>
                    <DimInput type="number" placeholder="Width (px)" value={imageWidth} onChange={handleWidthChange} min={1} />
                    <DimSeparator>×</DimSeparator>
                    <DimInput type="number" placeholder="Height (px)" value={imageHeight} onChange={handleHeightChange} min={1} />
                </DimInputsRow>
                <PresetsSection>
                    <PresetLabel>Presets</PresetLabel>
                    <PresetsRow>
                        {PRESETS.map((p) => (
                            <PresetBtn key={p.label} onClick={() => applyPreset(p)}>
                                {p.label}
                            </PresetBtn>
                        ))}
                    </PresetsRow>
                </PresetsSection>
                <ActionBar>
                    <ActionBtn $danger onClick={handleReset} disabled={!hasInput}>
                        Reset
                    </ActionBtn>
                </ActionBar>
            </Panel>

            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.aspectRatioLabel}</PanelLabel>
                    {imageWidth && imageHeight && (
                        <MetaText>
                            {imageWidth}×{imageHeight}px
                        </MetaText>
                    )}
                </PanelHeader>
                <AspectDisplay>
                    {aspectRatio ? (
                        <>
                            <AspectRatioLabel>{aspectRatio}</AspectRatioLabel>
                            <Typography
                                variant="body2"
                                sx={{ fontSize: "12px", color: "var(--text-secondary)", mt: 1, fontFamily: "Inter, sans-serif" }}
                            >
                                Simplified ratio
                            </Typography>
                        </>
                    ) : (
                        <EmptyState>
                            <Typography variant="body2" sx={{ fontSize: "13px" }}>
                                Enter dimensions or upload an image
                            </Typography>
                        </EmptyState>
                    )}
                </AspectDisplay>
                <ActionBar>
                    <ActionBtnGroup>
                        <ActionBtn $success={copied} onClick={handleCopy} disabled={!aspectRatio}>
                            {copyIcon} {copyLabel}
                        </ActionBtn>
                    </ActionBtnGroup>
                </ActionBar>
            </Panel>
        </ToolLayout>
    );
}
