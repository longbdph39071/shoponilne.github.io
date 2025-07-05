import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import './index.css'
import App from './App.jsx'

// Suppress React DevTools warning in development
if (import.meta.env.DEV) {
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('Download the React DevTools')) {
      return;
    }
    if (args[0] && typeof args[0] === 'string' && args[0].includes('antd v5 support React is 16 ~ 18')) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          // Suppress compatibility warnings
          motion: false,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)
