import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Typography, 
  Space, 
  Button, 
  Modal, 
  List, 
  Avatar,
  Empty,
  Spin,
  message,
  Row,
  Col,
  Statistic,
  Descriptions,
  Divider,
  Popconfirm
} from 'antd';
import { 
  ShoppingOutlined, 
  EyeOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import api from '../services/api';

const { Title, Text } = Typography;

const OrderApproval = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [stats, setStats] = useState({
    totalAwaiting: 0,
    totalApproved: 0,
    totalRejected: 0
  });

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'staff')) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      
      // Lọc đơn hàng chờ phê duyệt
      const awaitingOrders = response.data.filter(order => 
        order.status === 'awaiting_approval'
      );
      
      // Tính thống kê
      const totalApproved = response.data.filter(order => 
        order.status === 'pending'
      ).length;
      const totalRejected = response.data.filter(order => 
        order.status === 'cancelled'
      ).length;
      
      setOrders(awaitingOrders);
      setStats({
        totalAwaiting: awaitingOrders.length,
        totalApproved,
        totalRejected
      });
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setDetailVisible(true);
  };

  const handleApproveOrder = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}`, { status: 'pending' });
      message.success(`Đã phê duyệt đơn hàng #${orderId.toString().padStart(6, '0')} thành công! Người dùng sẽ nhận được thông báo.`);
      fetchOrders();
    } catch (error) {
      message.error('Không thể phê duyệt đơn hàng');
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}`, { status: 'cancelled' });
      message.success(`Đã từ chối đơn hàng #${orderId.toString().padStart(6, '0')}! Người dùng sẽ nhận được thông báo.`);
      fetchOrders();
    } catch (error) {
      message.error('Không thể từ chối đơn hàng');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => `#${id.toString().padStart(6, '0')}`
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.customerEmail}
          </Text>
        </div>
      )
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 150,
      render: (date) => (
        <div>
          <CalendarOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
          {formatDate(date)}
        </div>
      )
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <div>
          <Text strong>{items.length} sản phẩm</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {items.map(item => item.productName).join(', ')}
          </Text>
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
      render: (amount) => (
        <div>
          <DollarOutlined style={{ marginRight: '4px', color: '#52c41a' }} />
          <Text strong style={{ color: '#52c41a' }}>
            {formatPrice(amount)}
          </Text>
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showOrderDetail(record)}
          >
            Chi tiết
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn phê duyệt đơn hàng này?"
            onConfirm={() => handleApproveOrder(record.id)}
            okText="Phê duyệt"
            cancelText="Hủy"
            icon={<ExclamationCircleOutlined style={{ color: 'green' }} />}
          >
            <Button 
              type="primary" 
              size="small"
              icon={<CheckCircleOutlined />}
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
            >
              Phê duyệt
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Bạn có chắc chắn muốn từ chối đơn hàng này?"
            onConfirm={() => handleRejectOrder(record.id)}
            okText="Từ chối"
            cancelText="Hủy"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button 
              danger 
              size="small"
              icon={<CloseCircleOutlined />}
            >
              Từ chối
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Navigation />
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Card>
            <Title level={3}>Bạn không có quyền truy cập trang này</Title>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navigation />
      
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                <CheckCircleOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                Phê duyệt đơn hàng
              </Title>
              <Text type="secondary">
                Xem xét và phê duyệt các đơn hàng chờ xử lý
              </Text>
            </div>
          </div>

          {/* Thống kê */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Đơn hàng chờ phê duyệt"
                  value={stats.totalAwaiting}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Đã phê duyệt"
                  value={stats.totalApproved}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Đã từ chối"
                  value={stats.totalRejected}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px' }}>
                <Text>Đang tải danh sách đơn hàng...</Text>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <Empty 
              description="Không có đơn hàng nào chờ phê duyệt"
              style={{ margin: '48px 0' }}
            >
              <Text type="secondary">Tất cả đơn hàng đã được xử lý</Text>
            </Empty>
          ) : (
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} của ${total} đơn hàng`
              }}
              scroll={{ x: 1000 }}
            />
          )}
        </Card>
      </div>

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={
          <Space>
            <ShoppingOutlined />
            Chi tiết đơn hàng #{selectedOrder?.id?.toString().padStart(6, '0')}
          </Space>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>,
          <Popconfirm
            key="reject"
            title="Bạn có chắc chắn muốn từ chối đơn hàng này?"
            onConfirm={() => {
              handleRejectOrder(selectedOrder.id);
              setDetailVisible(false);
            }}
            okText="Từ chối"
            cancelText="Hủy"
          >
            <Button danger>
              Từ chối đơn hàng
            </Button>
          </Popconfirm>,
          <Popconfirm
            key="approve"
            title="Bạn có chắc chắn muốn phê duyệt đơn hàng này?"
            onConfirm={() => {
              handleApproveOrder(selectedOrder.id);
              setDetailVisible(false);
            }}
            okText="Phê duyệt"
            cancelText="Hủy"
          >
            <Button type="primary">
              Phê duyệt đơn hàng
            </Button>
          </Popconfirm>
        ]}
        width={800}
      >
        {selectedOrder && (
          <div>
            {/* Thông tin đơn hàng */}
            <Card size="small" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Trạng thái: </Text>
                  <Tag color="gold" icon={<ClockCircleOutlined />}>
                    Chờ phê duyệt
                  </Tag>
                </div>
                <div>
                  <Text strong>Ngày đặt: </Text>
                  <Text>{formatDate(selectedOrder.orderDate)}</Text>
                </div>
              </div>
            </Card>

            {/* Thông tin khách hàng */}
            <Card size="small" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <Text strong>Thông tin khách hàng</Text>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <Text type="secondary">Họ tên:</Text>
                  <br />
                  <Text strong>{selectedOrder.customerName}</Text>
                </div>
                <div>
                  <Text type="secondary">Email:</Text>
                  <br />
                  <Text>{selectedOrder.customerEmail}</Text>
                </div>
                <div>
                  <Text type="secondary">Số điện thoại:</Text>
                  <br />
                  <Text>{selectedOrder.customerPhone}</Text>
                </div>
                <div>
                  <Text type="secondary">Địa chỉ:</Text>
                  <br />
                  <Text>{selectedOrder.customerAddress}</Text>
                </div>
              </div>
            </Card>

            {/* Danh sách sản phẩm */}
            <Card size="small" style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <Text strong>Sản phẩm đã đặt</Text>
              </div>
              <List
                dataSource={selectedOrder.items}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          size={48} 
                          icon={<ShoppingOutlined />}
                          style={{ background: '#f0f0f0' }}
                        />
                      }
                      title={item.productName}
                      description={
                        <div>
                          <Text>Số lượng: {item.quantity}</Text>
                          <br />
                          <Text type="secondary">
                            Đơn giá: {formatPrice(item.price)}
                          </Text>
                        </div>
                      }
                    />
                    <div style={{ textAlign: 'right' }}>
                      <Text strong style={{ fontSize: '16px' }}>
                        {formatPrice(item.price * item.quantity)}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* Tổng tiền */}
            <Card size="small">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '18px'
              }}>
                <Text strong>Tổng cộng:</Text>
                <Text strong style={{ fontSize: '20px', color: '#52c41a' }}>
                  {formatPrice(selectedOrder.totalAmount)}
                </Text>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderApproval; 