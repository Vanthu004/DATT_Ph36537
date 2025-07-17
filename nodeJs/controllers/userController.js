const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ─────────────────────────────────────────────────────────
// CREATE  (POST /api/users)
exports.createUser = async (req, res) => {
  try {
    const { email, password, role, name, avatar, avata_url, phone_number } = req.body;
    
    // Kiểm tra user đang đăng nhập
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false,
        message: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.' 
      });
    }
    
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email này đã được sử dụng. Vui lòng chọn email khác.' 
      });
    }
    
    // Endpoint này chỉ cho phép tạo tài khoản chính
    if (role === 'parent_sub') {
      return res.status(400).json({ 
        success: false,
        message: 'Endpoint này không hỗ trợ tạo tài khoản phụ. Vui lòng sử dụng endpoint /sub-account' 
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      email, 
      password: hashedPassword, 
      role: role || 'parent_main', 
      name, 
      avatar, 
      avata_url, 
      phone_number 
    });
    
    // Trả về user không bao gồm password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (err) {
    console.log('createUser error:', err);
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// ─────────────────────────────────────────────────────────
// CREATE SUB ACCOUNT  (POST /api/users/sub-account)
exports.createSubAccount = async (req, res) => {
  try {
    const { email, password, name, avatar, avata_url, phone_number } = req.body;
    console.log('createSubAccount - Request body:', { email, name, avata_url, phone_number });
    console.log('createSubAccount - req.user:', req.user);
    
    // Kiểm tra user đang đăng nhập
    if (!req.user || !req.user.id) {
      console.log('createSubAccount - No user found in token');
      return res.status(401).json({ 
        success: false,
        message: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.' 
      });
    }
    
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('createSubAccount - Email already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: 'Email này đã được sử dụng. Vui lòng chọn email khác.' 
      });
    }
    
    // Kiểm tra user đang đăng nhập có phải là tài khoản chính không
    const currentUser = await User.findById(req.user.id);
    console.log('createSubAccount - Current user:', currentUser ? { id: currentUser._id, role: currentUser.role } : 'Not found');
    
    if (!currentUser || currentUser.role !== 'parent_main') {
      console.log('createSubAccount - User is not parent_main');
      return res.status(403).json({ 
        success: false,
        message: 'Chỉ tài khoản chính mới có thể tạo tài khoản phụ' 
      });
    }
    
    // Sử dụng ID của user đang đăng nhập làm parent_id
    const parent_id = req.user.id;
    console.log('createSubAccount - Creating sub account with parent_id:', parent_id);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      email, 
      password: hashedPassword, 
      role: 'parent_sub', // Luôn là parent_sub
      name, 
      parent_id, 
      avatar, 
      avata_url, 
      phone_number 
    });
    
    console.log('createSubAccount - Created user:', { id: user._id, email: user.email, role: user.role, parent_id: user.parent_id });
    
    // Trả về user không bao gồm password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (err) {
    console.log('createSubAccount error:', err);
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// READ ALL  (GET /api/users)
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    console.log('getAllUsers - req.user.id:', req.user.id);
    console.log('getAllUsers - role query:', role);
    
    let query = {};
    if (role) query.role = role;
    // Nếu là parent_sub thì chỉ lấy của parent đang đăng nhập
    if (role === 'parent_sub') {
      query.parent_id = req.user.id;
      console.log('getAllUsers - final query:', query);
    }
    
    const users = await User.find(query).select('-password');
    console.log('getAllUsers - found users count:', users.length);
    console.log('getAllUsers - found users:', users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role, parent_id: u.parent_id })));
    
    // Trả về format phù hợp với frontend
    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    console.log('getAllUsers - error:', err);
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// GET CURRENT USER  (GET /api/users/me)
exports.getCurrentUser = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    console.log('req.user.id:', req.user.id);
    
    if (!req.user || !req.user.id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không tìm thấy thông tin user trong token' 
      });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy user' 
      });
    }
    // Nếu user bị block, trả về thêm block_until, block_reason, is_blocked
    const userObj = user.toObject();
    res.json({ 
      success: true, 
      data: {
        ...userObj,
        is_blocked: user.is_blocked,
        block_reason: user.block_reason || '',
        block_until: user.block_until || null
      }
    });
  } catch (err) {
    console.log('Lỗi trong getCurrentUser:', err);
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// READ ONE  (GET /api/users/:id)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user' 
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: 'ID không hợp lệ' 
    });
  }
};

// UPDATE  (PUT /api/users/:id)
exports.updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const updateData = { ...rest };
    // Đảm bảo nhận cả block_reason và block_until nếu có
    if (typeof req.body.block_reason !== 'undefined') updateData.block_reason = req.body.block_reason;
    if (typeof req.body.block_until !== 'undefined') updateData.block_until = req.body.block_until;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user' 
      });
    }
    // Trả về user không bao gồm password
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({
      success: true,
      data: userResponse
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// DELETE  (DELETE /api/users/:id)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user' 
      });
    }
    res.json({ 
      success: true,
      message: 'Đã xoá user' 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// ĐĂNG NHẬP (POST /api/auth/login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }
    
    if (user.is_blocked) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đã bị khóa với lý do',
        block_reason: user.block_reason || 'Không rõ lý do',
        is_blocked: true,
        block_until: user.block_until || null
      });
    }

    // Đảm bảo user._id được chuyển đổi thành string
    const userId = user._id.toString();
    const token = jwt.sign({ id: userId, role: user.role }, 'your_jwt_secret', { expiresIn: '7d' });
    res.json({ 
      success: true,
      token, 
      data: { 
        id: userId, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        is_blocked: user.is_blocked,
        block_reason: user.block_reason || '',
        block_until: user.block_until || null
      } 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// QUÊN MẬT KHẨU (POST /api/auth/forgot-password)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user' 
      });
    }
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1h
    await user.save();
    // TODO: Gửi token qua email, ở đây trả về response để test
    res.json({ 
      success: true,
      message: 'Đã gửi mã đặt lại mật khẩu', 
      data: { token } 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// ĐẶT LẠI MẬT KHẨU (POST /api/auth/reset-password)
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn' 
      });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.json({ 
      success: true,
      message: 'Đặt lại mật khẩu thành công' 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};
