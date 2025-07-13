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
  try {
    const { childId, date } = req.query;
    let query = {};
    if (childId) query.child_id = childId;
    if (date) {
      // Lọc theo ngày (bỏ giờ)
      const start = new Date(date);
      start.setHours(0,0,0,0);
      const end = new Date(date);
      end.setHours(23,59,59,999);
      query.date = { $gte: start, $lte: end };
    }
    const logs = await ActivityLog.find(query);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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