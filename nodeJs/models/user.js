const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Thông tin tài khoản cơ bản
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    phone_number: {
      type: String,
      required: false
    },

    // Vai trò người dùng
    role: {
      type: String,
      enum: ['admin', 'parent_main', 'parent_sub'],
      default: 'parent_main'
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // Chỉ tài khoản phụ mới có
    },

    // Trạng thái hoạt động
    is_active: {
      type: Boolean,
      default: true
    },
    is_blocked: {
      type: Boolean,
      default: false
    },
    block_reason: {
      type: String,
      default: ''
    },
    block_until: {
      type: Date,
      default: null
    },

    // Thông tin avatar
    avatar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Upload'
    },
    avata_url: {
      type: String,
      default: ''
    },

    // Thông tin thiết bị
    token_device: {
      type: String,
      default: ''
    },
    // Thông tin reset mật khẩu
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// // Tự động hash password trước khi lưu
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

module.exports = mongoose.model('User', userSchema);
