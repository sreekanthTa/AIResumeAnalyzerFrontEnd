import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getAllQuestions } from '../../api';
import { useNavigate } from 'react-router-dom';
import './QuestionsPage.css';
import ProblemDetails from '../../components/ProblemDetail/problemDetail'; // Adjust the import path as necessary 
import QuestionsTable from '../../components/QuestionsTable';
import { debounce } from '../../utils/PrivateRoute';

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [limit, setLimit] = useState(10); // Default limit for pagination
  const [offset, setOffset] = useState(0); // Default offset for pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState('');
  const navigate = useNavigate();

  const getQuestions = React.useCallback(async (limit_, offset_, search = "", difficulty_ = "") => {
    try {
      const response = await getAllQuestions(limit_, offset_, search, difficulty_);
      setQuestions(response.data.paginatedData);
      setTotalPages(Math.ceil(response.data.totalCount / limit_));
      setTotalQuestions(response.data.totalCount);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }, []);

  const debounceFunc = React.useMemo(() => debounce(getQuestions, 700), [getQuestions]);

  React.useEffect(() => {
    debounceFunc(limit, offset, searchTerm, difficulty);
  }, [limit, offset, searchTerm, difficulty, debounceFunc]);

  const handleQuestionClick = (id) => {
    navigate(`/coding-editor/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getQuestions(limit, (page - 1) * limit, searchTerm);
    setOffset((page - 1) * limit);
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    getQuestions(Number(event.target.value), offset, searchTerm);
    setCurrentPage(1);
  };

  const handleViewSolution = (solution) => {
    setSelectedSolution(solution);
    setSelectedProblem(null); // Clear the problem description
  };

  const handleViewProblem = (question) => {
    setSelectedSolution(null); // Clear the solution view
    setSelectedProblem({...question}); // Set the problem description, sample input, and sample output
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
    setCurrentPage(1);
    getQuestions(limit, 0, searchTerm, event.target.value);
    setOffset(0);
  };

  return (
    <div className="questions-page">
      <div className="questions-list">
        <h1 className="questions-title">
          Questions: {offset} - {limit+offset}
          <span className="questions-total"> (Total: {totalQuestions})</span>
        </h1>
        <div className="questions-search-bar">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="questions-search"
          />
          <select value={difficulty} onChange={handleDifficultyChange} className="questions-difficulty-select">
            <option value="">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <span className="questions-count">
            Showing {questions.length} of {totalQuestions} questions
          </span>
          <select id="limit" value={limit} onChange={handleLimitChange} className="questions-limit-select">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        


        <QuestionsTable
          questions={questions}
          handleViewSolution={handleViewSolution}
          handleQuestionClick={handleQuestionClick}
          handleViewProblem={handleViewProblem}
        />
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="solution-container">
        <h1>Details</h1>
        <ProblemDetails selectedProblem={selectedProblem} selectedSolution={selectedSolution} />
      </div>
    </div>
  );
};

export default QuestionsPage;