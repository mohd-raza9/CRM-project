const Activity = require("../models/Activity");
const Lead = require("../models/Lead");

const logActivity = async ({
  lead_id,
  agent_id,
  type,
  description,
  metadata = {},
}) => {
  const activity = await Activity.create({
    lead_id,
    agent_id,
    type,
    description,
    metadata,
    timestamp: new Date(),
  });

  await Lead.findByIdAndUpdate(lead_id, { last_activity_at: new Date() });

  return activity;
};

const getLeadActivities = async (lead_id) => {
  return Activity.find({ lead_id })
    .populate("agent_id", "name email")
    .sort({ timestamp: -1 });
};

module.exports = { logActivity, getLeadActivities };