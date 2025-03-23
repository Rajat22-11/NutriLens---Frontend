import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for production deployment
  base: "/",
  // Build configuration
  build: {
    // Output directory for production build
    outDir: "dist",
    // Generate sourcemaps for better debugging
    sourcemap: true,
    // Optimize chunks for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
        },
      },
    },
  },
  // Server configuration
  server: {
    port: 5173,
    // Allow connections from all network interfaces
    host: true,
  },
});
