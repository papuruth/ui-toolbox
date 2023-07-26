import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'nprogress/nprogress.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';


ReactDOM.render(<App />, document.getElementById('root'));

// Registers for service worker
serviceWorkerRegistration.register();