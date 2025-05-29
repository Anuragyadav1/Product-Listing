const mongoose = require("mongoose");
const recommendationSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Recommendation", recommendationSchema);
