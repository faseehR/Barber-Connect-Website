// frontend/src/index.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// MUI Theme Configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b35', // BarberConnect orange
    },
    secondary: {
      main: '#004e89', // Complementary blue
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: [
      '"Poppins"',
      '"Helvetica"',
      '"Arial"',
      'sans-serif'
    ].join(','),
    button: {
      textTransform: 'none' // Disable auto-uppercase in buttons
    }
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
)