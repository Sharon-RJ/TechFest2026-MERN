import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Registration() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch available events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get("/events");
        const data = response.data;

        if (Array.isArray(data)) {
          setEvents(data);
        } else if (Array.isArray(data.data)) {
          setEvents(data.data);
        } else if (Array.isArray(data.events)) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setMessage("Unable to load events.");
      }
    };

    fetchEvents();
  }, []);

  // Register for selected event
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!eventId) {
      setMessage("Please select an event.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/registrations", {
        eventId
      });

      setMessage(
        response.data.message || "Registration successful!"
      );

      setEventId("");

    } catch (error) {
      console.error("Registration error:", error);

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
    <main className="page-container">
      <section className="registration-section">

        <div className="section-label">TECHFEST 2026</div>

        <h1>Registration</h1>

        <p className="section-description">
          Register for an event and be part of TechFest 2026.
        </p>

        <form
          className="registration-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label htmlFor="event">Select Event</label>

            <select
              id="event"
              value={eventId}
              onChange={(e) => {
                setEventId(e.target.value);
                setMessage("");
              }}
            >
              <option value="">Select an event</option>

              {events.map((event) => (
                <option
                  key={event._id}
                  value={event._id}
                  disabled={event.seats <= 0}
                >
                  {event.name} - ₹{event.fee}
                  {event.seats <= 0 ? " (Sold Out)" : ""}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {message && (
            <p className="registration-message">
              {message}
            </p>
          )}

        </form>

      </section>
    </main>
  );
}

export default Registration;