import { createSlice } from '@reduxjs/toolkit';

// Initial state for the campaign slice.
// It stores the campaign update data.
const initialState = {
  // Holds the data for campaign updates
  campaignUpdateData: null
};

// Slice definition for managing campaign-related state
const slice = createSlice({
  name: 'campaign', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    /**
     * Sets the campaign update data in the state.
     * @param {Object} state - Current state of the campaign slice
     * @param {Object} action - Action object containing the campaign data
     * @param {Object} action.payload - The campaign update data to be stored
     */
    setCampaignData(state, action) {
      state.campaignUpdateData = action.payload;
    }
  }
});

// Reducer export - Responsible for updating the state based on the actions
export default slice.reducer;

// Action export - This function can be dispatched to modify the state with campaign data
export const { setCampaignData } = slice.actions;
