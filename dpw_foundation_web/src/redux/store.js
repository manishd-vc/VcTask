/* Core */
import { configureStore } from '@reduxjs/toolkit';
import { useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';
import { persistStore } from 'redux-persist';

import { reducer } from './rootReducer';
import { middleware } from './middleware';

/**
 * Configures the Redux store with the specified reducer and middleware.
 * @returns {Object} The configured Redux store.
 */
export const reduxStore = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false
    }).concat(middleware);
  }
});

/**
 * Creates a persistor for the Redux store to manage persistence.
 * @param {Object} reduxStore - The Redux store instance.
 * @returns {Object} The persistor instance.
 */
export const persistor = persistStore(reduxStore);

/**
 * Custom hook to use Redux dispatch.
 * @returns {Function} The dispatch function from Redux.
 */
export const useDispatch = () => useReduxDispatch();

/**
 * Custom hook to use Redux selector.
 * @returns {Function} The selector function from Redux.
 */
export const useSelector = useReduxSelector;
