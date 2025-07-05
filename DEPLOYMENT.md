# 🚀 Hướng dẫn Deploy lên GitHub Pages

## ✅ Deploy đã hoàn thành!

Ứng dụng của bạn đã được deploy thành công lên GitHub Pages và có thể truy cập tại:

**🌐 Live Demo: https://longbdph39071.github.io/shoponilne.github.io/**

## 📋 Các bước đã thực hiện:

### 1. **Cấu hình Vite**
- Cập nhật `base` path trong `vite.config.js`
- Cấu hình build tối ưu cho production

### 2. **Cài đặt gh-pages**
- Thêm `gh-pages` package
- Cấu hình scripts deploy trong `package.json`

### 3. **Xử lý Client-side Routing**
- Tạo `public/404.html` để handle routing fallback
- Tạo `public/_redirects` cho SPA routing
- Thêm script routing vào `index.html`

### 4. **Deploy tự động**
- Build project với `npm run build`
- Upload lên GitHub Pages với `gh-pages`

## 🔧 Cách sử dụng:

### **Deploy lần đầu:**
```bash
npm run deploy
```

### **Deploy sau khi có thay đổi:**
```bash
# Commit thay đổi
git add .
git commit -m "Update features"
git push origin main

# Deploy
npm run deploy
```

### **Chạy development:**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run dev
```

## 📁 Cấu trúc deployment:

```
Repository/
├── main branch/          # Source code
├── gh-pages branch/      # Deployed files (tự động tạo)
└── dist/                 # Build output
```

## ⚙️ Cấu hình GitHub Pages:

1. Vào **Settings** > **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages` / `/(root)`
4. **Save**

## 🔄 Workflow:

1. **Development**: Code và test locally
2. **Commit**: Push code lên main branch
3. **Deploy**: Chạy `npm run deploy`
4. **Access**: Truy cập live site

## 📱 Tính năng đã deploy:

- ✅ User Authentication (Login/Register)
- ✅ Product Catalog với Search & Filter
- ✅ Shopping Cart
- ✅ Order Management
- ✅ Admin Dashboard
- ✅ Order Approval System
- ✅ User Profile Management
- ✅ Responsive Design
- ✅ Client-side Routing

## 🐛 Troubleshooting:

### **Nếu site không load:**
1. Kiểm tra GitHub Pages settings
2. Đảm bảo gh-pages branch đã được tạo
3. Chờ vài phút để deploy hoàn tất

### **Nếu routing không hoạt động:**
1. Kiểm tra file `public/404.html`
2. Đảm bảo script routing trong `index.html`
3. Clear browser cache

### **Nếu API không hoạt động:**
- API chỉ hoạt động khi chạy locally
- Cần deploy backend riêng cho production

## 📞 Hỗ trợ:

Nếu gặp vấn đề, hãy:
1. Kiểm tra GitHub Actions logs
2. Xem deployment status trong repository
3. Tạo issue trên GitHub

---

**🎉 Chúc mừng! Ứng dụng của bạn đã live trên GitHub Pages!** 