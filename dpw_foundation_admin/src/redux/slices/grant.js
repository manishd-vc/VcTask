import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  grantRequestData: null,
  grantRequestLoading: false,
  isFilledAssessmentQuestion: false,
  isPaymentValidated: false
};

const slice = createSlice({
  name: 'grant', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    setGrantRequestData(state, action) {
      state.grantRequestData = action.payload;
    },
    setGrantRequestLoading(state, action) {
      state.grantRequestLoading = action.payload;
    },
    setIsFilledAssessmentQuestion(state, action) {
      state.isFilledAssessmentQuestion = action.payload;
    },
    setIsPaymentValidated(state, action) {
      state.isPaymentValidated = action.payload;
    }
  }
});

export default slice.reducer;

export const { setGrantRequestData, setGrantRequestLoading, setIsFilledAssessmentQuestion, setIsPaymentValidated } =
  slice.actions;
