# 🔧 Fix GitHub Actions Deployment Issues

## ✅ Đã sửa lỗi "The process '/usr/bin/git' failed with exit code 128"

### 🔍 Nguyên nhân lỗi:
- GitHub Actions không có quyền truy cập để push lên branch `gh-pages`
- Sử dụng action cũ không tương thích với GitHub Pages mới
- Thiếu permissions trong workflow

### 🛠️ Cách đã sửa:

#### 1. **Cập nhật permissions trong workflow:**
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

#### 2. **Sử dụng GitHub Pages Actions mới:**
```yaml
- name: Setup Pages
  uses: actions/configure-pages@v4
  
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: './dist'
    
- name: Deploy to GitHub Pages
  id: deployment
  uses: actions/deploy-pages@v4
```

#### 3. **Thêm concurrency để tránh conflict:**
```yaml
concurrency:
  group: "pages"
  cancel-in-progress: false
```

### 🚀 Cách deploy:

#### **Tự động (GitHub Actions):**
- Push code lên main branch
- GitHub Actions sẽ tự động build và deploy

#### **Thủ công:**
```bash
npm run deploy
```

### 📋 Kiểm tra deployment:

1. **GitHub Actions tab:**
   - Vào repository > Actions
   - Kiểm tra workflow "Deploy to GitHub Pages"
   - Đảm bảo status là ✅ (green)

2. **GitHub Pages settings:**
   - Vào Settings > Pages
   - Source: "GitHub Actions"
   - Branch: Tự động từ workflow

3. **Live site:**
   - https://longbdph39071.github.io/shoponilne.github.io/

### 🔄 Workflow hoạt động:

1. **Trigger:** Push lên main branch
2. **Build:** `npm run build`
3. **Upload:** Upload dist folder
4. **Deploy:** Deploy lên GitHub Pages

### ⚠️ Lưu ý quan trọng:

- **Không cần Personal Access Token** với workflow mới
- **Tự động sử dụng GitHub token** có sẵn
- **Không cần cấu hình thêm** trong repository settings

### 🐛 Nếu vẫn gặp lỗi:

1. **Kiểm tra repository settings:**
   - Settings > Actions > General
   - Đảm bảo "Allow GitHub Actions to create and approve pull requests" được bật

2. **Kiểm tra Pages settings:**
   - Settings > Pages
   - Source: "GitHub Actions"

3. **Clear cache:**
   - Xóa branch gh-pages cũ (nếu có)
   - Chạy lại workflow

### 📞 Hỗ trợ:

Nếu vẫn gặp vấn đề:
1. Kiểm tra GitHub Actions logs
2. Đảm bảo repository có quyền truy cập GitHub Pages
3. Kiểm tra repository visibility (public/private)

---

**✅ Kết quả:** Website đã được deploy thành công và GitHub Actions sẽ tự động deploy khi có thay đổi! 