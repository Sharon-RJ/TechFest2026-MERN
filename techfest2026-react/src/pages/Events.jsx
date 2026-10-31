
import { useState, useEffect } from "react";
import API from "../api";
import EventList from "../components/EventList";

function Events() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch events from MongoDB through the backend API
  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await API.get("/events");

      console.log("Backend response:", response.data);

      // Handle different API response formats
      const data = response.data;

      if (Array.isArray(data)) {
        setEventsData(data);
      } else if (Array.isArray(data.events)) {
        setEventsData(data.events);
      } else if (Array.isArray(data.data)) {
        setEventsData(data.data);
      } else {
        setEventsData([]);
        setError("Unexpected response format from server.");
      }

    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Unable to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);
  // Search and category filtering
  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="small-heading">TECHFEST 2026</p>

        <h1>Events</h1>

        <p>
          Explore the technical, workshop and cultural events
          happening at TechFest 2026.
        </p>
      </div>

      {/* SEARCH AND FILTER */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Technical">Technical</option>
          <option value="Workshop">Workshop</option>
          <option value="Cultural">Cultural</option>
        </select>
      </div>

      {/* EVENT LIST */}
      {loading ? (
        <div className="no-events">Loading events...</div>
      ) : error ? (
        <div className="no-events">{error}</div>
      ) : filteredEvents.length > 0 ? (
        <EventList events={filteredEvents} />
      ) : (
        <div className="no-events">No events found.</div>
      )}
    </section>
  );
}

export default Events;
