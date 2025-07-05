import React from 'react';
import { Menu, Button, Space } from 'antd';
import { 
  ShoppingOutlined, 
  DashboardOutlined, 
  UserOutlined,
  LoginOutlined,
  HistoryOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <ShoppingOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '/shopping',
      icon: <ShoppingOutlined />,
      label: 'Mua hàng',
    },
    ...(user ? [
      ...(user.role === 'admin' || user.role === 'staff' ? [
        {
          key: '/admin',
          icon: <DashboardOutlined />,
          label: 'Quản lý',
        },
        {
          key: '/order-approval',
          icon: <CheckCircleOutlined />,
          label: 'Phê duyệt đơn hàng',
        },
      ] : [
        {
          key: '/order-history',
          icon: <HistoryOutlined />,
          label: 'Lịch sử đặt hàng',
        },
        {
          key: '/profile',
          icon: <UserOutlined />,
          label: 'Hồ sơ',
        },
      ])
    ] : [])
  ];

  return (
    <div style={{ 
      background: 'white', 
      padding: '0 24px', 
      borderBottom: '1px solid #f0f0f0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 
            style={{ 
              margin: '0 24px 0 0', 
              color: '#1890ff',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            🛍️ Shop Online
          </h2>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ border: 'none' }}
          />
        </div>
        
        <Space>
          {user ? (
            <>
              <span>Xin chào, {user.name}</span>
              {user.role === 'admin' || user.role === 'staff' ? (
                <Button onClick={() => navigate('/admin')} type="link">
                  Quản lý
                </Button>
              ) : (
                <Button onClick={() => navigate('/profile')} type="link">
                  Hồ sơ
                </Button>
              )}
              <Button onClick={handleLogout} type="link">
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => navigate('/register')}
                style={{ marginRight: '8px' }}
              >
                Đăng ký
              </Button>
              <Button 
                type="primary" 
                icon={<LoginOutlined />}
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </Button>
            </>
          )}
        </Space>
      </div>
    </div>
  );
};

export default Navigation; 