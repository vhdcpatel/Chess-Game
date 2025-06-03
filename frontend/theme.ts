// src/theme.ts
import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3d59',
      light: '#3f5b85',
      dark: '#001633',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6f61',
      light: '#ffa494',
      dark: '#c43f36',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#b71c1c',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#9e9e9e',
      // hint: '#bdbdbd',
    },
  },
});

export default theme;
