import { createGlobalStyle } from 'styled-components';

import colors from './colors';

const GlobalStyle = createGlobalStyle`
  /* Default */
  * {
    box-sizing: border-box;
    margin: 0;
    outline: 0;
    padding: 0;
  }
  body {
    background-color: ${colors.background};
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
  }
  body, input, textarea {
    font-family: 'Ubuntu', sans-serif !important;
  }
  a, button {
    outline: none;
    text-decoration: none;
    color: ${colors.black};
  }
  a:active,a:focus {
    color: ${colors.black};
  }

  /* Toast Notification */
  .toast-notification-error,
  .toast-notification-info,
  .toast-notification-success,
  .toast-notification-warning {
    .toast-notification-body {
      padding: 10px;
      font-size: 14px;
    }
  }
  #nprogress .bar {
    background: #ed1430 !important;
    z-index: 1100 !important;
  }
`;

export default GlobalStyle;
