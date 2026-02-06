import axios from "axios";

const API = axios.create({
  // This checks for an environment variable, otherwise defaults to local
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export default API;