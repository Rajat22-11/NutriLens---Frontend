// Environment configuration
const ENV = {
  development: {
    API_URL: "http://localhost:5000",
  },
  production: {
    API_URL: "https://nutrilens-backend-aet6.onrender.com",
  },
};

// Determine current environment
const isDevelopment = window.location.hostname === "localhost";
const currentEnv = isDevelopment ? "development" : "production";

// Export configuration for current environment
export const config = ENV[currentEnv];
