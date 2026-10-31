
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

    if (!formData.name || !formData.email || !formData.password) {
      setMessage("Please fill in all the fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/register", formData);

      setMessage(
        response.data.message || "Account created successfully!"
      );

      setFormData({
        name: "",
        email: "",
        password: ""
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <section className="registration-section">

        <div className="section-label">TECHFEST 2026</div>

        <h1>Create Account</h1>

        <p className="section-description">
          Sign up to participate in TechFest 2026 events.
        </p>

        <form
          className="registration-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Create a password (minimum 6 characters)"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {message && (
            <p className="registration-message">
              {message}
            </p>
          )}

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </form>
      </section>
    </main>
  );
}

export default Signup;
