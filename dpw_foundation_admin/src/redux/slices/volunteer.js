import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  volunteerCampaignData: null,
  existingCampaignData: null,
  volunteerAssessmentQuestions: [],
  volunteerPredefineAssessmentQuestions: [],
  volunteerEnrollmentData: null,
  volunteerEnrollmentLoading: false
};

const slice = createSlice({
  name: 'volunteer',
  initialState,
  reducers: {
    setVolunteerCampaignData(state, action) {
      state.volunteerCampaignData = action.payload;
    },
    setExistingCampaignData(state, action) {
      state.existingCampaignData = action.payload;
    },
    setVolunteerAssessmentQuestions(state, action) {
      state.volunteerAssessmentQuestions = action.payload;
    },
    setVolunteerPredefineAssessmentQuestions(state, action) {
      state.volunteerPredefineAssessmentQuestions = action.payload;
    },
    setVolunteerEnrollmentData(state, action) {
      state.volunteerEnrollmentData = action.payload;
    },
    setVolunteerEnrollmentLoading(state, action) {
      state.volunteerEnrollmentLoading = action.payload;
    }
  }
});

export default slice.reducer;

export const {
  setVolunteerCampaignData,
  setExistingCampaignData,
  setVolunteerAssessmentQuestions,
  setVolunteerPredefineAssessmentQuestions,
  setVolunteerEnrollmentData,
  setVolunteerEnrollmentLoading
} = slice.actions;
