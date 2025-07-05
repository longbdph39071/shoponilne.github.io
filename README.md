# Hệ thống quản lý bán hàng

Ứng dụng React.js với các module quản lý sản phẩm, đơn hàng, khách hàng và thống kê, cùng với REST API và hệ thống phân quyền.

## Tính năng chính

### Y1 - Module quản lý
1. **Module quản lý sản phẩm**: Thêm, sửa, xóa và quản lý sản phẩm
2. **Module quản lý đơn hàng**: Theo dõi và quản lý đơn hàng
3. **Module quản lý khách hàng**: Thêm mới và quản lý thông tin khách hàng
4. **Module thống kê**: Hiển thị biểu đồ doanh thu, sản phẩm bán chạy

### Y2 - REST API và phân quyền
1. **REST API**: Quản lý sản phẩm, đơn hàng, khách hàng
2. **Phân quyền**: Admin hoặc nhân viên bán hàng

## Công nghệ sử dụng

- **Frontend**: React.js, Ant Design, Recharts
- **Backend**: JSON Server với JSON Server Auth
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios

## Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy JSON Server (Backend)
```bash
npm run db
```
Server sẽ chạy tại: http://localhost:3001

### 3. Chạy ứng dụng React
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: http://localhost:5173

## Tài khoản demo

### Admin
- Email: admin@company.com
- Password: 123456
- Quyền: Toàn quyền quản lý hệ thống

### Staff
- Email: staff@company.com
- Password: 123456
- Quyền: Xem sản phẩm, khách hàng, đơn hàng và tạo/sửa đơn hàng

## Cấu trúc dự án

```
src/
├── components/          # Components tái sử dụng
│   └── Layout.jsx      # Layout chính với navigation
├── contexts/           # React Context
│   └── AuthContext.jsx # Quản lý authentication và phân quyền
├── pages/              # Các trang của ứng dụng
│   ├── Login.jsx       # Trang đăng nhập
│   ├── Dashboard.jsx   # Trang tổng quan
│   ├── Products.jsx    # Quản lý sản phẩm
│   ├── Customers.jsx   # Quản lý khách hàng
│   ├── Orders.jsx      # Quản lý đơn hàng
│   ├── Statistics.jsx  # Thống kê và biểu đồ
│   └── Users.jsx       # Quản lý người dùng (Admin only)
├── services/           # API services
│   └── api.js         # Cấu hình API và các hàm gọi API
└── App.jsx            # Component chính với routing
```

## API Endpoints

### Authentication
- `POST /login` - Đăng nhập
- `POST /register` - Đăng ký
- `POST /logout` - Đăng xuất

### Products
- `GET /products` - Lấy danh sách sản phẩm
- `GET /products/:id` - Lấy chi tiết sản phẩm
- `POST /products` - Tạo sản phẩm mới
- `PUT /products/:id` - Cập nhật sản phẩm
- `DELETE /products/:id` - Xóa sản phẩm

### Customers
- `GET /customers` - Lấy danh sách khách hàng
- `GET /customers/:id` - Lấy chi tiết khách hàng
- `POST /customers` - Tạo khách hàng mới
- `PUT /customers/:id` - Cập nhật khách hàng
- `DELETE /customers/:id` - Xóa khách hàng

### Orders
- `GET /orders` - Lấy danh sách đơn hàng
- `GET /orders/:id` - Lấy chi tiết đơn hàng
- `POST /orders` - Tạo đơn hàng mới
- `PUT /orders/:id` - Cập nhật đơn hàng
- `DELETE /orders/:id` - Xóa đơn hàng
- `PATCH /orders/:id` - Cập nhật trạng thái đơn hàng

### Users
- `GET /users` - Lấy danh sách người dùng
- `GET /users/:id` - Lấy chi tiết người dùng
- `POST /users` - Tạo người dùng mới
- `PUT /users/:id` - Cập nhật người dùng
- `DELETE /users/:id` - Xóa người dùng

## Phân quyền

### Admin
- Toàn quyền truy cập tất cả module
- Quản lý người dùng
- Xem thống kê chi tiết

### Staff
- Xem sản phẩm
- Xem khách hàng
- Xem, tạo, sửa đơn hàng
- Xem thống kê cơ bản

## Tính năng nổi bật

1. **Giao diện hiện đại**: Sử dụng Ant Design với UI/UX tối ưu
2. **Responsive**: Tương thích với mọi thiết bị
3. **Biểu đồ tương tác**: Sử dụng Recharts với nhiều loại biểu đồ
4. **Phân quyền chi tiết**: Kiểm soát quyền truy cập theo từng chức năng
5. **Validation**: Form validation đầy đủ
6. **Loading states**: Hiển thị trạng thái loading
7. **Error handling**: Xử lý lỗi tốt
8. **Pagination**: Phân trang cho bảng dữ liệu
9. **Search & Filter**: Tìm kiếm và lọc dữ liệu
10. **Export/Import**: Hỗ trợ xuất/nhập dữ liệu

## Hướng dẫn sử dụng

1. **Đăng nhập**: Sử dụng tài khoản demo để đăng nhập
2. **Dashboard**: Xem tổng quan hệ thống
3. **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm
4. **Quản lý khách hàng**: Quản lý thông tin khách hàng
5. **Quản lý đơn hàng**: Tạo và theo dõi đơn hàng
6. **Thống kê**: Xem biểu đồ doanh thu và sản phẩm bán chạy
7. **Quản lý người dùng**: Quản lý tài khoản (Admin only)

## Lưu ý

- Mật khẩu mặc định cho tài khoản mới: `123456`
- Dữ liệu được lưu trong file `db.json`
- Có thể thay đổi cấu hình API trong `src/services/api.js`
- Đảm bảo JSON Server đang chạy trước khi sử dụng ứng dụng
# shoponilne.github.io
