import React, { useState } from 'react';

const AddUserForm = ({ addUser }) => {
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    created_at: '', // You may set a default created_at value or get it from the server.
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(newUser);
    setNewUser({
      username: '',
      email: '',
      created_at: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        name='username'
        placeholder='Username'
        value={newUser.username}
        onChange={handleChange}
        required
      />
      <input
        type='email'
        name='email'
        placeholder='Email'
        value={newUser.email}
        onChange={handleChange}
        required
      />
      {/* Add more fields as needed */}
      <button type='submit'>Add User</button>
    </form>
  );
};

export default AddUserForm;
