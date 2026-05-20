const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    exerciseName: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    caloriesBurned: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["Cardio", "Strength", "Yoga", "HIIT", "Walking", "Running", "Other"],
      default: "Other",
    },
    notes: {
      type: String,
      default: "",
    },
    workoutDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);