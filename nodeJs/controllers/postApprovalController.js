const PostApproval = require('../models/PostApproval');
const Post = require('../models/Post');
const User = require('../models/user');

// Tạo mới phiếu kiểm duyệt
exports.createApproval = async (req, res) => {
  try {
    const { post_id, approved_by, status, note } = req.body;

    const post = await Post.findById(post_id);
    const admin = await User.findById(approved_by);

    if (!post || !admin) {
      return res.status(400).json({ message: 'post_id hoặc approved_by không hợp lệ' });
    }

    const approval = await PostApproval.create({
      post_id,
      approved_by,
      status,
      note
    });

    res.status(201).json(approval);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả
exports.getAllApprovals = async (req, res) => {
  const approvals = await PostApproval.find()
    .populate('post_id', 'title')
    .populate('approved_by', 'name role');
  res.json(approvals);
};

// Lấy 1 theo id
exports.getApprovalById = async (req, res) => {
  const approval = await PostApproval.findById(req.params.id)
    .populate('post_id', 'title')
    .populate('approved_by', 'name');
  if (!approval) return res.status(404).json({ message: 'Không tìm thấy' });
  res.json(approval);
};

// Cập nhật trạng thái kiểm duyệt
exports.updateApproval = async (req, res) => {
  const { status, note } = req.body;

  const approval = await PostApproval.findByIdAndUpdate(
    req.params.id,
    {
      status,
      note,
      approved_at: new Date()
    },
    { new: true }
  );

  if (!approval) return res.status(404).json({ message: 'Không tìm thấy phê duyệt' });
  res.json(approval);
};

// Xoá phiếu duyệt
exports.deleteApproval = async (req, res) => {
  const deleted = await PostApproval.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Không tìm thấy' });
  res.json({ message: 'Đã xoá thành công' });
};
