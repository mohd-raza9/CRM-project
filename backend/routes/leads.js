const express = require("express");
const router = express.Router();
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");
const { getLeadActivities } = require("../services/activityService");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", createLead);
router.get("/", getLeads);
router.get("/:id", getLeadById);
router.patch("/:id", updateLead);
router.delete("/:id", deleteLead);

router.get("/:id/activities", async (req, res) => {
  try {
    const activities = await getLeadActivities(req.params.id);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;