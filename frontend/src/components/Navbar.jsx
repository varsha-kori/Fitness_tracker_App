import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>Fitness Tracker</h2>

      <div>
        {token ? (
  <>
    <Link to="/">Dashboard</Link>
    <Link to="/bmi">BMI</Link>
    <Link to="/goals">Goals</Link>
    <Link to="/water">Water</Link>
    <Link to="/profile">Profile</Link>
    <button onClick={logout}>Logout</button>
  </>
) : (
  <>
    <Link to="/login">Login</Link>
    <Link to="/register">Register</Link>
  </>
)}
      </div>
    </nav>
  );
}

export default Navbar;