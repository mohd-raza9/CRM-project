const express = require("express");
const router = express.Router();
const {
  getFollowUps,
  completeFollowUp,
} = require("../controllers/followupController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", getFollowUps);
router.patch("/:id/complete", completeFollowUp);

module.exports = router;