import React from 'react';
import { Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ marginBottom: 16, fontSize: '2em' }}>⚠️ Đã xảy ra lỗi</h1>
          <p style={{ marginBottom: 24, fontSize: '1.1em' }}>
            Rất tiếc, đã xảy ra lỗi không mong muốn. Vui lòng thử lại.
          </p>
          
          <div style={{ marginBottom: 24 }}>
            <Button 
              type="primary" 
              size="large"
              onClick={() => window.location.reload()}
              style={{ marginRight: 12 }}
            >
              Tải lại trang
            </Button>
            <Button 
              size="large"
              onClick={() => window.history.back()}
            >
              Quay lại
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              background: 'rgba(0,0,0,0.2)', 
              padding: '16px', 
              borderRadius: '8px',
              marginTop: '16px',
              textAlign: 'left',
              maxWidth: '600px'
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                Chi tiết lỗi (Chỉ hiển thị trong môi trường development)
              </summary>
              <pre style={{ 
                fontSize: '12px', 
                overflow: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 