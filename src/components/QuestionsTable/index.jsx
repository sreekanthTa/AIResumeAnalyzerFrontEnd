import React from 'react';
import styles from "./questionsTable.module.css";
const QuestionsTable = ({ questions, handleViewSolution, handleQuestionClick, handleViewProblem }) => (
  <table className={styles.questionsTable}>
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
          <tr key={question.id} className={styles.questionRow}>
            <td className={styles.questionTitle}>{question.title}</td>
            <td className={`${styles.difficulty} ${styles[question.difficulty.toLowerCase()]}`}>{question.difficulty}</td>
            <td className={styles.actionButtons}>
              <button className={styles.viewButton} onClick={() => handleViewSolution(question.solution)}>View</button>
              <button className={styles.codeButton} onClick={() => handleQuestionClick(question.id)}>Code</button>
              <button className={styles.problemButton} onClick={() => handleViewProblem(question)}>Problem</button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="3" className={styles.noQuestions}>No questions available.</td>
        </tr>
      )}
    </tbody>
  </table>
);

export default QuestionsTable;