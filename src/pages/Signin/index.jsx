import React, { useState } from 'react';
import axios from 'axios';
import './Signin.css'; // Import the CSS file for styling

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignin = async (e) => {
    e.preventDefault();
    console.log('Credentials:', { email, password }); // Log credentials for debugging
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
        email,
        password,
      }, {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      console.log('Login successful:', response.data);
      // Handle successful login (e.g., redirect or show a success message)
    } catch (error) {
      console.error('Error during login:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Signin</h1>
        <form onSubmit={handleSignin} className="auth-form">
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
          <button type="submit" className="auth-button">Signin</button>
        </form>
        <div className="auth-footer">
          <p>
            Don't have an account? <a href="/signup" className="auth-link">Signup here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;