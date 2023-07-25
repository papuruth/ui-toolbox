import Home from 'pages/Home';
import Operations from 'pages/Operations';

export default [
  {
    path: '/',
    component: Home,
    exact: true,
    key: 'HOMECOMPONENT',
  },
  {
    path: '/image-to-base64',
    component: Operations,
    exact: true,
    key: 'IMAGETOBASE64',
  },
  {
    path: '/base64-to-image',
    component: Operations,
    exact: true,
    key: 'BASE64TOIMAGE',
  },
  {
    path: '/qr-generator',
    component: Operations,
    exact: true,
    key: 'QRGENERATOR',
  },
  {
    path: '/image-resizer',
    component: Operations,
    exact: true,
    key: 'IMAGERESIZER',
  },
  {
    path: '/aspect-ratio-calculator',
    component: Operations,
    exact: true,
    key: 'ASPECTRATIOCALCULATOR',
  },
  {
    path: '/decode-base64',
    component: Operations,
    exact: true,
    key: 'DECODEBASE64',
  },
  {
    path: '/encode-base64',
    component: Operations,
    exact: true,
    key: 'ENCODEBASE64',
  },
];
