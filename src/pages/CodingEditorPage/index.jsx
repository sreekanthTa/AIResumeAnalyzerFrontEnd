import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./CodingEditorPage.css";
import { getQuestionById } from "../../api"; // Adjust the import path as necessary
import { CodingEditor } from "../../components/CodingEditor/CodingEditor";

const CodingEditorPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(""); // State for code and setCode
  const [logs, setLogs] = useState([]); // State for logs
  const [testResults, setTestResults] = useState([]); // Store individual test case results
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
    const results = [];

    setTestResults([]); // Clear previous results
    setLogs([]); // Clear logs if you want

    let index = 0;

    const runTest = () => {
      if (index >= problem.test_cases?.length) {
        setTestResults(results); // Save results to state for UI
        setLogs(results); // Optionally also show logs in logs section
        return;
      }

      const test_case = problem.test_cases[index];

      let parsedInput = test_case.input;
      let parsedOutput = test_case.output;

      try {
        parsedInput = JSON.parse(parsedInput);
      } catch {}

      try {
        parsedOutput = JSON.parse(parsedOutput);
      } catch {}

      workerRef.current.onmessage = (e) => {
        const { result, error } = e?.data;
        console.log("srdtfyg", parsedInput,parsedOutput)

        if (error) {
          results.push(`❌ Error: ${error}`);
        } else {
          const passed = JSON.stringify(result) === JSON.stringify(parsedOutput);
          results.push(
            `${JSON.stringify(result)} ${passed ? "✅" : "❌"}`
          );
        }

        index++;
        runTest();
      };

      workerRef.current.postMessage({ code, input: parsedInput });
    };

    runTest();
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

        <div className="test-cases" style={{ marginTop: "20px" }}>
          {problem.test_cases?.map((e, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "20px",
                borderBottom: "1px solid #ddd",
                padding: "8px 0",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 2 }}>
                <strong>Input:</strong> {e?.input}
              </div>
              <div style={{ flex: 2 }}>
                <strong>Expected:</strong> {e?.output}
              </div>
              <div style={{ flex: 3 }}>
                <strong>Result:</strong> {testResults[i] || "Not run yet"}
              </div>
            </div>
          ))}
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
