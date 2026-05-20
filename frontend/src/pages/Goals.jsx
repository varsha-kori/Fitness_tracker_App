import { useEffect, useState, useCallback } from "react";
import API from "../api";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: "",
    targetValue: "",
    currentValue: "",
    unit: "",
  });

  const fetchGoals = useCallback(async () => {
    const response = await API.get("/goals");
    setGoals(response.data);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGoals();
  }, [fetchGoals]);

  const submitHandler = async (e) => {
    e.preventDefault();

    await API.post("/goals", form);

    setForm({
      title: "",
      targetValue: "",
      currentValue: "",
      unit: "",
    });

    fetchGoals();
  };

  const deleteGoal = async (id) => {
    await API.delete(`/goals/${id}`);
    fetchGoals();
  };

  return (
    <main className="container">
      <h1>Goal Tracking</h1>

      <form className="card" onSubmit={submitHandler}>
        <input
          placeholder="Goal title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Target value"
          value={form.targetValue}
          onChange={(e) => setForm({ ...form, targetValue: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Current value"
          value={form.currentValue}
          onChange={(e) => setForm({ ...form, currentValue: e.target.value })}
        />

        <input
          placeholder="Unit, example: kg, workouts, calories"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          required
        />

        <button>Add Goal</button>
      </form>

      <div className="grid">
        {goals.map((goal) => {
          const progress = Math.min(
            (goal.currentValue / goal.targetValue) * 100,
            100
          );

          return (
            <div className="card" key={goal._id}>
              <h3>{goal.title}</h3>
              <p>
                {goal.currentValue} / {goal.targetValue} {goal.unit}
              </p>

              <div className="progress">
                <div style={{ width: `${progress}%` }}></div>
              </div>

              <button className="danger" onClick={() => deleteGoal(goal._id)}>
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Goals;