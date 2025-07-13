const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  child_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String }, // VD: '10:30'
  activityType: { type: String, required: true }, // VD: 'Uống thuốc'
  amount: { type: String }, // VD: '1 viên'
  note: { type: String },
  image: { type: String }, // link ảnh
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
