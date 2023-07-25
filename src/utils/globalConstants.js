import { AspectRatio, CropFree, Extension, ExtensionOff, PhotoLibrary, QrCode } from '@mui/icons-material';
import React from 'react';

export const GLOBAL_CONSTANTS = {
  OPERATIONS_ITEMS: [
    {
      label: 'Image to Base64',
      route: '/image-to-base64',
      icon: <PhotoLibrary fontSize="large" />,
    },
    {
      label: 'Base64 to Image',
      route: '/base64-to-image',
      icon: <PhotoLibrary fontSize="large" />,
    },
    {
      label: 'QR Generator',
      route: '/qr-generator',
      icon: <QrCode fontSize="large" />,
    },
    {
      label: 'Image Resizer',
      route: '/image-resizer',
      icon: <CropFree fontSize="large" />,
    },
    {
      label: 'Aspect Ratio',
      route: '/aspect-ratio-calculator',
      icon: <AspectRatio fontSize="large" />,
    },
    {
      label: 'Decode base64',
      route: '/decode-base64',
      icon: <ExtensionOff fontSize="large" />,
    },
    {
      label: 'Encode base64',
      route: '/encode-base64',
      icon: <Extension fontSize="large" />,
    },
  ],
  APIS: {
    urlShortner: 'https://api-ssl.bitly.com/v4/shorten',
  },
};
