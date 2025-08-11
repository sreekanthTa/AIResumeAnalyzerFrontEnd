import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import styles from "./CodingEditorPage.module.css";
import { getQuestionById } from "../../api"; // Adjust the import path as necessary
import { CodingEditor } from "../../components/CodingEditor/CodingEditor";
import axios from "axios";

const CodingEditorPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(""); // State for code and setCode
  const [logs, setLogs] = useState([]); // State for logs
  const [testResults, setTestResults] = useState([]); // Store individual test case results
  const [aiEval, setAiEval] = useState({
    meets_requirements: null,
    reasoning: '',
    issues_found: [],
    test_source: '',
  });
  const workerRef = React.useRef(null);

  const editorRef = React.useRef(null);

  // Callback to get the editor instance
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }
  

  // Load WebWorker
  useEffect(() => {
    workerRef.current = new Worker("/worker.js");

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    const getProblem = async () => {
      try {
        const response = await getQuestionById(id);
        setProblem(response.data);
        setCode(
          response.data.starter_code || "// Write your JavaScript code here"
        );
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    if (id) {
      getProblem();
    }
  }, [id]);

  if (!problem) {
    return <div>Loading...</div>;
  }
 
  
  const handleExecute = () => {
    setTestResults([]); // Clear previous results
    setLogs([]); // Clear logs if you want

    // Send the code to the backend for AI Evaluation
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/test_cases/evaluate/${id}`, {
        code: code, // The code to be executed
      })
      .then((response) => {
        console.log("Response from backend:", response.data);
        const { test_cases_used, meets_requirements, reasoning, issues_found, test_source, test_results } = response.data;
        setAiEval({
          meets_requirements,
          reasoning,
          issues_found,
          test_source,
        });
        if (Array.isArray(test_results)) {
          setTestResults(test_results.map(result => ({
            input: result.input,
            expected: result.expected,
            actual: result.actual,
            passed: result.passed
          })));
        } else {
          setTestResults([]);
        }
      })
      .catch((error) => {
        console.error("Error executing code:", error);
        setLogs((prevLogs) => [...prevLogs, "Error executing code"]);
      });

 
  };


  return (
    <div className={styles["coding-editor-page"]}>
      <div className={styles["problem-container"]}>
        <h1 className={styles["problem-title"]}>{problem.title}</h1>
        <p className={styles["problem-difficulty"]}>
          Difficulty: <span>{problem.difficulty}</span>
        </p>
        <p className={styles["problem-date"]}>
          Created At: <span>{new Date(problem.created_at).toLocaleString()}</span>
        </p>
        <p className={styles["problem-date"]}>
          Updated At: <span>{new Date(problem.updated_at).toLocaleString()}</span>
        </p>
        <p className={styles["problem-description"]}>{problem.description}</p>
        <h2 className={styles["problem-question"]}>Question</h2>
        <p>{problem.question}</p>
        <h2 className={styles["problem-sample"]}>Sample Input/Output</h2>
        <table className={styles["sample-table"]}>
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

      <div className={styles["editor-container"]}>
        <CodingEditor
          height={"75vh"}
          code={code}
          setCode={setCode}
          logs={logs}

        />

        <button onClick={handleExecute} className={styles["execute-button"]}>
          Execute Code
        </button>



        {/* AI Evaluation Summary UI */}
        {(aiEval.meets_requirements || aiEval.reasoning || (aiEval.issues_found && aiEval.issues_found.length > 0) || aiEval.test_source) && (
          <div className={styles["ai-eval-summary"]}>
            <div className={styles["ai-eval-header"]}>
              <span className={styles["ai-eval-title"]}>AI Evaluation</span>
              {aiEval.meets_requirements && (
                <span className={
                  aiEval.meets_requirements === 'YES'
                    ? styles["ai-eval-badge"] + ' ' + styles["ai-eval-badge-pass"]
                    : styles["ai-eval-badge"] + ' ' + styles["ai-eval-badge-fail"]
                }>
                  {aiEval.meets_requirements === 'YES' ? 'Meets Requirements' : 'Does Not Meet Requirements'}
                </span>
              )}
            </div>
            {aiEval.reasoning && (
              <div className={styles["ai-eval-reasoning"]}>
                <strong>Reasoning:</strong>
                <div className={styles["ai-eval-reasoning-text"]}>{aiEval.reasoning}</div>
              </div>
            )}
            {aiEval.issues_found && aiEval.issues_found.length > 0 && (
              <div className={styles["ai-eval-issues"]}>
                <strong>Issues Found:</strong>
                <ul className={styles["ai-eval-issues-list"]}>
                  {aiEval.issues_found.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            {aiEval.test_source && (
              <div className={styles["ai-eval-source"]}>
                <strong>Test Source:</strong> <span className={styles["ai-eval-source-link"]}>{aiEval.test_source}</span>
              </div>
            )}
          </div>
        )}

        {/* Test Case Results UI */}
        <div className={styles["test-cases-results"]}>
          {testResults.length > 0 && (
            <>
              <h3 className={styles["test-cases-title"]}>Test Case Results</h3>
              <div className={styles["test-cases-list"]}>
                {testResults.map((tc, i) => (
                  <div
                    key={i}
                    className={
                      styles["test-case-row"] + ' ' + (tc.passed ? styles["test-case-pass"] : styles["test-case-fail"]) + (i !== testResults.length - 1 ? ' ' + styles["test-case-row-border"] : '')
                    }
                  >
                    <div className={styles["test-case-col"] + ' ' + styles["test-case-col-input"]}>
                      <div className={styles["test-case-label"]}><strong>Input:</strong></div>
                      <pre className={styles["test-case-pre"]}>{tc.input}</pre>
                    </div>
                    <div className={styles["test-case-col"] + ' ' + styles["test-case-col-expected"]}>
                      <div className={styles["test-case-label"]}><strong>Expected:</strong></div>
                      <pre className={styles["test-case-pre"]}>{tc.expected}</pre>
                    </div>
                    <div className={styles["test-case-col"] + ' ' + styles["test-case-col-actual"]}>
                      <div className={styles["test-case-label"]}><strong>Actual:</strong></div>
                      <pre className={styles["test-case-pre"]}>{tc.actual}</pre>
                    </div>
                    <div className={styles["test-case-col"] + ' ' + styles["test-case-col-status"]}>
                      <span className={
                        tc.passed ? styles["test-case-badge"] + ' ' + styles["test-case-badge-pass"] : styles["test-case-badge"] + ' ' + styles["test-case-badge-fail"]
                      }>
                        {tc.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* <div className="logs-container">
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default CodingEditorPage;
