
import EventCard from "./EventCard";

function EventList({ events }) {
  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
        />
      ))}
    </div>
  );
}

export default EventList;
