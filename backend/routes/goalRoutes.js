const express = require("express");
const Goal = require("../models/Goal");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const goals = await Goal.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(goals);
});

router.post("/", authMiddleware, async (req, res) => {
  const goal = await Goal.create({
    ...req.body,
    user: req.userId,
  });

  res.status(201).json(goal);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true }
  );

  res.json(goal);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Goal.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });

  res.json({ message: "Goal deleted" });
});

module.exports = router;