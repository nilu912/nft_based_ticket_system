import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link import
import "./OrganizerDashboard.css";
import axios from "axios";

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [ticketSales, setTicketSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    // new event data
    title: "",
    date: "",
    time: "",
    location: "",
    category: "",
    price: "",
    availableTickets: "",
    description: "",
    image: "",
  });

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token"); // Retrieve the token from localStorage

        const response = await fetch(
          "http://localhost:5000/api/events/orgEvents",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token, // Pass the token in the headers
            },
          }
        );

        const data = await response.json();
        console.log(data.eventData[0]);
        const filteredEvents = data.eventData.map((event) => {
          // Destructure and omit unwanted fields
          const {
            event_name,
            event_date,
            duration,
            ticket_price,
            total_tickets,
            // Omit these fields
            address,
            created_at,
            wallet_address,
            __v,
            _id,
            ...rest // Spread the remaining properties
          } = event;

          // Return only the relevant data
          return {
            title: event_name,
            date: event_date,
            time: duration,
            price: ticket_price,
            availableTickets: total_tickets,
            description: rest.description, // Include description if needed
            // You can add any other necessary fields from `rest`
          };
        });

        // Set the filtered events to the state
        setEvents(filteredEvents);

        // Get events from localStorage (if needed)
        const storedEvents = localStorage.getItem("events");
        if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents);
          setEvents(parsedEvents);
        }

        // Get ticket sales from localStorage
        const storedTickets = localStorage.getItem("tickets");
        if (storedTickets) {
          const parsedTickets = JSON.parse(storedTickets);
          setTicketSales(parsedTickets);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    // alert("Token : "+token);
    // Check if token is available
    if (!token) {
      alert("You must be logged in to create an event.");
      return;
    }

    // try {
    const eventResponse = await axios.post(
      "http://localhost:5000/api/events/create",
      {
        event_name: newEvent.title,
        description: newEvent.description,
        event_date: newEvent.date,
        duration: newEvent.time,
        total_tickets: newEvent.availableTickets,
        ticket_price: newEvent.price,
        address: newEvent.location,
      },
      {
        headers: {
          token: token,
        },
      }
    );

    // Handle server response
    // const responseData = await eventResponse.json();
    // if(responseData.ok) {
    //   alert("all okay");
    // }

    // } catch (error) {
    //   console.error("Error creating event:", error);
    //   alert("Error while creating event. Please try again.");
    // }

    // Reset the form and close modal
    setNewEvent({
      title: "",
      date: "",
      time: "",
      location: "",
      category: "",
      price: "",
      availableTickets: "",
      description: "",
      image: "",
    });
    setShowCreateEvent(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const calculateTotalRevenue = () => {
    if (!ticketSales || ticketSales.length === 0) return 0;
    return ticketSales.reduce(
      (total, sale) => total + sale.price * sale.quantity,
      0
    );
  };

  const calculateTotalTickets = () => {
    if (!ticketSales || ticketSales.length === 0) return 0;
    return ticketSales.reduce((total, sale) => total + sale.quantity, 0);
  };

  const getEventSales = (eventId) => {
    if (!ticketSales || ticketSales.length === 0) return [];
    return ticketSales.filter((sale) => sale.eventId === eventId);
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // In the dashboard-header section, add the scanner button
  return (
    <div className="organizer-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Organizer Dashboard</h1>
          <div className="dashboard-actions">
            <button
              className="create-event-btn"
              onClick={() => setShowCreateEvent(true)}
            >
              Create New Event
            </button>
            <Link to="/ticket-scanner" className="scanner-button">
              <i className="fas fa-qrcode"></i> Scan Tickets
            </Link>
          </div>
        </div>
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            Events
          </button>
          <button
            className={`tab-btn ${activeTab === "sales" ? "active" : ""}`}
            onClick={() => setActiveTab("sales")}
          >
            Sales
          </button>
        </div>
      </div>

      {showCreateEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setShowCreateEvent(false)}
            >
              ×
            </button>
            <h2>Create New Event</h2>
            <form onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  name="time"
                  value={newEvent.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={newEvent.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={newEvent.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="arts">Arts</option>
                  <option value="food">Food</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                </select>
              </div>
              <div className="form-group">
                <label>Available Tickets</label>
                <input
                  type="number"
                  name="availableTickets"
                  value={newEvent.availableTickets}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateEvent(false)}>
                  Cancel
                </button>
                <button type="submit">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === "overview" && (
        <div className="dashboard-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎪</div>
              <div className="stat-info">
                <h3>Total Events</h3>
                <p className="stat-value">{events.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>Total Revenue</h3>
                <p className="stat-value">
                  ${calculateTotalRevenue().toFixed(2)}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎫</div>
              <div className="stat-info">
                <h3>Total Tickets Sold</h3>
                <p className="stat-value">{calculateTotalTickets()}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>Active Events</h3>
                <p className="stat-value">
                  {
                    events.filter((event) => new Date(event.date) >= new Date())
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="recent-sales">
            <h2>Recent Sales</h2>
            <div className="sales-list">
              {ticketSales.slice(0, 5).map((sale) => {
                const event = events.find((e) => e.id === sale.eventId);
                return (
                  <div key={sale.id} className="sale-item">
                    <div className="sale-info">
                      <h4>{event ? event.title : "Unknown Event"}</h4>
                      <p>
                        {sale.quantity} tickets - $
                        {(sale.price * sale.quantity).toFixed(2)}
                      </p>
                    </div>
                    <span className="sale-date">
                      {new Date(sale.purchaseDate).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div className="dashboard-events">
          <div className="events-list">
            {events.map((event) => {
              const eventSales = getEventSales(event.id);
              const totalRevenue = eventSales.reduce(
                (total, sale) => total + sale.price * sale.quantity,
                0
              );
              const totalTickets = eventSales.reduce(
                (total, sale) => total + sale.quantity,
                0
              );

              return (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                    <span className="event-category">{event.category}</span>
                  </div>
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p className="event-date">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="event-location">{event.location}</p>
                    <div className="event-stats">
                      <div className="stat">
                        <span className="label">Price:</span>
                        <span className="value">${event.price}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Available:</span>
                        <span className="value">{event.availableTickets}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Sold:</span>
                        <span className="value">{totalTickets}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Revenue:</span>
                        <span className="value">
                          ${totalRevenue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "sales" && (
        <div className="dashboard-sales">
          <div className="sales-filters">
            <select className="filter-select">
              <option value="all">All Events</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            <select className="filter-select">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="sales-table">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Purchase Date</th>
                </tr>
              </thead>
              <tbody>
                {ticketSales.map((sale) => {
                  const event = events.find((e) => e.id === sale.eventId);
                  return (
                    <tr key={sale.id}>
                      <td>{event ? event.title : "Unknown Event"}</td>
                      <td>
                        {event
                          ? new Date(event.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>{sale.quantity}</td>
                      <td>${sale.price.toFixed(2)}</td>
                      <td>${(sale.price * sale.quantity).toFixed(2)}</td>
                      <td>
                        {new Date(sale.purchaseDate).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
