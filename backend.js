const path = require("path");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve views from the "views" directory
app.get("/", (request, response) => {
  return response.sendFile("index.html", {
    root: path.join(__dirname, "views"),
  });
});

app.get("/auth/discord", (request, response) => {
  return response.sendFile("dashboard.html", {
    root: path.join(__dirname, "views"),
  });
});

// CORS proxy for Discord API
app.get("/discord-api/users/@me", async (req, res) => {
  const { accessToken, tokenType } = req.query;
  if (!accessToken || !tokenType) {
    return res.status(400).json({ error: "Missing accessToken or tokenType" });
  }
  try {
    const discordResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    });
    const data = await discordResponse.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Discord user data" });
  }
});

// Serve favicon
app.get("/favicon.ico", (req, res) => {
  res.sendFile("favicon.ico", {
    root: path.join(__dirname, "public"),
  });
});

const port = "53134";
app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
