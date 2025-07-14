const Post = require('../models/Post');
const User = require('../models/user');
const PostApproval = require('../models/PostApproval'); // Thêm dòng này

// Tạo bài viết
exports.createPost = async (req, res) => {
  try {
    const { user_id, title, content, visibility, images } = req.body;

    const userExists = await User.findById(user_id);
    if (!userExists) return res.status(400).json({ message: 'user_id không tồn tại' });

    // Thiết lập status dựa vào visibility
    let status = 'pending';
    if (visibility === 'family') {
      status = 'approved';
    }

    const post = await Post.create({ user_id, title, content, visibility, images, status });

    // Tự động tạo phiếu kiểm duyệt nếu là bài viết cộng đồng
    if (visibility === 'community') {
      await PostApproval.create({
        post_id: post._id,
        status: 'pending',
        note: ''
        // approved_by để trống, sẽ cập nhật khi admin duyệt
      });
    }

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lấy tất cả bài viết
exports.getAllPosts = async (req, res) => {
  try {
    const { visibility, userId, parentId, status } = req.query;
    let query = {};
    if (visibility === 'community') {
      query.visibility = 'community';
      if (status) {
        query.status = status;
      }
    } else if (visibility === 'family') {
      query.visibility = 'family';
      if (userId && parentId) {
        // Lấy bài viết family của user chính và các tài khoản phụ
        query['$or'] = [
          { user_id: userId },
          { user_id: parentId }
        ];
      } else if (userId) {
        query.user_id = userId;
      }
      if (status) {
        query.status = status;
      }
    } else {
      // Nếu không truyền visibility, có thể lọc theo status toàn bộ
      if (status) {
        query.status = status;
      }
    }
    // Nếu không truyền visibility, trả về tất cả bài viết
    const posts = await Post.find(query).populate('user_id', 'name email role parent_id');
    res.json(posts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lấy 1 bài viết
exports.getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('user_id', 'name');
  if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
  res.json(post);
};

// Cập nhật bài viết
exports.updatePost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
  res.json(post);
};

// Xoá bài viết
exports.deletePost = async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
  res.json({ message: 'Đã xoá bài viết' });
};
