import React from 'react';

const Simple = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        background: 'rgba(255,255,255,0.1)',
        padding: '40px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        maxWidth: '500px'
      }}>
        <h1 style={{ fontSize: '2.5em', marginBottom: '20px' }}>
          🎉 React is Working!
        </h1>
        
        <p style={{ fontSize: '1.2em', marginBottom: '30px' }}>
          Nếu bạn thấy trang này, React đã hoạt động bình thường!
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginTop: '30px'
        }}>
          <button 
            onClick={() => window.location.href = '/login'}
            style={{
              padding: '15px 25px',
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔐 Đăng nhập
          </button>
          
          <button 
            onClick={() => window.location.href = '/test'}
            style={{
              padding: '15px 25px',
              background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🧪 Test Page
          </button>
        </div>
        
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <p><strong>Thời gian:</strong> {new Date().toLocaleString('vi-VN')}</p>
          <p><strong>React Version:</strong> {React.version}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        </div>
      </div>
    </div>
  );
};

export default Simple; 