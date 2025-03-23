// Environment configuration
const ENV = {
  development: {
    API_URL: "http://localhost:5000",
  },
  production: {
    API_URL: "https://nutrilens-backend-aet6.onrender.com", // Make sure this matches the deployed backend URL
  },
};

// Determine current environment
// Check if we're on localhost OR if we're using a local file (file:// protocol)
const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.protocol === "file:";
const currentEnv = isDevelopment ? "development" : "production";

console.log(
  `Running in ${currentEnv} environment with API URL: ${ENV[currentEnv].API_URL}`
);

// Export configuration for current environment
export const config = ENV[currentEnv];
