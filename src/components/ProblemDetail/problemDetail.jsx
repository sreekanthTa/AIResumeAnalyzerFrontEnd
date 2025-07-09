import React from 'react';
import styles from './problemDetail.css'; // Assuming you have a CSS module for styles
const ProblemDetails = ({ selectedProblem, selectedSolution }) => {
    console.log("selectedProblem", selectedProblem);    
  if (selectedProblem) {
    return (
      <div>
        <p className="problem-description">{selectedProblem.description}</p>
        <h3>Sample Input</h3>
        <pre className="sample-input">{selectedProblem.sampleInput}</pre>
        <h3>Sample Output</h3>
        <pre className="sample-output">{selectedProblem.sampleOutput}</pre>
      </div>
    );
  } else if (selectedSolution) {
    return <pre className="solution-code">{selectedSolution}</pre>;
  } else {
    return <p>Select a question to view its details.</p>;
  }
};

export default ProblemDetails;