/* Core */
import { configureStore } from '@reduxjs/toolkit';
import { useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { persistStore } from 'redux-persist';

/* Instruments */
import { reducer } from './rootReducer';
import { middleware } from './middleware';

/**
 * Configures the Redux store with the specified reducer and middleware.
 * The store is also configured to disable serializable checks and add custom middleware.
 */
export const reduxStore = configureStore({
  reducer, // The root reducer for the Redux store
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false // Disables serializable check for non-serializable data
    }).concat(middleware); // Add custom middleware to the default middleware
  }
});

/**
 * Creates a persist store to persist the Redux store state.
 */
export const persistor = persistStore(reduxStore);

/**
 * Custom hook to access the Redux dispatch function.
 *
 * @returns {function} - The Redux dispatch function.
 */
export const useDispatch = () => useReduxDispatch();

/**
 * Custom hook to access the Redux state using the selector.
 *
 * @param {function} selector - The selector function to extract a piece of state.
 * @returns {any} - The value selected from the Redux state.
 */
export const useSelector = useReduxSelector;
