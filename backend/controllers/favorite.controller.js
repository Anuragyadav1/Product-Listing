const Favorite = require("../models/favorite.model");
const Property = require("../models/property.model");

exports.addFavorite = async (req, res) => {
  const { propertyId } = req.body;
  const property = await Property.findById(propertyId);
  if (!property) return res.status(404).json({ message: "Property not found" });
  const favorite = await Favorite.create({
    user: req.user._id,
    property: propertyId,
  });
  res.status(201).json(favorite);
};

exports.getFavorites = async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id }).populate(
    "property"
  );
  res.json(favorites);
};

exports.removeFavorite = async (req, res) => {
  await Favorite.deleteOne({
    user: req.user._id,
    property: req.params.propertyId,
  });
  res.json({ message: "Removed from favorites" });
};
