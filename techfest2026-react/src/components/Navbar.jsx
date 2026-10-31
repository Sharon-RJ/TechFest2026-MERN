
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function Navbar() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        TechFest 2026
      </div>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/registration">Registration</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/my-registrations">
  My Registrations
</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
