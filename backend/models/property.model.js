const mongoose = require("mongoose");
const propertySchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    type: String,
    price: Number,
    state: String,
    city: String,
    areaSqFt: Number,
    bedrooms: Number,
    bathrooms: Number,
    amenities: String,
    furnished: String,
    availableFrom: Date,
    listedBy: String,
    tags: String,
    colorTheme: String,
    rating: Number,
    isVerified: Boolean,
    listingType: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Property", propertySchema);
