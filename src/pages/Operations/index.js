import AspectRatioCalculator from 'components/AspectRatioCalculator';
import Base64ToImage from 'components/Base64ToImage';
import DecodeBase64 from 'components/DecodeBase64';
import EncodeBase64 from 'components/EncodeBase64';
import ImageResizer from 'components/ImageResizer';
import ImageToBase64 from 'components/ImageToBase64';
import QRGenerator from 'components/QRGenerator';
import { object, oneOfType } from 'prop-types';
import React from 'react';
import { Divider, Typography } from '@mui/material';
import StepperNavigation from 'components/StepperNavigation';
import UrlValidator from 'components/UrlValidator';
import localization from 'localization';
import { StyledContainer, StyledLayoutContainer } from './styles';

function Operations({ location }) {
  const { pathname } = location || {};
  const renderComponentConditionally = () => {
    const { imageToBase64, base64ToImage, qrGenerator, imageResizer, aspectRatioCalculator, base64Encoder, base64Decoder, urlValidator } =
      localization;
    switch (pathname) {
      case '/image-to-base64':
        return { title: imageToBase64.pageTitle, component: ImageToBase64 };
      case '/base64-to-image':
        return { title: base64ToImage.pageTitle, component: Base64ToImage };
      case '/qr-generator':
        return { title: qrGenerator.pageTitle, component: QRGenerator };
      case '/image-resizer':
        return { title: imageResizer.pageTitle, component: ImageResizer };
      case '/aspect-ratio-calculator':
        return { title: aspectRatioCalculator.pageTitle, component: AspectRatioCalculator };
      case '/encode-base64':
        return { title: base64Encoder.pageTitle, component: EncodeBase64 };
      case '/decode-base64':
        return { title: base64Decoder.pageTitle, component: DecodeBase64 };
      case '/url-validator':
        return { title: urlValidator.pageTitle, component: UrlValidator };
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
          <Typography variant="h3" fontWeight={500}>
            {title}
          </Typography>
          <Divider flexItem sx={{ m: 2 }} />
          <Component />
        </StyledContainer>
      </StyledLayoutContainer>
    </>
  );
}

Operations.propTypes = {
  location: oneOfType([object]).isRequired,
};

export default Operations;
