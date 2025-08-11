import React from 'react';
import styles from "./problemDetail.module.css";

const ProblemDetails = ({ selectedProblem, selectedSolution }) => {
  if (selectedProblem) {
    return (
      <div className={styles.problemContainer}>
        <header className={styles.problemHeader}>
          <h1 className={styles.problemTitle}>{selectedProblem.title}</h1>
          {selectedProblem.difficulty && (
            <span className={`${styles.difficultyBadge} ${styles[`difficulty-${selectedProblem.difficulty.toLowerCase()}`]}`}>
              {selectedProblem.difficulty}
            </span>
          )}
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Problem Description</h2>
          <p className={styles.description}>{selectedProblem.description}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Sample Input/Output</h2>
          <div className={styles.sampleContainer}>
            <div className={styles.sampleBox}>
              <h3 className={styles.sampleTitle}>Input</h3>
              <pre className={styles.sampleContent}>{selectedProblem.sample_input}</pre>
            </div>
            <div className={styles.sampleBox}>
              <h3 className={styles.sampleTitle}>Output</h3>
              <pre className={styles.sampleContent}>{selectedProblem.sample_output}</pre>
            </div>
          </div>
        </section>

        {selectedProblem.solution && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Solution</h2>
            <pre className={styles.solutionCode}>{selectedProblem.solution}</pre>
          </section>
        )}
      </div>
    )
 
  } else {
    return <p>Select a question to view its details.</p>;
  }
};

export default ProblemDetails;