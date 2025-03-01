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

// Discord authentication callback to store user in MongoDB
app.get("/auth/discord/callback", async (req, res) => {
  const { accessToken, tokenType } = req.query;

  if (!accessToken || !tokenType) {
    return res.status(400).json({ error: "Missing accessToken or tokenType" });
  }

  try {
    // Fetch user data from Discord API
    const discordResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { authorization: `${tokenType} ${accessToken}` },
    });
    const discordUser = await discordResponse.json();

    if (!discordUser.id) {
      return res.status(400).json({ error: "Failed to get Discord user data" });
    }

    // Check if user exists in MongoDB
    let user = await User.findOne({ discordId: discordUser.id });

    if (!user) {
      // If not, create a new user
      user = new User({
        discordId: discordUser.id,
        username: discordUser.username,
        avatar: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
      });

      await user.save();
    }

    // Redirect to dashboard (or send user data as JSON)
    res.redirect(`/dashboard.html?userId=${user.discordId}`);
  } catch (error) {
    console.error("Error fetching Discord user data:", error);
    res.status(500).json({ error: "Failed to authenticate with Discord" });
  }
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
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 50000, // Wait longer before failing
      connectTimeoutMS: 50000,
    });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

connectDB();

// Export app for Vercel
module.exports = app;
