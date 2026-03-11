const Lead = require("../models/Lead");
const Visit = require("../models/Visit");
const FollowUp = require("../models/FollowUp");

const getDashboard = async (req, res) => {
  try {
    const agentFilter =
      req.user.role === "agent" ? { assigned_agent: req.user._id } : {};

    const statusCounts = await Lead.aggregate([
      { $match: agentFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusMap = {};
    statusCounts.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    const sourceCounts = await Lead.aggregate([
      { $match: agentFilter },
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]);

    const totalLeads = await Lead.countDocuments(agentFilter);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const visitFilter =
      req.user.role === "agent" ? { agent_id: req.user._id } : {};
    const visitsThisWeek = await Visit.countDocuments({
      ...visitFilter,
      date: { $gte: startOfWeek },
    });

    const followupFilter =
      req.user.role === "agent" ? { agent_id: req.user._id } : {};
    const pendingFollowUps = await FollowUp.countDocuments({
      ...followupFilter,
      is_completed: false,
    });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const leadsPerDay = await Lead.aggregate([
      {
        $match: { ...agentFilter, created_at: { $gte: sevenDaysAgo } },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalLeads,
      newLeads: statusMap["new"] || 0,
      contacted: statusMap["contacted"] || 0,
      requirementCollected: statusMap["requirement_collected"] || 0,
      propertySuggested: statusMap["property_suggested"] || 0,
      visitScheduled: statusMap["visit_scheduled"] || 0,
      visitCompleted: statusMap["visit_completed"] || 0,
      booked: statusMap["booked"] || 0,
      lost: statusMap["lost"] || 0,
      visitsThisWeek,
      pendingFollowUps,
      sourceCounts,
      leadsPerDay,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard };