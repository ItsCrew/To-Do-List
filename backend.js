const express = require("express");
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User"); // Import User model

const mongoURI = process.env.MONGODB_URI;

const app = express();
app.use(cors());

// Serve static files correctly
app.use(express.static(path.join(__dirname, "public"))); // ✅ This serves /public correctly

// Serve HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/auth/discord", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// CORS proxy for Discord API
app.get("/discord-api/users/@me", async (req, res) => {
  const { accessToken, tokenType } = req.query;
  if (!accessToken || !tokenType) {
    return res.status(400).json({ error: "Missing accessToken or tokenType" });
  }
  try {
    const discordResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { authorization: `${tokenType} ${accessToken}` },
    });
    const data = await discordResponse.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Discord user data" });
  }
});

// Serve favicon
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "favicon.ico"));
});

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {});
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

connectDB();

// Export app for Vercel
module.exports = app;
