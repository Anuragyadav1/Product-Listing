const mongoose = require("mongoose");
const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
});
module.exports = mongoose.model("Favorite", favoriteSchema);
