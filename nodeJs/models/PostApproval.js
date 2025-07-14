const mongoose = require('mongoose');

const postApprovalSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Admin
    required: false,
  },
  approved_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['approved', 'rejected', 'pending'],
    default: 'pending',
  },
  note: {
    type: String,
    default: '',
  }
});

module.exports = mongoose.model('PostApproval', postApprovalSchema);
