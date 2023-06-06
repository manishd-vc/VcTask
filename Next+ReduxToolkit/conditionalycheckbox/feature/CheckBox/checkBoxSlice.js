import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  checkList: [
    {
      id: '1',
      priority: '1',
      text: 'I have a bicycle',
    },
    {
      id: '2',
      priority: '2',
      text: 'I have a car',
    },
    {
      id: '3',
      priority: '3',
      text: 'I have a bike',
    },
    {
      id: '4',
      priority: '4',
      text: 'I have a train',
    },
    {
      id: '5',
      priority: '2',
      text: 'I have a boat',
    },
    {
      id: '6',
      priority: '3',
      text: 'I have a airplane',
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
