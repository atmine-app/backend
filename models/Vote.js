const { Schema, model } = require("mongoose");

const voteSchema = new Schema(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
      type: Number,
      required: [true, "Please rate the location"],
      default: 5,
    },
    cleanliness: {
      type: Number,
      required: [true, "Please rate the cleanliness"],
      default: 5,
    },
    communication: {
      type: Number,
      required: [true, "Please rate the communication"],
      default: 5,
    },
    valueForMoney: {
      type: Number,
      required: [true, "Please rate the value for money"],
      default: 5,
    },
    amenities: {
      type: Number,
      required: [true, "Please rate the amenities"],
      default: 5,
    },
    averageRating: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Vote = model("Vote", voteSchema);
module.exports = Vote;
