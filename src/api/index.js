import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Include cookies with requests
});

// Add Axios interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    // Optionally, you can throw the error to be caught in components if needed
    return Promise.reject(error);
  }
);

// Authentication APIs
export const signin = (email, password) => {
  return apiClient.post('/api/auth/signin', { email, password });
};

export const signup = (name, email, password) => {
  return apiClient.post('/api/auth/signup', { name, email, password });
};

export const refreshToken = () => {
  return apiClient.post('/api/auth/refresh-token', {}, {
    withCredentials: true, // Explicitly ensure cookies are sent
  });
};

export const logout = () => {
  return apiClient.post('/api/auth/logout');
};



// Resume Analysis APIs
export const analyzeResume = (formData) => {
  return apiClient.post('/api/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const rewriteResume = (formData) => {
  return apiClient.post('/api/resume/rewrite', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getInterviewQuestions = (description) => {
  return apiClient.post('/api/resume/questions', { description });
};

export const chatWithAI = (messages, description) => {
  return apiClient.post('/api/resume/chat', { messages, description });
};



// Coding Editor APIs
export const getAllQuestions = (limit, offset) => {
  return apiClient.get(`/api/questions`, {
    params: {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    },
  });
};
export const getQuestionById = (questionId) => {
  return apiClient.get(`/api/questions/${questionId}`);
}