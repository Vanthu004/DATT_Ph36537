# Post API với hỗ trợ ảnh

## Cấu trúc Post Model

```javascript
{
  user_id: ObjectId,        // ID của user tạo bài viết
  title: String,            // Tiêu đề bài viết
  content: String,          // Nội dung bài viết
  images: [String],         // Mảng các URL ảnh
  visibility: String,       // 'family' hoặc 'community'
  status: String,           // 'pending', 'approved', 'rejected'
  created_at: Date          // Thời gian tạo
}
```

## Các API Endpoints

### 1. Upload ảnh
**POST** `/api/images/upload`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body:**
```
image: [file]  // File ảnh
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/...",
  "public_id": "uploads/..."
}
```

### 2. Tạo bài viết với ảnh
**POST** `/api/posts`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "user_id": "64f1234567890abcdef12345",
  "title": "Tiêu đề bài viết",
  "content": "Nội dung bài viết",
  "visibility": "family",
  "images": [
    "https://res.cloudinary.com/...",
    "https://res.cloudinary.com/..."
  ]
}
```

**Response:**
```json
{
  "_id": "64f1234567890abcdef12346",
  "user_id": "64f1234567890abcdef12345",
  "title": "Tiêu đề bài viết",
  "content": "Nội dung bài viết",
  "images": [
    "https://res.cloudinary.com/...",
    "https://res.cloudinary.com/..."
  ],
  "visibility": "family",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

### 3. Lấy tất cả bài viết
**GET** `/api/posts`

**Response:**
```json
[
  {
    "_id": "64f1234567890abcdef12346",
    "user_id": {
      "_id": "64f1234567890abcdef12345",
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "parent"
    },
    "title": "Tiêu đề bài viết",
    "content": "Nội dung bài viết",
    "images": [
      "https://res.cloudinary.com/...",
      "https://res.cloudinary.com/..."
    ],
    "visibility": "family",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### 4. Lấy bài viết theo ID
**GET** `/api/posts/:id`

**Response:**
```json
{
  "_id": "64f1234567890abcdef12346",
  "user_id": {
    "_id": "64f1234567890abcdef12345",
    "name": "Nguyễn Văn A"
  },
  "title": "Tiêu đề bài viết",
  "content": "Nội dung bài viết",
  "images": [
    "https://res.cloudinary.com/...",
    "https://res.cloudinary.com/..."
  ],
  "visibility": "family",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

### 5. Cập nhật bài viết
**PUT** `/api/posts/:id`

**Body:**
```json
{
  "title": "Tiêu đề mới",
  "content": "Nội dung mới",
  "images": [
    "https://res.cloudinary.com/...",
    "https://res.cloudinary.com/..."
  ],
  "visibility": "community"
}
```

### 6. Xóa bài viết
**DELETE** `/api/posts/:id`

**Response:**
```json
{
  "message": "Đã xoá bài viết"
}
```

### 7. Xóa ảnh
**POST** `/api/images/delete`

**Body:**
```json
{
  "public_id": "uploads/..."
}
```

## Quy trình sử dụng

1. **Upload ảnh trước**: Sử dụng `/api/images/upload` để upload ảnh lên Cloudinary
2. **Lấy URL ảnh**: Từ response của upload, lấy `url` 
3. **Tạo bài viết**: Sử dụng `/api/posts` với mảng `images` chứa các URL ảnh

## Ví dụ sử dụng với JavaScript

```javascript
// 1. Upload ảnh
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const uploadResponse = await fetch('/api/images/upload', {
  method: 'POST',
  body: formData
});
const { url } = await uploadResponse.json();

// 2. Tạo bài viết với ảnh
const postData = {
  user_id: "64f1234567890abcdef12345",
  title: "Bài viết có ảnh",
  content: "Nội dung bài viết",
  visibility: "family",
  images: [url]
};

const postResponse = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(postData)
});
const post = await postResponse.json();
```

## Lưu ý

- Ảnh được lưu trữ trên Cloudinary
- Mỗi bài viết có thể có nhiều ảnh
- Trường `images` là mảng các URL string
- Khi xóa bài viết, cần xóa ảnh riêng biệt nếu muốn
- API hỗ trợ upload ảnh với kích thước tối đa 10MB 