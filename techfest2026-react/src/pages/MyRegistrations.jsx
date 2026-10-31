
import { useState, useEffect } from "react";
import API from "../api";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await API.get("/registrations/my");

        const data = response.data;

        if (Array.isArray(data)) {
          setRegistrations(data);
        } else if (Array.isArray(data.registrations)) {
          setRegistrations(data.registrations);
        } else if (Array.isArray(data.data)) {
          setRegistrations(data.data);
        } else {
          setRegistrations([]);
        }

      } catch (err) {
        console.error("Error fetching registrations:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load your registrations. Please log in."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <main className="page-container">
      <section className="registration-section">

        <div className="section-label">TECHFEST 2026</div>

        <h1>My Registrations</h1>

        <p className="section-description">
          View all the events you have registered for.
        </p>

        {loading ? (
          <p>Loading registrations...</p>
        ) : error ? (
          <p className="registration-message">{error}</p>
        ) : registrations.length > 0 ? (
          <div className="event-grid">

            {registrations.map((registration) => {
              const event = registration.event;

              return (
                <div
                  className="event-card"
                  key={registration._id}
                >
                  <div className="event-top">
                    <span className="category">
                      {event?.category || "Event"}
                    </span>
                  </div>

                  <h3>
                    {event?.name || "Event unavailable"}
                  </h3>

                  <div className="event-details">
                    <div className="detail">
                      <span>Entry Fee</span>
                      <strong>₹{event?.fee ?? "N/A"}</strong>
                    </div>

                    <div className="detail">
                      <span>Registration Date</span>
                      <strong>
                        {new Date(
                          registration.registrationDate
                        ).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        ) : (
          <p>No registrations found.</p>
        )}

      </section>
    </main>
  );
}

export default MyRegistrations;
