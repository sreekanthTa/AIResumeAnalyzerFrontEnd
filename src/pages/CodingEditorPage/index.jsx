import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./CodingEditorPage.css";
import { getQuestionById } from "../../api"; // Adjust the import path as necessary
import { CodingEditor } from "../../components/CodingEditor/CodingEditor";

const CodingEditorPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(""); // Add missing state for code and setCode
  const [logs, setLogs] = useState([]); // Add missing state for logs

  useEffect(() => {
    const getProblem = async () => {
      try {
        const response = await getQuestionById(id);
        setProblem(response.data);
        setCode(
          response.data.starter_code || "// Write your JavaScript code here"
        ); // Set initial code
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

  // Ensure testCases is defined correctly
  const testCases = [
    {
      input: problem.sample_input,
      expectedOutput: problem.sample_output,
    },
  ];

  const handleExecute = () => {
    const logCollector = [];
    const originalConsoleLog = console.log;

    try {
      // Override console.log to capture output for UI only
      console.log = (...args) => {
        logCollector.push(
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ")
        );
        // Do NOT print to real console
      };

      const userFunction = new Function(code);
      const result = userFunction();

      if (result !== undefined) {
        logCollector.push(`Return: ${result}`);
      }

      setLogs(logCollector);
    } catch (error) {
      setLogs([`❌ Error: ${error.message}`]);
    } finally {
      console.log = originalConsoleLog; // Restore the original console
    }
  };

  return (
    <div className="coding-editor-page">
      <div className="problem-container">
        <h1 className="problem-title">{problem.title}</h1>
        <p className="problem-difficulty">
          Difficulty: <span>{problem.difficulty}</span>
        </p>
        <p className="problem-date">
          Created At:{" "}
          <span>{new Date(problem.created_at).toLocaleString()}</span>
        </p>
        <p className="problem-date">
          Updated At:{" "}
          <span>{new Date(problem.updated_at).toLocaleString()}</span>
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
          testCases={testCases}
          logs={logs} // Ensure logs are passed as a prop
        />

        <button onClick={handleExecute} className="execute-button">
          Execute Code
        </button>
        <div className="logs-container">
          {/* <h3>Logs</h3> */}
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodingEditorPage;
