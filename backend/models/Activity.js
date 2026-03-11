const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
    required: true,
  },
  agent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: [
      "lead_created",
      "assigned",
      "status_changed",
      "contacted",
      "visit_scheduled",
      "visit_completed",
      "visit_rescheduled",
      "visit_no_show",
      "visit_booked",
      "note_added",
      "follow_up_created",
    ],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Activity", activitySchema);