const Reminder = require('../models/Reminder');

// Tạo mới reminder
exports.createReminder = async (req, res) => {
  try {
    const reminder = await Reminder.create(req.body);
    res.status(201).json(reminder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả reminder
exports.getAllReminders = async (req, res) => {
  const reminders = await Reminder.find()
    .populate('child_id', 'full_name')
    .populate('created_by', 'name');
  res.json(reminders);
};

// Lấy 1 reminder theo id
exports.getReminderById = async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);
  if (!reminder) return res.status(404).json({ message: 'Không tìm thấy' });
  res.json(reminder);
};

// Lấy reminder theo child_id
exports.getRemindersByChild = async (req, res) => {
  try {
    const reminders = await Reminder.find({ child_id: req.params.child_id });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật reminder
exports.updateReminder = async (req, res) => {
  const { completedDate, ...updateData } = req.body;
  let updated;
  if (completedDate) {
    // Push ngày hoàn thành vào mảng completedDates nếu chưa có
    updated = await Reminder.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { completedDates: new Date(completedDate) } },
      { new: true }
    );
    // Có thể update thêm các trường khác nếu cần
    if (Object.keys(updateData).length > 0) {
      updated = await Reminder.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
    }
  } else {
    updated = await Reminder.findByIdAndUpdate(req.params.id, updateData, {
      new: true
    });
  }
  if (!updated) return res.status(404).json({ message: 'Không tìm thấy' });
  res.json(updated);
};

// Xoá reminder
exports.deleteReminder = async (req, res) => {
  const deleted = await Reminder.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Không tìm thấy' });
  res.json({ message: 'Đã xoá lịch nhắc' });
};
