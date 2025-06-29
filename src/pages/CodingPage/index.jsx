import React from "react";
import { CodingEditor } from "../../components/CodingEditor/CodingEditor";
import "./CodingPage.css";
const CodingPage = () => {
  const [code, setCode] = React.useState("// Write your JavaScript code here");
  const [logs, setLogs] = React.useState([]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const logCollector = [];
      const originalConsoleLog = console.log;

      try {
        // Override console.log to capture output for UI
        console.log = (...args) => {
          logCollector.push(
            args
              .map((arg) =>
                typeof arg === "object" ? JSON.stringify(arg) : String(arg)
              )
              .join(" ")
          );
        };

        const userFunction = new Function(code);
        const result = userFunction();

        if (result !== undefined) {
          logCollector.push(`Return: ${result}`);
        }

        setLogs(logCollector);
      } catch (error) {
        setLogs([`Error: ${error.message}`]);
      } finally {
        console.log = originalConsoleLog; // Restore original console
      }
    }, 1000); // Execute code 1 second after typing stops

    return () => clearTimeout(timeoutId); // Clear timeout on cleanup
  }, [code]);

  return (
    <div className="coding-page">
      <div className="coding-left">
        <h1 className="coding-heading">Online JavaScript Compiler</h1>
        <CodingEditor height={"80vh"} code={code} setCode={setCode} />
      </div>
      <div className="coding-right">
        <h2>Logs</h2>
        <div>
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodingPage;
