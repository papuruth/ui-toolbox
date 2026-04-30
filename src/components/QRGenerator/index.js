import { CloudDownload, QrCode } from "@mui/icons-material";
import { Typography } from "@mui/material";
import ImageDropZone from "components/ImageDropZone";
import localization from "localization";
import QRCode from "qrcode";
import React, { useCallback, useEffect, useState } from "react";
import { applyShadowToQRImage, downloadFile, getDataUrl } from "utils/helperFunctions";
import toast from "utils/toast";
import topLoader from "utils/topLoader";
import {
    ActionBar,
    ActionBtn,
    ActionBtnGroup,
    ColorInput,
    ControlLabel,
    ControlRow,
    ControlValue,
    ControlsSection,
    EmptyState,
    MetaText,
    ModeBtn,
    ModeToggle,
    Panel,
    PanelHeader,
    PanelLabel,
    QrInput,
    QrInputWrap,
    QrPreviewArea,
    QrPreviewImg,
    SliderWrap,
    ToolLayout
} from "./styles";

const DEFAULT_SIZE = 300;
const DEFAULT_FG = "#000000";
const DEFAULT_BG = "#ffffff";

export default function QRGenerator() {
    const [qrImage, setQrImage] = useState("");
    const [qrData, setQrData] = useState("");
    const [size, setSize] = useState(DEFAULT_SIZE);
    const [fgColor, setFgColor] = useState(DEFAULT_FG);
    const [bgColor, setBgColor] = useState(DEFAULT_BG);
    const [addLogo, setAddLogo] = useState(false);
    const [logoSrc, setLogoSrc] = useState("");
    const [logoQr, setLogoQr] = useState("");

    const { appTitle, qrGenerator: L } = localization;

    const generateQR = useCallback(async (data, logo, currentSize, fg, bg) => {
        if (!data) {
            setQrImage("");
            setLogoQr("");
            return;
        }
        try {
            const dataUrl = await QRCode.toDataURL(data, {
                errorCorrectionLevel: "H",
                width: currentSize,
                margin: 1,
                color: { dark: fg, light: bg }
            });
            const withShadow = await applyShadowToQRImage(dataUrl, logo);
            if (logo) {
                setLogoQr(withShadow);
            } else {
                setQrImage(withShadow);
                setLogoQr("");
            }
        } catch (err) {
            console.error("QR generation error", err.message);
        }
    }, []);

    useEffect(() => {
        generateQR(qrData, logoSrc, size, fgColor, bgColor);
    }, [qrData, logoSrc, size, fgColor, bgColor, generateQR]);

    const handleDownloadPNG = useCallback(() => {
        const src = logoQr || qrImage;
        if (src) {
            downloadFile(src, `${appTitle}-QR-${Date.now()}.png`);
        }
    }, [qrImage, logoQr, appTitle]);

    const handleDownloadSVG = useCallback(() => {
        if (!qrData) return;
        QRCode.toString(qrData, {
            type: "svg",
            width: size,
            margin: 1,
            color: { dark: fgColor, light: bgColor }
        })
            .then((svgString) => {
                const blob = new Blob([svgString], { type: "image/svg+xml" });
                downloadFile(URL.createObjectURL(blob), `${appTitle}-QR-${Date.now()}.svg`);
            })
            .catch((err) => console.error("SVG generation error", err.message));
    }, [qrData, size, fgColor, bgColor, appTitle]);

    const handleClear = useCallback(() => {
        setQrData("");
        setQrImage("");
        setSize(DEFAULT_SIZE);
        setFgColor(DEFAULT_FG);
        setBgColor(DEFAULT_BG);
        setAddLogo(false);
        setLogoSrc("");
        setLogoQr("");
    }, []);

    const loadLogoImage = async (imgData) => {
        try {
            const image = new Image();
            image.src = imgData;
            await image.decode();
            return image;
        } catch (error) {
            toast.error("Logo image decode error!");
            return {};
        }
    };

    const handleLogoFiles = useCallback(
        (acceptedFiles) => {
            const loaderId = Date.now();
            try {
                acceptedFiles.forEach(async (file) => {
                    if (Math.floor(file.size / 1024) > 512) {
                        toast.error(L.maxLogoSizeLabel);
                        return;
                    }
                    topLoader.show(true, loaderId);
                    const result = await getDataUrl(file);
                    if (result) {
                        const { width, height } = await loadLogoImage(result);
                        if (width > 512 && height > 512) {
                            toast.error(L.maxLogoSizePXLabel);
                        } else if (width > 0 && height > 0) {
                            setLogoSrc(result);
                        }
                    }
                    topLoader.hide(true, loaderId);
                });
            } catch (error) {
                console.log("Logo Load Error", error);
                topLoader.hide(true, loaderId);
            }
        },
        [L.maxLogoSizeLabel, L.maxLogoSizePXLabel]
    );

    const disableLogo = useCallback(() => {
        setAddLogo(false);
        setLogoSrc("");
        setLogoQr("");
    }, []);

    const enableLogo = useCallback(() => {
        setAddLogo(true);
    }, []);

    const activeQr = logoQr || qrImage;
    const hasData = qrData.length > 0;

    return (
        <ToolLayout>
            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.qrDataLabel}</PanelLabel>
                    {hasData && <MetaText>{qrData.length} chars</MetaText>}
                </PanelHeader>
                <QrInputWrap>
                    <QrInput placeholder={L.inputPlaceholder} value={qrData} onChange={(e) => setQrData(e.target.value)} maxLength={2000} />
                </QrInputWrap>
                <ControlsSection>
                    <ControlRow>
                        <ControlLabel>{L.sizeLabel}</ControlLabel>
                        <SliderWrap>
                            <input type="range" min={100} max={1000} step={50} value={size} onChange={(e) => setSize(Number(e.target.value))} />
                        </SliderWrap>
                        <ControlValue>{size}px</ControlValue>
                    </ControlRow>
                    <ControlRow>
                        <ControlLabel>{L.foregroundLabel}</ControlLabel>
                        <ColorInput type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
                        <ControlValue>{fgColor}</ControlValue>
                    </ControlRow>
                    <ControlRow>
                        <ControlLabel>{L.backgroundLabel}</ControlLabel>
                        <ColorInput type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                        <ControlValue>{bgColor}</ControlValue>
                    </ControlRow>
                    <ControlRow>
                        <ControlLabel>{L.logoLabel}</ControlLabel>
                        <ModeToggle>
                            <ModeBtn $active={!addLogo} onClick={disableLogo}>
                                {L.logoOffLabel}
                            </ModeBtn>
                            <ModeBtn $active={addLogo} onClick={enableLogo}>
                                {L.logoOnLabel}
                            </ModeBtn>
                        </ModeToggle>
                    </ControlRow>
                    {addLogo && <ImageDropZone maxImageSize={512} unit="KB" handleOnDrop={handleLogoFiles} />}
                </ControlsSection>
            </Panel>

            <Panel>
                <PanelHeader>
                    <PanelLabel>{L.qrPreviewLabel}</PanelLabel>
                    {activeQr && (
                        <MetaText>
                            {size}×{size}px
                        </MetaText>
                    )}
                </PanelHeader>
                <QrPreviewArea>
                    {activeQr ? (
                        <QrPreviewImg src={activeQr} alt="QR Code" />
                    ) : (
                        <EmptyState>
                            <QrCode sx={{ fontSize: 48 }} />
                            <Typography variant="body2" sx={{ fontSize: "13px" }}>
                                {L.emptyStateMessage}
                            </Typography>
                        </EmptyState>
                    )}
                </QrPreviewArea>
                <ActionBar>
                    <ActionBtnGroup>
                        <ActionBtn onClick={handleDownloadPNG} disabled={!activeQr}>
                            <CloudDownload sx={{ fontSize: 13 }} /> {L.pngBtn}
                        </ActionBtn>
                        <ActionBtn onClick={handleDownloadSVG} disabled={!hasData}>
                            <CloudDownload sx={{ fontSize: 13 }} /> {L.svgBtn}
                        </ActionBtn>
                    </ActionBtnGroup>
                    <ActionBtn $danger onClick={handleClear} disabled={!hasData}>
                        {L.clearBtn}
                    </ActionBtn>
                </ActionBar>
            </Panel>
        </ToolLayout>
    );
}
