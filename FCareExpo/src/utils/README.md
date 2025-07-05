# API Utils Documentation

## Tổng quan
Thư mục `utils` chứa các hàm API để giao tiếp với backend server. Tất cả các API calls đều được tổ chức và quản lý tập trung.

## Cấu trúc thư mục
```
utils/
├── apiConfig.js      # Cấu hình API endpoints
├── apiService.js     # Service chính để gọi API
├── userApi.js        # API functions cho user
├── postApi.js        # API functions cho posts
├── childApi.js       # API functions cho children
├── reminderApi.js    # API functions cho reminders
├── paymentApi.js     # API functions cho payments
├── supportApi.js     # API functions cho support
├── index.js          # Export tất cả functions
└── exampleUsage.js   # Ví dụ sử dụng
```

## Cách sử dụng

### 1. Import API functions
```javascript
import { userApi, postApi, childApi } from '../utils';
```

### 2. Đăng nhập
```javascript
const handleLogin = async () => {
  try {
    const response = await userApi.login(email, password);
    if (response.success) {
      // Lưu token
      userApi.setToken(response.data.token);
      // Chuyển màn hình
      navigation.replace('Home');
    } else {
      Alert.alert('Lỗi', response.error);
    }
  } catch (error) {
    Alert.alert('Lỗi', 'Đăng nhập thất bại');
  }
};
```

### 3. Đăng ký
```javascript
const handleRegister = async () => {
  const userData = {
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'parent'
  };
  
  try {
    const response = await userApi.register(userData);
    if (response.success) {
      Alert.alert('Thành công', 'Đăng ký thành công!');
    } else {
      Alert.alert('Lỗi', response.error);
    }
  } catch (error) {
    Alert.alert('Lỗi', 'Đăng ký thất bại');
  }
};
```

### 4. Lấy danh sách posts
```javascript
const [posts, setPosts] = useState([]);

const loadPosts = async () => {
  try {
    const response = await postApi.getAllPosts();
    if (response.success) {
      setPosts(response.data);
    }
  } catch (error) {
    console.error('Error loading posts:', error);
  }
};
```

### 5. Tạo post mới
```javascript
const createPost = async (postData) => {
  try {
    const response = await postApi.createPost(postData);
    if (response.success) {
      // Refresh danh sách
      loadPosts();
      Alert.alert('Thành công', 'Tạo post thành công');
    } else {
      Alert.alert('Lỗi', response.error);
    }
  } catch (error) {
    Alert.alert('Lỗi', 'Tạo post thất bại');
  }
};
```

## API Endpoints

### User Endpoints
- `POST /api/users/login` - Đăng nhập
- `POST /api/users` - Đăng ký
- `GET /api/users/:id` - Lấy thông tin user
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user
- `POST /api/users/forgot-password` - Quên mật khẩu
- `POST /api/users/reset-password` - Đặt lại mật khẩu

### Post Endpoints
- `GET /api/posts` - Lấy danh sách posts
- `POST /api/posts` - Tạo post mới
- `GET /api/posts/:id` - Lấy post theo ID
- `PUT /api/posts/:id` - Cập nhật post
- `DELETE /api/posts/:id` - Xóa post

### Child Endpoints
- `GET /api/children` - Lấy danh sách children
- `POST /api/children` - Tạo child mới
- `GET /api/children/:id` - Lấy child theo ID
- `PUT /api/children/:id` - Cập nhật child
- `DELETE /api/children/:id` - Xóa child

### Reminder Endpoints
- `GET /api/reminders` - Lấy danh sách reminders
- `POST /api/reminders` - Tạo reminder mới
- `GET /api/reminders/:id` - Lấy reminder theo ID
- `PUT /api/reminders/:id` - Cập nhật reminder
- `DELETE /api/reminders/:id` - Xóa reminder

## Authentication

### Lưu token
```javascript
userApi.setToken(token);
```

### Xóa token (logout)
```javascript
userApi.logout();
```

## Error Handling

Tất cả API functions đều trả về object với format:
```javascript
{
  success: boolean,
  data?: any,      // Khi success = true
  error?: string   // Khi success = false
}
```

## Cấu hình

Để thay đổi base URL, chỉnh sửa file `apiConfig.js`:
```javascript
const API_BASE_URL = 'http://your-server-url:3000/api';
```

## Lưu ý

1. Đảm bảo server đang chạy trên port 3000
2. Kiểm tra kết nối mạng trước khi gọi API
3. Xử lý loading state trong UI khi gọi API
4. Lưu token vào AsyncStorage để duy trì session 