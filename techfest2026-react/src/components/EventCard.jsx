import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function EventCard({ event }) {
  const [seats, setSeats] = useState(event.seats);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await API.post("/registrations", {
        eventId: event._id
      });

      setSeats(response.data.remainingSeats);
      setMessage("Registration successful!");

    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-card">
      <div className="event-top">
        <span className="category">
          {event.category}
        </span>

        <span className="event-number">
          #{String(event._id).slice(-4).toUpperCase()}
        </span>
      </div>

      <h3>{event.name}</h3>

      <div className="event-details">
        <div className="detail">
          <span>Entry Fee</span>
          <strong>₹{event.fee}</strong>
        </div>

        <div className="detail">
          <span>Available Seats</span>
          <strong>{seats}</strong>
        </div>
      </div>

      {seats > 0 ? (
        <button
          className="register-btn"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      ) : (
        <div className="sold-out">
          SOLD OUT
        </div>
      )}

      {message && (
        <p className="registration-message">
          {message}
        </p>
      )}
    </div>
  );
}

export default EventCard;