import { createSlice } from '@reduxjs/toolkit';

// Initial state for the settings slice.
// It stores the theme mode, sidebar state, currency, and exchange rate.
const initialState = {
  themeMode: 'light', // Default theme mode is light
  openSidebar: true, // Sidebar is open by default
  currency: process.env.BASE_CURRENCY || 'USD', // Currency defaults to USD or environment variable value
  rate: 1 // Default exchange rate is set to 1
};

// slice definition for managing application settings (theme, sidebar, currency)
const slice = createSlice({
  name: 'settings', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    /**
     * Updates the theme mode (light or dark).
     * @param {Object} state - Current state of the settings slice
     * @param {Object} action - Action object containing the new theme mode
     * @param {string} action.payload - The new theme mode value
     */
    setThemeMode(state, action) {
      state.themeMode = action.payload;
    },

    /**
     * Toggles the sidebar visibility based on the payload value.
     * @param {Object} state - Current state of the settings slice
     * @param {Object} action - Action object containing the sidebar visibility status
     * @param {boolean} action.payload - Whether the sidebar should be open or closed
     */
    toggleSidebar(state, action) {
      state.openSidebar = action.payload;
    },

    /**
     * Updates the application currency and exchange rate.
     * @param {Object} state - Current state of the settings slice
     * @param {Object} action - Action object containing the new currency and rate
     * @param {Object} action.payload - Object containing the new currency and rate
     * @param {string} action.payload.currency - The new currency to be set
     * @param {number} action.payload.rate - The new exchange rate for the selected currency
     */
    handleChangeCurrency(state, action) {
      state.currency = action.payload.currency;
      state.rate = action.payload.rate;
    }
  }
});

// Reducer export - Responsible for updating the state based on the actions
export default slice.reducer;

// Action exports - These are the functions that can be dispatched to modify the state
export const { setThemeMode, toggleSidebar, handleChangeCurrency } = slice.actions;
