import React from 'react';
import Debug from '../components/Debug';

const Test = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      color: 'white'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          🧪 Test Page - Kiểm tra ứng dụng
        </h1>
        
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '20px', 
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h2>📋 Thông tin hệ thống</h2>
          <p><strong>React Version:</strong> {React.version}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>Current Time:</strong> {new Date().toLocaleString('vi-VN')}</p>
          <p><strong>User Agent:</strong> {navigator.userAgent}</p>
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '20px', 
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h2>🔗 Kiểm tra API</h2>
          <Debug />
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '20px', 
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h2>🎨 Kiểm tra CSS</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px'
          }}>
            <button style={{
              padding: '10px',
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer'
            }}>
              Button 1
            </button>
            <button style={{
              padding: '10px',
              background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer'
            }}>
              Button 2
            </button>
            <button style={{
              padding: '10px',
              background: 'linear-gradient(45deg, #45b7d1, #96c93d)',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer'
            }}>
              Button 3
            </button>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '20px', 
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h2>🚀 Hướng dẫn tiếp theo</h2>
          <p>Nếu trang này hiển thị bình thường, React đã hoạt động tốt!</p>
          <p>Bạn có thể truy cập <a href="/login" style={{ color: '#ffd700' }}>trang đăng nhập</a> để tiếp tục.</p>
        </div>
      </div>
    </div>
  );
};

export default Test; 