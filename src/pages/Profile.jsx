import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  notification, 
  Space,
  Divider,
  Row,
  Col,
  Avatar,
  Tag,
  Modal
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  SaveOutlined,
  LockOutlined,
  HistoryOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import api from '../services/api';
import { usersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const Profile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const navigate = useNavigate();

  // Khởi tạo form với dữ liệu user hiện tại
  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, form]);

  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);
      
      // Chỉ gửi các trường cần cập nhật, không bao gồm password
      const updateData = {
        name: values.name,
        phone: values.phone,
        address: values.address
      };

      // Sử dụng updateProfile method mới
      await usersAPI.updateProfile(user.id, updateData);
      
      notification.success({
        message: 'Cập nhật thông tin thành công!',
        description: 'Thông tin mới đã được lưu.'
      });
      setEditing(false);
      
      // Cập nhật thông tin user trong localStorage
      const updatedUser = { ...user, ...values };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Cập nhật context mà không cần reload trang
      window.location.reload();
      
    } catch (error) {
      console.error('Error updating profile:', error);
      notification.error({
        message: 'Có lỗi xảy ra khi cập nhật thông tin',
        description: 'Vui lòng thử lại sau!'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    notification.success({
      message: 'Đăng xuất thành công!',
      description: 'Bạn đã đăng xuất khỏi tài khoản.'
    });
  };

  const handleChangePassword = async (values) => {
    try {
      setChangePasswordLoading(true);
      
      // Gọi API để đổi mật khẩu
      await usersAPI.update(user.id, {
        ...user,
        password: values.newPassword
      });
      
      notification.success({
        message: 'Đổi mật khẩu thành công!',
        description: 'Vui lòng đăng nhập lại với mật khẩu mới.'
      });
      setChangePasswordVisible(false);
      passwordForm.resetFields();
      
      // Đăng xuất để user đăng nhập lại với mật khẩu mới
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Error changing password:', error);
      notification.error({
        message: 'Có lỗi xảy ra khi đổi mật khẩu',
        description: 'Vui lòng thử lại sau!'
      });
    } finally {
      setChangePasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Navigation />
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Card>
            <Title level={3}>Vui lòng đăng nhập để xem thông tin cá nhân</Title>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navigation />
      
      <div style={{ padding: '24px' }}>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} md={16} lg={12}>
            {/* Profile Header */}
            <Card style={{ marginBottom: '24px', textAlign: 'center' }}>
              <Avatar 
                size={80} 
                icon={<UserOutlined />}
                style={{ 
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  marginBottom: '16px'
                }}
              />
              <Title level={2} style={{ marginBottom: '8px' }}>
                {user.name}
              </Title>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  {user.email}
                </Text>
              </div>
              <Space>
                <Tag color="blue">{user.role === 'admin' ? 'Quản trị viên' : 
                                   user.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}</Tag>
                <Tag color="green">Đã xác thực</Tag>
              </Space>
              {user.phone && (
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    📞 {user.phone}
                  </Text>
                </div>
              )}
            </Card>

            {/* Profile Form */}
            <Card 
              title={
                <Space>
                  <UserOutlined />
                  Thông tin cá nhân
                </Space>
              }
              extra={
                <Button 
                  type={editing ? "default" : "primary"}
                  icon={editing ? <SaveOutlined /> : <EditOutlined />}
                  onClick={() => {
                    if (editing) {
                      form.submit();
                    } else {
                      setEditing(true);
                    }
                  }}
                  loading={loading}
                >
                  {editing ? 'Lưu' : 'Chỉnh sửa'}
                </Button>
              }
            >
              {!editing && (
                <div style={{ 
                  marginBottom: '16px', 
                  padding: '12px', 
                  background: '#f6ffed', 
                  border: '1px solid #b7eb8f', 
                  borderRadius: '6px' 
                }}>
                  <Text type="secondary">
                    💡 Click "Chỉnh sửa" để cập nhật thông tin cá nhân. Email không thể thay đổi vì lý do bảo mật.
                  </Text>
                </div>
              )}
              
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateProfile}
                disabled={!editing}
                validateTrigger={['onChange', 'onBlur']}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label="Họ và tên"
                      rules={[
                        { required: true, message: 'Vui lòng nhập họ tên!' },
                        { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
                        { max: 50, message: 'Họ tên không được quá 50 ký tự!' }
                      ]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="Nhập họ và tên"
                        maxLength={50}
                        showCount
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
                          message: 'Số điện thoại phải có 10-11 chữ số!' 
                        }
                      ]}
                    >
                      <Input 
                        prefix={<PhoneOutlined />} 
                        placeholder="Nhập số điện thoại"
                        maxLength={11}
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
                    disabled={true} // Email không được phép thay đổi
                  />
                </Form.Item>

                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[
                    { required: true, message: 'Vui lòng nhập địa chỉ!' },
                    { min: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự!' },
                    { max: 200, message: 'Địa chỉ không được quá 200 ký tự!' }
                  ]}
                >
                  <Input.TextArea 
                    prefix={<EnvironmentOutlined />} 
                    placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                    rows={3}
                    maxLength={200}
                    showCount
                  />
                </Form.Item>

                {editing && (
                  <Form.Item>
                    <Space>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        icon={<SaveOutlined />}
                      >
                        Lưu thay đổi
                      </Button>
                      <Button 
                        onClick={() => {
                          setEditing(false);
                          // Reset form về giá trị ban đầu
                          form.setFieldsValue({
                            name: user.name,
                            email: user.email,
                            phone: user.phone || '',
                            address: user.address || ''
                          });
                        }}
                      >
                        Hủy
                      </Button>
                    </Space>
                  </Form.Item>
                )}
              </Form>
            </Card>

            {/* Account Actions */}
            <Card 
              title={
                <Space>
                  <LockOutlined />
                  Tài khoản
                </Space>
              }
            >
                          <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div>
                  <Text strong>Lịch sử đặt hàng</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Xem lại các đơn hàng đã đặt
                  </Text>
                </div>
                <Button 
                  type="link" 
                  icon={<HistoryOutlined />}
                  onClick={() => navigate('/order-history')}
                >
                  Xem lịch sử
                </Button>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div>
                  <Text strong>Đổi mật khẩu</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Cập nhật mật khẩu để bảo mật tài khoản
                  </Text>
                </div>
                <Button 
                  type="link"
                  icon={<LockOutlined />}
                  onClick={() => setChangePasswordVisible(true)}
                >
                  Thay đổi
                </Button>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0'
              }}>
                <div>
                  <Text strong>Đăng xuất</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Thoát khỏi tài khoản hiện tại
                  </Text>
                </div>
                <Button 
                  danger 
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              </div>
            </Space>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal Đổi mật khẩu */}
      <Modal
        title={
          <Space>
            <LockOutlined />
            Đổi mật khẩu
          </Space>
        }
        open={changePasswordVisible}
        onCancel={() => {
          setChangePasswordVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <div style={{ marginBottom: '16px' }}>
          <Text type="secondary">
            💡 Mật khẩu mới phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số. Sau khi đổi mật khẩu, bạn sẽ được đăng xuất để đăng nhập lại.
          </Text>
        </div>
        
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              { 
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
                message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!' 
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập lại mật khẩu mới"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={() => {
                  setChangePasswordVisible(false);
                  passwordForm.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={changePasswordLoading}
                icon={<SaveOutlined />}
              >
                Đổi mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile; 