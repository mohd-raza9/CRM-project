const Visit = require("../models/Visit");
const Lead = require("../models/Lead");
const { logActivity } = require("../services/activityService");

const createVisit = async (req, res) => {
  try {
    const { lead_id, property_name, date, time, notes } = req.body;

    const lead = await Lead.findById(lead_id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const visit = await Visit.create({
      lead_id,
      agent_id: lead.assigned_agent || req.user._id,
      property_name,
      date,
      time,
      notes,
      visit_status: "scheduled",
    });

    lead.status = "visit_scheduled";
    lead.last_activity_at = new Date();
    await lead.save();

    await logActivity({
      lead_id,
      agent_id: req.user._id,
      type: "visit_scheduled",
      description: `Visit scheduled at "${property_name}" on ${new Date(
        date
      ).toLocaleDateString()} at ${time}`,
    });

    const populatedVisit = await Visit.findById(visit._id)
      .populate("lead_id", "name phone")
      .populate("agent_id", "name email");

    res.status(201).json(populatedVisit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVisits = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === "agent") {
      query.agent_id = req.user._id;
    }
    if (req.query.visit_status) {
      query.visit_status = req.query.visit_status;
    }

    const visits = await Visit.find(query)
      .populate("lead_id", "name phone email status")
      .populate("agent_id", "name email")
      .sort({ date: 1, time: 1 });

    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVisit = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    const { visit_status, date, time, notes } = req.body;

    if (visit_status) visit.visit_status = visit_status;
    if (date) visit.date = date;
    if (time) visit.time = time;
    if (notes !== undefined) visit.notes = notes;
    await visit.save();

    const lead = await Lead.findById(visit.lead_id);
    if (lead) {
      const activityMap = {
        completed: {
          status: "visit_completed",
          type: "visit_completed",
          desc: "Visit completed",
        },
        rescheduled: {
          status: "visit_scheduled",
          type: "visit_rescheduled",
          desc: "Visit rescheduled",
        },
        no_show: {
          status: "visit_scheduled",
          type: "visit_no_show",
          desc: "Lead was a no-show",
        },
        booked: {
          status: "booked",
          type: "visit_booked",
          desc: "Lead booked after visit!",
        },
      };

      const mapping = activityMap[visit_status];
      if (mapping) {
        lead.status = mapping.status;
        lead.last_activity_at = new Date();
        await lead.save();

        await logActivity({
          lead_id: lead._id,
          agent_id: req.user._id,
          type: mapping.type,
          description: `${mapping.desc} at "${visit.property_name}"`,
        });
      }
    }

    const updatedVisit = await Visit.findById(visit._id)
      .populate("lead_id", "name phone")
      .populate("agent_id", "name email");

    res.json(updatedVisit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createVisit, getVisits, updateVisit };