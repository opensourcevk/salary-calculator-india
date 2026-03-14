import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4', // MD3 Purple
      light: '#EADDFF',
      dark: '#4F378B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#625B71',
      light: '#E8DEF8',
      dark: '#4A4458',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FEF7FF', // MD3 surface color
      paper: '#FFFFFF',
    },
    error: {
      main: '#B3261E',
      light: '#F9DEDC',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 400,
    },
    h5: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 16, // MD3 typical corner radius
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Pill shaped buttons in MD3
          textTransform: 'none', // MD3 typically uses sentence case or title case
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12, // Slightly more rounded text fields
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
