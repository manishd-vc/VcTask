import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  buttons: [
    { value: 1, label: 'low' },
    { value: 2, label: 'medium' },
    { value: 3, label: 'heigh' },
    { value: 4, label: 'Customize' },
  ],
  checkList: [
    {
      id: '1',
      priority: 1,
      text: 'I have a bicycle',
    },
    {
      id: '2',
      priority: 2,
      text: 'I have a car',
    },
    {
      id: '3',
      priority: 3,
      text: 'I have a bike',
    },
    {
      id: '4',
      priority: 2,
      text: 'I have a train',
    },
    {
      id: '5',
      priority: 2,
      text: 'I have a boat',
    },
    {
      id: '6',
      priority: 3,
      text: 'I have a airplane',
    },
    {
      id: '7',
      priority: 3,
      text: 'I have a 7 airplane',
    },
    {
      id: '8',
      priority: 2,
      text: 'I have a 8 airplane',
    },
    {
      id: '9',
      priority: 1,
      text: 'I have a 9 airplane',
    },
    {
      id: '10',
      priority: 1,
      text: 'I have a 10 airplane',
    },
  ],
};

const checkBoxSlice = createSlice({
  name: 'checkBox',
  initialState,
  reducers: {
    updateCheckBox: (state, action) => {
      state.checkList = action?.payload?.updatedList;
    },
  },
});

export const { updateCheckBox } = checkBoxSlice.actions;

export default checkBoxSlice.reducer;
