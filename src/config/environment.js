// Environment configuration
const ENV = {
  development: {
    API_URL: "http://localhost:5000",
  },
  production: {
    API_URL: "https://nutrilens-backend-aet6.onrender.com",
  },
};

// Improved environment detection
const isDevelopment = import.meta.env.DEV;
const currentEnv = isDevelopment ? "development" : "production";

console.log(
  `Running in ${currentEnv} environment with API URL: ${ENV[currentEnv].API_URL}`
);

export const config = ENV[currentEnv];
