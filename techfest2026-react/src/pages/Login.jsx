
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const response = await API.post("/auth/login", formData);

      // The backend sets the JWT in an HttpOnly cookie.
      // Do not store the token in localStorage.

      setMessage(response.data.message || "Login successful!");

      setTimeout(() => {
        navigate("/events");
      }, 800);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <section className="registration-section">

        <div className="section-label">TECHFEST 2026</div>

        <h1>Login</h1>

        <p className="section-description">
          Login to your TechFest account to register for events.
        </p>

        <form
          className="registration-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className="registration-message">
              {message}
            </p>
          )}

          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>

        </form>
      </section>
    </main>
  );
}

export default Login;
