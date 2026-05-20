import { useEffect, useState } from "react";
import API from "../api";

function WorkoutForm({ fetchWorkouts, editingWorkout, clearEdit }) {
  const [form, setForm] = useState({
    exerciseName: "",
    category: "Cardio",
    duration: "",
    caloriesBurned: "",
    workoutDate: "",
    notes: "",
  });

  useEffect(() => {
    if (editingWorkout) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        exerciseName: editingWorkout.exerciseName,
        category: editingWorkout.category || "Other",
        duration: editingWorkout.duration,
        caloriesBurned: editingWorkout.caloriesBurned,
        workoutDate: editingWorkout.workoutDate?.slice(0, 10),
        notes: editingWorkout.notes || "",
      });
    }
  }, [editingWorkout]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (editingWorkout) {
      await API.put(`/workouts/${editingWorkout._id}`, form);
      clearEdit();
    } else {
      await API.post("/workouts", form);
    }

    setForm({
      exerciseName: "",
      category: "Cardio",
      duration: "",
      caloriesBurned: "",
      workoutDate: "",
      notes: "",
    });

    fetchWorkouts();
  };

  return (
    <form className="card" onSubmit={submitHandler}>
      <h2>{editingWorkout ? "Edit Workout" : "Add Workout"}</h2>

      <input
        placeholder="Exercise name"
        value={form.exerciseName}
        onChange={(e) => setForm({ ...form, exerciseName: e.target.value })}
        required
      />

      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option>Cardio</option>
        <option>Strength</option>
        <option>Yoga</option>
        <option>HIIT</option>
        <option>Walking</option>
        <option>Running</option>
        <option>Other</option>
      </select>

      <input
        type="number"
        placeholder="Duration in minutes"
        value={form.duration}
        onChange={(e) => setForm({ ...form, duration: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Calories burned"
        value={form.caloriesBurned}
        onChange={(e) => setForm({ ...form, caloriesBurned: e.target.value })}
        required
      />

      <input
        type="date"
        value={form.workoutDate}
        onChange={(e) => setForm({ ...form, workoutDate: e.target.value })}
      />

      <textarea
        placeholder="Notes"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      <button>{editingWorkout ? "Update Workout" : "Add Workout"}</button>

      {editingWorkout && (
        <button type="button" className="secondary" onClick={clearEdit}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default WorkoutForm;