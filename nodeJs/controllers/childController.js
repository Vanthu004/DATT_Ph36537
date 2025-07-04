const Child = require('../models/Child');

// ──────────────────────────────────────────
// CREATE  (POST /api/children)
exports.createChild = async (req, res) => {
  try {
    const { parent_id, full_name, dob, gender, note } = req.body;
    const child = await Child.create({ parent_id, full_name, dob, gender, note });
    res.status(201).json(child);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL  (GET /api/children)
exports.getAllChildren = async (_req, res) => {
  const children = await Child.find().populate('parent_id', 'name email');
  res.json(children);
};

// READ ONE  (GET /api/children/:id)
exports.getChildById = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id).populate('parent_id', 'name email');
    if (!child) return res.status(404).json({ message: 'Không tìm thấy trẻ' });
    res.json(child);
  } catch (err) {
    res.status(400).json({ message: 'ID không hợp lệ' });
  }
};

// UPDATE  (PUT /api/children/:id)
exports.updateChild = async (req, res) => {
  try {
    const child = await Child.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!child) return res.status(404).json({ message: 'Không tìm thấy trẻ' });
    res.json(child);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE  (DELETE /api/children/:id)
exports.deleteChild = async (req, res) => {
  const child = await Child.findByIdAndDelete(req.params.id);
  if (!child) return res.status(404).json({ message: 'Không tìm thấy trẻ' });
  res.json({ message: 'Đã xoá thông tin trẻ' });
};
