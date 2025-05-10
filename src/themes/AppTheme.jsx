import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useState, useEffect } from "react";

const AppTheme = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false); // Default to light mode

  useEffect(() => {
    // Check if user settings exist in localStorage
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      // Use the darkMode setting from localStorage if available
      setDarkMode(
        parsedSettings.darkMode !== undefined ? parsedSettings.darkMode : false
      );
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppTheme;
