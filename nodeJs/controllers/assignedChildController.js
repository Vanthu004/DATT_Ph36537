const AssignedChild = require("../models/AssignedChild");

// ✅ Gán trẻ cho tài khoản phụ
exports.assignChildToUser = async (req, res) => {
  const { child_id, user_id } = req.body;

  try {
    // Kiểm tra đã tồn tại chưa
    const exists = await AssignedChild.findOne({ child_id, user_id });
    if (exists) {
      return res.status(400).json({ success: false, message: "Đã gán trẻ này cho tài khoản phụ rồi." });
    }

    const assigned = new AssignedChild({ child_id, user_id });
    await assigned.save();

    res.status(201).json({ success: true, message: "Gán thành công.", data: assigned });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server.", error: err.message });
  }
};

// ❌ Hủy gán trẻ
exports.unassignChildFromUser = async (req, res) => {
  const { child_id, user_id } = req.body;

  try {
    const deleted = await AssignedChild.findOneAndDelete({ child_id, user_id });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu để hủy gán." });
    }

    res.json({ success: true, message: "Đã hủy gán trẻ khỏi tài khoản phụ." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server.", error: err.message });
  }
};

// 📋 Lấy danh sách trẻ được gán cho user
exports.getChildrenByUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const children = await AssignedChild.find({ user_id }).populate("child_id");

    res.json({ success: true, data: children });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server.", error: err.message });
  }
};

// 📋 Lấy danh sách tài khoản phụ được gán cho trẻ
exports.getUsersByChild = async (req, res) => {
  const { child_id } = req.params;

  try {
    const users = await AssignedChild.find({ child_id }).populate("user_id");

    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server.", error: err.message });
  }
};
