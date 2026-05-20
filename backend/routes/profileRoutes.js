const express = require("express");
const Profile = require("../models/Profile");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const calculateMetrics = (profile) => {
  const height = Number(profile.height);
  const weight = Number(profile.weight);
  const age = Number(profile.age);
  const genderAdjustment = profile.gender === "male" ? 5 : -161;

  const bmi = weight / (height / 100) ** 2;
  const bmr = 10 * weight + 6.25 * height - 5 * age + genderAdjustment;
  const tdee = bmr * activityMultipliers[profile.activityLevel];

  return {
    bmi: Number(bmi.toFixed(2)),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
  };
};

router.get("/", authMiddleware, async (req, res) => {
  let profile = await Profile.findOne({ user: req.userId });

  if (!profile) {
    profile = await Profile.create({ user: req.userId });
  }

  res.json({
    profile,
    metrics: calculateMetrics(profile),
  });
});

router.put("/", authMiddleware, async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    { user: req.userId },
    { ...req.body, user: req.userId },
    { new: true, upsert: true }
  );

  res.json({
    profile,
    metrics: calculateMetrics(profile),
  });
});

module.exports = router;