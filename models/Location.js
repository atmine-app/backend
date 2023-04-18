const mongoose = require("mongoose");

const locationSchema = new Schema({
  coordinates: { type: [Number], required: true },
});

moduele.exports = model("Location", locationSchema);
