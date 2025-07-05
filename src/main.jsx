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

// Add error handling for the root
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  createRoot(rootElement).render(
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
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 20px;
    ">
      <h1>🚀 Shop Online</h1>
      <p>Đang khởi tạo ứng dụng...</p>
      <button onclick="window.location.reload()" style="
        margin-top: 16px;
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        cursor: pointer;
      ">
        Tải lại trang
      </button>
    </div>
  `;
}
