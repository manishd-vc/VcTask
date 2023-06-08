import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeStep: 1,
  steps: ['first step', 'second step', 'third step'],
  selectedUser: '',
  selectedDesignation: '',
};

const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    setNextStep: (state) => {
      if (state.activeStep >= state?.steps?.length) {
        return;
      } else {
        state.activeStep += 1;
      }
    },
    setPreviousStep: (state) => {
      if (state.activeStep <= 1) {
        return;
      } else {
        state.activeStep -= 1;
      }
    },
    setUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setDesignation: (state, action) => {
      state.selectedDesignation = action.payload;
    },
  },
});

export const { setNextStep, setPreviousStep, setUser, setDesignation } =
  stepperSlice.actions;

export default stepperSlice.reducer;
