import { createSlice } from '@reduxjs/toolkit';

// Initial state for the donor slice.
// It manages the donor-related data in the admin context.
const initialState = {
  getDonorAdminData: null, // Stores donor admin data
  getOnSpotDonorData: null
};

// Slice definition for managing donor-related state
const slice = createSlice({
  name: 'donor', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    /**
     * Sets the donor admin data in the state.
     * @param {Object} state - Current state of the donor slice
     * @param {Object} action - Action object containing the donor admin data
     * @param {Object} action.payload - Donor admin data to be stored in the state
     */
    setDonorAdminData(state, action) {
      state.getDonorAdminData = action.payload;
    },
    /**
     * Sets the on-spot donor data in the state.
     * @param {Object} state - Current state of the donor slice
     * @param {Object} action - Action object containing the on-spot donor data
     * @param {Object} action.payload - On-spot donor data to be stored in the state
     */
    setOnSpotDonorData(state, action) {
      state.getOnSpotDonorData = action.payload;
    }
  }
});

// Reducer export - Responsible for updating the state based on the actions
export default slice.reducer;

// Action exports - These are the functions that can be dispatched to modify the state
export const { setDonorAdminData, setOnSpotDonorData } = slice.actions;
