import { useEffect, useState, useCallback } from "react";
import API from "../api";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutList from "../components/WorkoutList";
import ProgressChart from "../components/ProgressChart";

function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [stats, setStats] = useState({ weekly: [], monthly: [] });
  const [summary, setSummary] = useState({
    currentStreak: 0,
    longestStreak: 0,
    categories: [],
  });

  const fetchWorkouts = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (sortBy) params.append("sortBy", sortBy);

    const response = await API.get(`/workouts?${params.toString()}`);
    setWorkouts(response.data);
  }, [search, category, sortBy]);

  const fetchStats = useCallback(async () => {
    const response = await API.get("/workouts/stats/progress");
    setStats(response.data);
  }, []);

  const fetchSummary = useCallback(async () => {
    const response = await API.get("/workouts/stats/summary");
    setSummary(response.data);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkouts();
  }, [fetchWorkouts]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
    fetchSummary();
  }, [fetchStats, fetchSummary]);

  const refreshDashboard = () => {
    fetchWorkouts();
    fetchStats();
    fetchSummary();
  };

  const exportCsv = async () => {
    const response = await API.get("/workouts/export/csv", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "workouts.csv");

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const totalCalories = workouts.reduce(
    (sum, workout) => sum + Number(workout.caloriesBurned),
    0
  );

  const totalDuration = workouts.reduce(
    (sum, workout) => sum + Number(workout.duration),
    0
  );

  return (
    <main className="container">
      <h1>Dashboard</h1>

      <div className="stats">
        <div className="card">
          <h3>Total Workouts</h3>
          <p>{workouts.length}</p>
        </div>

        <div className="card">
          <h3>Total Calories</h3>
          <p>{totalCalories}</p>
        </div>

        <div className="card">
          <h3>Total Duration</h3>
          <p>{totalDuration} min</p>
        </div>

        <div className="card">
          <h3>Current Streak</h3>
          <p>{summary.currentStreak} days</p>
        </div>

        <div className="card">
          <h3>Longest Streak</h3>
          <p>{summary.longestStreak} days</p>
        </div>
      </div>

      <div className="card">
        <input
          placeholder="Search workout"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option>Cardio</option>
          <option>Strength</option>
          <option>Yoga</option>
          <option>HIIT</option>
          <option>Walking</option>
          <option>Running</option>
          <option>Other</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Sort by date</option>
          <option value="calories">Sort by calories</option>
          <option value="duration">Sort by duration</option>
        </select>

        <button onClick={fetchWorkouts}>Search</button>

        <button type="button" className="secondary" onClick={exportCsv}>
          Export CSV
        </button>
      </div>

      <div className="grid">
        <WorkoutForm
          fetchWorkouts={refreshDashboard}
          editingWorkout={editingWorkout}
          clearEdit={() => setEditingWorkout(null)}
        />

        <WorkoutList
          workouts={workouts}
          fetchWorkouts={refreshDashboard}
          setEditingWorkout={setEditingWorkout}
        />
      </div>

      <div className="grid">
        <ProgressChart title="Weekly Calories" data={stats.weekly} />
        <ProgressChart title="Monthly Calories" data={stats.monthly} />
      </div>

      <div className="card">
        <h2>Workout Categories</h2>

        <div className="category-list">
          {summary.categories.map((item) => (
            <span key={item.name}>
              {item.name}: {item.count}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;