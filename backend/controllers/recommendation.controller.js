// const User = require("../models/user.model");
// const Property = require("../models/property.model");
// const Recommendation = require("../models/recommendation.model");

// exports.recommendProperty = async (req, res) => {
//   const { recipientEmail, propertyId } = req.body;
//   const recipient = await User.findOne({ email: recipientEmail });
//   if (!recipient)
//     return res.status(404).json({ message: "Recipient not found" });
//   const property = await Property.findById(propertyId);
//   if (!property) return res.status(404).json({ message: "Property not found" });
//   await Recommendation.create({
//     from: req.user._id,
//     to: recipient._id,
//     property: propertyId,
//   });
//   recipient.recommendationsReceived.push(propertyId);
//   await recipient.save();
//   res.json({ message: "Property recommended" });
// };

// exports.getReceivedRecommendations = async (req, res) => {
//   const recommendations = await Recommendation.find({
//     to: req.user._id,
//   }).populate("property from");
//   res.json(recommendations);
// };


const mongoose = require("mongoose");
const User = require("../models/user.model");
const Property = require("../models/property.model");
const Recommendation = require("../models/recommendation.model");

// Recommend a property to another user
exports.recommendProperty = async (req, res) => {
  try {
    const { recipientEmail, propertyId } = req.body;

    if (!recipientEmail || !propertyId) {
      return res.status(400).json({ message: "recipientEmail and propertyId are required" });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID format. Please use a valid MongoDB ObjectId." });
    }

    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Create recommendation
    await Recommendation.create({
      from: req.user._id,
      to: recipient._id,
      property: propertyId,
    });

    // Update recipient's recommendationsReceived
    if (!recipient.recommendationsReceived.includes(propertyId)) {
      recipient.recommendationsReceived.push(propertyId);
      await recipient.save();
    }

    res.json({ message: "Property recommended" });
  } catch (error) {
    console.error("Recommend Property Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all received recommendations
exports.getReceivedRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({
      to: req.user._id,
    }).populate("property from");

    res.json(recommendations);
  } catch (error) {
    console.error("Get Recommendations Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
