import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, deleteTodo, updateTodo, deleteAllTodos } from './todoSlice';

const Todo = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todoList);
  const [inputValue, setInputValue] = useState('');
  console.log('todos', todos);
  // Load todos from local storage on component mount
  // useEffect(() => {
  //   const storedTodos = localStorage.getItem('todos');
  //   if (storedTodos) {
  //     dispatch(addTodo(JSON.parse(storedTodos)));
  //   }
  // }, [dispatch]);

  // Add a new todo to the list
  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
      };
      dispatch(addTodo(newTodo));
      setInputValue('');
    }
  };

  // Delete a todo from the list
  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
  };

  // Delete all todos from the list
  const handleDeleteAllTodos = () => {
    dispatch(deleteAllTodos());
  };

  // Update the text of a todo
  const handleUpdateTodo = (id, newText) => {
    dispatch(updateTodo({ id, newText }));
  };

  return (
    <div>
      <input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleAddTodo}>Add</button>
      <ul>
        {todos?.todoList?.map((todo) => (
          <li key={todo.id}>
            <input
              type='text'
              value={todo.text}
              onChange={(e) => handleUpdateTodo(todo.id, e.target.value)}
            />
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {todos?.todoList?.length > 0 && (
        <button onClick={handleDeleteAllTodos}>Delete All</button>
      )}
    </div>
  );
};

export default Todo;
