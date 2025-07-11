const AssignedChild = require("../models/AssignedChild");
const Child = require("../models/Child");

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
    // Trả về mảng các object trẻ đã populate
    const childObjects = children
      .map(item => item.child_id)
      .filter(child => !!child); // loại bỏ null nếu có
    res.json({ success: true, data: childObjects });
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

// 📋 Lấy tất cả trẻ với thông tin gán cho tài khoản phụ cụ thể
exports.getAllChildrenWithAssignment = async (req, res) => {
  const { user_id } = req.params;

  try {
    console.log('User info:', { id: req.user.id, role: req.user.role });
    console.log('Requested user_id:', user_id);
    
    // Chỉ parent hoặc parent_main mới có thể xem và quản lý gán trẻ cho sub-accounts
    if (req.user.role !== 'parent' && req.user.role !== 'parent_main') {
      return res.status(403).json({ success: false, message: "Chỉ tài khoản chính mới có thể quản lý gán trẻ." });
    }

    // Lấy tất cả trẻ của parent đang đăng nhập
    const allChildren = await Child.find({ parent_id: req.user.id });
    console.log('Found children:', allChildren.length);
    
    // Lấy danh sách trẻ đã được gán cho tài khoản phụ này
    const assignedChildren = await AssignedChild.find({ user_id }).populate("child_id");
    const assignedChildIds = assignedChildren.map(ac => ac.child_id._id.toString());
    console.log('Assigned child IDs:', assignedChildIds);
    
    // Thêm thông tin gán vào mỗi trẻ
    const childrenWithAssignment = allChildren.map(child => ({
      ...child.toObject(),
      isAssigned: assignedChildIds.includes(child._id.toString())
    }));

    res.json({ 
      success: true, 
      data: childrenWithAssignment 
    });
  } catch (err) {
    console.error('Error in getAllChildrenWithAssignment:', err);
    res.status(500).json({ success: false, message: "Lỗi server.", error: err.message });
  }
};
