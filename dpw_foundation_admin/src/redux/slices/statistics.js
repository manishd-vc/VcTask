import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAllStatistics: false
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    setAllStatistics: (state, action) => {
      state.isAllStatistics = action.payload;
    }
  }
});

export const { setAllStatistics } = statisticsSlice.actions;

export default statisticsSlice.reducer;
