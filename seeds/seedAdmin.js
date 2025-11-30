require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require("../models/user");
const connectDB = require('../config/db');

const seedAdmin = async () => {
  await connectDB();

  const adminEmail = "admin@college.edu";
  const adminPassword = "password123";

  try {
    // Check if admin exists
    const userExists = await User.findOne({ email: adminEmail });

    if (userExists) {
      console.log('⚠️  Admin user already exists');
      process.exit();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin
    await User.create({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();