import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import './CodingEditor.css';

const CodingEditor = () => {
  const [code, setCode] = useState('// Write your JavaScript code here');
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
  const [defaultTestCases] = useState([
    {
      input: [1, 2, 3, 4, 5],
      expectedOutput: [1, 2, 3, 4, 5],
    },
    {
      input: [10, 15, 20, 25],
      expectedOutput: [10, 15, 20, 25],
    },
  ]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleExecute = () => {
    try {
      const userFunction = new Function('input', code);
      const logCollector = [];
    

      const testResults = defaultTestCases.map((testCase) => {
        const result = userFunction(testCase.input);
        const passed = result === testCase.expectedOutput;
        logCollector.push(
          `${passed ? '✅' : '❌'} Input: ${JSON.stringify(testCase.input)}, Expected: ${testCase.expectedOutput}, Actual: ${result}, `
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
          defaultValue={code}
          onChange={handleEditorChange}
          theme='vs-dark'
          options={{
            fontSize: 16,
            fontFamily: 'Fira Code, monospace',
            wordWrap: "on",
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