/* Core */
import { configureStore } from '@reduxjs/toolkit';
import { useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { persistStore } from 'redux-persist';

/* Instruments */
import { reducer } from './rootReducer';
import { middleware } from './middleware';

/**
 * Configures the Redux store with reducers and middleware.
 * @type {Object}
 * @property {Function} configureStore - Redux toolkit function to configure the store.
 * @property {Object} reducer - The root reducer for the Redux store.
 * @property {Function} middleware - Middleware to be applied to the store.
 */
export const reduxStore = configureStore({
  reducer, // Root reducer
  middleware: (getDefaultMiddleware) => {
    // Configure middleware with disabled serializableCheck and additional custom middleware
    return getDefaultMiddleware({
      serializableCheck: false // Disable serializability check for non-serializable data
    }).concat(middleware); // Concatenate additional middleware
  }
});

/**
 * Creates and exports the persistor instance for Redux Persist.
 * @type {Object}
 * @property {Function} persistStore - Redux Persist function to create a persistor.
 */
export const persistor = persistStore(reduxStore); // Persist the redux store

/**
 * Custom hook to dispatch actions to the Redux store.
 * @returns {Function} Dispatch function to send actions to the store.
 */
export const useDispatch = () => useReduxDispatch(); // Hook for dispatching actions

/**
 * Custom hook to select state from the Redux store.
 * @returns {Function} Selector function to read state from the store.
 */
export const useSelector = useReduxSelector; // Hook for selecting state
