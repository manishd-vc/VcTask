import { createSlice } from '@reduxjs/toolkit';

// Initial state definition
const initialState = {
  toastMessage: {
    show: false,
    message: '',
    variant: '',
    title: ''
  },
  masterData: [] // Stores master data
};

/**
 * Redux slice for managing common state such as toast messages and master data.
 * @type {Object}
 * @property {string} name - The name of the slice.
 * @property {Object} initialState - The initial state for the slice.
 * @property {Object} reducers - The reducers for managing the state.
 */
const slice = createSlice({
  name: 'common', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    /**
     * Sets the toast message state.
     * @param {Object} state - Current state of the slice.
     * @param {Object} action - The action containing the payload.
     * @param {string} action.payload.message - The message to display.
     * @param {string} action.payload.variant - The variant/type of toast (e.g., success, error).
     * @param {string} action.payload.title - The title of the toast message.
     */
    setToastMessage(state, action) {
      state.toastMessage = {
        show: true, // Display the toast message
        message: action.payload.message, // Set the message
        variant: action.payload.variant, // Set the variant
        title: action.payload.title // Set the title
      };
    },

    /**
     * Hides the toast message by resetting the state.
     * @param {Object} state - Current state of the slice.
     */
    hideToastMessage(state) {
      state.toastMessage = {
        show: false, // Hide the toast message
        message: '', // Reset the message
        variant: '', // Reset the variant
        title: '' // Reset the title
      };
    },

    /**
     * Sets the master data in the state.
     * @param {Object} state - Current state of the slice.
     * @param {Object} action - The action containing the payload.
     * @param {Array} action.payload - The array of master data to store.
     */
    setMasterData(state, action) {
      state.masterData = action.payload; // Set the master data
    }
  }
});

// Reducer export
export default slice.reducer;

// Action exports
export const { setToastMessage, hideToastMessage, setMasterData } = slice.actions;
