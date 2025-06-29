import React, { useEffect, useState } from 'react';
import { getAllQuestions } from '../../api';
import './QuestionsPage.css';

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [limit, setLimit] = useState(1); // Default limit for pagination
  const [offset, setOffset] = useState(0); // Default limit for pagination


  const getQuestions = async (limit_, offset_) => {
    try {
      const response = await getAllQuestions(limit_, offset_);
      setQuestions(response.data.paginatedData);
      setTotalPages(response.data.totalCount / limit);
      setTotalQuestions(response.data.totalCount );
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };


  useEffect(() => {
    getQuestions(limit, offset);
  }, [limit]);

  const handleQuestionClick = (solution) => {
    setSelectedSolution(solution);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getQuestions(limit, (page - 1) * limit);
    setOffset((page - 1) * limit); // Update offset based on the current page
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    getQuestions(Number(event.target.value),offset );

    setCurrentPage(1); // Reset to the first page when limit changes
  };

  return (
    <div className="questions-page">
      <div className="questions-list">
        <h1>Total Questions &nbsp; {totalQuestions}</h1>
      
        <table className="questions-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr
                key={question.id}
                className="question-row"
                onClick={() => handleQuestionClick(question.solution)}
              >
                <td>{question.title}</td>
                <td className={`difficulty ${question.difficulty.toLowerCase()}`}>{question.difficulty}</td>
                <td>
                  <button className="view-button">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
        <div className="limit-dropdown">
          <label htmlFor="limit">Questions per page:</label>
          <select id="limit" value={limit} onChange={handleLimitChange}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
          </select>
        </div>
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
        <h1>Solution</h1>
        {selectedSolution ? (
          <pre className="solution-code">{selectedSolution}</pre>
        ) : (
          <p>Select a question to view its solution.</p>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;