'use client'; // Marks the file as a client-side component for Next.js

import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useState } from 'react';

// mui
import { LinearProgress, Stack } from '@mui/material';
import ThemeRegistry from 'src/theme';

// redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, reduxStore } from 'src/redux';

// react query
import { QueryClient, QueryClientProvider } from 'react-query';

// toast
import Toaster from 'src/components/toaster';

// components
import GlobalStyles from 'src/theme/globalStyles';
import AuthProvider from './auth';

// dynamic import for ProgressBar component (SSR disabled)
const ProgressBar = dynamic(() => import('src/components/ProgressBar'), {
  ssr: false // Disable SSR for the ProgressBar component
});

export default function Providers(props) {
  // Initialize React Query client with default options
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false // Disable refetching on window focus
          }
        }
      })
  );

  return (
    <Provider store={reduxStore}>
      {' '}
      {/* Provide Redux store to the app */}
      <AuthProvider isAuth={props.isAuth}>
        {' '}
        {/* Provide authentication context */}
        <ThemeRegistry>
          {' '}
          {/* Apply theme settings */}
          <GlobalStyles /> {/* Apply global styles */}
          <QueryClientProvider client={queryClient}>
            {' '}
            {/* Provide QueryClient for React Query */}
            <Toaster /> {/* Render Toast notifications */}
            <PersistGate
              loading={
                /* Show loading indicator while rehydrating the Redux store */
                <Stack
                  sx={{
                    position: 'fixed',
                    top: 'calc(50vh - 2px)',
                    width: '300px',
                    left: 'calc(50vw - 150px)',
                    zIndex: 11
                  }}
                >
                  <LinearProgress /> {/* Display a linear progress bar */}
                </Stack>
              }
              persistor={persistor}
            >
              {props.children} {/* Render children components after store is rehydrated */}
            </PersistGate>
          </QueryClientProvider>
          <ProgressBar /> {/* Render ProgressBar component dynamically */}
        </ThemeRegistry>
      </AuthProvider>
    </Provider>
  );
}

// Prop types validation for Providers component
Providers.propTypes = {
  isAuth: PropTypes.bool.isRequired, // isAuth: Boolean indicating authentication status
  children: PropTypes.node.isRequired // children: React nodes to be rendered inside the Providers component
};
