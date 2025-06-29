import React, { useState } from 'react';
import './Signup.css'; // Import the CSS file for styling
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // New state for name

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        name,
        email,
        password,
      });

      console.log('Signup successful:', response.data);
      // Handle successful signup (e.g., redirect or show a success message)
    } catch (error) {
      console.error('Error during signup:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Create Account</h1>
        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="auth-button">Signup</button>
        </form>
        <p className="auth-footer">
          Already have an account? <a href="/signin" className="auth-link">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;