const ActivityLog = require('../models/ActivityLog');

// Tạo mới log
exports.createLog = async (req, res) => {
  try {
    const log = await ActivityLog.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả log
exports.getAllLogs = async (req, res) => {
  const logs = await ActivityLog.find()
    .populate('child_id', 'full_name')
    .populate('user_id', 'name');
  res.json(logs);
};

// Lấy log theo id
exports.getLogById = async (req, res) => {
  const log = await ActivityLog.findById(req.params.id);
  if (!log) return res.status(404).json({ message: 'Không tìm thấy' });
  res.json(log);
};

// Cập nhật log
exports.updateLog = async (req, res) => {
  const updated = await ActivityLog.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!updated) return res.status(404).json({ message: 'Không tìm thấy' });
  res.json(updated);
};

// Xoá log
exports.deleteLog = async (req, res) => {
  const deleted = await ActivityLog.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Không tìm thấy' });
  res.json({ message: 'Đã xoá log hoạt động' });
};
