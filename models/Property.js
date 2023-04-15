const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const propertySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: [
        "parking",
        "storage",
        "garden",
        "garage",
        "basement",
        "attic",
        "pool",
        "barbecue",
        "photostudio",
        "other",
      ],
      required: true,
    },
    price: { type: Number, required: true },
    size: { type: Number, required: true },
    images: [{ type: String }],
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    summary: { type: String, required: true },
    coordinates: {
      type: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    amenities: {
      type: [
        {
          type: String,
          enum: [
            "wifi",
            "music",
            "tv",
            "airConditioning",
            "heating",
            "washer",
            "dryer",
            "dishwasher",
            "elevator",
            "petFriendly",
            "smokingAllowed",
            "kidFriendly",
            "eventFriendly",
            "other",
          ],
        },
      ],
      default: [],
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Property", propertySchema);
