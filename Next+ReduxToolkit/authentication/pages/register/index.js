import React, { useEffect, useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [userData, setUserData] = useState([]);
  console.log('userData', userData);

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem('userList') || '[]'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = [...userData, formData];
    setUserData(updatedData);
    localStorage.setItem('userList', JSON.stringify(updatedData));
    setFormData({ email: '', password: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='inputField'>
        <label htmlFor='fName'>First Name</label>
        <input
          required
          type='text'
          name='firstName'
          id='fName'
          placeholder='Enter First Name'
          value={formData.firstName}
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div className='inputField'>
        <label htmlFor='lName'>Last Name</label>
        <input
          required
          type='text'
          name='lastName'
          id='lName'
          placeholder='Enter Last Name'
          value={formData.lastName}
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div className='inputField'>
        <label htmlFor='email'>Email</label>
        <input
          required
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
          required
          type='password'
          name='password'
          id='password'
          placeholder='Enter Password'
          value={formData.password}
          onChange={(e) => handleChange(e)}
        />
      </div>
      <button type='submit'>Register</button>
    </form>
  );
}
