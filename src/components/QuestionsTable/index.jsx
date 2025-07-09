import React from 'react';

const QuestionsTable = ({ questions, handleViewSolution, handleQuestionClick, handleViewProblem }) => (
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
            <td className="question-title">{question.title}</td>
            <td className={`difficulty ${question.difficulty.toLowerCase()}`}>{question.difficulty}</td>
            <td className="action-buttons">
              <button className="view-button" onClick={() => handleViewSolution(question.solution)}>View</button>
              <button className="code-button" onClick={() => handleQuestionClick(question.id)}>Code</button>
              <button className="problem-button" onClick={() => handleViewProblem(question)}>Problem</button>
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
);

export default QuestionsTable;