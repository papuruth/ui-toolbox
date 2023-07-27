import { AspectRatio, CropFree, Extension, ExtensionOff, Link as LinkIcon, PhotoLibrary, QrCode } from '@mui/icons-material';
import React from 'react';

export const GLOBAL_CONSTANTS = {
  OPERATIONS_ITEMS: [
    {
      label: 'Image to Base64',
      route: '/image-to-base64',
      icon: <PhotoLibrary fontSize="large" sx={{ fontSize: '5rem' }} />,
    },
    {
      label: 'Base64 to Image',
      route: '/base64-to-image',
      icon: <PhotoLibrary fontSize="large" sx={{ fontSize: '5rem' }} />,
    },
    {
      label: 'QR Generator',
      route: '/qr-generator',
      icon: <QrCode fontSize="large" sx={{ fontSize: '5rem' }} />,
    },
    {
      label: 'Image Resizer',
      route: '/image-resizer',
      icon: <CropFree fontSize="large" sx={{ fontSize: '5rem' }} />,
    },
    {
      label: 'Aspect Ratio',
      route: '/aspect-ratio-calculator',
      icon: <AspectRatio fontSize="large" sx={{ fontSize: '5rem' }} />,
    },
    {
      label: 'Decode base64',
      route: '/decode-base64',
      icon: <ExtensionOff fontSize="large" sx={{ fontSize: '5rem' }} />,
    },
    {
      label: 'Encode base64',
      route: '/encode-base64',
      icon: <Extension fontSize="large" sx={{ fontSize: '5rem' }} />,
    },
    {
      label: 'URL Validator',
      route: '/url-validator',
      icon: <LinkIcon fontSize="large" sx={{ fontSize: '5rem' }} />,
    },
  ],
  APIS: {
    urlShortner: 'https://api-ssl.bitly.com/v4/shorten',
  },
  DEFAULT_GRID_LAYOUT_CONFIG: {
    i: 'grid_id',
    x: 0,
    y: 0,
    h: 2,
    w: 2,
  },
};
