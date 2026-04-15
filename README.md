# POD Software Tools 🛠️

**POD Software Tools** là một nền tảng tập trung giúp quản lý và phân phối các công cụ phần mềm hỗ trợ cho cộng đồng Print-on-Demand (POD). Hệ thống cung cấp giao diện người dùng hiện đại để tải xuống các công cụ và một trang quản trị (Admin Dashboard) bảo mật để cập nhật nội dung.

---

## 🚀 Tính năng nổi bật

- **Trang chủ chuyên nghiệp**: Liệt kê danh sách các công cụ với biểu tượng, phiên bản và mô tả chi tiết.
- **Admin Dashboard**: Giao diện quản trị hiện đại, cho phép thêm, sửa, xóa (CRUD) các công cụ một cách dễ dàng.
- **Bảo mật**: Hệ thống đăng nhập Admin sử dụng xác thực JWT (JSON Web Token) và mã hóa mật khẩu Bcrypt.
- **Thiết kế Responsive**: Tối ưu hiển thị tốt trên cả máy tính và thiết bị di động.
- **Tải xuống trực tiếp**: Hỗ trợ liên kết tải xuống từ các nguồn lưu trữ đám mây.

## 💻 Công nghệ sử dụng

- **Frontend/Backend**: [Next.js 14](https://nextjs.org/) (App Router)
- **Cơ sở dữ liệu**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) thông qua [Mongoose](https://mongoosejs.com/)
- **Xác thực**: JWT & Bcryptjs
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (CSS Modules)

---

## 🛠️ Hướng dẫn cài đặt

Để chạy dự án này trên môi trường local, hãy làm theo các bước sau:

### 1. Tải về (Clone)
```bash
git clone <repository_url>
cd UI_Download_Tools
```

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
# hoặc
yarn install
```

### 3. Cấu hình môi trường
Tạo file `.env.local` ở thư mục gốc và cấu hình các biến sau:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt
```

---

## ⚙️ Cách vận hành

### Chạy chế độ phát triển (Development)
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.

### Build và chạy sản phẩm (Production)
```bash
npm run build
npm start
```

---

## 📂 Cấu trúc thư mục

- `/app`: Chứa các route, layouts và components chính (App Router).
- `/app/admin`: Các module dành riêng cho quản trị viên (Login, Dashboard).
- `/api`: Các API endpoint để giao tiếp với cơ sở dữ liệu.
- `/models`: Định nghĩa các schemas cho MongoDB (Mongoose Models).
- `/lib`: Chứa các cấu hình thư viện và tiện ích (Database connection, JWT helpers).
- `/public`: Chứa các tệp tĩnh như hình ảnh, logos.

---

## 📝 Giấy phép

Dự án này được phát triển bởi **IT POD SOFTWARE**. Mọi quyền được bảo lưu. &copy; 2026.

