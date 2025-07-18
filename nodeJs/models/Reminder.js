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
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  customDates: {
    type: [Date],
    required: false,
    default: undefined
  },
  repeat_type: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly','custom'],
    default: 'none'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedDates: {
    type: [Date],
    default: undefined
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Reminder', reminderSchema);
