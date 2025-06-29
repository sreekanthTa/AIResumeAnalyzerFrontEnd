import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import axios from 'axios';

// Configure Axios to include cookies in all requests
axios.defaults.withCredentials = true;

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
        const refreshResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`, {}, {
          withCredentials: true, // Ensure cookies are sent
        });

        // Update Axios headers with the new access token
        const newToken = refreshResponse.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Handle refresh token failure (e.g., redirect to login)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
