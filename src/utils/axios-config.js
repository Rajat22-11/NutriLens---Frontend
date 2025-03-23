import axios from "axios";

import { config } from "../config/environment";

// Add enhanced debugging to verify the API URL and connection
console.log("Creating API client with base URL:", config.API_URL);
console.log("Environment:", import.meta.env.MODE);

// Create axios instance with base URL
const api = axios.create({
  baseURL: config.API_URL, // Use environment-specific API URL
  withCredentials: true, // Important for CORS with credentials
});

// Add request interceptor to include JWT token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token"); // Using your existing token key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      "Making request to:",
      config.url,
      "with base URL:",
      config.baseURL,
      "full URL:",
      config.baseURL +
        (config.url.startsWith("/") ? config.url : "/" + config.url)
    );
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (expired token)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    // Handle connection errors (network issues)
    else if (!error.response) {
      console.error("Network Error: Unable to connect to the API server");
      console.error("Request details:", {
        url: error.config.url,
        baseURL: error.config.baseURL,
        method: error.config.method,
        fullURL: error.config.baseURL + error.config.url,
      });
      // You could dispatch to a global error state or show a notification here
      // For example, using a toast notification library
      if (window.showErrorToast) {
        window.showErrorToast(
          "Network Error: Unable to connect to the API server. Please check your internet connection."
        );
      }
    }
    // Handle other server errors
    else if (error.response && error.response.status >= 500) {
      console.error(
        "Server Error:",
        error.response.status,
        error.response.data
      );
      if (window.showErrorToast) {
        window.showErrorToast(
          "Server Error: The server encountered an error. Please try again later."
        );
      }
    }
    return Promise.reject(error);
  }
);

export default api;
