import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/Auth/authSlice';

export function makeStore() {
  return configureStore({
    reducer: { authData: authReducer },
  });
}

const store = makeStore();

export default store;
