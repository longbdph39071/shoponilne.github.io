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
  Progress,
  Timeline,
  Alert,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  ShoppingOutlined, 
  EyeOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  StopOutlined,
  SyncOutlined,
  ReloadOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import api from '../services/api';

const { Title, Text } = Typography;

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [hasNewApprovals, setHasNewApprovals] = useState(false);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    awaitingApproval: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
      
      // Tự động refresh dữ liệu mỗi 30 giây để cập nhật trạng thái
      const interval = setInterval(() => {
        fetchOrders(true);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchOrders = async (showMessage = false) => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để xem lịch sử đặt hàng');
      return;
    }

    try {
      setLoading(true);
      // Lấy customers để tìm customerId nếu có
      const [ordersResponse, customersResponse] = await Promise.all([
        api.get('/orders'),
        api.get('/customers')
      ]);
      const allOrders = ordersResponse.data;
      const allCustomers = customersResponse.data;
      // Tìm customerId nếu user có trong bảng customers
      let customerId = null;
      if (user.email) {
        const found = allCustomers.find(c => c.email === user.email);
        if (found) customerId = found.id;
      }
      // Lọc đơn hàng theo customerEmail hoặc customerId
      const userOrders = allOrders.filter(order => {
        if (order.customerEmail && user.email && order.customerEmail === user.email) return true;
        if (order.customerId && customerId && order.customerId === customerId) return true;
        return false;
      });
      setOrders(userOrders);
      setLastUpdate(new Date());
      // Tính toán thống kê đơn hàng
      const stats = {
        total: userOrders.length,
        awaitingApproval: userOrders.filter(order => order.status === 'awaiting_approval').length,
        pending: userOrders.filter(order => order.status === 'pending').length,
        processing: userOrders.filter(order => order.status === 'processing').length,
        shipped: userOrders.filter(order => order.status === 'shipped').length,
        delivered: userOrders.filter(order => order.status === 'delivered').length,
        completed: userOrders.filter(order => order.status === 'completed').length,
        cancelled: userOrders.filter(order => order.status === 'cancelled').length
      };
      setOrderStats(stats);
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Không thể tải lịch sử đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setDetailVisible(true);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'awaiting_approval':
        return 'gold';
      case 'pending':
        return 'orange';
      case 'processing':
        return 'blue';
      case 'shipped':
        return 'purple';
      case 'delivered':
        return 'green';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'awaiting_approval':
        return <ClockCircleOutlined />;
      case 'pending':
        return <ClockCircleOutlined />;
      case 'processing':
        return <SyncOutlined spin />;
      case 'shipped':
        return <CarOutlined />;
      case 'delivered':
      case 'completed':
        return <CheckCircleOutlined />;
      case 'cancelled':
        return <StopOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'awaiting_approval':
        return 'Chờ phê duyệt';
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusProgress = (status) => {
    switch (status) {
      case 'awaiting_approval':
        return 10;
      case 'pending':
        return 25;
      case 'processing':
        return 50;
      case 'shipped':
        return 75;
      case 'delivered':
      case 'completed':
        return 100;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  const getStatusTimeline = (status) => {
    const timeline = [
      { status: 'awaiting_approval', text: 'Đơn hàng đã được đặt', icon: <ClockCircleOutlined />, color: 'blue' },
      { status: 'pending', text: 'Đơn hàng đã được phê duyệt', icon: <CheckCircleOutlined />, color: 'blue' },
      { status: 'processing', text: 'Đơn hàng đang được xử lý', icon: <SyncOutlined />, color: 'blue' },
      { status: 'shipped', text: 'Đơn hàng đang được giao', icon: <CarOutlined />, color: 'blue' },
      { status: 'delivered', text: 'Đơn hàng đã được giao', icon: <CheckCircleOutlined />, color: 'green' }
    ];

    const currentIndex = timeline.findIndex(item => item.status === status);
    if (status === 'cancelled') {
      return timeline.map((item, index) => ({
        ...item,
        color: 'red',
        icon: <StopOutlined />
      }));
    }

    return timeline.map((item, index) => ({
      ...item,
      color: index <= currentIndex ? item.color : 'gray'
    }));
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status, record) => {
        const isNewStatus = record.status === 'pending' && record.orderDate > new Date(Date.now() - 5 * 60 * 1000); // 5 phút gần đây
        
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <Tag 
                color={getStatusColor(status)} 
                icon={getStatusIcon(status)}
              >
                {getStatusText(status)}
              </Tag>
              {isNewStatus && (
                <Tag color="green" style={{ fontSize: '10px', padding: '0 4px' }}>
                  Mới
                </Tag>
              )}
            </div>
            <Progress 
              percent={getStatusProgress(status)} 
              size="small" 
              showInfo={false}
              strokeColor={getStatusColor(status)}
            />
          </div>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small"
          icon={<EyeOutlined />}
          onClick={() => showOrderDetail(record)}
        >
          Chi tiết
        </Button>
      )
    }
  ];

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Navigation />
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Card>
            <Title level={3}>Vui lòng đăng nhập để xem lịch sử đặt hàng</Title>
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
          {hasNewApprovals && (
            <Alert
              message="🎉 Có đơn hàng mới được phê duyệt!"
              description="Đơn hàng của bạn đã được admin phê duyệt và đang chờ xử lý. Bạn có thể theo dõi tiến trình trong bảng bên dưới."
              type="success"
              showIcon
              closable
              onClose={() => setHasNewApprovals(false)}
              style={{ marginBottom: '16px' }}
            />
          )}
          
          {/* Thông báo đơn hàng đang chờ phê duyệt */}
          {orderStats.awaitingApproval > 0 && (
            <Alert
              message="⏳ Có đơn hàng đang chờ phê duyệt"
              description={`Bạn có ${orderStats.awaitingApproval} đơn hàng đang chờ admin phê duyệt. Vui lòng chờ thông báo khi đơn hàng được xử lý.`}
              type="warning"
              showIcon
              closable
              style={{ marginBottom: '16px' }}
            />
          )}
          
          {/* Thông báo đơn hàng hoàn thành */}
          {orderStats.completed > 0 && (
            <Alert
              message="🎉 Có đơn hàng đã hoàn thành!"
              description={`Chúc mừng! Bạn có ${orderStats.completed} đơn hàng đã hoàn thành thành công. Cảm ơn bạn đã tin tưởng chúng tôi!`}
              type="success"
              showIcon
              closable
              style={{ marginBottom: '16px' }}
            />
          )}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                <ShoppingOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                Lịch sử đặt hàng
              </Title>
              <Text type="secondary">
                Xem lại các đơn hàng đã đặt và theo dõi trạng thái
              </Text>
              {lastUpdate && (
                <div style={{ marginTop: '4px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    <BellOutlined style={{ marginRight: '4px' }} />
                    Cập nhật lần cuối: {lastUpdate.toLocaleTimeString('vi-VN')}
                  </Text>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: '16px' }}>Tổng cộng: {orderStats.total} đơn hàng</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {orderStats.completed > 0 && `${orderStats.completed} hoàn thành`}
                  {orderStats.completed > 0 && orderStats.total > orderStats.completed && ' • '}
                  {orderStats.total - orderStats.completed > 0 && `${orderStats.total - orderStats.completed} đang xử lý`}
                </Text>
              </div>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => fetchOrders(true)}
                loading={loading}
                size="small"
              >
                Làm mới
              </Button>
            </div>
          </div>

          {/* Thống kê đơn hàng */}
          {orderStats.total > 0 && (
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col xs={12} sm={6} md={3}>
                <Card size="small" style={{ textAlign: 'center', background: orderStats.awaitingApproval > 0 ? '#fff7e6' : '#f5f5f5' }}>
                  <Statistic
                    title="Chờ phê duyệt"
                    value={orderStats.awaitingApproval}
                    valueStyle={{ color: orderStats.awaitingApproval > 0 ? '#fa8c16' : '#999' }}
                    prefix={<ClockCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Card size="small" style={{ textAlign: 'center', background: orderStats.pending > 0 ? '#fff7e6' : '#f5f5f5' }}>
                  <Statistic
                    title="Chờ xử lý"
                    value={orderStats.pending}
                    valueStyle={{ color: orderStats.pending > 0 ? '#fa8c16' : '#999' }}
                    prefix={<ClockCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Card size="small" style={{ textAlign: 'center', background: orderStats.processing > 0 ? '#e6f7ff' : '#f5f5f5' }}>
                  <Statistic
                    title="Đang xử lý"
                    value={orderStats.processing}
                    valueStyle={{ color: orderStats.processing > 0 ? '#1890ff' : '#999' }}
                    prefix={<SyncOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Card size="small" style={{ textAlign: 'center', background: orderStats.shipped > 0 ? '#f0f0ff' : '#f5f5f5' }}>
                  <Statistic
                    title="Đang giao"
                    value={orderStats.shipped}
                    valueStyle={{ color: orderStats.shipped > 0 ? '#722ed1' : '#999' }}
                    prefix={<CarOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Card size="small" style={{ textAlign: 'center', background: orderStats.delivered > 0 ? '#f6ffed' : '#f5f5f5' }}>
                  <Statistic
                    title="Đã giao"
                    value={orderStats.delivered}
                    valueStyle={{ color: orderStats.delivered > 0 ? '#52c41a' : '#999' }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Card size="small" style={{ textAlign: 'center', background: orderStats.completed > 0 ? '#f6ffed' : '#f5f5f5' }}>
                  <Statistic
                    title="Hoàn thành"
                    value={orderStats.completed}
                    valueStyle={{ color: orderStats.completed > 0 ? '#52c41a' : '#999' }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Card size="small" style={{ textAlign: 'center', background: orderStats.cancelled > 0 ? '#fff2f0' : '#f5f5f5' }}>
                  <Statistic
                    title="Đã hủy"
                    value={orderStats.cancelled}
                    valueStyle={{ color: orderStats.cancelled > 0 ? '#ff4d4f' : '#999' }}
                    prefix={<StopOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Card size="small" style={{ textAlign: 'center', background: '#f0f9ff' }}>
                  <Statistic
                    title="Tổng đơn hàng"
                    value={orderStats.total}
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<ShoppingOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px' }}>
                <Text>Đang tải lịch sử đặt hàng...</Text>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div>
              <Empty 
                description={
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong style={{ fontSize: '16px' }}>Bạn chưa có đơn hàng nào</Text>
                      <br />
                      <Text type="secondary">Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên của bạn!</Text>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        💡 Mẹo: Sau khi đặt hàng, bạn có thể theo dõi trạng thái đơn hàng tại đây
                      </Text>
                    </div>
                  </div>
                }
              />
            </div>
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
              scroll={{ x: 800 }}
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
          </Button>
        ]}
        width={800}
      >
        {selectedOrder && (
          <div>
            {/* Thông tin đơn hàng */}
            <Card size="small" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <Text strong>Trạng thái: </Text>
                  <Tag 
                    color={getStatusColor(selectedOrder.status)} 
                    icon={getStatusIcon(selectedOrder.status)}
                    style={{ fontSize: '14px', padding: '4px 8px' }}
                  >
                    {getStatusText(selectedOrder.status)}
                  </Tag>
                  {selectedOrder.status === 'pending' && (
                    <div style={{ marginTop: '8px' }}>
                      <Text type="success" style={{ fontSize: '12px' }}>
                        <CheckCircleOutlined style={{ marginRight: '4px' }} />
                        Đơn hàng đã được phê duyệt và đang chờ xử lý
                      </Text>
                    </div>
                  )}
                  {selectedOrder.status === 'cancelled' && (
                    <div style={{ marginTop: '8px' }}>
                      <Text type="danger" style={{ fontSize: '12px' }}>
                        <StopOutlined style={{ marginRight: '4px' }} />
                        Đơn hàng đã bị từ chối bởi admin
                      </Text>
                    </div>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <div style={{ marginTop: '8px' }}>
                      <Text type="primary" style={{ fontSize: '12px' }}>
                        <SyncOutlined style={{ marginRight: '4px' }} />
                        Đơn hàng đang được xử lý và chuẩn bị giao hàng
                      </Text>
                    </div>
                  )}
                  {selectedOrder.status === 'shipped' && (
                    <div style={{ marginTop: '8px' }}>
                      <Text type="primary" style={{ fontSize: '12px' }}>
                        <CarOutlined style={{ marginRight: '4px' }} />
                        Đơn hàng đang được giao đến bạn
                      </Text>
                    </div>
                  )}
                  {(selectedOrder.status === 'delivered' || selectedOrder.status === 'completed') && (
                    <div style={{ marginTop: '8px' }}>
                      <Text type="success" style={{ fontSize: '12px' }}>
                        <CheckCircleOutlined style={{ marginRight: '4px' }} />
                        Đơn hàng đã hoàn thành thành công!
                      </Text>
                    </div>
                  )}
                </div>
                <div>
                  <Text strong>Ngày đặt: </Text>
                  <Text>{formatDate(selectedOrder.orderDate)}</Text>
                </div>
              </div>
              
              {/* Progress bar */}
              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ marginBottom: '8px', display: 'block' }}>
                  Tiến độ đơn hàng:
                </Text>
                <Progress 
                  percent={getStatusProgress(selectedOrder.status)} 
                  strokeColor={getStatusColor(selectedOrder.status)}
                  format={() => `${getStatusProgress(selectedOrder.status)}%`}
                />
              </div>

              {/* Timeline */}
              <div>
                <Text strong style={{ marginBottom: '8px', display: 'block' }}>
                  Lịch trình đơn hàng:
                </Text>
                <Timeline
                  items={getStatusTimeline(selectedOrder.status).map((item, index) => ({
                    color: item.color,
                    children: (
                      <div>
                        <Text strong>{item.text}</Text>
                        {index === 0 && (
                          <div style={{ marginTop: '4px' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {formatDate(selectedOrder.orderDate)}
                            </Text>
                          </div>
                        )}
                      </div>
                    )
                  }))}
                />
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

export default OrderHistory; 