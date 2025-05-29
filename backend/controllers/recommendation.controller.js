const User = require("../models/user.model");
const Property = require("../models/property.model");
const Recommendation = require("../models/recommendation.model");

exports.recommendProperty = async (req, res) => {
  const { recipientEmail, propertyId } = req.body;
  const recipient = await User.findOne({ email: recipientEmail });
  if (!recipient)
    return res.status(404).json({ message: "Recipient not found" });
  const property = await Property.findById(propertyId);
  if (!property) return res.status(404).json({ message: "Property not found" });
  await Recommendation.create({
    from: req.user._id,
    to: recipient._id,
    property: propertyId,
  });
  recipient.recommendationsReceived.push(propertyId);
  await recipient.save();
  res.json({ message: "Property recommended" });
};

exports.getReceivedRecommendations = async (req, res) => {
  const recommendations = await Recommendation.find({
    to: req.user._id,
  }).populate("property from");
  res.json(recommendations);
};
