const User = require("../models/User");
const Lead = require("../models/Lead");

const getNextAgent = async () => {
  const agents = await User.find({ role: "agent", isActive: true }).sort({
    name: 1,
  });

  if (agents.length === 0) {
    throw new Error("No active agents available");
  }

  const lastAssignedLead = await Lead.findOne({
    assigned_agent: { $ne: null },
  }).sort({ created_at: -1 });

  if (!lastAssignedLead || !lastAssignedLead.assigned_agent) {
    return agents[0];
  }

  const lastAgentIndex = agents.findIndex(
    (a) => a._id.toString() === lastAssignedLead.assigned_agent.toString()
  );

  const nextIndex = (lastAgentIndex + 1) % agents.length;
  return agents[nextIndex];
};

module.exports = { getNextAgent };