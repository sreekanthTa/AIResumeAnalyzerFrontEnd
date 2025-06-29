import React, { useState } from 'react';
import './Signup.css'; // Import the CSS file for styling
import { signup } from '../../api';
import Navbar from '../../components/NavBar/Navbar';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // New state for name

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(name, email, password);
      console.log('Signup successful:', response.data);
      alert('Account created successfully! You can now sign in.');
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Failed to sign up. Please try again later.');
    }
  };

  return (
    <>
      <Navbar />
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
    </>
  );
};

export default Signup;