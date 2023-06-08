import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from './feature/Stepper/stepperSlice';

export function makeStore() {
  return configureStore({
    reducer: { stepperData: stepperReducer },
  });
}

const store = makeStore();

export default store;
