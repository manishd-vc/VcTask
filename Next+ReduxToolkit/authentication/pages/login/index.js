import React, { useState } from 'react';

export default function login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  console.log('formData', formData);
  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTableData((prevState) => [...prevState, formData]);
    setFormData({ email: '', password: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='inputField'>
        <label htmlFor='email'>Email</label>
        <input
          type='text'
          name='email'
          id='email'
          placeholder='Enter Email'
          value={formData.email}
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div className='inputField'>
        <label htmlFor='password'>Enter Password</label>
        <input
          type='password'
          name='password'
          id='password'
          placeholder='Enter Password'
          value={formData.password}
          onChange={(e) => handleChange(e)}
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  );
}
