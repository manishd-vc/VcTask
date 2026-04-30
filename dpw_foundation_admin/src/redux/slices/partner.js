import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  partnershipRequestData: null,
  partnershipRequestLoading: false,
  partnerAssessmentQuestions: [],
  predefineAssessmentQuestions: []
};

const slice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    setPartnershipRequestData(state, action) {
      state.partnershipRequestData = action.payload;
    },
    setPartnershipRequestLoading(state, action) {
      state.partnershipRequestLoading = action.payload;
    },
    setPartnerAssessmentQuestions(state, action) {
      state.partnerAssessmentQuestions = action.payload;
    },
    setPredefineQuestions(state, action) {
      state.predefineAssessmentQuestions = action.payload;
    }
  }
});

export default slice.reducer;

export const {
  setPartnershipRequestData,
  setPartnershipRequestLoading,
  setPartnerAssessmentQuestions,
  setPredefineQuestions
} = slice.actions;
