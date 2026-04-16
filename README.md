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
- **Cơ sở dữ liệu**: PostgreSQL thông qua [node-postgres](https://node-postgres.com/)
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
JWT_SECRET=your_secret_key_for_jwt
SETUP_TOKEN=your_one_time_setup_token
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_initial_admin_password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
POSTGRES_HOST=your_postgres_host
POSTGRES_PORT=5432
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
POSTGRES_SSL=false
```

> Không commit file `.env.local`. Các giá trị trên chỉ là ví dụ, hãy dùng secret mạnh khi deploy.

### Deploy lên Vercel
Khi deploy, cấu hình các biến môi trường trong **Vercel Project Settings → Environment Variables**:

```env
JWT_SECRET=your_secret_key_for_jwt
SETUP_TOKEN=your_one_time_setup_token
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_initial_admin_password
NEXT_PUBLIC_SITE_URL=https://your-domain.com
POSTGRES_HOST=your_postgres_host
POSTGRES_PORT=5432
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
POSTGRES_SSL=false
```

Nếu PostgreSQL chỉ cho phép IP cố định, cần mở quyền kết nối cho hạ tầng deploy hoặc dùng database/proxy hỗ trợ serverless. File `vercel.json` đang đặt region `sin1` để ưu tiên máy chủ gần Việt Nam/Singapore.

### 4. Tạo tài khoản Admin lần đầu
Sau khi cấu hình env và chạy server, gọi endpoint setup bằng Bearer token:

```bash
curl -X POST http://localhost:3000/api/setup \
  -H "Authorization: Bearer your_one_time_setup_token"
```

Endpoint `/api/setup` chỉ tạo admin khi database chưa có user nào. Nếu đã có admin, API sẽ trả về trạng thái setup đã hoàn tất.

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
- `/lib`: Chứa cấu hình PostgreSQL, repositories và JWT helpers.
- `/public`: Chứa các tệp tĩnh như hình ảnh, logos.

---

## 📝 Giấy phép

Dự án này được phát triển bởi **IT POD SOFTWARE**. Mọi quyền được bảo lưu. &copy; 2026.

