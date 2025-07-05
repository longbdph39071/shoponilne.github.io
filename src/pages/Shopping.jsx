import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Button, 
  Badge, 
  Drawer, 
  List, 
  Avatar, 
  Space, 
  Typography, 
  Divider, 
  Select, 
  Empty,
  message,
  Modal,
  Form,
  InputNumber,
  Tag,
  Alert
} from 'antd';
import { 
  ShoppingCartOutlined, 
  SearchOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  MinusOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import api from '../services/api';
import Navigation from '../components/Navigation';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const Shopping = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [checkoutForm] = Form.useForm();

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search or category changes
  useEffect(() => {
    let filtered = products;
    
    if (searchText) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchText, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Cart functions
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      setTimeout(() => {
        message.success(`Đã thêm thêm 1 ${product.name} vào giỏ hàng (Tổng: ${existingItem.quantity + 1})`);
      }, 0);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      setTimeout(() => {
        message.success(`Đã thêm ${product.name} vào giỏ hàng! Giỏ hàng hiện có ${getCartCount() + 1} sản phẩm`);
      }, 0);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    setTimeout(() => {
      message.success('Đã xóa sản phẩm khỏi giỏ hàng');
    }, 0);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity }
        : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Checkout functions
  const handleCheckout = async (values) => {
    // Kiểm tra giỏ hàng có sản phẩm không
    if (cart.length === 0) {
      message.error('Giỏ hàng trống! Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.');
      return;
    }
    
    // Hiển thị modal xác nhận thanh toán
    Modal.confirm({
      title: (
        <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
          💳 Xác nhận thanh toán
        </div>
      ),
      content: (
        <div style={{ padding: '20px 0' }}>
          <div style={{ 
            background: '#f0f9ff', 
            border: '1px solid #91d5ff', 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '20px' 
          }}>
            <h4 style={{ color: '#1890ff', marginBottom: '15px' }}>Thông tin đơn hàng:</h4>
            <div style={{ marginBottom: '10px' }}>
              <strong>Khách hàng:</strong> {values.name}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Email:</strong> {values.email}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Số điện thoại:</strong> {values.phone}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Địa chỉ:</strong> {values.address}
            </div>
          </div>
          
          <div style={{ 
            background: '#fff7e6', 
            border: '1px solid #ffd591', 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '20px' 
          }}>
            <h4 style={{ color: '#fa8c16', marginBottom: '15px' }}>Chi tiết sản phẩm:</h4>
            {cart.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '8px',
                padding: '8px 0',
                borderBottom: index < cart.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                <span>{item.name} x{item.quantity}</span>
                <span style={{ fontWeight: 'bold' }}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '15px',
              paddingTop: '15px',
              borderTop: '2px solid #ffd591',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              <span>Tổng cộng:</span>
              <span style={{ color: '#fa8c16', fontSize: '18px' }}>{formatPrice(getCartTotal())}</span>
            </div>
          </div>
          
          <div style={{ 
            background: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: '8px', 
            padding: '15px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
              <span style={{ fontWeight: 'bold', color: '#52c41a' }}>Lưu ý:</span>
            </div>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
              • Đơn hàng sẽ được gửi đến admin để phê duyệt<br/>
              • Bạn sẽ nhận được thông báo khi đơn hàng được phê duyệt<br/>
              • Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
            </div>
          </div>
        </div>
      ),
      okText: 'Xác nhận thanh toán',
      cancelText: 'Hủy bỏ',
      okButtonProps: { 
        style: { 
          background: '#52c41a', 
          borderColor: '#52c41a',
          height: '40px',
          fontSize: '16px',
          fontWeight: 'bold'
        } 
      },
      cancelButtonProps: { 
        style: { 
          height: '40px',
          fontSize: '16px'
        } 
      },
      width: 600,
      onOk: () => {
        // Gọi hàm xử lý thanh toán
        processOrder(values);
      }
    });
  };

  // Hàm xử lý đơn hàng riêng biệt
  const processOrder = async (values) => {
    let loadingMessage = null;
    try {
      // Hiển thị loading khi đang xử lý thanh toán
      loadingMessage = message.loading('Đang xử lý thanh toán...', 0);
      
      const orderData = {
        customerName: values.name,
        customerEmail: values.email,
        customerPhone: values.phone,
        customerAddress: values.address,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getCartTotal(),
        status: 'awaiting_approval',
        orderDate: new Date().toISOString()
      };

      const response = await api.post('/orders', orderData);
      
      // Đóng loading message
      if (loadingMessage) loadingMessage();
      
      // Hiển thị thông báo thanh toán thành công với giao diện đẹp
      Modal.success({
        title: (
          <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
            🎉 Thanh toán thành công!
          </div>
        ),
        content: (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', 
              borderRadius: '50%', 
              width: '80px', 
              height: '80px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 20px',
              boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)'
            }}>
              <CheckCircleOutlined style={{ fontSize: '40px', color: 'white' }} />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#52c41a', marginBottom: '10px' }}>Đơn hàng đã được đặt thành công!</h3>
              <p style={{ color: '#666', marginBottom: '15px' }}>
                Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi
              </p>
            </div>
            
            <div style={{ 
              background: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              borderRadius: '8px', 
              padding: '15px', 
              marginBottom: '20px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>Mã đơn hàng:</span>
                <span style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '16px' }}>
                  #{response.data.id.toString().padStart(6, '0')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>Tổng tiền:</span>
                <span style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '16px' }}>
                  {formatPrice(getCartTotal())}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>Trạng thái:</span>
                <Tag color="gold" style={{ fontWeight: 'bold' }}>
                  Chờ phê duyệt
                </Tag>
              </div>
            </div>
            
            <div style={{ 
              background: '#e6f7ff', 
              border: '1px solid #91d5ff', 
              borderRadius: '8px', 
              padding: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <ClockCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>Quy trình tiếp theo:</span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                1. Admin sẽ xem xét và phê duyệt đơn hàng<br/>
                2. Bạn sẽ nhận được thông báo khi đơn hàng được phê duyệt<br/>
                3. Đơn hàng sẽ được xử lý và giao đến bạn
              </div>
            </div>
            
            <p style={{ color: '#666', fontSize: '14px' }}>
              Bạn có thể theo dõi trạng thái đơn hàng trong phần <strong>Lịch sử đặt hàng</strong>
            </p>
          </div>
        ),
        okText: 'Xem lịch sử đặt hàng',
        cancelText: 'Tiếp tục mua sắm',
        okButtonProps: { 
          style: { 
            background: '#52c41a', 
            borderColor: '#52c41a',
            height: '40px',
            fontSize: '16px',
            fontWeight: 'bold'
          } 
        },
        cancelButtonProps: { 
          style: { 
            height: '40px',
            fontSize: '16px'
          } 
        },
        width: 500,
        onOk: () => {
          navigate('/order-history');
        }
      });
      
      setCart([]);
      setCheckoutVisible(false);
      checkoutForm.resetFields();
      
    } catch (error) {
      // Đóng loading message nếu có
      if (loadingMessage) loadingMessage();
      console.error('Error during checkout:', error);
      message.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navigation />
      
      <div style={{ padding: '24px' }}>
        {/* Cart Button */}
        <div style={{ 
          position: 'fixed', 
          top: '80px', 
          right: '24px', 
          zIndex: 1000 
        }}>
          <Badge count={getCartCount()} size="large">
            <Button 
              type="primary" 
              icon={<ShoppingCartOutlined />}
              size="large"
              onClick={() => setCartVisible(true)}
              style={{ 
                borderRadius: '50%', 
                width: '60px', 
                height: '60px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
          </Badge>
        </div>

        {/* Search and Filter */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Search
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="large"
              />
            </Col>
            <Col span={12}>
              <Select
                placeholder="Chọn danh mục"
                value={selectedCategory}
                onChange={setSelectedCategory}
                size="large"
                style={{ width: '100%' }}
              >
                <Option value="all">Tất cả danh mục</Option>
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Products Grid */}
        <Row gutter={[16, 16]}>
          {filteredProducts.map(product => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                cover={
                  <div style={{ 
                    height: '200px', 
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f0f0f0'
                  }}>
                    <img
                      alt={product.name}
                      src={product.image}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  </div>
                }
                actions={[
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                  </Button>
                ]}
              >
                <Card.Meta
                  title={
                    <div>
                      <Text strong style={{ fontSize: '16px' }}>
                        {product.name}
                      </Text>
                      {product.stock === 0 && (
                        <Tag color="red" style={{ marginLeft: '8px' }}>
                          Hết hàng
                        </Tag>
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph ellipsis={{ rows: 2 }}>
                        {product.description}
                      </Paragraph>
                      <div style={{ marginTop: '8px' }}>
                        <Text type="danger" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {formatPrice(product.price)}
                        </Text>
                      </div>
                      <div style={{ marginTop: '4px' }}>
                        <Text type="secondary">
                          Còn lại: {product.stock} sản phẩm
                        </Text>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {filteredProducts.length === 0 && !loading && (
          <Empty 
            description="Không tìm thấy sản phẩm nào"
            style={{ marginTop: '48px' }}
          />
        )}

        {/* Shopping Cart Drawer */}
        <Drawer
          title={
            <div>
              <ShoppingCartOutlined style={{ marginRight: '8px' }} />
              Giỏ hàng ({getCartCount()} sản phẩm)
            </div>
          }
          placement="right"
          onClose={() => setCartVisible(false)}
          open={cartVisible}
          width={400}
          footer={
            cart.length > 0 ? (
              <div>
                <Divider />
                <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                  <Text strong>Tổng cộng:</Text>
                  <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                    {formatPrice(getCartTotal())}
                  </Text>
                </Row>
                <Button 
                  type="primary" 
                  size="large" 
                  block
                  icon={<CreditCardOutlined />}
                  onClick={() => setCheckoutVisible(true)}
                >
                  Thanh toán
                </Button>
              </div>
            ) : null
          }
        >
          {cart.length === 0 ? (
            <Empty description="Giỏ hàng trống" />
          ) : (
            <List
              dataSource={cart}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        size={64} 
                        src={item.image}
                        shape="square"
                      />
                    }
                    title={item.name}
                    description={
                      <div>
                        <Text>{formatPrice(item.price)}</Text>
                        <br />
                        <Space>
                          <Button 
                            size="small" 
                            icon={<MinusOutlined />}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          />
                          <Text>{item.quantity}</Text>
                          <Button 
                            size="small" 
                            icon={<PlusOutlined />}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          />
                          <Button 
                            size="small" 
                            danger 
                            icon={<DeleteOutlined />}
                            onClick={() => removeFromCart(item.id)}
                          />
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Drawer>

        {/* Checkout Modal */}
        <Modal
          title="Thông tin thanh toán"
          open={checkoutVisible}
          onCancel={() => setCheckoutVisible(false)}
          footer={null}
          width={600}
        >
          <Alert
            message="📋 Thông tin quan trọng"
            description="Đơn hàng của bạn sẽ được gửi đến admin để phê duyệt. Bạn sẽ nhận được thông báo khi đơn hàng được phê duyệt hoặc từ chối."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <Form
            form={checkoutForm}
            layout="vertical"
            onFinish={handleCheckout}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
            
            <Form.Item
              name="address"
              label="Địa chỉ giao hàng"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input.TextArea 
                prefix={<EnvironmentOutlined />} 
                placeholder="Nhập địa chỉ giao hàng"
                rows={3}
              />
            </Form.Item>

            <Divider>Thông tin đơn hàng</Divider>
            
            <List
              size="small"
              dataSource={cart}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar size={40} src={item.image} shape="square" />}
                    title={item.name}
                    description={`Số lượng: ${item.quantity}`}
                  />
                  <Text strong>{formatPrice(item.price * item.quantity)}</Text>
                </List.Item>
              )}
            />
            
            <Divider />
            <Row justify="space-between" align="middle">
              <Text strong style={{ fontSize: '16px' }}>Tổng cộng:</Text>
              <Text strong style={{ fontSize: '20px', color: '#1890ff' }}>
                {formatPrice(getCartTotal())}
              </Text>
            </Row>
            
            <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
              <Button type="primary" size="large" block htmlType="submit">
                Xác nhận đặt hàng
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Shopping; 