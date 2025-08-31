import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      // Redirect or update UI
      alert('Login successful!');
    } catch (err) {
      alert('Error logging in!');
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} required />
      <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;