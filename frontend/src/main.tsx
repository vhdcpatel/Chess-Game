import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from '../theme.ts';
import AppProvider from './context/provider.tsx';
import { Analytics } from "@vercel/analytics/react"
import { Provider } from 'react-redux';
import { store } from './features';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <>
    <Analytics/>
    <Provider store={store}>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </AppProvider>
    </Provider>
  </>
  // </React.StrictMode>,
)
