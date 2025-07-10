import React from 'react';
import  styles from "./problemDetail.module.css"; // Assuming you have a CSS file for styling
const ProblemDetails = ({ selectedProblem, selectedSolution }) => {
    console.log("selectedProblem", selectedProblem);    
  if (selectedProblem) {
    return (
      <div>
        <h3 className={styles.problemDescription}>{selectedProblem.title}</h3>
        <p className={styles.problemDescription}>{selectedProblem.description}</p>
        <h3>Sample Input</h3>
        <pre className={styles.sampleInput}>{selectedProblem.sample_input}</pre>
        <h3>Sample Output</h3>
        <pre className={styles.sampleOutput}>{selectedProblem.sample_output}</pre>
        <h3>Solution</h3>
        <pre className={styles.solutionCode}>{selectedProblem.solution}</pre>
      </div>
        )
 
  } else {
    return <p>Select a question to view its details.</p>;
  }
};

export default ProblemDetails;