import { createSlice } from '@reduxjs/toolkit';

const getDataFromLocalStorage = JSON.parse(
  localStorage.getItem('userList') || '[]'
);
const initialState = {
  userList: getDataFromLocalStorage,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
