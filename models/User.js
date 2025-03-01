const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true }, // Stores Discord user ID
  username: { type: String }, // Optional: Store username
  avatar: { type: String }, // Optional: Store avatar URL
});

module.exports = mongoose.model("User", userSchema);
