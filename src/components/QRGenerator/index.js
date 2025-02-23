import { CloudDownload, Delete, QrCode } from "@mui/icons-material";
import { Box, Button, IconButton, Slider, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import ImageDropZone from "components/ImageDropZone";
import { StyledBoxCenter, StyledImagePreviewContainer, StyledImageRenderer, StyledPaperCenter } from "components/Shared/Styled-Components";
import StyledSwitch from "components/Shared/StyledSwitch";
import localization from "localization";
import QRCode from "qrcode";
import React, { useCallback, useEffect, useState } from "react";
import colors from "styles/colors";
import { applyShadowToQRImage, downloadFile, getDataUrl } from "utils/helperFunctions";
import toast from "utils/toast";
import topLoader from "utils/topLoader";

export default function QRGenerator() {
    const [qrImage, setQRImage] = useState("");
    const [qrData, setQRData] = useState("");
    const [width, setWidth] = useState(0);
    const [addLogoSwitch, setAddLogoSwitch] = useState(false);
    const [qrImageWithLogo, setQRImageWithLogo] = useState("");
    const [logoSrc, setLogoSrc] = useState("");

    const {
        appTitle,
        qrGenerator: { qrPreviewLabel, maxLogoSizeLabel, maxLogoSizePXLabel, enterQRDataLabel, qrWidthLabel },
        common: { downloadQRLabel }
    } = localization;

    const generateQRCode = useCallback(
        (data, logo) => {
            QRCode.toDataURL(data, { errorCorrectionLevel: "H", width: width > 0 ? width : 300, margin: 0 }).then(async (data) => {
                const qrImageWithShadow = await applyShadowToQRImage(data, logo);
                if (logo) {
                    setQRImageWithLogo(qrImageWithShadow);
                    setLogoSrc(logo);
                } else {
                    setQRImage(qrImageWithShadow);
                }
            });
        },
        [width]
    );

    const handleDownload = useCallback(() => {
        const fileName = `${appTitle}-QR_code-${Date.now()}.png`;
        if (qrImage && !qrImageWithLogo) {
            downloadFile(qrImage, fileName);
        } else if (qrImageWithLogo) {
            downloadFile(qrImageWithLogo, fileName);
        }
    }, [qrImage, qrImageWithLogo, appTitle]);

    const loadQRPreview = useCallback(() => {
        if (qrImage && (!addLogoSwitch || !qrImageWithLogo)) {
            return <StyledImageRenderer src={qrImage} alt="qr-preview" width={width} sameDimensions />;
        }
        if (addLogoSwitch && qrImageWithLogo) {
            return <StyledImageRenderer src={qrImageWithLogo} alt="qr-preview" width={width} sameDimensions />;
        }
        return (
            <StyledPaperCenter height={350} width={350}>
                <QrCode fontSize="large" />
                <Typography variant="h6">{qrPreviewLabel}</Typography>
            </StyledPaperCenter>
        );
    }, [qrImage, addLogoSwitch, qrImageWithLogo, width, qrPreviewLabel]);

    const handleQRInputChange = useCallback(
        (event) => {
            if (event.target.value) {
                setQRData(event.target.value);
                if (!qrData) {
                    setWidth(300);
                }
                generateQRCode(event.target.value, logoSrc);
            }
        },
        [generateQRCode, logoSrc, qrData]
    );

    useEffect(() => {
        if ((qrImage || (qrImageWithLogo && logoSrc)) && width > 0 && qrData) {
            generateQRCode(qrData, logoSrc);
        }
    }, [qrImage, width, generateQRCode, qrData, logoSrc, qrImageWithLogo]);

    const handleQRWidthChange = ({ target: { value } }) => {
        const qrWidth = Number(value);
        if (qrWidth) {
            setWidth(qrWidth);
        } else {
            setWidth(0);
        }
    };

    const valuetext = (value) => `QR idth ${value}`;

    const loadImage = async (imgData) => {
        try {
            const image = new Image();
            image.src = imgData;
            await image.decode();
            return image;
        } catch (error) {
            toast.error("Logo image decode error!");
            console.log("Logo image decode error", error.message);
            return {};
        }
    };

    const handleSelectedFiles = useCallback(
        (acceptedFiles) => {
            const loaderId = Date.now();
            try {
                acceptedFiles.forEach(async (file) => {
                    console.log(file);
                    if (Math.floor(file.size / 1024) > 512) {
                        toast.error(maxLogoSizeLabel);
                        return;
                    }
                    topLoader.show(true, loaderId);
                    const result = await getDataUrl(file);
                    if (result) {
                        const { width, height } = await loadImage(result);
                        if (width > 512 && height > 512) {
                            toast.error(maxLogoSizePXLabel);
                        } else if (width > 0 && height > 0) {
                            generateQRCode(qrData, result);
                        }
                    }
                    topLoader.hide(true, loaderId);
                });
            } catch (error) {
                console.log("Image Load Error", error);
                topLoader.hide(true, loaderId);
            }
        },
        [generateQRCode, qrData, maxLogoSizeLabel, maxLogoSizePXLabel]
    );

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", width: "50%", minHeight: 64 }}>
                <Typography component="p" color={colors.black} fontWeight={700} flexGrow={1}>
                    {enterQRDataLabel}
                </Typography>
                {qrData.length > 0 ? (
                    <Toolbar>
                        <Tooltip title="Clear">
                            <IconButton
                                onClick={() => {
                                    setQRData("");
                                    setQRImage("");
                                    setWidth(0);
                                    setAddLogoSwitch(false);
                                    setQRImageWithLogo("");
                                    setLogoSrc("");
                                }}
                            >
                                <Delete color="error" />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                ) : null}
            </Box>
            <TextField
                id="qr-data"
                placeholder="QR data"
                sx={{ width: "50%", mb: 3 }}
                value={qrData}
                onChange={handleQRInputChange}
                inputProps={{ maxLength: 200 }}
            />
            <Toolbar sx={{ width: { xs: "100%", sm: "100%", md: 400 } }}>
                <Typography id="qr-width-slider" marginRight={2} width={100} fontWeight={500}>
                    {qrWidthLabel}
                </Typography>
                <Slider
                    aria-label="Width"
                    value={width}
                    getAriaValueText={valuetext}
                    valueLabelDisplay="auto"
                    step={100}
                    marks
                    min={100}
                    max={1000}
                    color="secondary"
                    size="large"
                    sx={{ width: "100%" }}
                    onChange={handleQRWidthChange}
                    disabled={!qrData}
                />
            </Toolbar>
            <StyledBoxCenter width={350} marginTop={2} justifyContent="flex-start" $isLeftRightPadding>
                <StyledSwitch
                    label="Add Logo"
                    checked={!!addLogoSwitch}
                    onChange={() => {
                        setAddLogoSwitch(!addLogoSwitch);
                        setQRImageWithLogo("");
                        setLogoSrc("");
                    }}
                    disabled={!qrImage}
                />
            </StyledBoxCenter>
            {addLogoSwitch ? (
                <StyledBoxCenter justifyContent="center" marginTop={2}>
                    <ImageDropZone maxImageSize={512} unit="KB" handleOnDrop={handleSelectedFiles} />
                </StyledBoxCenter>
            ) : null}
            <StyledImagePreviewContainer padding>{loadQRPreview()}</StyledImagePreviewContainer>
            {qrImage ? (
                <Toolbar>
                    <Button onClick={handleDownload} variant="outlined" endIcon={<CloudDownload color="primary" />}>
                        {downloadQRLabel}
                    </Button>
                </Toolbar>
            ) : null}
        </>
    );
}
