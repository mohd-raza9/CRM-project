const express = require("express");
const router = express.Router();
const {
  login,
  register,
  getMe,
  getAgents,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/login", login);
router.post("/register", protect, adminOnly, register);
router.get("/me", protect, getMe);
router.get("/agents", protect, getAgents);

module.exports = router;