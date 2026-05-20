import { useEffect, useState, useCallback } from "react";
import API from "../api";

function Profile() {
  const [form, setForm] = useState({
    age: "",
    gender: "other",
    height: "",
    weight: "",
    activityLevel: "moderate",
    dailyCalorieTarget: "",
    waterGoal: "",
  });

  const [metrics, setMetrics] = useState(null);

  const fetchProfile = useCallback(async () => {
    const response = await API.get("/profile");
    setForm(response.data.profile);
    setMetrics(response.data.metrics);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, [fetchProfile]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const response = await API.put("/profile", form);

    setForm(response.data.profile);
    setMetrics(response.data.metrics);
  };

  return (
    <main className="container">
      <h1>Profile & Calorie Calculator</h1>

      <div className="grid">
        <form className="card" onSubmit={submitHandler}>
          <input
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />

          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            type="number"
            placeholder="Height in cm"
            value={form.height}
            onChange={(e) => setForm({ ...form, height: e.target.value })}
          />

          <input
            type="number"
            placeholder="Weight in kg"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
          />

          <select
            value={form.activityLevel}
            onChange={(e) =>
              setForm({ ...form, activityLevel: e.target.value })
            }
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light activity</option>
            <option value="moderate">Moderate activity</option>
            <option value="active">Active</option>
            <option value="very_active">Very active</option>
          </select>

          <input
            type="number"
            placeholder="Daily calorie target"
            value={form.dailyCalorieTarget}
            onChange={(e) =>
              setForm({ ...form, dailyCalorieTarget: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Water goal in ml"
            value={form.waterGoal}
            onChange={(e) => setForm({ ...form, waterGoal: e.target.value })}
          />

          <button>Save Profile</button>
        </form>

        <div className="card">
          <h2>Your Health Metrics</h2>

          {metrics && (
            <>
              <p>BMI: {metrics.bmi}</p>
              <p>BMR: {metrics.bmr} calories/day</p>
              <p>TDEE: {metrics.tdee} calories/day</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default Profile;