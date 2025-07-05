import { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  Popconfirm, 
  message, 
  Typography,
  Card,
  Row,
  Col,
  Tag,
  Descriptions,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { ordersAPI, customersAPI, productsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form] = Form.useForm();
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        ordersAPI.getAll(),
        customersAPI.getAll(),
        productsAPI.getAll()
      ]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingOrder(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingOrder(record);
    form.setFieldsValue({
      customerId: record.customerId,
      status: record.status,
      items: record.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    });
    setModalVisible(true);
  };

  const handleView = (record) => {
    setSelectedOrder(record);
    setDetailModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await ordersAPI.delete(id);
      message.success('Xóa đơn hàng thành công');
      fetchData();
    } catch (error) {
      message.error('Không thể xóa đơn hàng');
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      message.success(`Đã cập nhật trạng thái đơn hàng #${orderId.toString().padStart(6, '0')} thành: ${getStatusText(status)}. Người dùng sẽ nhận được thông báo.`);
      fetchData();
    } catch (error) {
      message.error('Không thể cập nhật trạng thái');
      console.error('Error updating status:', error);
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      await ordersAPI.updateStatus(orderId, 'pending');
      message.success(`Đã phê duyệt đơn hàng #${orderId.toString().padStart(6, '0')} thành công! Người dùng sẽ nhận được thông báo.`);
      fetchData();
    } catch (error) {
      message.error('Không thể phê duyệt đơn hàng');
      console.error('Error approving order:', error);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await ordersAPI.updateStatus(orderId, 'cancelled');
      message.success(`Đã từ chối đơn hàng #${orderId.toString().padStart(6, '0')}! Người dùng sẽ nhận được thông báo.`);
      fetchData();
    } catch (error) {
      message.error('Không thể từ chối đơn hàng');
      console.error('Error rejecting order:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const orderData = {
        ...values,
        customerName: customers.find(c => c.id === values.customerId)?.name,
        totalAmount: values.items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
        orderDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      if (editingOrder) {
        await ordersAPI.update(editingOrder.id, orderData);
        message.success('Cập nhật đơn hàng thành công');
      } else {
        await ordersAPI.create(orderData);
        message.success('Thêm đơn hàng thành công');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Có lỗi xảy ra');
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

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => formatCurrency(amount),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        if (status === 'awaiting_approval') {
          return (
            <div>
              <Tag color={getStatusColor(status)} style={{ marginBottom: '8px' }}>
                {getStatusText(status)}
              </Tag>
              <div style={{ display: 'flex', gap: '4px' }}>
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleApproveOrder(record.id)}
                  disabled={!hasPermission('edit_orders')}
                  style={{ fontSize: '10px', padding: '0 4px' }}
                >
                  Phê duyệt
                </Button>
                <Button
                  danger
                  size="small"
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleRejectOrder(record.id)}
                  disabled={!hasPermission('edit_orders')}
                  style={{ fontSize: '10px', padding: '0 4px' }}
                >
                  Từ chối
                </Button>
              </div>
            </div>
          );
        }
        
        return (
          <Select
            value={status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record.id, value)}
            disabled={!hasPermission('edit_orders')}
          >
            <Option value="awaiting_approval">Chờ phê duyệt</Option>
            <Option value="pending">Chờ xử lý</Option>
            <Option value="processing">Đang xử lý</Option>
            <Option value="shipped">Đang giao hàng</Option>
            <Option value="delivered">Đã giao hàng</Option>
            <Option value="completed">Hoàn thành</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
        );
      },
      filters: [
        { text: 'Chờ phê duyệt', value: 'awaiting_approval' },
        { text: 'Chờ xử lý', value: 'pending' },
        { text: 'Đang xử lý', value: 'processing' },
        { text: 'Đang giao hàng', value: 'shipped' },
        { text: 'Đã giao hàng', value: 'delivered' },
        { text: 'Hoàn thành', value: 'completed' },
        { text: 'Đã hủy', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          {hasPermission('edit_orders') && (
            <Button 
              type="link" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              Sửa
            </Button>
          )}
          {hasPermission('delete_orders') && (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa đơn hàng này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>Quản lý đơn hàng</Title>
        </Col>
        <Col>
          {hasPermission('create_orders') && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Thêm đơn hàng
            </Button>
          )}
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} đơn hàng`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa đơn hàng */}
      <Modal
        title={editingOrder ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerId"
                label="Khách hàng"
                rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
              >
                <Select placeholder="Chọn khách hàng">
                  {customers.map(customer => (
                    <Option key={customer.id} value={customer.id}>
                      {customer.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="awaiting_approval">Chờ phê duyệt</Option>
                  <Option value="pending">Chờ xử lý</Option>
                  <Option value="processing">Đang xử lý</Option>
                  <Option value="shipped">Đang giao hàng</Option>
                  <Option value="delivered">Đã giao hàng</Option>
                  <Option value="completed">Hoàn thành</Option>
                  <Option value="cancelled">Đã hủy</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={16} key={key}>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'productId']}
                        label="Sản phẩm"
                        rules={[{ required: true, message: 'Chọn sản phẩm!' }]}
                      >
                        <Select placeholder="Chọn sản phẩm">
                          {products.map(product => (
                            <Option key={product.id} value={product.id}>
                              {product.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        label="Số lượng"
                        rules={[{ required: true, message: 'Nhập số lượng!' }]}
                      >
                        <Input type="number" min={1} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'price']}
                        label="Đơn giá"
                        rules={[{ required: true, message: 'Nhập đơn giá!' }]}
                      >
                        <Input type="number" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Button 
                        type="link" 
                        danger 
                        onClick={() => remove(name)}
                        style={{ marginTop: 32 }}
                      >
                        Xóa
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Thêm sản phẩm
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingOrder ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết đơn hàng */}
      <Modal
        title="Chi tiết đơn hàng"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã đơn hàng">
                #{selectedOrder.id}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Họ tên">
                {selectedOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedOrder.customerEmail || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.customerPhone || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {selectedOrder.customerAddress || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {formatDate(selectedOrder.orderDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <strong>{formatCurrency(selectedOrder.totalAmount)}</strong>
              </Descriptions.Item>
            </Descriptions>

            <Divider>Danh sách sản phẩm</Divider>
            
            <Table
              columns={[
                {
                  title: 'Sản phẩm',
                  dataIndex: 'productName',
                  key: 'productName',
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Đơn giá',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => formatCurrency(price),
                },
                {
                  title: 'Thành tiền',
                  key: 'total',
                  render: (_, record) => formatCurrency(record.quantity * record.price),
                },
              ]}
              dataSource={selectedOrder.items}
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders; 