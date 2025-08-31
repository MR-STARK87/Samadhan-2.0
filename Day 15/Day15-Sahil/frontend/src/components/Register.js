// frontend/src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // The proxy in package.json will direct this request to our backend
      const res = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      alert('Registration successful! Please log in.');
      navigate('/login'); // Redirect to login page after successful registration
    } catch (err) {
      alert('Error registering!');
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Register</h2>
      <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} required />
      <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} required />
      <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;