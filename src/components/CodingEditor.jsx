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
    try {
      const userFunction = new Function('nums', 'target', code);
      const logCollector = [];

      const testResults = testCases.map((testCase) => {
        const [nums, target] = testCase.input.match(/\d+/g).map(Number);
        const result = userFunction(nums, target);
        const passed = JSON.stringify(result) === testCase.expectedOutput;
        logCollector.push(
          `Test Case: Input: ${testCase.input}, Expected: ${testCase.expectedOutput}, Actual: ${JSON.stringify(result)}, Passed: ${passed ? '✅' : '❌'}`
        );
        return passed;
      });

      setLogs(logCollector);

      if (testResults.every((passed) => passed)) {
        alert('All test cases passed successfully!');
      } else {
        alert('Some test cases failed. Check the logs for details.');
      }
    } catch (error) {
      setLogs([`Error: ${error.message}`]);
      alert('Error executing code: ' + error.message);
    }
  };

  return (
    <div className="coding-editor">
      <div className="editor-container">
        <Editor
          height="70vh"
          defaultLanguage="javascript"
          value={starterCode} // Starter code is passed and not editable
          theme='vs-dark'
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