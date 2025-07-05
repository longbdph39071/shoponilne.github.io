import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  message, 
  Space,
  Divider,
  Row,
  Col
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  PhoneOutlined,
  EnvironmentOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

const { Title, Text, Paragraph } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { register } = useAuth();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // Kiểm tra mật khẩu xác nhận
      if (values.password !== values.confirmPassword) {
        message.error('Mật khẩu xác nhận không khớp!');
        return;
      }

      // Tạo dữ liệu đăng ký
      const registerData = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        address: values.address,
        role: 'customer' // Mặc định là khách hàng
      };

      // Gọi API đăng ký
      const result = await register(registerData);
      
      if (result.success) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        message.error(result.error);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 409) {
        message.error('Email đã tồn tại! Vui lòng sử dụng email khác.');
      } else {
        message.error('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navigation />
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 64px)',
        padding: '24px'
      }}>
        <Card 
          style={{ 
            width: '100%', 
            maxWidth: '500px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '12px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
              🎉 Đăng ký tài khoản
            </Title>
            <Paragraph style={{ color: '#666', margin: 0 }}>
              Tạo tài khoản mới để bắt đầu mua sắm
            </Paragraph>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: 'Vui lòng nhập họ tên!' },
                    { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Nhập họ và tên"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { 
                      pattern: /^[0-9]{10,11}$/, 
                      message: 'Số điện thoại không hợp lệ!' 
                    }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined />} 
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Nhập email"
              />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ!' },
                { min: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự!' }
              ]}
            >
              <Input.TextArea 
                prefix={<EnvironmentOutlined />} 
                placeholder="Nhập địa chỉ chi tiết"
                rows={3}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Mật khẩu phải chứa chữ hoa, chữ thường và số!'
                }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Nhập lại mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                style={{ 
                  height: '48px', 
                  fontSize: '16px',
                  borderRadius: '8px'
                }}
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          <Divider>
            <Text type="secondary">hoặc</Text>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Text type="secondary">
                Đã có tài khoản?{' '}
                <Link to="/login" style={{ color: '#1890ff' }}>
                  Đăng nhập ngay
                </Link>
              </Text>
              
              <Button 
                type="link" 
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/')}
                style={{ color: '#666' }}
              >
                Quay về trang chủ
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register; 