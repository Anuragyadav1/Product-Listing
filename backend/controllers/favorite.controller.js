// const Favorite = require("../models/favorite.model");
// const Property = require("../models/property.model");

// exports.addFavorite = async (req, res) => {
//   const { propertyId } = req.body;
//   const property = await Property.findById(propertyId);
//   if (!property) return res.status(404).json({ message: "Property not found" });
//   const favorite = await Favorite.create({
//     user: req.user._id,
//     property: propertyId,
//   });
//   res.status(201).json(favorite);
// };

// exports.getFavorites = async (req, res) => {
//   const favorites = await Favorite.find({ user: req.user._id }).populate(
//     "property"
//   );
//   res.json(favorites);
// };

// exports.removeFavorite = async (req, res) => {
//   await Favorite.deleteOne({
//     user: req.user._id,
//     property: req.params.propertyId,
//   });
//   res.json({ message: "Removed from favorites" });
// };



// const mongoose = require("mongoose");
// const Favorite = require("../models/favorite.model");
// const Property = require("../models/property.model");

// // Add to favorites
// exports.addFavorite = async (req, res) => {
//   try {
//     const { propertyId } = req.body;

//     // Validate ID format
//     if (!mongoose.Types.ObjectId.isValid(propertyId)) {
//       return res.status(400).json({ message: "Invalid property ID format. Please use a valid MongoDB ObjectId." });
//     }

//     const property = await Property.findById(propertyId);
//     if (!property) {
//       return res.status(404).json({ message: "Property not found" });
//     }

//     const favorite = await Favorite.create({
//       user: req.user._id,
//       property: propertyId,
//     });

//     res.status(201).json(favorite);
//   } catch (error) {
//     console.error("Add Favorite Error:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Get all favorites
// exports.getFavorites = async (req, res) => {
//   try {
//     const favorites = await Favorite.find({ user: req.user._id }).populate("property");
//     res.json(favorites);
//   } catch (error) {
//     console.error("Get Favorites Error:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Remove favorite
// exports.removeFavorite = async (req, res) => {
//   try {
//     const { propertyId } = req.params;

//     // Validate ID format
//     if (!mongoose.Types.ObjectId.isValid(propertyId)) {
//       return res.status(400).json({ message: "Invalid property ID format. Please use a valid MongoDB ObjectId." });
//     }

//     await Favorite.deleteOne({
//       user: req.user._id,
//       property: propertyId,
//     });

//     res.json({ message: "Removed from favorites" });
//   } catch (error) {
//     console.error("Remove Favorite Error:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };



const mongoose = require("mongoose");
const Favorite = require("../models/favorite.model");
const Property = require("../models/property.model");
const User = require("../models/user.model"); // Make sure this is imported

// Add to favorites
exports.addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID format. Please use a valid MongoDB ObjectId." });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Avoid duplicate favorites
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });
    if (existingFavorite) {
      return res.status(400).json({ message: "Property already in favorites" });
    }

    // Save in Favorite collection
    const favorite = await Favorite.create({
      user: req.user._id,
      property: propertyId,
    });

    // Sync to user's favorites array
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favorites: propertyId } }, // $addToSet prevents duplicates
      { new: true }
    );

    res.status(201).json(favorite);
  } catch (error) {
    console.error("Add Favorite Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all favorites
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate("property");
    res.json(favorites);
  } catch (error) {
    console.error("Get Favorites Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove favorite
exports.removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID format. Please use a valid MongoDB ObjectId." });
    }

    // Remove from Favorite collection
    await Favorite.deleteOne({
      user: req.user._id,
      property: propertyId,
    });

    // Also remove from user's favorites array
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: propertyId } }
    );

    res.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Remove Favorite Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
