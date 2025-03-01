const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  username: String,
  avatar: String,
});

module.exports = mongoose.model("User", userSchema);
