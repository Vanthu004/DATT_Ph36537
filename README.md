# FMCarer Server với Admin Panel

Dự án bao gồm:
- **Backend**: Node.js + Express + MongoDB
- **Admin Frontend**: React + TypeScript + Vite
- **Mobile App**: React Native (FCareExpo)

## Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
# Cài đặt tất cả dependencies
npm run install:all
```

### 2. Cấu hình môi trường

Tạo file `.env` trong thư mục `nodeJs/`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fmcarer
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Chạy dự án

```bash
# Chạy cả backend và frontend
npm run dev

# Hoặc chạy riêng lẻ:
# Backend
npm run dev:backend

# Frontend (Admin)
npm run dev:frontend
```

### 4. Truy cập

- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:5173
- **Mobile App**: Chạy trên Expo

## Cấu trúc API

### Authentication
- `POST /api/users/login` - Đăng nhập
- `POST /api/users/register` - Đăng ký
- `GET /api/users/profile` - Lấy thông tin user

### Users
- `GET /api/users` - Lấy danh sách users
- `GET /api/users/:id` - Lấy thông tin user
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

### Children
- `GET /api/children` - Lấy danh sách children
- `POST /api/children` - Tạo child mới
- `GET /api/children/:id` - Lấy thông tin child
- `PUT /api/children/:id` - Cập nhật child
- `DELETE /api/children/:id` - Xóa child

### Posts
- `GET /api/posts` - Lấy danh sách posts
- `GET /api/posts/:id` - Lấy thông tin post
- `DELETE /api/posts/:id` - Xóa post

### Post Approvals
- `GET /api/approvals` - Lấy danh sách approvals
- `PUT /api/approvals/:id` - Phê duyệt/từ chối post

### Reminders
- `GET /api/reminders` - Lấy danh sách reminders
- `POST /api/reminders` - Tạo reminder mới
- `GET /api/reminders/:id` - Lấy thông tin reminder
- `PUT /api/reminders/:id` - Cập nhật reminder
- `DELETE /api/reminders/:id` - Xóa reminder

### Activity Logs
- `GET /api/activity-logs` - Lấy danh sách activity logs
- `POST /api/activity-logs` - Tạo activity log mới
- `GET /api/activity-logs/:id` - Lấy thông tin activity log
- `PUT /api/activity-logs/:id` - Cập nhật activity log
- `DELETE /api/activity-logs/:id` - Xóa activity log

### Payments
- `GET /api/payments` - Lấy danh sách payments
- `POST /api/payments` - Tạo payment mới
- `GET /api/payments/:id` - Lấy thông tin payment
- `PUT /api/payments/:id` - Cập nhật payment
- `DELETE /api/payments/:id` - Xóa payment

### Support
- `GET /api/support` - Lấy danh sách support tickets
- `POST /api/support` - Tạo support ticket mới
- `GET /api/support/:id` - Lấy thông tin support ticket
- `PUT /api/support/:id` - Cập nhật support ticket
- `DELETE /api/support/:id` - Xóa support ticket

## Tính năng Admin Panel

- ✅ Đăng nhập/đăng xuất
- ✅ Quản lý users
- ✅ Quản lý children
- ✅ Quản lý posts và approvals
- ✅ Quản lý reminders
- ✅ Quản lý activity logs
- ✅ Quản lý payments
- ✅ Quản lý support tickets

## Công nghệ sử dụng

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (File upload)
- Cloudinary (Image storage)
- CORS

### Admin Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### Mobile App
- React Native
- Expo
- Redux Toolkit 