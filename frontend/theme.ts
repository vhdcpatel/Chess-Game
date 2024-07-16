// src/theme.ts
import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3d59', // Dark Blue for a professional and calm look
      light: '#3f5b85', // Lighter shade for hover effects and accents
      dark: '#001633', // Darker shade for deeper accents
      contrastText: '#ffffff', // White text for readability on primary colors
    },
    secondary: {
      main: '#ff6f61', // Warm Coral for contrast and emphasis
      light: '#ffa494', // Lighter shade for secondary accents
      dark: '#c43f36', // Darker shade for emphasis and active states
      contrastText: '#ffffff', // White text for readability on secondary colors
    },
    error: {
      main: '#d32f2f', // Standard error color
      light: '#ef5350', // Light error color for background or hover states
      dark: '#b71c1c', // Dark error color for active states
      contrastText: '#ffffff', // White text for readability on error colors
    },
    background: {
      default: '#f5f5f5', // Light grey for a soft background
      paper: '#ffffff', // White for cards and containers
    },
    text: {
      primary: '#333333', // Dark grey for main text
      secondary: '#666666', // Medium grey for secondary text
      disabled: '#9e9e9e', // Light grey for disabled text
      // hint: '#bdbdbd', // Light grey for hints and placeholders
    },
  },
});

export default theme;
