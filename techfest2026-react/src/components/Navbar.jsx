
import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import API from "../api";

function Navbar() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check whether the user has a valid session
  useEffect(() => {
    const checkLogin = async () => {
      try {
        await API.get("/auth/me");
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, [location.pathname]);

  // Logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await API.post("/auth/logout");

      setIsLoggedIn(false);
      navigate("/login");

    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

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

        {isLoggedIn ? (
          <button
            className="theme-toggle"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}

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
