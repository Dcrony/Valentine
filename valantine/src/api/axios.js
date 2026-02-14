import axios from "axios";

// Create axios instance with proper configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Set to true if using cookies/auth
});

// Optional: Add request interceptor for debugging
API.interceptors.request.use(
  config => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor
API.interceptors.response.use(
  response => response,
  error => {
    console.error('API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default API;