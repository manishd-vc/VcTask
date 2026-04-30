import { createSlice } from '@reduxjs/toolkit';

// Initial state for the stepper slice.
// It tracks the active step of a multi-step process.
const initialState = {
  activeStep: 0 // The initial step is set to 0
};

// slice definition for managing the active step in a multi-step process
const slice = createSlice({
  name: 'stepper', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    /**
     * Moves to the next step by incrementing the active step by 1.
     * @param {Object} state - Current state of the stepper slice
     */
    nextStep: (state) => {
      state.activeStep = state.activeStep + 1;
    },

    /**
     * Moves to the previous step by decrementing the active step by 1.
     * @param {Object} state - Current state of the stepper slice
     */
    previousStep: (state) => {
      state.activeStep = state.activeStep - 1;
    },

    /**
     * Resets the active step back to 0 (initial step).
     * @param {Object} state - Current state of the stepper slice
     */
    resetStep: (state) => {
      state.activeStep = 0;
    }
  }
});

// Reducer export - Responsible for updating the state based on the actions
export default slice.reducer;

// Action exports - These are the functions that can be dispatched to modify the state
export const { nextStep, previousStep, resetStep } = slice.actions;
