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

  const steps = problem?.steps
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
 
  console.log("Problem data:", problem);
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
        <header>
          <h1 className={styles["problem-title"]}>{problem.title}</h1>
          <div className={styles["problem-metadata"]}>
            <p className={styles["problem-difficulty"]}>
              <span>{problem.difficulty}</span>
            </p>
            <div className={styles["problem-dates"]}>
              <p className={styles["problem-date"]}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                </svg>
                <span>{new Date(problem.created_at).toLocaleDateString()}</span>
              </p>
              <p className={styles["problem-date"]}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                </svg>
                <span>{new Date(problem.updated_at).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
        </header>

        <div className={styles["problem-section"]}>
          <h2 className={styles["section-title"]}>Problem Description</h2>
          <p>{problem.description}</p>
        </div>

        {steps.steps_to_solve && (
          <div className={styles["problem-section"]}>
            <h2 className={styles["section-title"]}>Steps to Solve</h2>
            <ul className={styles["steps-list"]}>
              {steps.steps_to_solve.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {steps.edge_cases && (
          <div className={styles["problem-section"]}>
            <h2 className={styles["section-title"]}>Edge Cases to Consider</h2>
            <ul className={styles["edge-cases-list"]}>
              {steps.edge_cases.map((edge, index) => (
                <li key={index}>{edge}</li>
              ))}
            </ul>
          </div>
        )}

        {(steps.time_complexity_estimate || steps.space_complexity_estimate) && (
          <div className={styles["problem-section"]}>
            <h2 className={styles["section-title"]}>Complexity Analysis</h2>
            <div className={styles["complexity-info"]}>
              {steps.time_complexity_estimate && (
                <div className={styles["complexity-item"]}>
                  <span className={styles["complexity-label"]}>Time Complexity:</span>
                  <code className={styles["complexity-value"]}>{steps.time_complexity_estimate}</code>
                </div>
              )}
              {steps.space_complexity_estimate && (
                <div className={styles["complexity-item"]}>
                  <span className={styles["complexity-label"]}>Space Complexity:</span>
                  <code className={styles["complexity-value"]}>{steps.space_complexity_estimate}</code>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles["problem-section"]}>
          <h2 className={styles["section-title"]}>Sample Input/Output</h2>
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
