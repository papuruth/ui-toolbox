import { AspectRatio, ContentCut, CropFree, Extension, ExtensionOff, Link as LinkIcon, PhotoLibrary, QrCode } from "@mui/icons-material";
import localization from "localization";
import React from "react";

const { imageToBase64, base64ToImage, qrGenerator, imageResizer, aspectRatioCalculator, base64Encoder, base64Decoder, urlValidator, urlShortner } =
    localization;

export const GLOBAL_CONSTANTS = {
    OPERATIONS_ITEMS: [
        {
            label: imageToBase64.pageTitle,
            route: "/image-to-base64",
            icon: (
                <PhotoLibrary
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: base64ToImage.pageTitle,
            route: "/base64-to-image",
            icon: (
                <PhotoLibrary
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: qrGenerator.pageTitle,
            route: "/qr-generator",
            icon: (
                <QrCode
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: imageResizer.pageTitle,
            route: "/image-resizer",
            icon: (
                <CropFree
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: aspectRatioCalculator.pageTitle,
            route: "/aspect-ratio-calculator",
            icon: (
                <AspectRatio
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: base64Decoder.pageTitle,
            route: "/decode-base64",
            icon: (
                <ExtensionOff
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: base64Encoder.pageTitle,
            route: "/encode-base64",
            icon: (
                <Extension
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: urlValidator.pageTitle,
            route: "/url-validator",
            icon: (
                <LinkIcon
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: urlShortner.pageTitle,
            route: "/url-shortener",
            icon: (
                <ContentCut
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        }
    ],
    APIS: {
        urlShortner: "https://api-ssl.bitly.com/v4/shorten"
    }
};
