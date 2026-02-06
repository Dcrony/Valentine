import axios from "axios";

// Get API URL from environment or use default
const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

// Log for debugging (remove in production)
console.log("API Base URL:", baseURL);

const API = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: false, // Set to true if using cookies/sessions
  timeout: 15000, // 15 second timeout
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    // Add any auth tokens if needed
    const token = localStorage.getItem("valentine_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CORS headers
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    
    // Handle CORS errors
    if (error.code === "ERR_NETWORK" || 
        error.message.includes("CORS") || 
        error.message.includes("origin")) {
      console.error("🚨 CORS Error Detected!");
      console.log("Frontend URL:", window.location.origin);
      console.log("Backend URL:", baseURL);
      
      // Provide helpful error message
      error.userMessage = "Connection error. Please check if backend server is running and CORS is configured.";
    }
    
    return Promise.reject(error);
  }
);

export default API;
