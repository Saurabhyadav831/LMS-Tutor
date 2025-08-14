require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("./models/user.model");

const testDB = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Database connected successfully");
    
    // Test user model
    const testEmail = "test@example.com";
    
    // Check if user exists
    const existingUser = await userModel.findOne({ email: testEmail });
    console.log("🔍 Checking for existing user:", testEmail);
    console.log("Result:", existingUser ? "User found" : "No user found");
    
    // Count total users
    const totalUsers = await userModel.countDocuments();
    console.log("📊 Total users in database:", totalUsers);
    
    // List all users (first 5)
    const users = await userModel.find({}).select('name email createdAt').limit(5);
    console.log("👥 Sample users:", users);
    
    await mongoose.disconnect();
    console.log("✅ Database disconnected");
    
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    process.exit(1);
  }
};

testDB();
