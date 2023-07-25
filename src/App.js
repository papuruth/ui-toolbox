import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalLayout from 'components/GlobalLayout';
import GlobalStyled from 'styles/global';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <CssBaseline />
      <GlobalStyled />
      <StyledEngineProvider injectFirst>
        <GlobalLayout />
      </StyledEngineProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
        closeButton={false}
      />
    </Provider>
  );
}

export default App;
