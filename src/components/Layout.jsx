import { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, theme, Badge } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: 'Quản lý sản phẩm',
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: 'Quản lý khách hàng',
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Quản lý đơn hàng',
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: 'Thống kê',
    },
    ...(isAdmin() ? [{
      key: '/users',
      icon: <SettingOutlined />,
      label: 'Quản lý người dùng',
    }] : []),
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={280}
        style={{
          background: 'linear-gradient(180deg, #001529 0%, #003a70 100%)',
        }}
      >
        <div className="sidebar-logo">
          {collapsed ? 'AD' : 'ADMIN PANEL'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            background: 'transparent',
            borderRight: 'none',
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 48,
                height: 48,
                borderRadius: '8px',
              }}
            />
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#262626',
              marginLeft: 8
            }}>
              {menuItems.find(item => item.key === location.pathname)?.label || 'Dashboard'}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{
                  fontSize: '16px',
                  width: 40,
                  height: 40,
                  borderRadius: '8px',
                }}
              />
            </Badge>
            
            <Dropdown
              menu={{
                items: userMenuItems,
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div className="user-menu">
                <div className="user-avatar">
                  {getUserInitials(user?.name || 'User')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#262626',
                    lineHeight: '1.2'
                  }}>
                    {user?.name || 'User'}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#8c8c8c',
                    lineHeight: '1.2'
                  }}>
                    {user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                  </span>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: 0,
            minHeight: 280,
            background: 'transparent',
          }}
        >
          <div className="fade-in">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 