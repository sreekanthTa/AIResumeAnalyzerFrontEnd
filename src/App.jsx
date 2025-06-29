import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import CodingEditorPage from './pages/CodingEditorPage';
import QuestionsPage from './pages/QuestionsPage';
import CodingPage from './pages/CodingPage';
import Analyzer from './pages/Analyzer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/questions" element={<PrivateRoute><QuestionsPage /></PrivateRoute>} />
        <Route path="/coding" element={<PrivateRoute><CodingPage /></PrivateRoute>} />
        <Route path="/coding-editor/:id" element={<PrivateRoute><CodingEditorPage /></PrivateRoute>} />
        <Route path="/analyzer" element={<PrivateRoute><Analyzer /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
