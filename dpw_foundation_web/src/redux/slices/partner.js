import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  partnerRequestData: null
};

const slice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    setPartnerRequestData(state, action) {
      state.partnerRequestData = action.payload;
    }
  }
});

export default slice.reducer;

export const { setPartnerRequestData } = slice.actions;
