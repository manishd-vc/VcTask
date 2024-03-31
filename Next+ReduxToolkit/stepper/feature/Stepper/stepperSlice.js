import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeStep: 1,
  steps: ['first step', 'second step', 'third step'],
  userList: [
    { id: '1686292u65u56u', userName: 'manish', designation: 'designer' },
    { id: '1686292g56i5', userName: 'pankaj', designation: 'designer 2' },
    { id: '1686qwfqww294', userName: 'dhaval', designation: 'designer 3' },
  ],
  selectedUser: {
    userName: '',
    designation: '',
  },
  selectedUserId: [],
  selectedUserData: [],
};

const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    setNextStep: (state) => {
      if (state.activeStep >= state?.steps?.length) {
        return;
      } else {
        if (state.activeStep === 1) {
          const timestamp = Date.now();
          const newUser = { id: timestamp, ...state.selectedUser };
          state.userList = [...state.userList, newUser];
        } else if (state.activeStep === 2) {
          const selectedData = state.userList.filter((item) =>
            state.selectedUserId.includes(item.id)
          );
          console.log('selectedData', selectedData);
          state.selectedUserData = [...state.selectedUserData, ...selectedData];
        } else {
          return;
        }
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
    updateSelectedUser: (state, action) => {
      state.selectedUser = { ...state.selectedUser, ...action.payload };
    },
    updateSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
  },
});

export const {
  setNextStep,
  setPreviousStep,
  updateSelectedUser,
  updateSelectedUserId,
} = stepperSlice.actions;

export default stepperSlice.reducer;
