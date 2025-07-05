# 🔧 Troubleshooting Guide

## 🐛 Vấn đề thường gặp và cách khắc phục

### 1. **Màn hình trắng (White Screen)**

**Nguyên nhân:** Lỗi routing hoặc JavaScript không load được

**Đã khắc phục:**
- ✅ Chuyển từ `BrowserRouter` sang `HashRouter`
- ✅ Loại bỏ base path trong Vite config
- ✅ Thêm error handling trong main.jsx
- ✅ Xóa các file routing không cần thiết

**Cách kiểm tra:**
1. Mở Developer Tools (F12)
2. Kiểm tra Console tab xem có lỗi không
3. Kiểm tra Network tab xem file JS có load được không

### 2. **Routing không hoạt động**

**Nguyên nhân:** GitHub Pages không hỗ trợ client-side routing

**Giải pháp:** Sử dụng HashRouter (#)
- URL sẽ có dạng: `https://domain.com/#/path`
- Ví dụ: `https://longbdph39071.github.io/shoponilne.github.io/#/shopping`

### 3. **API không hoạt động**

**Nguyên nhân:** Backend chỉ chạy locally

**Giải pháp:**
```bash
# Terminal 1 - Chạy backend
npm run server

# Terminal 2 - Chạy frontend (nếu cần test locally)
npm run dev
```

**Lưu ý:** Trên GitHub Pages, API sẽ không hoạt động vì không có backend.

### 4. **Tính năng cần backend:**
- ✅ Login/Register (cần backend)
- ✅ Product management (cần backend)
- ✅ Order management (cần backend)
- ✅ User management (cần backend)

### 5. **Tính năng hoạt động offline:**
- ✅ UI/UX
- ✅ Navigation
- ✅ Static content

## 🚀 Cách test locally:

### **Chạy đầy đủ (Frontend + Backend):**
```bash
# Terminal 1
npm run server

# Terminal 2
npm run dev
```

### **Chỉ test Frontend:**
```bash
npm run build
npm run preview
```

## 📱 Test trên GitHub Pages:

1. **Truy cập:** https://longbdph39071.github.io/shoponilne.github.io/
2. **Kiểm tra navigation:** Click các menu
3. **Kiểm tra routing:** URL sẽ có # (hash)
4. **Kiểm tra responsive:** Thay đổi kích thước màn hình

## 🔍 Debug steps:

### **Nếu vẫn gặp vấn đề:**

1. **Clear cache:**
   - Ctrl + F5 (Windows/Linux)
   - Cmd + Shift + R (Mac)

2. **Kiểm tra console:**
   - F12 > Console
   - Tìm lỗi màu đỏ

3. **Kiểm tra network:**
   - F12 > Network
   - Xem file nào bị lỗi 404

4. **Test trên browser khác:**
   - Chrome, Firefox, Safari

## 📞 Báo cáo lỗi:

Nếu vẫn gặp vấn đề, hãy cung cấp:
1. **Browser:** Chrome/Firefox/Safari + version
2. **OS:** Windows/Mac/Linux
3. **Console errors:** Copy lỗi từ F12 > Console
4. **Steps to reproduce:** Các bước để tái hiện lỗi

## ✅ Checklist trước khi deploy:

- [ ] Test locally với `npm run dev`
- [ ] Build thành công với `npm run build`
- [ ] Preview build với `npm run preview`
- [ ] Deploy với `npm run deploy`
- [ ] Test trên GitHub Pages
- [ ] Test responsive design
- [ ] Test navigation

---

**💡 Tip:** Luôn test locally trước khi deploy để tránh lỗi!

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