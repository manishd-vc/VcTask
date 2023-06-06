import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './feature/todo/todoSlice';

export function makeStore() {
  return configureStore({
    reducer: { todoList: todoReducer },
  });
}

const store = makeStore();

export default store;
