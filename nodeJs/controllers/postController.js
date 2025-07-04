const Post = require('../models/Post');
const User = require('../models/user');

// Tạo bài viết
exports.createPost = async (req, res) => {
  try {
    const { user_id, title, content, visibility } = req.body;

    const userExists = await User.findById(user_id);
    if (!userExists) return res.status(400).json({ message: 'user_id không tồn tại' });

    const post = await Post.create({ user_id, title, content, visibility });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lấy tất cả bài viết
exports.getAllPosts = async (_req, res) => {
  const posts = await Post.find().populate('user_id', 'name email role');
  res.json(posts);
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
