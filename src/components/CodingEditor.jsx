import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import './CodingEditor.css';

const CodingEditor = ({ starterCode, testCases }) => {
  const [code, setCode] = useState(starterCode || '// Write your JavaScript code here');
  const [logs, setLogs] = useState([]);
  const [questions] = useState([
    {
      question: 'What is a closure in JavaScript?',
      answer: 'A closure is a function that has access to its outer scope, even after the outer function has returned.',
    },
    {
      question: 'Explain event delegation in JavaScript.',
      answer: 'Event delegation is a technique where a single event listener is added to a parent element to handle events for its child elements.',
    },
  ]);
 
  const handleExecute = () => {
    const logCollector = [];
    const originalConsoleLog = console.log;
  
    try {
      // Override console.log to capture output for UI only
      console.log = (...args) => {
        logCollector.push(
          args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' ')
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
    <div className="coding-editor">
      <div className="editor-container">
        <Editor
          height="70vh"
          defaultLanguage="javascript"
          value={code} // Bind the editor value to the `code` state
          onChange={(newValue) => setCode(newValue)} // Update the `code` state on change
          theme="vs-dark"
          options={{
            // readOnly: true, // Make the editor read-only
            fontSize: 16,
            fontFamily: 'Fira Code, monospace',
            wordWrap: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            acceptSuggestionOnEnter: "on",
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            matchBrackets: "always",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            lineNumbers: "on",
            }}
            className="editor"

        />
      </div>
      <button onClick={handleExecute} className="execute-button">Execute Code</button>
      <div className="logs-container">
        <h3>Test Cases</h3>
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
      <div className="questions-container">
        <h2>Questions</h2>
        {questions.map((q, index) => (
          <div key={index} className="question">
            <h3>{q.question}</h3>
            <p>{q.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodingEditor;