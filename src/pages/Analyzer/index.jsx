import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiUpload, FiFileText, FiRefreshCw, FiMessageSquare, FiCopy, FiCheck, FiAlertCircle, FiMessageCircle } from 'react-icons/fi';
import  "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Navbar from '../../components/Navbar';
import { analyzeResume, rewriteResume, getInterviewQuestions, chatWithAI } from '../../api';

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

const Analyzer = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isGettingQuestions, setIsGettingQuestions] = useState(false);
  const [activeResult, setActiveResult] = useState(null); // 'analysis', 'rewrite', 'questions', 'chat', or null
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [rewrittenResume, setRewrittenResume] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [copiedAnalysis, setCopiedAnalysis] = useState(false);
  const [copiedRewrite, setCopiedRewrite] = useState(false);
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // New state for chat visibility
  const fileInputRef = useRef(null);

  const clearResults = () => {
    setResult(null);
    setRewrittenResume(null);
    setQuestions(null);
    setActiveResult(null);
    setError(null);
    setIsChatOpen(false); // Also close chat when clearing results
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  const handleFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setFile(file);
      clearResults();
    } else {
      setError('Please upload a PDF file');
      setFile(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    clearResults(); // Clear all existing results and close chat

    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (description) {
        formData.append('description', description);
      }

      const { data } = await analyzeResume(formData);
      
      setResult(data?.result);
      setActiveResult('analysis');
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
      console.error('Analysis error:', err.response?.data || err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRewrite = async () => {
    if (!file) return;

    setIsRewriting(true);
    clearResults(); // Clear all existing results and close chat

    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (description) {
        formData.append('description', description);
      }

      const { data } = await rewriteResume(formData);
      
      setRewrittenResume(data?.rewrittenResume);
      setActiveResult('rewrite');
    } catch (err) {
      setError('Failed to rewrite resume. Please try again.');
      console.error('Rewrite error:', err.response?.data || err.message);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleGetQuestions = async () => {
    if (!description) {
      setError('Please provide a job description to get questions');
      return;
    }

    setIsGettingQuestions(true);
    clearResults(); // Clear all existing results and close chat

    try {
      const response = await getInterviewQuestions(description);
      const responseData = response.data;

      if (typeof responseData === 'string') {
        setQuestions(responseData);
      } else if (responseData && typeof responseData === 'object') {
        if (responseData.questions) {
          setQuestions(responseData.questions);
        } else if (responseData.result) {
          setQuestions(responseData.result);
        } else {
          throw new Error('Invalid response format from server');
        }
      }
      setActiveResult('questions');
    } catch (err) {
      console.error('Questions error:', err);
      setError('Failed to get questions. Please try again.');
    } finally {
      setIsGettingQuestions(false);
    }
  };

  const handleChatToggle = () => {
    clearResults(); // Clear any existing results and activeResult
    setIsChatOpen(prev => !prev); // Toggle chat visibility
    if (!isChatOpen) {
      setActiveResult('chat'); // Set activeResult to chat when opening chat
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    switch(type) {
      case 'analysis':
        setCopiedAnalysis(true);
        setTimeout(() => setCopiedAnalysis(false), 2000);
        break;
      case 'rewrite':
        setCopiedRewrite(true);
        setTimeout(() => setCopiedRewrite(false), 2000);
        break;
      case 'questions':
        setCopiedQuestions(true);
        setTimeout(() => setCopiedQuestions(false), 2000);
        break;
    }
  };

  const  [messages, setMessages] = React.useState([
    {role:"assistant", content:"Hello my friend"},
  ])

const handleSend = async (message) => {
  console.log('Message sent:', message);

  const newMessage = { role: "user", content: message };
  const updatedMessages = [...messages, newMessage];
  setMessages(updatedMessages);

  try {
    const response = await chatWithAI(updatedMessages, description || "test");
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let fullResponse = "";
    const botMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, botMessage]); // Initial empty assistant message

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
    console.log("repoasd",chunk)

      const lines = chunk.split("\n").filter((line) => line.trim() !== "");

      for (const line of lines) {
        if (line.startsWith("data:")) {
          const token = line.replace("data: ", "").trim();
          if (token === "[DONE]") break;

          if(token?.startsWith("'")){
            fullResponse += token ;

          }else{
            fullResponse += " " + token  ;

          }

          // Update the last assistant message with streamed content
          setMessages((prevMessages) => {
            const updated = [...prevMessages];
            const last = updated[updated.length - 1];
            if (last.role === "assistant") {
              last.content = fullResponse;
            }
            return [...updated];
          });
        }
      }
    }
  } catch (error) {
    console.error("Error streaming response:", error);
    alert("Failed to get response from server");
  }
};



  return (
    <div className="analyzer-page">
      <Navbar />
      <div className="analyzer-container">
        <div className="analyzer-content">
          <div className="analyzer-header">
            <h1 className="analyzer-title">Resume Analysis & Optimization</h1>
            <p className="analyzer-subtitle">
              Upload your resume to get AI-powered analysis, optimization suggestions, and personalized interview questions.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="jobDescription" className="form-label">
              Job Description (Optional)
              <span className="form-hint">Add a job description to get more targeted feedback</span>
            </label>
            <textarea
              id="jobDescription"
              className="job-description-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste the job description here to get tailored analysis and interview questions..."
              rows={4}
            />
          </div>

          <div
            className={`upload-area ${isDragging ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf"
              className="hidden"
            />
            <FiUpload className="upload-icon" />
            <div className="upload-text">
              {file ? file.name : 'Drag & drop your resume here'}
            </div>
            <p className="upload-hint">Only PDF files are supported</p>
          </div>


          <div className="button-grid">
            <button
              className="analyzer-button"
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing || isChatOpen}
            >
              {isAnalyzing ? (
                <>
                  <div className="loading-spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FiFileText />
                  Analyze Resume
                </>
              )}
            </button>

            <button
              className="analyzer-button"
              onClick={handleRewrite}
              disabled={!file || isRewriting || isChatOpen}
            >
              {isRewriting ? (
                <>
                  <div className="loading-spinner" />
                  Rewriting...
                </>
              ) : (
                <>
                  <FiRefreshCw />
                  Optimize Resume
                </>
              )}
            </button>

            <button
              className="analyzer-button"
              onClick={handleGetQuestions}
              disabled={!description || isGettingQuestions || isChatOpen}
            >
              {isGettingQuestions ? (
                <>
                  <div className="loading-spinner" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <FiMessageSquare />
                  Get Interview Questions
                </>
              )}
            </button>

            <button
              className="analyzer-button analyzer-button-secondary"
              onClick={handleChatToggle}
            >
              <FiMessageCircle />
              {isChatOpen ? 'Close Chat' : 'Open Chat'}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <FiAlertCircle />
              {error}
            </div>
          )}

          {isChatOpen && ( // Conditionally render chat when isChatOpen is true
            <div style={{ height: "500px" }}>
              <MainContainer>
                <ChatContainer>
                  <MessageList>
                    {messages?.map((e, index) => (
                      <Message
                        key={index}
                        model={{
                          message: e?.content,
                          sentTime: "just now",
                          sender: e?.role === "user" ? "You" : "AI",
                          direction: e?.role === "user" ? "outgoing" : "incoming",
                        }}
                      />
                    ))}
                  </MessageList>
                  <MessageInput placeholder="Type message here" onSend={handleSend} />
                </ChatContainer>
              </MainContainer>
            </div>
          )}

          {!isChatOpen && activeResult === 'analysis' && result && (
            <div className="result-container">
              <div className="result-header">
                <h2>Analysis Results</h2>
                <button
                  className="copy-button"
                  onClick={() => handleCopy(result, 'analysis')}
                  title="Copy to clipboard"
                >
                  {copiedAnalysis ? <FiCheck /> : <FiCopy />}
                  {copiedAnalysis ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div 
                className="analysis-result"
                dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '') }}
                // dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>') }}
              />
            </div>
          )}

          {!isChatOpen && activeResult === 'rewrite' && rewrittenResume && (
            <div className="result-container">
              <div className="result-header">
                <h2>Optimized Resume</h2>
                <button
                  className="copy-button"
                  onClick={() => handleCopy(rewrittenResume, 'rewrite')}
                  title="Copy to clipboard"
                >
                  {copiedRewrite ? <FiCheck /> : <FiCopy />}
                  {copiedRewrite ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div 
                className="rewritten-content"
                dangerouslySetInnerHTML={{ __html: rewrittenResume.replace(/\n/g, '') }}
                // dangerouslySetInnerHTML={{ __html: rewrittenResume.replace(/\n/g, '<br/>') }}
              />
            </div>
          )}

          {!isChatOpen && activeResult === 'questions' && questions && (
            <div className="result-container">
              <div className="result-header">
                <h2>Interview Questions</h2>
                <button
                  className="copy-button"
                  onClick={() => handleCopy(Array.isArray(questions) ? questions.join('\n\n') : questions, 'questions')}
                  title="Copy to clipboard"
                >
                  {copiedQuestions ? <FiCheck /> : <FiCopy />}
                  {copiedQuestions ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="questions-content">
                {Array.isArray(questions) ? (
                  questions.map((question, index) => (
                    <div 
                      key={index} 
                      className="question-container"
                      dangerouslySetInnerHTML={{ __html: question.replace(/\n/g, '<br/>') }}
                    />
                  ))
                ) : (
                  <div 
                    className="question-container"
                    dangerouslySetInnerHTML={{ __html: questions.replace(/\n/g, '') }}
                    // dangerouslySetInnerHTML={{ __html: questions.replace(/\n/g, '<br/>') }}
                  />
                )}
              </div>
            </div>
          )}

          <div className="auth-links">
            <Link to="/signup" className="auth-link">Signup</Link>
            <Link to="/signin" className="auth-link">Signin</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;