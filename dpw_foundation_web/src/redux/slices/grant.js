import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  grantRequestData: null,
  grantRequestLoading: false,
  contributionRequestData: null,
  contributionRequestLoading: false
};

const slice = createSlice({
  name: 'grant',
  initialState,
  reducers: {
    setGrantRequestData(state, action) {
      state.grantRequestData = action.payload;
    },
    setGrantRequestLoading(state, action) {
      state.grantRequestLoading = action.payload;
    },
    setContributionRequestData(state, action) {
      state.contributionRequestData = action.payload;
    },
    setContributionRequestLoading(state, action) {
      state.contributionRequestLoading = action.payload;
    }
  }
});

export default slice.reducer;

export const {
  setGrantRequestData,
  setGrantRequestLoading,
  setContributionRequestData,
  setContributionRequestLoading
} = slice.actions;
