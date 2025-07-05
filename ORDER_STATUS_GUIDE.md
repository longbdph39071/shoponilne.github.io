# Hướng dẫn sử dụng tính năng Trạng thái đơn hàng

## Tổng quan
Hệ thống quản lý bán hàng đã được cập nhật với tính năng theo dõi trạng thái đơn hàng chi tiết, giúp khách hàng và admin theo dõi tiến trình đơn hàng một cách trực quan.

## Các trạng thái đơn hàng

### 1. Chờ phê duyệt (Awaiting Approval) 🟡
- **Màu sắc**: Gold
- **Mô tả**: Đơn hàng đã được đặt thành công và đang chờ admin phê duyệt
- **Hành động tiếp theo**: Admin cần xem xét và phê duyệt hoặc từ chối đơn hàng

### 2. Chờ xử lý (Pending) 🟠
- **Màu sắc**: Orange
- **Mô tả**: Đơn hàng đã được phê duyệt và đang chờ admin xử lý
- **Hành động tiếp theo**: Admin cần chuẩn bị hàng và chuyển sang trạng thái "Đang xử lý"

### 3. Đang xử lý (Processing) 🔵
- **Màu sắc**: Blue
- **Mô tả**: Đơn hàng đang được admin xử lý, chuẩn bị hàng
- **Hành động tiếp theo**: Admin chuyển sang trạng thái "Đang giao hàng" khi đã chuẩn bị xong

### 4. Đang giao hàng (Shipped) 🟣
- **Màu sắc**: Purple
- **Mô tả**: Đơn hàng đã được đóng gói và đang được giao đến khách hàng
- **Hành động tiếp theo**: Chuyển sang trạng thái "Đã giao hàng" khi giao thành công

### 5. Đã giao hàng (Delivered) 🟢
- **Màu sắc**: Green
- **Mô tả**: Đơn hàng đã được giao thành công đến khách hàng
- **Hành động tiếp theo**: Có thể chuyển sang trạng thái "Hoàn thành" sau khi khách hàng xác nhận

### 6. Hoàn thành (Completed) 🟢
- **Màu sắc**: Green
- **Mô tả**: Đơn hàng đã hoàn tất toàn bộ quy trình
- **Hành động tiếp theo**: Không cần thêm hành động

### 7. Đã hủy (Cancelled) 🔴
- **Màu sắc**: Red
- **Mô tả**: Đơn hàng đã bị hủy bỏ
- **Hành động tiếp theo**: Không cần thêm hành động

## Tính năng cho Khách hàng

### 1. Xem trạng thái đơn hàng
- Truy cập trang "Lịch sử đặt hàng" từ menu
- Xem danh sách tất cả đơn hàng với trạng thái hiện tại
- Mỗi đơn hàng hiển thị:
  - Mã đơn hàng
  - Ngày đặt
  - Sản phẩm đã đặt
  - Tổng tiền
  - Trạng thái với màu sắc và icon
  - Thanh tiến độ (progress bar)

### 2. Chi tiết đơn hàng
- Click vào nút "Chi tiết" để xem thông tin chi tiết
- Modal hiển thị:
  - Thông tin trạng thái với icon
  - Thanh tiến độ đơn hàng
  - Timeline lịch trình đơn hàng
  - Thông tin khách hàng đầy đủ
  - Danh sách sản phẩm đã đặt
  - Tổng tiền

### 3. Thông báo đặt hàng thành công
- Khi đặt hàng thành công, hiển thị modal với:
  - Thông báo thành công
  - Mã đơn hàng
  - Trạng thái ban đầu (Chờ phê duyệt)
  - Tùy chọn xem lịch sử đặt hàng ngay

### 4. Thông báo cập nhật trạng thái tự động
- Hệ thống tự động refresh dữ liệu mỗi 30 giây
- Thông báo popup khi có thay đổi trạng thái:
  - ✅ Đơn hàng được phê duyệt
  - 🔄 Đơn hàng đang được xử lý
  - 🚚 Đơn hàng đang được giao
  - 🎉 Đơn hàng hoàn thành
  - ❌ Đơn hàng bị từ chối
- Alert thông báo đặc biệt khi có đơn hàng mới được phê duyệt
- Nút "Làm mới" để cập nhật thủ công
- Hiển thị thời gian cập nhật lần cuối

## Tính năng cho Admin

### 1. Phê duyệt đơn hàng
- Truy cập trang "Phê duyệt đơn hàng" từ menu admin
- Xem danh sách tất cả đơn hàng chờ phê duyệt
- Có thể phê duyệt hoặc từ chối đơn hàng trực tiếp từ bảng
- Modal chi tiết hiển thị đầy đủ thông tin khách hàng và sản phẩm
- Thông báo xác nhận khi phê duyệt/từ chối với mã đơn hàng
- Người dùng sẽ nhận được thông báo tự động khi trạng thái thay đổi

### 2. Quản lý trạng thái đơn hàng
- Truy cập trang "Quản lý đơn hàng" từ menu admin
- Có thể thay đổi trạng thái trực tiếp từ bảng bằng dropdown
- Các trạng thái được sắp xếp theo thứ tự logic
- Thông báo xác nhận khi thay đổi trạng thái với mã đơn hàng
- Người dùng sẽ nhận được thông báo tự động khi trạng thái thay đổi

### 3. Lọc đơn hàng theo trạng thái
- Sử dụng bộ lọc để xem đơn hàng theo từng trạng thái
- Dễ dàng quản lý và theo dõi

### 4. Thống kê trạng thái đơn hàng
- Dashboard hiển thị thống kê chi tiết:
  - Số lượng đơn hàng theo từng trạng thái
  - Tỷ lệ hoàn thành đơn hàng
  - Đơn hàng gần đây với trạng thái

### 5. Chi tiết đơn hàng
- Xem thông tin chi tiết khách hàng
- Cập nhật trạng thái từ modal chi tiết
- Theo dõi lịch sử thay đổi trạng thái

## Quy trình làm việc đề xuất

### Cho Admin:
1. **Nhận đơn hàng mới** → Trạng thái: "Chờ phê duyệt"
2. **Phê duyệt đơn hàng** → Trạng thái: "Chờ xử lý"
3. **Kiểm tra và chuẩn bị hàng** → Trạng thái: "Đang xử lý"
4. **Đóng gói và giao hàng** → Trạng thái: "Đang giao hàng"
5. **Giao hàng thành công** → Trạng thái: "Đã giao hàng"
6. **Khách hàng xác nhận** → Trạng thái: "Hoàn thành"

### Cho Khách hàng:
1. **Đặt hàng** → Nhận thông báo thành công (Chờ phê duyệt)
2. **Chờ admin phê duyệt** → Theo dõi trạng thái trong lịch sử đặt hàng
3. **Đơn hàng được phê duyệt** → Nhận thông báo tự động, chuyển sang trạng thái "Chờ xử lý"
4. **Theo dõi tiến trình** → Nhận thông báo khi trạng thái thay đổi, xem trong lịch sử đặt hàng
5. **Nhận hàng** → Xác nhận hoàn thành

## Tính năng thông báo tự động

### Cho Khách hàng:
- **Auto-refresh**: Dữ liệu tự động cập nhật mỗi 30 giây
- **Thông báo popup**: Hiển thị khi có thay đổi trạng thái
- **Alert đặc biệt**: Thông báo nổi bật khi đơn hàng được phê duyệt
- **Nút làm mới**: Cập nhật thủ công khi cần
- **Thời gian cập nhật**: Hiển thị thời gian cập nhật lần cuối

### Cho Admin:
- **Thông báo xác nhận**: Khi phê duyệt/từ chối đơn hàng
- **Mã đơn hàng**: Hiển thị trong thông báo để dễ theo dõi
- **Thông báo người dùng**: Người dùng sẽ nhận được thông báo tự động

### Các loại thông báo:
1. **Thành công** (màu xanh): Đơn hàng được phê duyệt, hoàn thành
2. **Thông tin** (màu xanh dương): Đơn hàng đang xử lý, đang giao
3. **Cảnh báo** (màu vàng): Đơn hàng chờ phê duyệt
4. **Lỗi** (màu đỏ): Đơn hàng bị từ chối

## Lưu ý kỹ thuật

### API Endpoints:
- `GET /orders` - Lấy danh sách đơn hàng
- `PATCH /orders/:id` - Cập nhật trạng thái đơn hàng
- `POST /orders` - Tạo đơn hàng mới
- `GET /order-approval` - Trang phê duyệt đơn hàng (Admin)
- `GET /order-history` - Trang lịch sử đặt hàng (Khách hàng)

### Database Schema:
```json
{
  "id": 1,
  "customerName": "Tên khách hàng",
  "customerEmail": "email@example.com",
  "customerPhone": "0123456789",
  "customerAddress": "Địa chỉ giao hàng",
  "items": [...],
  "totalAmount": 1000000,
  "status": "pending",
  "orderDate": "2025-07-05T10:00:00.000Z"
}
```

### Các trạng thái hợp lệ:
- `awaiting_approval` - Chờ phê duyệt
- `pending` - Chờ xử lý
- `processing` - Đang xử lý
- `shipped` - Đang giao hàng
- `delivered` - Đã giao hàng
- `completed` - Hoàn thành
- `cancelled` - Đã hủy

## Hỗ trợ

Nếu có vấn đề hoặc cần hỗ trợ, vui lòng liên hệ:
- Email: support@example.com
- Hotline: 1900-xxxx 