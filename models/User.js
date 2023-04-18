const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/duw4zfhmh/image/upload/v1680718758/at_mine/Screenshot_2023-04-05_at_20.18.29_zdw1vp.png",
    },
    name: String,
    lastname: String,
    phoneNumber: String,
    googleId: String,
    birthdate: Date,
    passportOrIdNumber: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
