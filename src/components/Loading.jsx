import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading = ({ size = 'large', text = 'Đang tải...' }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Spin indicator={antIcon} size={size} />
      <div style={{ 
        marginTop: 16, 
        color: 'white', 
        fontSize: '16px',
        fontWeight: '500'
      }}>
        {text}
      </div>
    </div>
  );
};

export default Loading; 