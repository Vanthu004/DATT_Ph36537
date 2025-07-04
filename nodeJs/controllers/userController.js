const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ─────────────────────────────────────────────────────────
// CREATE  (POST /api/users)
exports.createUser = async (req, res) => {
  try {
    const { email, password, role, name, parent_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, role, name, parent_id });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL  (GET /api/users)
exports.getAllUsers = async (_req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// READ ONE  (GET /api/users/:id)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'ID không hợp lệ' });
  }
};

// UPDATE  (PUT /api/users/:id)
exports.updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const updateData = { ...rest };
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE  (DELETE /api/users/:id)
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
  res.json({ message: 'Đã xoá user' });
};

// ĐĂNG NHẬP (POST /api/auth/login)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
  const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
};

// QUÊN MẬT KHẨU (POST /api/auth/forgot-password)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1h
  await user.save();
  // TODO: Gửi token qua email, ở đây trả về response để test
  res.json({ message: 'Đã gửi mã đặt lại mật khẩu', token });
};

// ĐẶT LẠI MẬT KHẨU (POST /api/auth/reset-password)
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
  res.json({ message: 'Đặt lại mật khẩu thành công' });
};
