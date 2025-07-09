const mongoose = require("mongoose");
const { Schema } = mongoose;

const assignedChildSchema = new Schema({
  child_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assigned_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AssignedChild", assignedChildSchema);
