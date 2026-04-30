import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inKindContributionRequestData: null,
  inKindContributionRequestLoading: false,
  inKindAssessmentQuestions: [],
  beneficiaryUserDetails: null,
  beneficiaryUserDetailsLoading: false
};

const slice = createSlice({
  name: 'beneficiary', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    setInKindContributionRequestData(state, action) {
      state.inKindContributionRequestData = action.payload;
    },
    setInKindContributionRequestLoading(state, action) {
      state.inKindContributionRequestLoading = action.payload;
    },
    setInKindAssessmentQuestions(state, action) {
      state.inKindAssessmentQuestions = action.payload;
    },
    setBeneficiaryUserDetails(state, action) {
      state.beneficiaryUserDetails = action.payload;
    },
    setBeneficiaryUserDetailsLoading(state, action) {
      state.beneficiaryUserDetailsLoading = action.payload;
    }
  }
});

export default slice.reducer;

export const {
  setInKindContributionRequestData,
  setInKindContributionRequestLoading,
  setInKindAssessmentQuestions,
  setBeneficiaryUserDetails,
  setBeneficiaryUserDetailsLoading
} = slice.actions;
