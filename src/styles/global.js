import { createGlobalStyle } from "styled-components";
import { generateMedia } from "styled-media-query";

import colors from "./colors";

export const styledMedia = generateMedia({
    xl: "1200px",
    lg: "992px",
    md: "768px",
    sm: "576px",
    xs: "476px"
});

const GlobalStyle = createGlobalStyle`
  /* Color mode tokens */
  :root {
    --bg-page: #f5f5f5;
    --bg-surface: #ffffff;
    --bg-card: #ffffff;
    --text-primary: rgba(0, 0, 0, 0.87);
    --text-secondary: rgba(0, 0, 0, 0.54);
    --border-color: rgba(0, 0, 0, 0.12);
    --hero-gradient: linear-gradient(135deg, #1f1e29 0%, #22cc99 100%);
  }
  [data-theme="dark"] {
    --bg-page: #121212;
    --bg-surface: #1e1e2e;
    --bg-card: #252535;
    --text-primary: rgba(255, 255, 255, 0.87);
    --text-secondary: rgba(255, 255, 255, 0.6);
    --border-color: rgba(255, 255, 255, 0.12);
    --hero-gradient: linear-gradient(135deg, #0d0c14 0%, #1a9970 100%);
  }

  /* Default */
  * {
    box-sizing: border-box;
    margin: 0;
    outline: 0;
    padding: 0;
  }
  body {
    background-color: var(--bg-page);
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
    overflow-x: hidden;
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
  .react-grid-item {
    max-height: 320px;
    min-width: 0;
    max-width: 300px;
  }
  #nprogress {
    pointer-events: bounding-box !important;
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1200;
  }
  #nprogress .bar {
    background: #ed1430 !important;
    z-index: 1100 !important;
  }
`;

export default GlobalStyle;
