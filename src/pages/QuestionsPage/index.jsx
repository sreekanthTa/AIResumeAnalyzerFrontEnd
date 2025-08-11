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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [limit, setLimit] = useState(10); // Default limit for pagination
  const [offset, setOffset] = useState(0); // Default offset for pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const getQuestions = React.useCallback(async (limit_, offset_, search = "", difficulty_ = "", catgory_="") => {
    try {
      const response = await getAllQuestions(limit_, offset_, search, difficulty_, catgory_);
      setQuestions(response.data.paginatedData);
      setTotalPages(Math.ceil(response.data.totalCount / limit_));
      setTotalQuestions(response.data.totalCount);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }, []);

  const debounceFunc = React.useMemo(() => debounce(getQuestions, 700), [getQuestions]);

  React.useEffect(() => {
    debounceFunc(limit, offset, searchTerm, difficulty, category);
  }, [limit, offset, searchTerm, difficulty, category, debounceFunc]);

  const handleQuestionClick = (id) => {
    navigate(`/coding-editor/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getQuestions(limit, page  * limit, searchTerm);
    setOffset(page  * limit);
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
    // getQuestions(limit, 0, searchTerm, event.target.value, category);
    setOffset(0);
  };

  const handleCategoryChange =(event) => {
    setCategory(event.target.value);
    setCurrentPage(1);
    // getQuestions(limit, 0, searchTerm, event.target.value, category);
    setOffset(0);
  };

  return (
    <div className="questions-page">
      <div className="questions-list">
        <div className="questions-list-header">
          <div className="questions-list-title-group">
            <h2 className="questions-title">Coding Questions</h2>
            <span className="questions-range">Showing {offset + 1} - {Math.min(offset + limit, totalQuestions)} of {totalQuestions}</span>
          </div>
        </div>
        <div className="questions-search-bar beautify">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="questions-search"
          />
          <select value={difficulty} onChange={handleDifficultyChange} className="questions-difficulty-select">
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select value={category} onChange={handleCategoryChange} className="questions-difficulty-select">
            <option value="">All Categories</option>
            <option value="string">String</option>
            <option value="array">Array</option>
            <option value="linked_list">Linked List</option>
          </select>
        </div>
        <QuestionsTable
          questions={questions}
          handleViewSolution={handleViewSolution}
          handleQuestionClick={handleQuestionClick}
          handleViewProblem={handleViewProblem}
        />
        <div className='pagination-container'>
          <select id="limit" value={limit} onChange={handleLimitChange} className="questions-limit-select">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          <div className="pagination-buttons">
            <button className={currentPage === 0 ? 'disabled' : ''} onClick={() => handlePageChange(currentPage - 1)}>{'<'}</button>
            <button className={(offset + limit) >= totalQuestions ? 'disabled' : ''} onClick={() => handlePageChange(currentPage + 1)}>{'>'}</button>
          </div>
        </div>
      </div>
       
      <div className="solution-container">
        {(!selectedProblem && !selectedSolution) && <h1>Details</h1>}
        <ProblemDetails selectedProblem={selectedProblem} selectedSolution={selectedSolution} />
      </div>
    </div>
  );
};

export default QuestionsPage;