const express = require("express");
const router = express.Router();
const {
  createVisit,
  getVisits,
  updateVisit,
} = require("../controllers/visitController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", createVisit);
router.get("/", getVisits);
router.patch("/:id", updateVisit);

module.exports = router;