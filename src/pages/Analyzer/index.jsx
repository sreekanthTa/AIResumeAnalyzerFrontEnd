import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Analyzer = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isGettingQuestions, setIsGettingQuestions] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [rewrittenResume, setRewrittenResume] = useState(null);
  const [questions, setQuestions] = useState(null);
  const fileInputRef = useRef(null);

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
      setError(null);
    } else {
      setError('Please upload a PDF file');
      setFile(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setIsRewriting(null);
    setResult(null);
    setError(null);
    setRewrittenResume(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (description) {
        formData.append('description', description);
      }

      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/resume/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResult(data?.result);
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
    setIsAnalyzing(null);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (description) {
        formData.append('description', description);
      }

      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/resume/rewrite`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setRewrittenResume(data?.rewrittenResume);
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
    setError(null);
    setResult(null);
    setRewrittenResume(null);

    try {
      // const formData = new FormData();
      // formData.append('description', description);
      // if (file) {
      //   formData.append('resume', file);
      // }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/resume/questions`, {
        description: description,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Questions Response:', response.data);
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
    } catch (err) {
      console.error('Questions error:', err);
      console.error('Error details:', err.response?.data);
      setError('Failed to get questions. Please try again.');
    } finally {
      setIsGettingQuestions(false);
    }
  };

  return (
    <div className="analyzer">
      <nav className="nav">
        <div className="container nav-container">
          <Link to="/" className="nav-logo">ResumeAnalyzer</Link>
          <div className="nav-links">
            <Link to="/" className="text-gray hover:text-primary">Home</Link>
            <Link to="/analyzer" className="text-gray hover:text-primary">Analyzer</Link>
          </div>
        </div>
      </nav>

      <div className="analyzer-container">
        <div className="analyzer-content">
          <h1 className="text-center mb-8">Analyze Your Resume</h1>
          
          <div className="container">
            <div className="mb-8">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Job Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Paste the job description here to get a targeted analysis..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                rows="4"
              />
              <p className="text-sm text-gray-500 mt-2">
                Adding a job description helps us provide more targeted feedback on how well your resume matches the position.
              </p>
            </div>

            <div className="upload-area" 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ borderColor: isDragging ? 'var(--primary)' : 'var(--gray-300)' }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <div className="text-center">
                <div className="upload-icon">
                  <svg className="w-12 h-12 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mt-4">
                  {file ? file.name : 'Upload your resume'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {file ? 'Click to change file' : 'Drag and drop your resume here or click to browse'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                className="btn btn-primary"
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing || isRewriting || isGettingQuestions}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleRewrite}
                disabled={!file || isAnalyzing || isRewriting || isGettingQuestions}
              >
                {isRewriting ? 'Rewriting...' : 'Rewrite Resume'}
              </button>
              <button
                className="btn btn-accent"
                onClick={handleGetQuestions}
                disabled={!description || isAnalyzing || isRewriting || isGettingQuestions}
              >
                {isGettingQuestions ? 'Getting Questions...' : 'Get Interview Questions'}
              </button>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {result && (
              <div className="result-container mt-8">
                <div 
                  className="analysis-result"
                  dangerouslySetInnerHTML={{ __html: result }}
                />
              </div>
            )}

            {rewrittenResume && (
              <div className="rewrite-container mt-8">
                <div 
                  className="rewritten-content"
                  dangerouslySetInnerHTML={{ __html: rewrittenResume }}
                />
                <div className="mt-6 flex justify-end">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      const tempDiv = document.createElement('div');
                      tempDiv.innerHTML = rewrittenResume;
                      const plainText = tempDiv.textContent || tempDiv.innerText;
                      navigator.clipboard.writeText(plainText);
                      alert('Resume copied to clipboard!');
                    }}
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}

            {questions && (
              <div className="questions-container mt-8">
                <div 
                  className="questions-content prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: questions }}
                />
                <div className="mt-6 flex justify-end">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      const tempDiv = document.createElement('div');
                      tempDiv.innerHTML = questions;
                      const plainText = tempDiv.textContent || tempDiv.innerText;
                      navigator.clipboard.writeText(plainText);
                      alert('Questions copied to clipboard!');
                    }}
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer; 