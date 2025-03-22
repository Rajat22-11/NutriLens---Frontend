import { createTheme, alpha } from '@mui/material/styles';

// Create a vibrant food-themed color palette
export const foodTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B35', // Vibrant Orange (like a spicy curry)
      light: '#FF8C5F',
      dark: '#E25420',
    },
    secondary: {
      main: '#2EC4B6', // Teal (fresh mint chutney)
      light: '#48E5D7',
      dark: '#1A9587',
    },
    info: {
      main: '#FFCA3A', // Turmeric Yellow
    },
    success: {
      main: '#8AC926', // Fresh Green (like coriander)
    },
    background: {
      default: '#FFFAF0', // Floral White (like basmati rice)
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.5px',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.3px',
    },
    h5: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '12px 24px',
          textTransform: 'none',
          fontSize: '16px',
          fontWeight: 600,
          boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F59 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #2EC4B6 0%, #40DFD0 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
  },
});

export default foodTheme;