#!/usr/bin/env node
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");

// require User model
const User = require(path.join(__dirname, "..", "src", "models", "User"));

async function main() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/newsapp";
  if (!/^mongodb(\+srv)?:\/\//i.test(uri)) {
    console.warn(
      "MONGO_URI not set or appears invalid. Using fallback local URI:",
      uri
    );
  }

  await mongoose.connect(uri).catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message || err);
    process.exit(1);
  });

  const email = process.env.NEW_OWNER_EMAIL || "owner@example.com";
  const password = process.env.NEW_OWNER_PASSWORD || "StrongPassword123!";
  const name = process.env.NEW_OWNER_NAME || "Owner Name";

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("User already exists with id:", existing._id.toString());
      await mongoose.disconnect();
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "owner",
    });
    console.log("Created owner user with id:", user._id.toString());
    console.log("Email:", email);
    console.log("Password (plaintext only shown here once):", password);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error creating owner:", err.message || err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
