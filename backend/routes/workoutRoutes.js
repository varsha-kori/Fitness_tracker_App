const express = require("express");
const Workout = require("../models/workout");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search, category, startDate, endDate, sortBy } = req.query;

    const filter = { user: req.userId };

    if (search) {
      filter.exerciseName = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.workoutDate = {};
      if (startDate) filter.workoutDate.$gte = new Date(startDate);
      if (endDate) filter.workoutDate.$lte = new Date(endDate);
    }

    const sortOptions = {
      date: { workoutDate: -1 },
      calories: { caloriesBurned: -1 },
      duration: { duration: -1 },
    };

    const workouts = await Workout.find(filter).sort(
      sortOptions[sortBy] || sortOptions.date
    );

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const workout = await Workout.create({
      ...req.body,
      user: req.userId,
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/export/csv", authMiddleware, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.userId }).sort({
      workoutDate: -1,
    });

    const rows = [
      ["Exercise", "Category", "Duration", "Calories", "Date", "Notes"],
      ...workouts.map((workout) => [
        workout.exerciseName,
        workout.category,
        workout.duration,
        workout.caloriesBurned,
        new Date(workout.workoutDate).toLocaleDateString(),
        workout.notes || "",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=workouts.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/stats/summary", authMiddleware, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.userId }).sort({
      workoutDate: -1,
    });

    const uniqueDays = [
      ...new Set(
        workouts.map((workout) =>
          new Date(workout.workoutDate).toISOString().slice(0, 10)
        )
      ),
    ].sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let index = 0; index < 365; index += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - index);
      const key = date.toISOString().slice(0, 10);

      if (uniqueDays.includes(key)) {
        currentStreak += 1;
      } else if (index > 0) {
        break;
      }
    }

    let longestStreak = 0;
    let runningStreak = 0;
    let previousDate = null;

    uniqueDays
      .slice()
      .reverse()
      .forEach((day) => {
        const currentDate = new Date(day);

        if (!previousDate) {
          runningStreak = 1;
        } else {
          const diffDays = Math.round(
            (currentDate - previousDate) / (1000 * 60 * 60 * 24)
          );

          runningStreak = diffDays === 1 ? runningStreak + 1 : 1;
        }

        longestStreak = Math.max(longestStreak, runningStreak);
        previousDate = currentDate;
      });

    const categories = {};

    workouts.forEach((workout) => {
      categories[workout.category] = (categories[workout.category] || 0) + 1;
    });

    res.json({
      currentStreak,
      longestStreak,
      categories: Object.keys(categories).map((name) => ({
        name,
        count: categories[name],
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/stats/progress", authMiddleware, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.userId });

    const weekly = {};
    const monthly = {};

    workouts.forEach((workout) => {
      const date = new Date(workout.workoutDate);

      const weekKey = `Week ${Math.ceil(date.getDate() / 7)}-${
        date.getMonth() + 1
      }`;

      const monthKey = `${date.getMonth() + 1}-${date.getFullYear()}`;

      weekly[weekKey] = (weekly[weekKey] || 0) + workout.caloriesBurned;
      monthly[monthKey] = (monthly[monthKey] || 0) + workout.caloriesBurned;
    });

    res.json({
      weekly: Object.keys(weekly).map((name) => ({
        name,
        calories: weekly[name],
      })),
      monthly: Object.keys(monthly).map((name) => ({
        name,
        calories: monthly[name],
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;