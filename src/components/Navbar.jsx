import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearAccessToken } from '../store/authSlice';
import { logout } from '../api';

const Navbar = () => {
    const {accessToken} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = async() => {
        try {
            const response =await logout();

            // Logic to handle logout, e.g., clearing the access token
            dispatch(clearAccessToken({}));
            // Optionally redirect to home or login page
            // window.location.href = '/'; // Redirect to home page after logout
        } catch (error) {
            console.error('Logout failed:', error);
            // Handle logout error (e.g., show an error message)
        }
     


    }  

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/analyzer">Analyzer</Link>
        </li>
        <li className="navbar-item">
          <Link to="/coding-editor">Coding Editor</Link>
        </li>
        <li className="navbar-item">
          <Link to="/questions">Questions</Link>
        </li>
        {!accessToken ? <>
        <li className="navbar-item">
          <Link to="/signin">Signin</Link>
        </li>
        <li className="navbar-item">
          <Link to="/signup">Signup</Link>
        </li>
        </> : 
        <li className="navbar-item" onClick={handleLogout}>
        <Link to="/">Logout</Link>
      </li>}
      </ul>
    </nav>
  );
};

export default Navbar;