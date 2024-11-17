import { createUser } from '../../api/user';
import React, { useState } from 'react';

const Register = () => {
  const [user, setUser] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(user);
      console.log('User created:', response);
      // Add any further action on successful creation (e.g., redirect or show message)
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="userName" value={user.userName} onChange={handleChange} placeholder="Username" />
      <input name="firstName" value={user.firstName} onChange={handleChange} placeholder="First Name" />
      <input name="lastName" value={user.lastName} onChange={handleChange} placeholder="Last Name" />
      <input name="email" value={user.email} onChange={handleChange} placeholder="Email" />
      <input name="password" type="password" value={user.password} onChange={handleChange} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;