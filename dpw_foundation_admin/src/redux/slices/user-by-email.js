import { createSlice } from '@reduxjs/toolkit';

// Initial state for the user by email slice.
// It stores the user by email update data and form state management.
const initialState = {
  // Form state management
  showConfirmEmail: false,
  userData: null,
  isExistingUser: false,
  disableArrow: true
};

// Slice definition for managing user by email-related state
const slice = createSlice({
  name: 'user-by-email', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    /**
     * Sets the show confirm email state
     * @param {Object} state - Current state of the user by email slice
     * @param {Object} action - Action object containing the boolean value
     */
    setShowConfirmEmail(state, action) {
      state.showConfirmEmail = action.payload;
    },

    /**
     * Sets the user data
     * @param {Object} state - Current state of the user by email slice
     * @param {Object} action - Action object containing the user data
     */
    setUserData(state, action) {
      state.userData = action.payload;
    },

    /**
     * Sets the existing user state
     * @param {Object} state - Current state of the user by email slice
     * @param {Object} action - Action object containing the boolean value
     */
    setIsExistingUser(state, action) {
      state.isExistingUser = action.payload;
    },

    /**
     * Sets the disable arrow state
     * @param {Object} state - Current state of the user by email slice
     * @param {Object} action - Action object containing the boolean value
     */
    setDisableArrow(state, action) {
      state.disableArrow = action.payload;
    },

    /**
     * Resets the user by email form state to initial values
     * @param {Object} state - Current state of the user by email slice
     */
    resetUserByEmailFormState(state) {
      state.showConfirmEmail = false;
      state.userData = null;
      state.isExistingUser = false;
      state.disableArrow = true;
    }
  }
});

// Reducer export - Responsible for updating the state based on the actions
export default slice.reducer;

// Action export - These functions can be dispatched to modify the state
export const { setShowConfirmEmail, setUserData, setIsExistingUser, setDisableArrow, resetUserByEmailFormState } =
  slice.actions;
