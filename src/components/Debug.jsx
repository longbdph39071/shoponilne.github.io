import React from 'react';

const Debug = () => {
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    checkAPI();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', background: '#f0f0f0' }}>
        <h2>🔍 Debug Info</h2>
        <p>Đang kiểm tra API...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', background: '#ffebee', border: '1px solid #f44336' }}>
        <h2>❌ Debug Error</h2>
        <p><strong>Lỗi:</strong> {error}</p>
        <p><strong>API URL:</strong> http://localhost:3000/users</p>
        <p><strong>Thời gian:</strong> {new Date().toLocaleString()}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#e8f5e8', border: '1px solid #4caf50' }}>
      <h2>✅ Debug Success</h2>
      <p><strong>API Status:</strong> Hoạt động bình thường</p>
      <p><strong>Users count:</strong> {data?.length || 0}</p>
      <p><strong>Thời gian:</strong> {new Date().toLocaleString()}</p>
    </div>
  );
};

export default Debug; 