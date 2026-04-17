// ─────────────────────────────────────────────────────────────────
// MongoDB connection using Mongoose
//
// Mongoose is an ODM (Object Data Modelling) library for MongoDB.
// It lets you define schemas, models, and run queries with JS objects.
//
// Key concepts:
//   - mongoose.connect()  → opens a connection to MongoDB
//   - connection events   → connected / error / disconnected
//   - mongoose.disconnect() → closes the connection cleanly
// ─────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected:", mongoose.connection.host);
  } catch (err) {
    console.error("Connection error:", err.message);
    process.exit(1); // exit if we can't connect
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
  console.log("MongoDB disconnected.");
}

module.exports = { connectDB, disconnectDB };