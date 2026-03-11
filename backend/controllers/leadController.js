const Lead = require("../models/Lead");
const { getNextAgent } = require("../services/assignmentService");
const { logActivity } = require("../services/activityService");

const createLead = async (req, res) => {
  try {
    const { name, phone, email, source, notes, budget, preferred_location } =
      req.body;

    const agent = await getNextAgent();

    const lead = await Lead.create({
      name,
      phone,
      email,
      source,
      notes,
      budget,
      preferred_location,
      assigned_agent: agent._id,
      status: "new",
      last_activity_at: new Date(),
    });

    await logActivity({
      lead_id: lead._id,
      agent_id: req.user._id,
      type: "lead_created",
      description: `Lead "${name}" created from source: ${source}`,
    });

    await logActivity({
      lead_id: lead._id,
      agent_id: agent._id,
      type: "assigned",
      description: `Lead assigned to agent: ${agent.name}`,
    });

    const populatedLead = await Lead.findById(lead._id).populate(
      "assigned_agent",
      "name email"
    );

    res.status(201).json(populatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeads = async (req, res) => {
  try {
    const {
      status,
      source,
      assigned_agent,
      search,
      page = 1,
      limit = 100,
    } = req.query;
    const query = {};

    if (status) query.status = status;
    if (source) query.source = source;
    if (assigned_agent) query.assigned_agent = assigned_agent;

    if (req.user.role === "agent") {
      query.assigned_agent = req.user._id;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate("assigned_agent", "name email")
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      leads,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "assigned_agent",
      "name email phone"
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const oldStatus = lead.status;
    const updates = req.body;

    Object.keys(updates).forEach((key) => {
      lead[key] = updates[key];
    });
    lead.last_activity_at = new Date();
    await lead.save();

    if (updates.status && updates.status !== oldStatus) {
      await logActivity({
        lead_id: lead._id,
        agent_id: req.user._id,
        type: "status_changed",
        description: `Status changed from "${oldStatus}" to "${updates.status}"`,
        metadata: { from: oldStatus, to: updates.status },
      });
    }

    const updatedLead = await Lead.findById(lead._id).populate(
      "assigned_agent",
      "name email"
    );

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createLead, getLeads, getLeadById, updateLead, deleteLead };