const express = require("express");
const Water = require("../models/Water");
const Profile = require("../models/Profile");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  return { start, end };
};

router.get("/", authMiddleware, async (req, res) => {
  const { start, end } = getTodayRange();

  const entries = await Water.find({
    user: req.userId,
    intakeDate: { $gte: start, $lt: end },
  }).sort({ intakeDate: -1 });

  const profile = await Profile.findOne({ user: req.userId });
  const goal = profile?.waterGoal || 2500;
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);

  res.json({ entries, total, goal });
});

router.post("/", authMiddleware, async (req, res) => {
  const entry = await Water.create({
    user: req.userId,
    amount: req.body.amount,
    intakeDate: req.body.intakeDate || new Date(),
  });

  res.status(201).json(entry);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Water.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ message: "Water entry deleted" });
});

module.exports = router;