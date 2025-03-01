import AspectRatioCalculator from "components/AspectRatioCalculator";
import Base64ToImage from "components/Base64ToImage";
import DecodeBase64 from "components/DecodeBase64";
import EncodeBase64 from "components/EncodeBase64";
import ImageResizer from "components/ImageResizer";
import ImageToBase64 from "components/ImageToBase64";
import QRGenerator from "components/QRGenerator";
import { object, oneOfType } from "prop-types";
import React from "react";
import { Divider } from "@mui/material";
import StepperNavigation from "components/StepperNavigation";
import UrlValidator from "components/UrlValidator";
import localization from "localization";
import { StyledText } from "components/Shared/Styled-Components";
import URLShortner from "components/URLShortner";
import JSONViewer from "components/JSONViewer";
import PasswordGenerator from "components/PasswordGenerator";
import PasswordStrengthMeter from "components/PasswordStrengthMeter";
import { StyledContainer, StyledLayoutContainer } from "./styles";

function Operations({ location }) {
    const { pathname } = location || {};
    const renderComponentConditionally = () => {
        const {
            imageToBase64,
            base64ToImage,
            qrGenerator,
            imageResizer,
            aspectRatioCalculator,
            base64Encoder,
            base64Decoder,
            urlValidator,
            urlShortner,
            jsonViewer,
            passwordGen,
            passwordStrengthMeter
        } = localization;
        switch (pathname) {
            case "/image-to-base64":
                return { title: imageToBase64.pageTitle, component: ImageToBase64 };
            case "/base64-to-image":
                return { title: base64ToImage.pageTitle, component: Base64ToImage };
            case "/qr-generator":
                return { title: qrGenerator.pageTitle, component: QRGenerator };
            case "/image-resizer":
                return { title: imageResizer.pageTitle, component: ImageResizer };
            case "/aspect-ratio-calculator":
                return { title: aspectRatioCalculator.pageTitle, component: AspectRatioCalculator };
            case "/encode-base64":
                return { title: base64Encoder.pageTitle, component: EncodeBase64 };
            case "/decode-base64":
                return { title: base64Decoder.pageTitle, component: DecodeBase64 };
            case "/url-validator":
                return { title: urlValidator.pageTitle, component: UrlValidator };
            case "/url-shortener":
                return { title: urlShortner.pageTitle, component: URLShortner };
            case "/json-viewer":
                return { title: jsonViewer.pageTitle, component: JSONViewer };
            case "/password-gen":
                return { title: passwordGen.pageTitle, component: PasswordGenerator };
            case "/password-strength-meter":
                return { title: passwordStrengthMeter.pageTitle, component: PasswordStrengthMeter };
            default:
                return null;
        }
    };
    const { title, component: Component } = renderComponentConditionally();

    return (
        <>
            <StepperNavigation currentView={title} />
            <StyledLayoutContainer>
                <StyledContainer>
                    <StyledText variant="h3" fontWeight={500} className="page-title">
                        {title}
                    </StyledText>
                    <Divider flexItem sx={{ m: 2 }} />
                    <Component />
                </StyledContainer>
            </StyledLayoutContainer>
        </>
    );
}

Operations.propTypes = {
    location: oneOfType([object]).isRequired
};

export default Operations;
