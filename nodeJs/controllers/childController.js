const Child = require('../models/Child');

// ──────────────────────────────────────────
// CREATE  (POST /api/children)
exports.createChild = async (req, res) => {
  try {
    const { parent_id, full_name, dob, gender, note } = req.body;
    const child = await Child.create({ parent_id, full_name, dob, gender, note });
    res.status(201).json({
      success: true,
      data: child
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// READ ALL  (GET /api/children)
exports.getAllChildren = async (req, res) => {
  try {
    // Chỉ lấy trẻ của parent đang đăng nhập
    const children = await Child.find({ parent_id: req.user.id }).populate('parent_id', 'name email');
    res.json({
      success: true,
      data: children
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// READ ONE  (GET /api/children/:id)
exports.getChildById = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id).populate('parent_id', 'name email');
    if (!child) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy trẻ' 
      });
    }
    res.json({
      success: true,
      data: child
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: 'ID không hợp lệ' 
    });
  }
};

// UPDATE  (PUT /api/children/:id)
exports.updateChild = async (req, res) => {
  try {
    const child = await Child.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!child) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy trẻ' 
      });
    }
    res.json({
      success: true,
      data: child
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// DELETE  (DELETE /api/children/:id)
exports.deleteChild = async (req, res) => {
  try {
    const child = await Child.findByIdAndDelete(req.params.id);
    if (!child) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy trẻ' 
      });
    }
    res.json({ 
      success: true,
      message: 'Đã xoá thông tin trẻ' 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};
