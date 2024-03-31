import { configureStore } from '@reduxjs/toolkit';
import checkBoxReducer from './feature/CheckBox/checkBoxSlice';

export function makeStore() {
  return configureStore({
    reducer: { checkBoxList: checkBoxReducer },
  });
}

const store = makeStore();

export default store;
