const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  messege: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending',
  },
 
  images: {
    type: [String],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  resolved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  response_message: { type: String, required: false },
  resolved_at: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
