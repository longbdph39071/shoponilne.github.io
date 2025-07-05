import { useState } from 'react';
import { Form, Input, Button, message, Typography, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(values);
      if (result.success) {
        message.success('Đăng nhập thành công!');
        // Chuyển hướng dựa trên role
        if (result.user?.role === 'admin' || result.user?.role === 'staff') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)'
          }}>
            <UserOutlined style={{ fontSize: '32px', color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#262626' }}>
            Chào mừng trở lại
          </Title>
          <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
            Đăng nhập để tiếp tục quản lý hệ thống
          </Text>
        </div>
        
        <div className="login-form">
          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Nhập email của bạn"
                style={{ height: '48px', borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Nhập mật khẩu"
                style={{ height: '48px', borderRadius: '8px' }}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                }}
                block
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '24px 0', color: '#bfbfbf' }}>
            <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>Tài khoản demo</Text>
          </Divider>

          <div style={{ 
            background: '#f6ffed', 
            border: '1px solid #b7eb8f',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <Text strong style={{ color: '#52c41a', fontSize: '13px' }}>👤 Admin:</Text>
              <Text style={{ fontSize: '13px', color: '#666', marginLeft: '8px' }}>
                admin@company.com / 123456
              </Text>
            </div>
            <div>
              <Text strong style={{ color: '#52c41a', fontSize: '13px' }}>👤 Staff:</Text>
              <Text style={{ fontSize: '13px', color: '#666', marginLeft: '8px' }}>
                staff@company.com / 123456
              </Text>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="small">
              <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                Chưa có tài khoản?{' '}
                <Link to="/register" style={{ color: '#1890ff' }}>
                  Đăng ký ngay
                </Link>
              </Text>
              <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                © 2024 Hệ thống quản lý bán hàng. Được phát triển với ❤️
              </Text>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 