const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  child_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  time: {
    type: Date,
    required: true
  },
  repeat_type: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly'],
    default: 'none'
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Reminder', reminderSchema);
