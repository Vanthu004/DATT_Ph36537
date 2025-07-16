const Notification = require('../models/Notification');

// Tạo thông báo mới
exports.createNotification = async (req, res) => {
  try {
    const newNotification = await Notification.create(req.body);
    res.status(201).json({ success: true, data: newNotification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Lấy tất cả thông báo của người dùng
exports.getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ user_id: userId }).sort({ created_at: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Đánh dấu đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { is_read: true });
    res.status(200).json({ success: true, message: 'Đã đánh dấu là đã đọc' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
