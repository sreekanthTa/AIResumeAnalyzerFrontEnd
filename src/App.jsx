import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import CodingEditorPage from './pages/CodingEditorPage';
import QuestionsPage from './pages/QuestionsPage';
import CodingPage from './pages/CodingPage';

const App = () => {

 
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/coding-editor/:id" element={<CodingEditorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
