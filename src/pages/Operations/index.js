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
import { StyledContainer, StyledLayoutContainer } from './styles';

function Operations({ location }) {
  const { pathname } = location || {};
  const renderComponentConditionally = () => {
    switch (pathname) {
      case '/image-to-base64':
        return { title: 'Image to Base64', component: ImageToBase64 };
      case '/base64-to-image':
        return { title: 'Base64 to Image', component: Base64ToImage };
      case '/qr-generator':
        return { title: 'QR Code Generator', component: QRGenerator };
      case '/image-resizer':
        return { title: 'Image Resizer', component: ImageResizer };
      case '/aspect-ratio-calculator':
        return { title: 'Aspect Ratio Calculator', component: AspectRatioCalculator };
      case '/encode-base64':
        return { title: 'Base64 Encoder', component: EncodeBase64 };
      case '/decode-base64':
        return { title: 'Base64 Decoder', component: DecodeBase64 };
      case '/url-validator':
        return { title: 'URL Validator', component: UrlValidator };
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
