import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showFilter: false,
  inKindContributionRequestData: null,
  financeDonationData: null
};

const slice = createSlice({
  name: 'finance', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    setShowFilter(state, action) {
      state.showFilter = action.payload;
    },
    setInKindContributionRequestData(state, action) {
      state.inKindContributionRequestData = action.payload;
    },
    setFinanceDonationData(state, action) {
      state.financeDonationData = action.payload;
    }
  }
});

export default slice.reducer;

export const { setShowFilter, setInKindContributionRequestData, setFinanceDonationData } = slice.actions;
