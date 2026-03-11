const FollowUp = require("../models/FollowUp");

const getFollowUps = async (req, res) => {
  try {
    const query = { is_completed: false };

    if (req.user.role === "agent") {
      query.agent_id = req.user._id;
    }

    const followups = await FollowUp.find(query)
      .populate("lead_id", "name phone status")
      .populate("agent_id", "name email")
      .sort({ reminder_date: -1 })
      .limit(50);

    res.json(followups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeFollowUp = async (req, res) => {
  try {
    const followup = await FollowUp.findByIdAndUpdate(
      req.params.id,
      { is_completed: true },
      { new: true }
    );

    if (!followup) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    res.json(followup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFollowUps, completeFollowUp };