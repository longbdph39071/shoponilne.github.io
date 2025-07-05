# Hướng dẫn khắc phục lỗi

## Các lỗi thường gặp và cách khắc phục

### 1. Lỗi "Cannot read property of undefined"
**Nguyên nhân:** Component đang cố gắng truy cập thuộc tính của object undefined
**Cách khắc phục:**
- Kiểm tra dữ liệu trước khi render
- Sử dụng optional chaining (?.) hoặc default values
- Đảm bảo API trả về dữ liệu đúng format

### 2. Lỗi "Network Error" hoặc "Failed to fetch"
**Nguyên nhân:** Backend server không chạy hoặc không thể kết nối
**Cách khắc phục:**
```bash
# Khởi động backend server
npm run db

# Kiểm tra server có chạy không
curl http://localhost:3001/users
```

### 3. Lỗi "Invalid token" hoặc "Unauthorized"
**Nguyên nhân:** Token hết hạn hoặc không hợp lệ
**Cách khắc phục:**
- Xóa localStorage và đăng nhập lại
- Kiểm tra token trong localStorage
- Đảm bảo backend server đang chạy

### 4. Lỗi "Module not found"
**Nguyên nhân:** Thiếu dependencies hoặc import sai
**Cách khắc phục:**
```bash
# Cài đặt lại dependencies
npm install

# Kiểm tra package.json
cat package.json
```

### 5. Lỗi "Port already in use"
**Nguyên nhân:** Port đã được sử dụng bởi process khác
**Cách khắc phục:**
```bash
# Tìm và kill process sử dụng port
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Hoặc sử dụng port khác
npm run db -- --port 3002
```

### 6. Lỗi "CORS"
**Nguyên nhân:** Cross-origin request bị chặn
**Cách khắc phục:**
- Đảm bảo backend server có CORS middleware
- Kiểm tra API URL trong frontend
- Sử dụng proxy trong vite.config.js

### 7. Lỗi "React Hook" rules
**Nguyên nhân:** Vi phạm rules của React Hooks
**Cách khắc phục:**
- Đảm bảo hooks chỉ được gọi ở top level
- Không gọi hooks trong loops, conditions, hoặc nested functions
- Kiểm tra dependencies array của useEffect

## Các bước kiểm tra cơ bản

### 1. Kiểm tra server status
```bash
# Backend
curl http://localhost:3001/users

# Frontend  
curl http://localhost:5173
```

### 2. Kiểm tra console errors
- Mở Developer Tools (F12)
- Xem tab Console
- Xem tab Network để kiểm tra API calls

### 3. Kiểm tra localStorage
```javascript
// Trong browser console
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

### 4. Clear cache và restart
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install

# Restart servers
npm run db
npm run dev
```

## Demo Accounts

**Admin:**
- Email: admin@company.com
- Password: 123456

**Staff:**
- Email: staff@company.com  
- Password: 123456

## API Endpoints

- **Auth:** POST /login, POST /register
- **Products:** GET/POST/PUT/DELETE /products
- **Customers:** GET/POST/PUT/DELETE /customers  
- **Orders:** GET/POST/PUT/DELETE /orders
- **Users:** GET/POST/PUT/DELETE /users

## Cấu trúc project

```
src/
├── components/     # Reusable components
├── contexts/       # React contexts
├── pages/         # Page components
├── services/      # API services
└── App.jsx        # Main app component
```

## Logs và Debugging

### Enable debug mode
```bash
# Backend debug
DEBUG=* npm run db

# Frontend debug
NODE_ENV=development npm run dev
```

### Check logs
```bash
# Backend logs
tail -f logs/server.log

# Frontend logs (browser console)
```

## Liên hệ hỗ trợ

Nếu vẫn gặp lỗi, vui lòng:
1. Chụp màn hình lỗi
2. Copy console errors
3. Mô tả các bước thực hiện trước khi lỗi xảy ra 