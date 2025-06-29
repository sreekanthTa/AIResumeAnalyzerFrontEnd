import { Editor } from "@monaco-editor/react";
import React from "react";


export const CodingEditor = ({height, code, setCode}) => {
  return (
    <Editor
    height={height} // Set the height of the editor, defaulting to 70vh if not provided
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
  );
}