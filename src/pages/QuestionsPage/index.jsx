import React, { useEffect, useState } from 'react';
import { getAllQuestions } from '../../api';
import { useNavigate } from 'react-router-dom';
import './QuestionsPage.css';

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [limit, setLimit] = useState(5); // Default limit for pagination
  const [offset, setOffset] = useState(0); // Default offset for pagination
  const navigate = useNavigate();

  const getQuestions = async (limit_, offset_) => {
    try {
      const response = await getAllQuestions(limit_, offset_);
      setQuestions(response.data.paginatedData);
      setTotalPages(Math.ceil(response.data.totalCount / limit));
      setTotalQuestions(response.data.totalCount);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    getQuestions(limit, offset);
  }, [limit]);

  const handleQuestionClick = (id) => {
    navigate(`/coding-editor/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getQuestions(limit, (page - 1) * limit);
    setOffset((page - 1) * limit); // Update offset based on the current page
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    getQuestions(Number(event.target.value), offset);
    setCurrentPage(1); // Reset to the first page when limit changes
  };

  const handleViewSolution = (solution) => {
    setSelectedSolution(solution);
    setSelectedProblem(null); // Clear the problem description
  };

  const handleViewProblem = (description, sampleInput, sampleOutput) => {
    setSelectedSolution(null); // Clear the solution view
    setSelectedProblem({ description, sampleInput, sampleOutput }); // Set the problem description, sample input, and sample output
  };

  return (
    <div className="questions-page">
      <div className="questions-list">
        <h1 className="questions-title">Questions</h1>
        <div className="questions-summary">
          <p>Total Questions: {totalQuestions}</p>
          <div className="limit-dropdown">
            <label htmlFor="limit">Questions per page:</label>
            <select id="limit" value={limit} onChange={handleLimitChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
        </div>
        <table className="questions-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions && questions.length > 0 ? (
              questions.map((question) => (
                <tr key={question.id} className="question-row">
                  <td>{question.title}</td>
                  <td className={`difficulty ${question.difficulty.toLowerCase()}`}>{question.difficulty}</td>
                  <td>
                    <button className="view-button" onClick={() => handleViewSolution(question.solution)}>View Solution</button>
                    <button className="code-button" onClick={() => handleQuestionClick(question.id)}>Go to Code</button>
                    <button className="problem-button" onClick={() => handleViewProblem(question.description, question.sample_input, question.sample_output)}>View Problem</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-questions">No questions available.</td>
              </tr>
            )}
          </tbody>
        </table>
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
        {selectedProblem ? (
          <div>
            <p className="problem-description">{selectedProblem.description}</p>
            <h3>Sample Input</h3>
            <pre className="sample-input">{selectedProblem.sampleInput}</pre>
            <h3>Sample Output</h3>
            <pre className="sample-output">{selectedProblem.sampleOutput}</pre>
          </div>
        ) : selectedSolution ? (
          <pre className="solution-code">{selectedSolution}</pre>
        ) : (
          <p>Select a question to view its details.</p>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;