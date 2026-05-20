import { useState } from "react";

function BMI() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);

  const calculateBMI = (e) => {
    e.preventDefault();

    const heightInMeters = Number(height) / 100;
    const result = Number(weight) / (heightInMeters * heightInMeters);

    setBmi(result.toFixed(2));
  };

  const getStatus = () => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  return (
    <main className="container">
      <form className="card" onSubmit={calculateBMI}>
        <h1>BMI Calculator</h1>

        <input
          type="number"
          placeholder="Height in cm"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Weight in kg"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />

        <button>Calculate BMI</button>

        {bmi && (
          <div>
            <h2>Your BMI: {bmi}</h2>
            <p>Status: {getStatus()}</p>
          </div>
        )}
      </form>
    </main>
  );
}

export default BMI;