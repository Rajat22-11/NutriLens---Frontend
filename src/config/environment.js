// Environment configuration
const ENV = {
  development: {
    API_URL: "http://localhost:5000",
  },
  production: {
    API_URL: "https://nutrilens-backend-aet6.onrender.com",
  },
};

// Enhanced environment detection with fallback
const isDevelopment = import.meta.env.DEV;
const currentEnv = isDevelopment ? "development" : "production";

// Add more detailed logging for debugging
console.log(`Environment variables:`, import.meta.env);
console.log(
  `Running in ${currentEnv} environment with API URL: ${ENV[currentEnv].API_URL}`
);

// Verify the API URL is accessible
const testApiConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${ENV[currentEnv].API_URL}/api/health`, {
      method: "GET",
      signal: controller.signal,
      mode: "cors",
    });

    clearTimeout(timeoutId);
    console.log(`API connection test result: ${response.status}`);
  } catch (error) {
    console.error(`API connection test failed: ${error.message}`);
    console.log(
      `Please ensure the backend server is running at ${ENV[currentEnv].API_URL}`
    );
  }
};

// Run the test in development mode only
if (isDevelopment) {
  testApiConnection();
}

export const config = ENV[currentEnv];
