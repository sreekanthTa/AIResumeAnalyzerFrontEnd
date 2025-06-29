import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import CodingEditor from '../../components/CodingEditor';
import './CodingEditorPage.css';
import { getQuestionById } from '../../api'; // Adjust the import path as necessary

const CodingEditorPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    const getProblem = async () => {
      try {
        const response = await getQuestionById(id);
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };

    if (id) {
      getProblem();
    }
  }, [id]);

  if (!problem) {
    return <div>Loading...</div>;
  }

  const testCases = [
    {
      input: problem.sample_input,
      expectedOutput: problem.sample_output,
    },
  ];

  return (
    <div className="coding-editor-page">
      <div className="problem-container">
        <h1 className="problem-title">{problem.title}</h1>
        <p className="problem-difficulty">Difficulty: <span>{problem.difficulty}</span></p>
        <p className="problem-date">Created At: <span>{new Date(problem.created_at).toLocaleString()}</span></p>
        <p className="problem-date">Updated At: <span>{new Date(problem.updated_at).toLocaleString()}</span></p>
        <p className="problem-description">{problem.description}</p>
        <h2 className="problem-question">Question</h2>
        <p>{problem.question}</p>
        <h2 className="problem-sample">Sample Input/Output</h2>
        <table className="sample-table">
          <thead>
            <tr>
              <th>Input</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{problem.sample_input}</td>
              <td>{problem.sample_output}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="editor-container">
        <CodingEditor 
        starterCode={problem.starter_code} 
        testCases={testCases}
        />
      </div>
    </div>
  );
};

export default CodingEditorPage;