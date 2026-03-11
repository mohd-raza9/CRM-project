const Lead = require("../models/Lead");
const FollowUp = require("../models/FollowUp");
const { logActivity } = require("./activityService");

const generateFollowUps = async () => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const staleLeads = await Lead.find({
    status: { $nin: ["booked", "lost"] },
    assigned_agent: { $ne: null },
    last_activity_at: { $lt: twentyFourHoursAgo },
  });

  let createdCount = 0;

  for (const lead of staleLeads) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const existingFollowUp = await FollowUp.findOne({
      lead_id: lead._id,
      is_completed: false,
      reminder_date: { $gte: todayStart },
    });

    if (!existingFollowUp) {
      await FollowUp.create({
        lead_id: lead._id,
        agent_id: lead.assigned_agent,
        reminder_date: new Date(),
        reason: `No activity for 24+ hours on lead: ${lead.name}`,
      });

      await logActivity({
        lead_id: lead._id,
        agent_id: lead.assigned_agent,
        type: "follow_up_created",
        description:
          "Auto follow-up reminder created (no activity for 24h)",
      });

      createdCount++;
    }
  }

  console.log(`[CRON] Created ${createdCount} follow-up reminders`);
  return createdCount;
};

module.exports = { generateFollowUps };