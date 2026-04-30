import { createSlice } from '@reduxjs/toolkit';

// Initial state for the common slice.
// It handles global data like toast messages and master data.
const initialState = {
  // Toast message settings (visibility, content, and type)
  toastMessage: {
    show: false, // Controls visibility of the toast message
    message: '', // The content of the toast message
    variant: '', // The style/type of the toast (e.g., success, error)
    title: '' // Title of the toast message
  },
  submittedAssessment: [],
  // Master data to store general data across the app
  masterData: [] // Stores master data (e.g., lists, settings)
};

// Slice definition for managing global common state
const slice = createSlice({
  name: 'common', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    /**
     * Updates the state to show a toast message with the provided content.
     * @param {Object} state - Current state of the common slice
     * @param {Object} action - Action object containing the toast message details
     * @param {string} action.payload.message - The content of the toast message
     * @param {string} action.payload.variant - The variant/type of the toast message (e.g., 'success')
     * @param {string} action.payload.title - The title for the toast message
     */
    setToastMessage(state, action) {
      state.toastMessage = {
        show: true, // Make toast message visible
        message: action.payload.message,
        variant: action.payload.variant,
        title: action.payload.title
      };
    },

    setSubmittedAssessment: (state, action) => {
      state.submittedAssessment = action.payload;
    },
    /**
     * Hides the toast message by resetting the state.
     * @param {Object} state - Current state of the common slice
     */
    hideToastMessage(state) {
      state.toastMessage = {
        show: false, // Hide the toast message
        message: '',
        variant: '',
        title: ''
      };
    },

    /**
     * Sets the master data in the state.
     * @param {Object} state - Current state of the common slice
     * @param {Object} action - Action object containing the master data
     * @param {Array} action.payload - The master data to be stored
     */
    setMasterData(state, action) {
      state.masterData = action.payload;
    }
  }
});

// Reducer export - Responsible for updating the state based on the actions
export default slice.reducer;

// Action exports - These are the functions that can be dispatched to modify the state
export const { setToastMessage, hideToastMessage, setMasterData, setSubmittedAssessment } = slice.actions;
