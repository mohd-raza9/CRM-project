const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { generateFollowUps } = require("./services/followupService");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/leads", require("./routes/leads"));
app.use("/api/visits", require("./routes/visits"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/followups", require("./routes/followups"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

app.use(errorHandler);

// Check for follow-ups every hour
cron.schedule("0 * * * *", async () => {
  console.log("[CRON] Checking for follow-up reminders...");
  try {
    await generateFollowUps();
  } catch (err) {
    console.error("[CRON] Error:", err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));