import { createSlice } from '@reduxjs/toolkit';

// Initial state definition
const initialState = {
  themeMode: 'light', // Default theme mode is light
  openSidebar: false, // Sidebar is initially closed
  currency: process.env.BASE_CURRENCY || 'USD', // Default currency is 'USD' or based on environment variable
  rate: 1 // Default exchange rate is 1
};

/**
 * Redux slice for managing settings such as theme mode, sidebar state, and currency settings.
 * @type {Object}
 * @property {string} name - The name of the slice.
 * @property {Object} initialState - The initial state for the slice.
 * @property {Object} reducers - The reducers for managing the state.
 */
const slice = createSlice({
  name: 'settings', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    /**
     * Sets the theme mode (light/dark) in the state.
     * @param {Object} state - Current state of the slice.
     * @param {Object} action - The action containing the payload.
     * @param {string} action.payload - The selected theme mode ('light' or 'dark').
     */
    setThemeMode(state, action) {
      state.themeMode = action.payload; // Set the theme mode
    },

    /**
     * Toggles the sidebar open/close state.
     * @param {Object} state - Current state of the slice.
     * @param {Object} action - The action containing the payload.
     * @param {boolean} action.payload - The state of the sidebar (true for open, false for closed).
     */
    toggleSidebar(state, action) {
      state.openSidebar = action.payload; // Set the sidebar state (open or closed)
    },

    /**
     * Changes the currency and exchange rate in the state.
     * @param {Object} state - Current state of the slice.
     * @param {Object} action - The action containing the payload.
     * @param {Object} action.payload - The new currency and rate.
     * @param {string} action.payload.currency - The new currency code (e.g., 'USD', 'EUR').
     * @param {number} action.payload.rate - The new exchange rate for the currency.
     */
    handleChangeCurrency(state, action) {
      state.currency = action.payload.currency; // Set the new currency
      state.rate = action.payload.rate; // Set the new exchange rate
    }
  }
});

// Reducer export
export default slice.reducer;

// Action exports
export const { setThemeMode, toggleSidebar, handleChangeCurrency } = slice.actions;
