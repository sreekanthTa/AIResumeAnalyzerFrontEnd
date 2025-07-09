import React from 'react';
import  styles from "./problemDetail.module.css"; // Assuming you have a CSS file for styling
const ProblemDetails = ({ selectedProblem, selectedSolution }) => {
    console.log("selectedProblem", selectedProblem);    
  if (selectedProblem) {
    return (
      <div>
        <p className={styles.problemDescription}>{selectedProblem.description}</p>
        <h3>Sample Input</h3>
        <pre className={styles.sampleInput}>{selectedProblem.sampleInput}</pre>
        <h3>Sample Output</h3>
        <pre className={styles.sampleOutput}>{selectedProblem.sampleOutput}</pre>
      </div>
    );
  } else if (selectedSolution) {
    return <pre className={styles.solutionCode}>{selectedSolution}</pre>;
  } else {
    return <p>Select a question to view its details.</p>;
  }
};

export default ProblemDetails;