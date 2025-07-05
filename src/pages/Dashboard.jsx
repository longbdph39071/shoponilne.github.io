import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Progress, Tag, Alert } from 'antd';
import {
  ShoppingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ArrowUpOutlined, // Thay thế TrendingUpOutlined
  ArrowDownOutlined, // Thay thế TrendingDownOutlined
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { productsAPI, customersAPI, ordersAPI } from '../services/api';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    awaitingApprovalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    lowStockProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, customersRes, ordersRes] = await Promise.all([
        productsAPI.getAll(),
        customersAPI.getAll(),
        ordersAPI.getAll()
      ]);

      const products = productsRes.data;
      const customers = customersRes.data;
      const orders = ordersRes.data;

      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const awaitingApprovalOrders = orders.filter(order => order.status === 'awaiting_approval');
      const completedOrders = orders.filter(order => order.status === 'completed');
      const pendingOrders = orders.filter(order => order.status === 'pending');
      const processingOrders = orders.filter(order => order.status === 'processing');
      const shippedOrders = orders.filter(order => order.status === 'shipped');
      const deliveredOrders = orders.filter(order => order.status === 'delivered');
      const cancelledOrders = orders.filter(order => order.status === 'cancelled');
      const lowStockProducts = products.filter(product => product.stock < 10);

      const recentOrdersData = orders
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 5);

      setStats({
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalOrders: orders.length,
        totalRevenue,
        awaitingApprovalOrders: awaitingApprovalOrders.length,
        completedOrders: completedOrders.length,
        pendingOrders: pendingOrders.length,
        processingOrders: processingOrders.length,
        shippedOrders: shippedOrders.length,
        deliveredOrders: deliveredOrders.length,
        cancelledOrders: cancelledOrders.length,
        lowStockProducts: lowStockProducts.length
      });

      setRecentOrders(recentOrdersData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getCompletionRate = () => {
    if (stats.totalOrders === 0) return 0;
    return Math.round((stats.completedOrders / stats.totalOrders) * 100);
  };

  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined style={{ color: '#1890ff' }} />
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => (
        <Text strong style={{ color: '#52c41a' }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'awaiting_approval': return 'gold';
            case 'pending': return 'orange';
            case 'processing': return 'blue';
            case 'shipped': return 'purple';
            case 'delivered': return 'green';
            case 'completed': return 'green';
            case 'cancelled': return 'red';
            default: return 'default';
          }
        };

        const getStatusText = (status) => {
          switch (status) {
            case 'awaiting_approval': return 'Chờ phê duyệt';
            case 'pending': return 'Chờ xử lý';
            case 'processing': return 'Đang xử lý';
            case 'shipped': return 'Đang giao hàng';
            case 'delivered': return 'Đã giao hàng';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
          }
        };

        return (
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => formatDate(date),
    },
  ];

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: '#262626' }}>
          Dashboard
        </Title>
        <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
          Tổng quan hệ thống quản lý bán hàng
        </Text>
      </div>

      {/* Alert for pending approvals */}
      {stats.awaitingApprovalOrders > 0 && (
        <Alert
          message={`📋 Có ${stats.awaitingApprovalOrders} đơn hàng chờ phê duyệt`}
          description="Vui lòng truy cập trang 'Phê duyệt đơn hàng' để xem xét và phê duyệt các đơn hàng mới."
          type="warning"
          showIcon
          closable
          style={{ marginBottom: '24px' }}
          action={
            <a href="/order-approval" style={{ color: '#faad14' }}>
              Xem ngay
            </a>
          }
        />
      )}

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} className="dashboard-stats">
        <Col xs={24} sm={12} lg={6}>
          <Card className="statistic-card">
            <Statistic
              title="Tổng sản phẩm"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined />}
              loading={loading}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {stats.lowStockProducts} sản phẩm sắp hết hàng
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="statistic-card">
            <Statistic
              title="Tổng khách hàng"
              value={stats.totalCustomers}
              prefix={<UserOutlined />}
              loading={loading}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Khách hàng đã đăng ký
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="statistic-card">
            <Statistic
              title="Tổng đơn hàng"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
              loading={loading}
              valueStyle={{ color: '#fa8c16' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {stats.pendingOrders} đơn hàng đang xử lý
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="statistic-card">
            <Statistic
              title="Tổng doanh thu"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(value)}
              loading={loading}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Tổng doanh thu hệ thống
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Tỷ lệ hoàn thành đơn hàng" className="chart-container">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Progress
                type="circle"
                percent={getCompletionRate()}
                format={(percent) => `${percent}%`}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                size={120}
              />
              <div style={{ marginTop: 16 }}>
                <Text strong>{stats.completedOrders}</Text>
                <Text type="secondary"> / {stats.totalOrders} đơn hàng</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Thống kê trạng thái đơn hàng" className="chart-container">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '12px' }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#faad14',
                    marginBottom: '4px'
                  }}>
                    {stats.awaitingApprovalOrders}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Chờ phê duyệt</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '12px' }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#fa8c16',
                    marginBottom: '4px'
                  }}>
                    {stats.pendingOrders}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Chờ xử lý</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '12px' }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1890ff',
                    marginBottom: '4px'
                  }}>
                    {stats.processingOrders}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Đang xử lý</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '12px' }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#722ed1',
                    marginBottom: '4px'
                  }}>
                    {stats.shippedOrders}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Đang giao</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '12px' }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#52c41a',
                    marginBottom: '4px'
                  }}>
                    {stats.deliveredOrders}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Đã giao</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '12px' }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#52c41a',
                    marginBottom: '4px'
                  }}>
                    {stats.completedOrders}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Hoàn thành</Text>
                </div>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '8px' }}>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '12px' }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ff4d4f',
                    marginBottom: '4px'
                  }}>
                    {stats.cancelledOrders}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Đã hủy</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Card
        title="Đơn hàng gần đây"
        className="chart-container"
        extra={
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Hiển thị 5 đơn hàng mới nhất
          </Text>
        }
      >
        <Table
          columns={orderColumns}
          dataSource={recentOrders}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default Dashboard;