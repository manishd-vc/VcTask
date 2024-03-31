import React, { useState } from 'react';

const EditUserForm = ({ user, updateUser }) => {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(editedUser);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        name='username'
        placeholder='Username'
        value={editedUser.username}
        onChange={handleChange}
        required
      />
      <input
        type='email'
        name='email'
        placeholder='Email'
        value={editedUser.email}
        onChange={handleChange}
        required
      />
      {/* Add more fields as needed */}
      <button type='submit'>Save</button>
    </form>
  );
};

export default EditUserForm;
