import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store';
import { refreshToken } from './api';
import { setAccessToken } from './store/authSlice';

// Global variable to store the access token in memory
let accessToken = null;

// Add Axios interceptor for token management
axios.interceptors.request.use((config) => {
  // Attach the access token to the Authorization header if available
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Add Axios interceptor for token refresh
axios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call the refresh token endpoint
        const refreshResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {}, {
          withCredentials: true, // Ensure cookies are sent
        });

        // Update the access token in memory
        accessToken = refreshResponse.data.accessToken;

        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Handle refresh token failure (e.g., redirect to login)
        // Optionally, you can dispatch an action to clear the access token in Redux
        store.dispatch(setAccessToken(null)); // Clear access token in Redux store
        // Redirect to login page
        window.location.href = '/signin'; // Redirect to signin page
        // Return a rejected promise to propagate the error 
        return Promise.reject(refreshError);

      }
    }

    return Promise.reject(error);
  }
);

// Refresh token on page load
const refreshAccessToken = async () => {
  try {
    const response = await refreshToken();
    const newAccessToken = response.data.accessToken;
    accessToken = newAccessToken; // Update the global variable
    store.dispatch(setAccessToken(newAccessToken));
    console.log('Access token refreshed:', newAccessToken);
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    // Optionally, redirect to login if refresh fails
    window.location.href = '/signin'; // Redirect to signin page
  }
};

refreshAccessToken();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
