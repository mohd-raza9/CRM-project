const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    lead_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    agent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reminder_date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      default: "No activity for 24 hours",
    },
    is_completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FollowUp", followUpSchema);