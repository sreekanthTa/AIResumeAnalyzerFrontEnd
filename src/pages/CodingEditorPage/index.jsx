import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./CodingEditorPage.css";
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
        const { test_cases_used, meets_requirements, reasoning, issues_found, test_source } = response.data;
        setAiEval({
          meets_requirements,
          reasoning,
          issues_found,
          test_source,
        });
        if (Array.isArray(test_cases_used)) {
          setTestResults(test_cases_used);
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
    <div className="coding-editor-page">
      <div className="problem-container">
        <h1 className="problem-title">{problem.title}</h1>
        <p className="problem-difficulty">
          Difficulty: <span>{problem.difficulty}</span>
        </p>
        <p className="problem-date">
          Created At: <span>{new Date(problem.created_at).toLocaleString()}</span>
        </p>
        <p className="problem-date">
          Updated At: <span>{new Date(problem.updated_at).toLocaleString()}</span>
        </p>
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
          height={"75vh"}
          code={code}
          setCode={setCode}
          logs={logs}

        />

        <button onClick={handleExecute} className="execute-button">
          Execute Code
        </button>



        {/* AI Evaluation Summary UI */}
        {(aiEval.meets_requirements || aiEval.reasoning || (aiEval.issues_found && aiEval.issues_found.length > 0) || aiEval.test_source) && (
          <div className="ai-eval-summary" style={{
            marginTop: 28,
            marginBottom: 24,
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            background: '#f8fafc',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
            padding: '20px 24px',
            maxWidth: 900
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 16, marginRight: 16 }}>AI Evaluation</span>
              {aiEval.meets_requirements && (
                <span style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  borderRadius: 16,
                  fontWeight: 600,
                  fontSize: 14,
                  color: aiEval.meets_requirements === 'YES' ? '#389e0d' : '#cf1322',
                  background: aiEval.meets_requirements === 'YES' ? '#d9f7be' : '#fff1f0',
                  border: aiEval.meets_requirements === 'YES' ? '1px solid #b7eb8f' : '1px solid #ffa39e',
                  marginLeft: 0
                }}>
                  {aiEval.meets_requirements === 'YES' ? 'Meets Requirements' : 'Does Not Meet Requirements'}
                </span>
              )}
            </div>
            {aiEval.reasoning && (
              <div style={{ marginBottom: 10 }}>
                <strong>Reasoning:</strong>
                <div style={{
                  background: '#f3f4f6',
                  borderRadius: 4,
                  padding: '8px 12px',
                  marginTop: 4,
                  fontSize: 14,
                  color: '#333',
                  whiteSpace: 'pre-wrap',
                }}>{aiEval.reasoning}</div>
              </div>
            )}
            {aiEval.issues_found && aiEval.issues_found.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <strong>Issues Found:</strong>
                <ul style={{
                  margin: '6px 0 0 18px',
                  padding: 0,
                  fontSize: 14,
                  color: '#d4380d',
                }}>
                  {aiEval.issues_found.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            {aiEval.test_source && (
              <div style={{ marginBottom: 0 }}>
                <strong>Test Source:</strong> <span style={{ color: '#1677ff', wordBreak: 'break-all' }}>{aiEval.test_source}</span>
              </div>
            )}
          </div>
        )}

        {/* Test Case Results UI */}
        <div className="test-cases-results" style={{ marginTop: "0px" }}>
          {testResults.length > 0 && (
            <>
              <h3 style={{ fontWeight: 600, fontSize: "1.2rem", marginBottom: 12 }}>Test Case Results</h3>
              <div style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                overflow: "hidden",
                background: "#fafbfc",
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
              }}>
                {testResults.map((tc, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      borderBottom: i !== testResults.length - 1 ? "1px solid #e5e7eb" : "none",
                      padding: "16px 20px",
                      background: tc.passed ? "#f6ffed" : "#fff1f0",
                      transition: "background 0.2s",
                    }}
                  >
                    <div style={{ flex: 2, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#555" }}><strong>Input:</strong></div>
                      <pre style={{
                        background: "#f3f4f6",
                        borderRadius: 4,
                        padding: "6px 10px",
                        margin: 0,
                        fontSize: 13,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all"
                      }}>{tc.input}</pre>
                    </div>
                    <div style={{ flex: 2, minWidth: 0, marginLeft: 16 }}>
                      <div style={{ fontSize: 13, color: "#555" }}><strong>Expected:</strong></div>
                      <pre style={{
                        background: "#f3f4f6",
                        borderRadius: 4,
                        padding: "6px 10px",
                        margin: 0,
                        fontSize: 13,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all"
                      }}>{tc.expected_output}</pre>
                    </div>
                    <div style={{ flex: 2, minWidth: 0, marginLeft: 16 }}>
                      <div style={{ fontSize: 13, color: "#555" }}><strong>Actual:</strong></div>
                      <pre style={{
                        background: "#f3f4f6",
                        borderRadius: 4,
                        padding: "6px 10px",
                        margin: 0,
                        fontSize: 13,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all"
                      }}>{tc.actual_output}</pre>
                    </div>
                    <div style={{ flex: 1, minWidth: 0, marginLeft: 16, display: "flex", alignItems: "center" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: 16,
                        fontWeight: 600,
                        fontSize: 13,
                        color: tc.passed ? "#389e0d" : "#cf1322",
                        background: tc.passed ? "#d9f7be" : "#fff1f0",
                        border: tc.passed ? "1px solid #b7eb8f" : "1px solid #ffa39e",
                        marginLeft: 0
                      }}>
                        {tc.passed ? "Passed" : "Failed"}
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
