const SupportTicket = require('../models/SupportTicket');
const User = require('../models/user');

// Tạo ticket
exports.createTicket = async (req, res) => {
  try {
    const { user_id, title, messege, images } = req.body;
    const user = await User.findById(user_id);
    if (!user) return res.status(400).json({ message: 'user_id không tồn tại' });

    const ticket = await SupportTicket.create({ user_id, title, messege, images });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả ticket (có thể lọc theo userId)
exports.getAllTickets = async (req, res) => {
  const { userId } = req.query;
  let query = {};
  if (userId) {
    query.user_id = userId;
  }
  const tickets = await SupportTicket.find(query)
    .populate('user_id', 'name email')
    .populate('resolved_by', 'name');
  res.json({
    success: true,
    data: tickets
  });
};

// Lấy 1 ticket theo ID
exports.getTicketById = async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id)
    .populate('user_id', 'name')
    .populate('resolved_by', 'name');
  if (!ticket) return res.status(404).json({ message: 'Không tìm thấy ticket' });
  res.json(ticket);
};

// Cập nhật ticket (ví dụ cập nhật trạng thái)
exports.resolveTicket = async (req, res) => {
  const { resolved_by } = req.body;
  const admin = await User.findById(resolved_by);
  if (!admin) return res.status(400).json({ message: 'resolved_by không tồn tại' });

  const ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    {
      status: 'resolved',
      resolved_by,
      resolved_at: new Date(),
    },
    { new: true }
  );

  if (!ticket) return res.status(404).json({ message: 'Không tìm thấy ticket' });
  res.json(ticket);
};

// Xoá ticket
exports.deleteTicket = async (req, res) => {
  const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Không tìm thấy ticket' });
  res.json({ message: 'Đã xoá ticket' });
};
