import { useEffect, useState, useCallback } from "react";
import API from "../api";

function Water() {
  const [amount, setAmount] = useState(250);
  const [water, setWater] = useState({ entries: [], total: 0, goal: 2500 });

  const fetchWater = useCallback(async () => {
    const response = await API.get("/water");
    setWater(response.data);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWater();
  }, [fetchWater]);

  const addWater = async (e) => {
    e.preventDefault();

    await API.post("/water", { amount });

    setAmount(250);
    fetchWater();
  };

  const deleteEntry = async (id) => {
    await API.delete(`/water/${id}`);
    fetchWater();
  };

  const progress = Math.min((water.total / water.goal) * 100, 100);

  return (
    <main className="container">
      <h1>Water Intake Tracker</h1>

      <div className="grid">
        <form className="card" onSubmit={addWater}>
          <h2>Add Water</h2>

          <input
            type="number"
            placeholder="Amount in ml"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <button>Add Water</button>
        </form>

        <div className="card">
          <h2>Today's Hydration</h2>

          <p>
            {water.total} / {water.goal} ml
          </p>

          <div className="progress">
            <div style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Entries</h2>

        {water.entries.map((entry) => (
          <div className="workout" key={entry._id}>
            <p>{entry.amount} ml</p>
            <p>{new Date(entry.intakeDate).toLocaleTimeString()}</p>

            <button className="danger" onClick={() => deleteEntry(entry._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Water;