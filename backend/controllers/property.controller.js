// const Property = require("../models/property.model");
// const cache = require("../utils/cache");

// exports.createProperty = async (req, res) => {
//   const property = await Property.create({
//     ...req.body,
//     createdBy: req.user._id,
//   });
//   await cache.del("properties"); // Invalidate cache
//   res.status(201).json(property);
// };

// exports.getProperties = async (req, res) => {
//   const cacheKey = `properties:${JSON.stringify(req.query)}`;
//   let properties = await cache.get(cacheKey);
//   if (!properties) {
//     const query = {};
//     // Build advanced filter from req.query
//     Object.keys(req.query).forEach((key) => {
//       if (
//         ["price", "areaSqFt", "bedrooms", "bathrooms", "rating"].includes(key)
//       ) {
//         query[key] = Number(req.query[key]);
//       } else if (key === "isVerified") {
//         query[key] = req.query[key] === "true";
//       } else {
//         query[key] = req.query[key];
//       }
//     });
//     properties = await Property.find(query);
//     await cache.set(cacheKey, properties);
//   }
//   res.json(properties);
// };

// // exports.getProperty = async (req, res) => {
// //   const property = await Property.findById(req.params.id);
// //   if (!property) return res.status(404).json({ message: "Not found" });
// //   res.json(property);
// // };
// const mongoose = require("mongoose");

// exports.getProperty = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Validate ObjectId format before querying
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid property ID format" });
//     }

//     const property = await Property.findById(id);

//     if (!property) {
//       return res.status(404).json({ message: "Property not found" });
//     }

//     res.json(property);
//   } catch (error) {
//     console.error("Error fetching property:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // exports.updateProperty = async (req, res) => {
// //   const property = await Property.findById(req.params.id);
// //   if (!property) return res.status(404).json({ message: "Not found" });
// //   if (property.createdBy.toString() !== req.user._id.toString())
// //     return res.status(403).json({ message: "Forbidden" });
// //   Object.assign(property, req.body);
// //   await property.save();
// //   await cache.del("properties");
// //   res.json(property);
// // };

// exports.updateProperty = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);

//     if (!property) {
//       return res.status(404).json({ message: "Property not found" });
//     }

//     // Check if createdBy exists
//     if (!property.createdBy) {
//       return res.status(400).json({ message: "Property has no creator info" });
//     }

//     // Check if user is authenticated
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ message: "Unauthorized: No user info" });
//     }

//     // Check if user is the creator
//     if (property.createdBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Forbidden: You do not own this property" });
//     }

//     // Proceed with update
//     Object.assign(property, req.body);
//     await property.save();

//     // Clear Redis cache
//     await cache.del("properties");

//     res.json(property);
//   } catch (err) {
//     console.error("Update Error:", err.message);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// exports.deleteProperty = async (req, res) => {
//   const property = await Property.findById(req.params.id);
//   if (!property) return res.status(404).json({ message: "Not found" });
//   if (property.createdBy.toString() !== req.user._id.toString())
//     return res.status(403).json({ message: "Forbidden" });
//   await property.deleteOne();
//   await cache.del("properties");
//   res.json({ message: "Deleted" });
// };





const mongoose = require("mongoose");
const Property = require("../models/property.model");
const cache = require("../utils/cache");

// Create a new property
exports.createProperty = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const property = await Property.create({
      ...req.body,
      createdBy: req.user._id,
    });

    await cache.del("properties"); // Invalidate cache
    res.status(201).json(property);
  } catch (err) {
    console.error("Create Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all properties (with caching)
exports.getProperties = async (req, res) => {
  try {
    const cacheKey = `properties:${JSON.stringify(req.query)}`;
    let properties = await cache.get(cacheKey);

    if (!properties) {
      const query = {};

      // Convert query params into MongoDB filters
      Object.keys(req.query).forEach((key) => {
        if (["price", "areaSqFt", "bedrooms", "bathrooms", "rating"].includes(key)) {
          query[key] = Number(req.query[key]);
        } else if (key === "isVerified") {
          query[key] = req.query[key] === "true";
        } else {
          query[key] = req.query[key];
        }
      });

      properties = await Property.find(query);
      await cache.set(cacheKey, properties);
    }

    res.json(properties);
  } catch (err) {
    console.error("Get Properties Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single property by ID
exports.getProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid property ID format. Please use a valid MongoDB ObjectId." });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("Get Property Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid property ID format. Please use a valid MongoDB ObjectId." });
    }

    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (!property.createdBy || !req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (property.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this property" });
    }

    Object.assign(property, req.body);
    await property.save();
    await cache.del("properties");

    res.json(property);
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid property ID format. Please use a valid MongoDB ObjectId." });
    }

    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (!property.createdBy || !req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (property.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this property" });
    }

    await property.deleteOne();
    await cache.del("properties");

    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
