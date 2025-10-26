const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("MONGO_URI not set in environment; skipping DB connect");
    return;
  }

  // Use new connection each time; caller handles errors
  await mongoose.connect(uri, {
    // mongoose 6+ options are fine with defaults; keep explicit for clarity
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  console.log("Connected to MongoDB");
}

module.exports = connectDB;
