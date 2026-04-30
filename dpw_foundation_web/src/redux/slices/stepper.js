import { createSlice } from '@reduxjs/toolkit';

// Initial state definition
const initialState = {
  activeStep: 0 // The initial active step is 0
};

/**
 * Redux slice for managing the stepper state (active step)
 * @type {Object}
 * @property {string} name - The name of the slice.
 * @property {Object} initialState - The initial state for the slice.
 * @property {Object} reducers - The reducers for managing the state.
 */
const slice = createSlice({
  name: 'stepper', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    /**
     * Increments the active step by 1.
     * @param {Object} state - Current state of the slice.
     */
    nextStep: (state) => {
      state.activeStep = state.activeStep + 1; // Increment the active step by 1
    },

    /**
     * Decrements the active step by 1.
     * @param {Object} state - Current state of the slice.
     */
    previousStep: (state) => {
      state.activeStep = state.activeStep - 1; // Decrement the active step by 1
    },

    /**
     * Resets the active step to 0.
     * @param {Object} state - Current state of the slice.
     */
    resetStep: (state) => {
      state.activeStep = 0; // Reset active step to 0
    }
  }
});

// Reducer export
export default slice.reducer;

// Action exports
export const { nextStep, previousStep, resetStep } = slice.actions;
