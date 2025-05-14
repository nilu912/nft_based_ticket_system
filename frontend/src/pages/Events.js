import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    date: "all",
    price: "all",
    category: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        // console.log(data[0])

        // Assuming data.eventData contains the events
        const eventData = data || [];

        // Filter out unwanted properties for each event
        const filteredEvents = eventData.map((event) => {
          const {
            event_id,
            event_name,
            event_date,
            duration,
            ticket_price,
            total_tickets,
            sold_tickets,
            // Omit unwanted properties
            address,
            created_at,
            wallet_address,
            __v,
            _id,
            ...rest
          } = event;

          // Return only the relevant properties
          return {
            event_id: event_id,
            title: event_name,
            date: event_date,
            time: duration,
            price: ticket_price,
            availableTickets: Number(total_tickets)-Number(sold_tickets),
            description: rest.description,
            address: address, // Include description or other necessary fields
            // You can include other properties from `rest` if needed
          };
        });

        // Set the filtered events to state
        setEvents(filteredEvents);
        setFilteredEvents(filteredEvents);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = [...events];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          event.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply date filter
    if (filters.date !== "all") {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date);
        switch (filters.date) {
          case "today":
            return eventDate.toDateString() === today.toDateString();
          case "tomorrow":
            return eventDate.toDateString() === tomorrow.toDateString();
          case "this-week":
            return eventDate <= nextWeek;
          default:
            return true;
        }
      });
    }

    // Apply price filter
    if (filters.price !== "all") {
      filtered = filtered.filter((event) => {
        switch (filters.price) {
          case "free":
            return event.price === 0;
          case "under-50":
            return event.price < 50;
          case "50-100":
            return event.price >= 50 && event.price <= 100;
          case "over-100":
            return event.price > 100;
          default:
            return true;
        }
      });
    }

    // Apply category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (event) =>
          event.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    setFilteredEvents(filtered);
  }, [events, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewEvent = (id) => {
    console.log(id);
    navigate(`/events/${id}`);
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Events</h1>
        <button
          className="toggle-filters-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="filters">
          <div className="filter-group">
            <input
              type="text"
              name="search"
              placeholder="Search events..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This Week</option>
            </select>
            <select
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="over-100">Over $100</option>
            </select>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts</option>
              <option value="food">Food</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
            </select>
          </div>
        </div>
      )}

      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <h2>No Events Found</h2>
            <p>
              Try adjusting your filters or check back later for new events.
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.event_id}
              style={{
                display: "flex",
                flexDirection: "row",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                margin: "20px 0",
                backgroundColor: "#fff",
                transition: "transform 0.2s ease",
              }}
            >
              <div
                style={{
                  position: "relative",
                  flex: "1 1 40%",
                  maxWidth: "40%",
                }}
              >
                <img
                  src="./eventImg.png"
                  alt={event.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    backgroundColor: "#000000cc",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                  }}
                >
                  {event.category}
                </div>
              </div>

              <div
                style={{
                  flex: "1 1 60%",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <h3
                  style={{
                    marginBottom: "10px",
                    fontSize: "1.5rem",
                    color: "#333",
                  }}
                >
                  {event.title}
                </h3>

                <div style={{ marginBottom: "16px" }}>
                  <p
                    style={{
                      margin: "4px 0",
                      color: "#666",
                      fontSize: "0.95rem",
                    }}
                  >
                    <i
                      className="fas fa-calendar"
                      style={{ marginRight: "8px", color: "#444" }}
                    ></i>
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p
                    style={{
                      margin: "4px 0",
                      color: "#666",
                      fontSize: "0.95rem",
                    }}
                  >
                    <i
                      className="fas fa-clock"
                      style={{ marginRight: "8px", color: "#444" }}
                    ></i>
                    {event.time}
                  </p>
                  <p
                    style={{
                      margin: "4px 0",
                      color: "#666",
                      fontSize: "0.95rem",
                    }}
                  >
                    <i
                      className="fas fa-map-marker-alt"
                      style={{ marginRight: "8px", color: "#444" }}
                    ></i>
                    {event.address}
                  </p>
                  <p
                    style={{
                      margin: "4px 0",
                      color: "#666",
                      fontSize: "0.95rem",
                    }}
                  >
                    <i
                      className="fas fa-ticket-alt"
                      style={{ marginRight: "8px", color: "#444" }}
                    ></i>
                    {event.availableTickets} tickets left
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "20px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#2d2d2d",
                    }}
                  >
                    ${event.price}
                  </span>
                  <button
                    style={{
                      backgroundColor: "#1e88e5",
                      color: "white",
                      padding: "8px 16px",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                    onClick={() => handleViewEvent(event.event_id)}
                  >
                    View Event
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
