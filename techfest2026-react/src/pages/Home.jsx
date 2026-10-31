
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts/1")
      .then((response) => {
        setApiData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load the latest update.");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Experiment 5: Feature branch demonstration */}

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-label">
            TECHFEST 2026 - NATIONAL LEVEL INNOVATION
          </p>

          <h1>
            Technology. Innovation.<br />
            Experience.
          </h1>

          <p className="hero-text">
            TechFest 2026 brings together students, innovators and
            technology enthusiasts for a celebration of ideas,
            creativity and competition.
          </p>

          <div className="hero-buttons">
            <Link to="/events" className="primary-button">
              Explore Events
            </Link>

            <Link to="/registration" className="secondary-button">
              Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="section">
        <div className="section-heading">
          <p className="small-heading">ABOUT TECHFEST</p>

          <h2>A platform for ideas and innovation</h2>

          <p>
            TechFest 2026 provides students with an opportunity to
            showcase technical skills, participate in competitions,
            attend workshops and experience a range of cultural events.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-box">
            <h3>Technical Events</h3>
            <p>
              Test your programming, development and problem-solving
              skills through exciting competitions.
            </p>
          </div>

          <div className="feature-box">
            <h3>Workshops</h3>
            <p>
              Learn new technologies and gain practical knowledge
              through interactive sessions.
            </p>
          </div>

          <div className="feature-box">
            <h3>Cultural Events</h3>
            <p>
              Take a break from technology and enjoy performances,
              creativity and campus activities.
            </p>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="highlight-section">
        <div>
          <span>05</span>
          <p>Events</p>
        </div>

        <div>
          <span>03</span>
          <p>Categories</p>
        </div>

        <div>
          <span>300+</span>
          <p>Seats</p>
        </div>

        <div>
          <span>2026</span>
          <p>Edition</p>
        </div>
      </section>

      {/* API REQUIREMENT */}
      <section className="update-section">
        <div>
          <p className="small-heading">LATEST NOTICE</p>

          {loading && <p>Loading latest update...</p>}

          {error && <p>{error}</p>}

          {apiData && !loading && !error && (
            <p>TechFest updates are being loaded successfully.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to take part?</h2>

        <p>
          Explore the events and find something that interests you.
        </p>

        <Link to="/events" className="primary-button">
          View All Events
        </Link>
      </section>
    </div>
  );
}

export default Home;
