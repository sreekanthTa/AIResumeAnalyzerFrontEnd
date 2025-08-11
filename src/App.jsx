import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import CodingEditorPage from './pages/CodingEditorPage';
import QuestionsPage from './pages/QuestionsPage';
import CodingPage from './pages/CodingPage';
import Analyzer from './pages/Analyzer';
import PrivateRoute from './utils/PrivateRoute';
import { refreshToken } from './api';
import { setAccessToken } from './store/authSlice';
import store from './store';

const App = () => {

  // Add logic to refresh token on page load
useEffect(() => {
  const refreshAccessToken = async () => {
    try {
      const response = await refreshToken();
      const accessToken = response.data.accessToken;
      store.dispatch(setAccessToken(accessToken));
    } catch (error) {
      console.error('Error refreshing token on page load:', error);
      store.dispatch(setAccessToken(null));
      window.location.href = '/signin';
    }
  };

  // refreshAccessToken();
}, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        {/* <Route path="/questions" element={<PrivateRoute><QuestionsPage /></PrivateRoute>} />
        <Route path="/coding" element={<PrivateRoute><CodingPage /></PrivateRoute>} />
        <Route path="/coding-editor/:id" element={<PrivateRoute><CodingEditorPage /></PrivateRoute>} />
        <Route path="/analyzer" element={<PrivateRoute><Analyzer /></PrivateRoute>} /> */}
         <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/coding-editor/:id" element={<CodingEditorPage />} />
        <Route path="/analyzer" element={<Analyzer />} />
      </Routes>
    </Router>
  );
};

export default App;
