const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    source: {
      type: String,
      enum: ["website", "whatsapp", "call", "social", "referral", "walkin"],
      default: "website",
    },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "requirement_collected",
        "property_suggested",
        "visit_scheduled",
        "visit_completed",
        "booked",
        "lost",
      ],
      default: "new",
    },
    assigned_agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      default: "",
    },
    budget: {
      type: String,
      trim: true,
    },
    preferred_location: {
      type: String,
      trim: true,
    },
    last_activity_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Lead", leadSchema);