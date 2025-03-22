import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const AppTheme = ({ children }) => {
  const theme = createTheme({
    palette: {
      mode: 'dark', // Change to 'dark' for dark mode
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
