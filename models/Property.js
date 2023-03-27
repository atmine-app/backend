const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reservations: [ReservationSchema],
  category: {
    type: String,
    enum: [
      "parking",
      "storage",
      "garden",
      "garage",
      "basement",
      "attic",
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
});

module.exports = mongoose.model("Property", PropertySchema);
