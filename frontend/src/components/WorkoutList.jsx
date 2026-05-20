import API from "../api";

function WorkoutList({ workouts, fetchWorkouts, setEditingWorkout }) {
  const deleteWorkout = async (id) => {
    await API.delete(`/workouts/${id}`);
    fetchWorkouts();
  };

  return (
    <div className="card">
      <h2>Workout History</h2>

      {workouts.length === 0 ? (
        <p>No workouts found.</p>
      ) : (
        workouts.map((workout) => (
          <div className="workout" key={workout._id}>
            <h3>{workout.exerciseName}</h3>
            <p>Category: {workout.category}</p>
            <p>Duration: {workout.duration} minutes</p>
            <p>Calories: {workout.caloriesBurned}</p>
            <p>Date: {new Date(workout.workoutDate).toLocaleDateString()}</p>
            {workout.notes && <p>Notes: {workout.notes}</p>}

            <button onClick={() => setEditingWorkout(workout)}>Edit</button>
            <button className="danger" onClick={() => deleteWorkout(workout._id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default WorkoutList;