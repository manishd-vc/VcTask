import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileData: null,
  enrollLoading: false,
  volunteerEnrollmentData: null,
  volunteerEnrollmentLoading: false,
  campaignEnrollmentData: null,
  volunteerFormData: null,
  volunteerCampaign: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setEnrollLoading: (state, action) => {
      state.enrollLoading = action.payload;
    },
    setVolunteerEnrollmentData: (state, action) => {
      state.volunteerEnrollmentData = action.payload;
    },
    setVolunteerEnrollmentLoading: (state, action) => {
      state.volunteerEnrollmentLoading = action.payload;
    },
    setCampaignEnrollmentData: (state, action) => {
      state.campaignEnrollmentData = action.payload;
    },
    setVolunteerFormData: (state, action) => {
      state.volunteerFormData = action.payload;
    },
    setVolunteerCampaign: (state, action) => {
      state.volunteerCampaign = action.payload;
    }
  }
});

export const {
  setProfileData,
  setEnrollLoading,
  setVolunteerEnrollmentData,
  setVolunteerEnrollmentLoading,
  setCampaignEnrollmentData,
  setVolunteerFormData,
  setVolunteerCampaign
} = profileSlice.actions;
export default profileSlice.reducer;
