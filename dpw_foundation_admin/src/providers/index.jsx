'use client';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useState } from 'react';

// mui
import { Stack } from '@mui/material';
import ThemeRegistry from 'src/theme';

// redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, reduxStore } from 'src/redux';

// react-query
import { QueryClient, QueryClientProvider } from 'react-query';

// components
import LinearIndeterminate from 'src/components/loading';
import Toaster from 'src/components/toaster';
import GlobalStyles from 'src/theme/globalStyles';
import AuthProvider from './auth';

// dynamic import
const ProgressBar = dynamic(() => import('src/components/ProgressBar'), {
  ssr: false // Disable server-side rendering for ProgressBar component
});

/**
 * Providers component that wraps the entire app with necessary providers and contexts.
 * It handles Redux, React Query, Toast notifications, Authentication, and theming.
 * @param {Object} props - Component properties.
 * @param {boolean} props.isAuth - Indicates if the user is authenticated.
 * @param {React.ReactNode} props.children - Child components that will be rendered within the provider.
 * @returns {React.ReactNode} - The wrapped application component with all necessary contexts.
 */
export default function Providers(props) {
  // Initialize the QueryClient for React Query with custom configurations for queries and mutations.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // Prevent refetching queries when window is focused (default: true)
            retry: false // Disable retry for failed queries
          },
          mutations: {
            onError: (error) => {
              // Handle mutation errors globally
              if (error.response?.status === 401) {
                // Optionally, handle unauthorized errors (e.g., redirect to login page)
              }
              return Promise.reject(error); // Reject the error to ensure it's propagated
            }
          }
        }
      })
  );

  return (
    <Provider store={reduxStore}>
      <AuthProvider isAuth={props.isAuth}>
        <ThemeRegistry>
          <GlobalStyles />
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <PersistGate
              loading={
                // Show a loading spinner while the redux state is being rehydrated
                <Stack
                  sx={{
                    position: 'fixed',
                    top: 'calc(50vh - 2px)', // Vertically center the loading spinner
                    width: '300px',
                    left: 'calc(50vw - 150px)', // Horizontally center the loading spinner
                    zIndex: 11
                  }}
                >
                  <LinearIndeterminate />
                </Stack>
              }
              persistor={persistor}
            >
              {props.children}
            </PersistGate>
          </QueryClientProvider>
          <ProgressBar />
        </ThemeRegistry>
      </AuthProvider>
    </Provider>
  );
}

/**
 * Prop types definition for the Providers component.
 * Ensures `isAuth` is a boolean and `children` is a React node.
 */
Providers.propTypes = {
  isAuth: PropTypes.bool.isRequired, // Indicates whether the user is authenticated
  children: PropTypes.node.isRequired // Child components to be rendered within the provider
};
