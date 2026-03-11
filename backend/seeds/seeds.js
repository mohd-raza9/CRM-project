const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Lead = require("../models/Lead");

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear data
    await User.deleteMany({});
    await Lead.deleteMany({});

    // Create admin
    await User.create({
      name: "Admin User",
      email: "admin@pgcrm.com",
      password: "admin123",
      role: "admin",
      phone: "9999999999",
    });

    // Create agents
    const agent1 = await User.create({
      name: "Rahul Sharma",
      email: "rahul@pgcrm.com",
      password: "agent123",
      role: "agent",
      phone: "9876543210",
    });

    const agent2 = await User.create({
      name: "Priya Patel",
      email: "priya@pgcrm.com",
      password: "agent123",
      role: "agent",
      phone: "9876543211",
    });

    const agent3 = await User.create({
      name: "Amit Kumar",
      email: "amit@pgcrm.com",
      password: "agent123",
      role: "agent",
      phone: "9876543212",
    });

    // Create sample leads
    await Lead.insertMany([
      {
        name: "Vikram Singh",
        phone: "9111111111",
        source: "website",
        status: "new",
        assigned_agent: agent1._id,
      },
      {
        name: "Neha Gupta",
        phone: "9222222222",
        source: "whatsapp",
        status: "contacted",
        assigned_agent: agent2._id,
      },
      {
        name: "Rohan Mehta",
        phone: "9333333333",
        source: "call",
        status: "requirement_collected",
        assigned_agent: agent3._id,
      },
      {
        name: "Anjali Desai",
        phone: "9444444444",
        source: "social",
        status: "property_suggested",
        assigned_agent: agent1._id,
      },
      {
        name: "Karan Joshi",
        phone: "9555555555",
        source: "referral",
        status: "visit_scheduled",
        assigned_agent: agent2._id,
      },
      {
        name: "Sneha Reddy",
        phone: "9666666666",
        source: "walkin",
        status: "visit_completed",
        assigned_agent: agent3._id,
      },
      {
        name: "Arjun Nair",
        phone: "9777777777",
        source: "website",
        status: "booked",
        assigned_agent: agent1._id,
      },
      {
        name: "Divya Iyer",
        phone: "9888888888",
        source: "call",
        status: "lost",
        assigned_agent: agent2._id,
      },
      {
        name: "Manish Tiwari",
        phone: "9100000001",
        source: "whatsapp",
        status: "new",
        assigned_agent: agent3._id,
      },
      {
        name: "Pooja Saxena",
        phone: "9100000002",
        source: "social",
        status: "new",
        assigned_agent: agent1._id,
      },
    ]);

    console.log("Seed completed!");
    console.log("------------------");
    console.log("Admin:  admin@pgcrm.com / admin123");
    console.log("Agent1: rahul@pgcrm.com / agent123");
    console.log("Agent2: priya@pgcrm.com / agent123");
    console.log("Agent3: amit@pgcrm.com  / agent123");
    console.log("------------------");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDB();