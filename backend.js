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

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Serve HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/auth/discord", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// Store Discord user in MongoDB
app.get("/discord-api/users/@me", async (req, res) => {
  const { accessToken, tokenType } = req.query;
  if (!accessToken || !tokenType) {
    return res.status(400).json({ error: "Missing accessToken or tokenType" });
  }

  try {
    const discordResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { authorization: `${tokenType} ${accessToken}` },
    });

    const discordUser = await discordResponse.json();

    if (!discordUser.id) {
      return res.status(400).json({ error: "Invalid Discord user data" });
    }

    // Check if user exists in MongoDB
    let user = await User.findOne({ discordId: discordUser.id });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        discordId: discordUser.id,
        username: discordUser.username,
        avatar: discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
          : null,
      });

      await user.save(); // Save to MongoDB
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching Discord user:", error);
    res.status(500).json({ error: "Failed to fetch Discord user data" });
  }
});

// Serve favicon
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "favicon.ico"));
});

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

connectDB();

// Export app for Vercel
module.exports = app;
