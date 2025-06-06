import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from '../theme.ts';
import AppProvider from './context/provider.tsx';
import { Analytics } from "@vercel/analytics/react"
import { Provider } from 'react-redux';
import { store } from './features';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
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
)
