import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '../../store/authSlice';
import './Signin.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { signin } from '../../api';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    console.log('Credentials:', { email, password }); // Log credentials for debugging
    try {
      const response = await signin(email, password);

      console.log('Login successful:', response.data);
      // Dispatch the action to store the access token in Redux
      dispatch(setAccessToken(response.data.accessToken));
      if (response.data) {
        navigate('/'); // Redirect to the analyzer page after successful login
      }
      // Handle successful login (e.g., redirect or show a success message)
    } catch (error) {
      console.error('Error during login:', error);
      alert('Failed to sign in. Please check your credentials and try again.');
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <>
      <Navbar />
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
    </>
  );
};

export default Signin;