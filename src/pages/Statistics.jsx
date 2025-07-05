import { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Statistic, 
  Select, 
  DatePicker,
  Table,
  Space
} from 'antd';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  DollarOutlined, 
  ShoppingCartOutlined, 
  UserOutlined, 
  ShoppingOutlined 
} from '@ant-design/icons';
import { ordersAPI, productsAPI, customersAPI } from '../services/api';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Statistics = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        ordersAPI.getAll(),
        productsAPI.getAll(),
        customersAPI.getAll()
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  // Tính toán doanh thu theo thời gian
  const getRevenueData = () => {
    const now = new Date();
    const data = [];
    
    if (timeRange === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayOrders = orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate.toDateString() === date.toDateString();
        });
        const revenue = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        data.push({
          date: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
          revenue: revenue
        });
      }
    } else if (timeRange === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayOrders = orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate.toDateString() === date.toDateString();
        });
        const revenue = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        data.push({
          date: date.getDate().toString(),
          revenue: revenue
        });
      }
    } else if (timeRange === 'year') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthOrders = orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate.getMonth() === date.getMonth() && 
                 orderDate.getFullYear() === date.getFullYear();
        });
        const revenue = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        data.push({
          date: date.toLocaleDateString('vi-VN', { month: 'short' }),
          revenue: revenue
        });
      }
    }
    
    return data;
  };

  // Tính toán sản phẩm bán chạy
  const getTopProducts = () => {
    const productSales = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productSales[item.productId]) {
          productSales[item.productId].quantity += item.quantity;
          productSales[item.productId].revenue += item.quantity * item.price;
        } else {
          const product = products.find(p => p.id === item.productId);
          productSales[item.productId] = {
            name: product?.name || 'Unknown',
            quantity: item.quantity,
            revenue: item.quantity * item.price
          };
        }
      });
    });
    
    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  };

  // Tính toán thống kê tổng quan
  const getStats = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const completedOrders = orders.filter(order => order.status === 'completed');
    const pendingOrders = orders.filter(order => order.status === 'pending');
    
    return {
      totalRevenue,
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      pendingOrders: pendingOrders.length,
      totalCustomers: customers.length,
      totalProducts: products.length
    };
  };

  const stats = getStats();
  const revenueData = getRevenueData();
  const topProducts = getTopProducts();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '4px'
        }}>
          <p>{`${label}: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Title level={2}>Thống kê</Title>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(value)}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn hàng hoàn thành"
              value={stats.completedOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#3f8600' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Khách hàng"
              value={stats.totalCustomers}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ doanh thu */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card 
            title="Biểu đồ doanh thu" 
            extra={
              <Space>
                <Select 
                  value={timeRange} 
                  onChange={setTimeRange}
                  style={{ width: 120 }}
                >
                  <Option value="week">Tuần</Option>
                  <Option value="month">Tháng</Option>
                  <Option value="year">Năm</Option>
                </Select>
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Doanh thu"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Sản phẩm bán chạy */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Top 10 sản phẩm bán chạy (theo số lượng)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#8884d8" name="Số lượng" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Phân bố doanh thu theo sản phẩm">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {topProducts.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Bảng chi tiết sản phẩm bán chạy */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Chi tiết sản phẩm bán chạy">
            <Table
              columns={[
                {
                  title: 'Tên sản phẩm',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Số lượng bán',
                  dataIndex: 'quantity',
                  key: 'quantity',
                  sorter: (a, b) => a.quantity - b.quantity,
                },
                {
                  title: 'Doanh thu',
                  dataIndex: 'revenue',
                  key: 'revenue',
                  render: (revenue) => formatCurrency(revenue),
                  sorter: (a, b) => a.revenue - b.revenue,
                },
              ]}
              dataSource={topProducts}
              rowKey="name"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics; 