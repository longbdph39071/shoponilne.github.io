import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Typography, 
  Carousel, 
  Tag, 
  Space,
  Statistic,
  Divider,
  Alert
} from 'antd';
import { 
  ShoppingOutlined, 
  StarOutlined, 
  FireOutlined,
  ArrowRightOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Navigation from '../components/Navigation';

const { Title, Text, Paragraph } = Typography;

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      // Lấy 4 sản phẩm đầu tiên làm sản phẩm nổi bật
      setFeaturedProducts(response.data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const bannerContent = [
    {
      title: "Chào mừng đến với Shop Online",
      subtitle: "Khám phá các sản phẩm chất lượng với giá tốt nhất",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
      buttonText: "Mua sắm ngay",
      buttonAction: () => navigate('/shopping')
    },
    {
      title: "Ưu đãi đặc biệt",
      subtitle: "Giảm giá lên đến 50% cho các sản phẩm điện tử",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop",
      buttonText: "Xem ưu đãi",
      buttonAction: () => navigate('/shopping')
    },
    {
      title: "Giao hàng miễn phí",
      subtitle: "Miễn phí vận chuyển cho đơn hàng từ 500.000đ",
      image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&h=400&fit=crop",
      buttonText: "Tìm hiểu thêm",
      buttonAction: () => navigate('/shopping')
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navigation />
      
      <div style={{ padding: '24px' }}>
        {/* Hero Banner */}
        <div style={{ marginBottom: '48px' }}>
          <Carousel autoplay dots={{ position: 'bottom' }}>
            {bannerContent.map((banner, index) => (
              <div key={index}>
                <div style={{
                  height: '400px',
                  background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${banner.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  position: 'relative'
                }}>
                  <div style={{
                    textAlign: 'center',
                    color: 'white',
                    maxWidth: '600px',
                    padding: '0 24px'
                  }}>
                    <Title level={1} style={{ color: 'white', marginBottom: '16px' }}>
                      {banner.title}
                    </Title>
                    <Paragraph style={{ 
                      fontSize: '18px', 
                      color: 'white', 
                      marginBottom: '32px',
                      opacity: 0.9
                    }}>
                      {banner.subtitle}
                    </Paragraph>
                    <Button 
                      type="primary" 
                      size="large"
                      icon={<ShoppingOutlined />}
                      onClick={banner.buttonAction}
                      style={{ 
                        height: '48px', 
                        padding: '0 32px',
                        fontSize: '16px',
                        borderRadius: '8px'
                      }}
                    >
                      {banner.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Order Status Info */}
        {user && user.role === 'user' && (
          <Alert
            message="📋 Quy trình đặt hàng"
            description="Khi bạn đặt hàng, đơn hàng sẽ được gửi đến admin để phê duyệt. Bạn sẽ nhận được thông báo khi đơn hàng được phê duyệt hoặc từ chối. Bạn có thể theo dõi trạng thái đơn hàng trong lịch sử đặt hàng."
            type="info"
            showIcon
            closable
            style={{ marginBottom: '24px' }}
            action={
              <Button size="small" type="link" onClick={() => navigate('/order-history')}>
                Xem lịch sử
              </Button>
            }
          />
        )}

        {/* Stats Section */}
        <Card style={{ marginBottom: '48px', textAlign: 'center' }}>
          <Row gutter={[32, 16]}>
            <Col xs={24} sm={8}>
              <Statistic
                title="Sản phẩm đa dạng"
                value={featuredProducts.length * 10}
                suffix="+"
                prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Khách hàng hài lòng"
                value={1000}
                suffix="+"
                prefix={<HeartOutlined style={{ color: '#ff4d4f' }} />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Đơn hàng thành công"
                value={5000}
                suffix="+"
                prefix={<StarOutlined style={{ color: '#faad14' }} />}
              />
            </Col>
          </Row>
        </Card>

        {/* Featured Products */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <Title level={2}>
              <FireOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
              Sản phẩm nổi bật
            </Title>
            <Button 
              type="link" 
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate('/shopping')}
            >
              Xem tất cả
            </Button>
          </div>

          <Row gutter={[24, 24]}>
            {featuredProducts.map(product => (
              <Col xs={24} sm={12} md={6} key={product.id}>
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
                      onClick={() => navigate('/shopping')}
                    >
                      Mua ngay
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
        </div>

        {/* Features Section */}
        <Card style={{ marginBottom: '48px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
            Tại sao chọn chúng tôi?
          </Title>
          <Row gutter={[32, 24]}>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#e6f7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '32px',
                  color: '#1890ff'
                }}>
                  🚚
                </div>
                <Title level={4}>Giao hàng nhanh chóng</Title>
                <Text type="secondary">
                  Giao hàng trong vòng 24h tại TP.HCM và 2-3 ngày cho các tỉnh khác
                </Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#f6ffed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '32px',
                  color: '#52c41a'
                }}>
                  💎
                </div>
                <Title level={4}>Chất lượng đảm bảo</Title>
                <Text type="secondary">
                  Tất cả sản phẩm đều được kiểm tra chất lượng trước khi giao hàng
                </Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#fff7e6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '32px',
                  color: '#faad14'
                }}>
                  💰
                </div>
                <Title level={4}>Giá cả hợp lý</Title>
                <Text type="secondary">
                  Cam kết giá tốt nhất thị trường với nhiều ưu đãi hấp dẫn
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* CTA Section */}
        <Card style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
                    <Title level={2} style={{ color: 'white', marginBottom: '16px' }}>
            {user ? `Chào mừng trở lại, ${user.name}!` : 'Sẵn sàng mua sắm?'}
          </Title>
          <Paragraph style={{ 
            fontSize: '18px', 
            color: 'white', 
            marginBottom: '32px',
            opacity: 0.9
          }}>
            {user ? 'Tiếp tục khám phá các sản phẩm chất lượng với giá tốt nhất' : 'Khám phá ngay các sản phẩm chất lượng với giá tốt nhất'}
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large"
              icon={<ShoppingOutlined />}
              onClick={() => navigate('/shopping')}
              style={{ 
                height: '48px', 
                padding: '0 32px',
                fontSize: '16px',
                borderRadius: '8px',
                background: 'white',
                color: '#667eea',
                border: 'none'
              }}
            >
              {user ? 'Tiếp tục mua sắm' : 'Bắt đầu mua sắm'}
            </Button>
            {!user && (
              <>
                <Button 
                  size="large"
                  onClick={() => navigate('/register')}
                  style={{ 
                    height: '48px', 
                    padding: '0 32px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    background: 'transparent',
                    color: 'white',
                    border: '2px solid white'
                  }}
                >
                  Đăng ký
                </Button>
                <Button 
                  size="large"
                  onClick={() => navigate('/login')}
                  style={{ 
                    height: '48px', 
                    padding: '0 32px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  Đăng nhập
                </Button>
              </>
            )}
            {user && (
              <>
                <Button 
                  size="large"
                  onClick={() => navigate('/order-history')}
                  style={{ 
                    height: '48px', 
                    padding: '0 32px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    background: 'transparent',
                    color: 'white',
                    border: '2px solid white'
                  }}
                >
                  Lịch sử đặt hàng
                </Button>
                <Button 
                  size="large"
                  onClick={() => navigate('/profile')}
                  style={{ 
                    height: '48px', 
                    padding: '0 32px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  Xem hồ sơ
                </Button>
              </>
            )}
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default Home; 