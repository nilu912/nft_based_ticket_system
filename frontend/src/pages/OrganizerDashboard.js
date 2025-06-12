import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link import
import "./OrganizerDashboard.css";
import axios from "axios";
import { parseUnits } from "ethers";

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  // const [ticketSales, setTicketSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [pirceUnit, setPriceUnit] = useState("wei");
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
  const token = localStorage.getItem("token");
  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;
        setLoading(true);

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
        // console.log(data.eventData[0]);
        const filteredEvents = data.eventData.map((event) => {
          // Destructure and omit unwanted fields
          const {
            event_name,
            event_date,
            duration,
            ticket_price,
            total_tickets,
            sold_tickets,
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
            sold_tickets: sold_tickets,
            availableTickets: Number(total_tickets) - Number(sold_tickets),
            description: rest.description, // Include description if needed
            // You can add any other necessary fields from `rest`
          };
        });

        // Set the filtered events to the state
        setEvents(filteredEvents);
        // Get events from localStorage (if needed)

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]); // Empty dependency array to run only once

  const onPriceUintChange = (e) => {
    console.log(e.target.value);
    setPriceUnit(e.target.value);
  };
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    // alert("Token : "+token);
    // Check if token is available
    if (!token) {
      alert("You must be logged in to create an event.");
      return;
    }
    const parsedPrice = parseUnits(newEvent.price, pirceUnit).toString();
    console.log("parsedPrice", parsedPrice);
    const updatedEvent = {
      ...newEvent,
      price: parsedPrice,
    }
    setNewEvent(updatedEvent);
    console.log(updatedEvent);
    // try {
    const eventResponse = await axios.post(
      "http://localhost:5000/api/events/create",
      {
        event_name: updatedEvent.title,
        description: updatedEvent.description,
        event_date: updatedEvent.date,
        duration: updatedEvent.time,
        total_tickets: updatedEvent.availableTickets,
        ticket_price: updatedEvent.price,
        address: updatedEvent.location,
      },
      {
        headers: {
          token: token,
        },
      }
    );

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
    setRefreshTrigger((prev) => !prev);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const calculateTotalRevenue = () => {
    if (!events || events.length === 0) return 0;
    const value = events.reduce((total, e) => {
      return total + e.sold_tickets * e.price;
    }, 0);
    return value;
  };

  const calculateTotalTickets = () => {
    if (!events || events.length === 0) return 0;
    const value = events.reduce((total, e) => total + e.sold_tickets, 0);
    return value;
  };

  // const getEventSales = (eventId) => {
  //   if (!ticketSales || ticketSales.length === 0) return [];
  //   return ticketSales.filter((sale) => sale.eventId === eventId);
  // };

  if (!token) {
    return (
      <div className="no-tickets">
        <h2>Wallet not Connected</h2>
        <p>Please connect wallet first!</p>
        <button
          className="browse-events-btn"
          // onClick={() => navigate("/events")}
        >
          Connect Wallet
        </button>
      </div>
    );
  }
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
          {/* <button
            className={`tab-btn ${activeTab === "sales" ? "active" : ""}`}
            onClick={() => setActiveTab("sales")}
          >
            Sales
          </button> */}
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
                <label>Price</label>
                <div className="price-subdiv">
                  <input
                    style={{ width: "80%" }}
                    type="number"
                    name="price"
                    value={newEvent.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                  <select
                    style={{ width: "20%" }}
                    value={pirceUnit}
                    name="priceUnit"
                    onChange={onPriceUintChange}
                    required
                  >
                    <option value="wei">Wei</option>
                    <option value="kwei">Kwei</option>
                    <option value="mwei">Mwei</option>
                    <option value="gwei">Gwei</option>
                    <option value="twei">Twei</option>
                    <option value="pwei">Pwei</option>
                    <option value="ether">Ether</option>
                  </select>
                </div>
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

          {/* <div className="recent-sales">
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
          </div> */}
        </div>
      )}

      {activeTab === "events" && (
        <div className="dashboard-events">
          <div className="events-list">
            {events.map((event) => {
              // const eventSales = getEventSales(event.id);
              const totalRevenue = event.price * event.sold_tickets;
              const totalTickets = event.sold_tickets;

              return (
                <div key={event.event_id} className="event-card">
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

      {/* {activeTab === "sales" && (
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
                {events.map((sale) => {
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
      )} */}
    </div>
  );
};

export default OrganizerDashboard;
