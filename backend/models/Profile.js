const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    age: { type: Number, default: 18 },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    height: { type: Number, default: 170 },
    weight: { type: Number, default: 65 },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very_active"],
      default: "moderate",
    },
    dailyCalorieTarget: { type: Number, default: 2000 },
    waterGoal: { type: Number, default: 2500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);