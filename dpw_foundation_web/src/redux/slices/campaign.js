// src/redux/slices/campaign.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  campaignUpdateData: null
};

const slice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setCampaignUpdateData(state, action) {
      state.campaignUpdateData = action.payload;
    }
  }
});

export default slice.reducer;
export const { setCampaignUpdateData } = slice.actions;
