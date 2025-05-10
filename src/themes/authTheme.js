import { createTheme } from "@mui/material/styles";

const foodTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ff8a00", // Warm gradient tone
    },
    secondary: {
      main: "#da1b60", // Deep magenta
    },
    background: {
      default: "#f8f9fa", // Light background
      paper: "#ffffff", // Clean white cards
    },
    text: {
      primary: "#333333",
      secondary: "rgba(0, 0, 0, 0.7)",
    },
  },
  typography: {
    fontFamily: ["Inter", "Playfair Display", "sans-serif"].join(","),
    h3: {
      fontFamily: "Playfair Display, serif",
      fontWeight: 700,
      letterSpacing: "1px",
    },
    h6: {
      fontWeight: 300,
      opacity: 0.8,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 20px",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        contained: {
          background: "linear-gradient(90deg, #ff8a00, #da1b60)",
          "&:hover": {
            background: "linear-gradient(90deg, #da1b60, #ff8a00)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          color: "#f0f0f0",
          "&.Mui-selected": {
            color: "#ff8a00",
          },
        },
      },
    },
  },
});

export default foodTheme;
