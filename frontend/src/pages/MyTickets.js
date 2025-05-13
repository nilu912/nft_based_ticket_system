import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyTickets.css";
import { useAuth } from "../contexts/AuthContext";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, valid, used, expired
  const navigate = useNavigate();
  const { walletAddress } = useAuth();
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if(!token)
          return;
        const ticektsResponse = await fetch(
          `http://localhost:5000/api/tickets/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token, // Make sure to pass the token
            },
          }
        );
        const eventResponse = await fetch(`http://localhost:5000/api/events/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        // Check if the response is successful
        if (!ticektsResponse.ok || !eventResponse.ok) {
          throw new Error("Failed to fetch event");
        }
        const ticketData = await ticektsResponse.json();
        const eventData = await eventResponse.json();
        const combineData = ticketData.map((t) => ({
          ticket_id: t.ticket_id,
          event: eventData.filter(
            (e) => t.event_id === e.event_id
            // event_id: e.event_id,
            // event_name: e.event_name,
            // description: e.description,
            // event_date: e.event_date,
            // duration: e.duration,
            // total_tickets: e.total_tickets,
            // ticket_price: e.ticket_price,
            // wallet_address: e.wallet_address,
            // address: e.address,
            // created_at: e.created_at,
          ),
          wallet_address: t.wallet_address,
          token_id: t.token_id,
          purchase_date: t.purchase_date,
        }));
        const filteredData = combineData.filter(
          (t) => t.wallet_address == walletAddress
        );
        console.log("env:",process.env.REACT_APP_CONTRACT_ADDRESS)
        console.log("Filtered data: ", filteredData);
        setTickets(filteredData);
      } catch (err) {
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = () => {
    tickets.filter((ticket) => {
      if (filter === "all") return true;
      return ticket.status === filter;
    });
  };

  const handleViewTicket = (ticket) => {
    // Store the selected ticket in localStorage for the TicketDetail component
    localStorage.setItem("selectedTicket", JSON.stringify(ticket));
    navigate(`/tickets/${ticket.id}`);
  };

  if (loading) {
    return <div className="loading">Loading your tickets...</div>;
  }

  // if (error) {
  //   return <div className="error">{error}</div>;
  // }
  if(!token){
    return (
      <div className="no-tickets">
          <h2>Wallet not Connected</h2>
          <p>Please connect wallet first!</p>
          <button
            className="browse-events-btn"
            onClick={() => navigate("/events")}
          >
            Connect Wallet
          </button>
        </div>
    )
  }
  return (
    <div className="my-tickets" style={{margin:'10px'}}>
      <div className="tickets-header">
        <h1>My Tickets</h1>
        <div className="tickets-filter">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Tickets</option>
            <option value="valid">Valid</option>
            <option value="used">Used</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
      <div className="my-tickets" style={{'margin': '0px 20px', 'margin-bottom': '20px'}}>
        <p className="wrap">
          <strong>Contract Address:</strong>{" "}
          {process.env.REACT_APP_CONTRACT_ADDRESS}
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="no-tickets">
          <h2>No Tickets Found</h2>
          <p>You haven't purchased any tickets yet.</p>
          <button
            className="browse-events-btn"
            onClick={() => navigate("/events")}
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div key={ticket.ticekt_id} className="ticket-card">
              <div className="ticket-header">
                <h3>{ticket.event[0].event_name}</h3>
                <button onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}>Click here</button>
                {/* <span className={`status ${ticket.status}`}>
                  {ticket.status.charAt(0).toUpperCase() +
                    ticket.status.slice(1)}
                </span> */}
              </div>
              <div className="ticket-details">
                <p>
                  <strong>Date:</strong>
                  {
                    new Date(ticket.event[0].event_date)
                      .toISOString()
                      .split("T")[0]
                  }
                </p>
                <p>
                  <strong>Time:</strong> {ticket.event[0].duration}
                </p>
                {/* <p>
                  <strong>Quantity:</strong> {1}
                  </p> */}
                <p>
                  <strong>Token Id:</strong> {ticket.token_id}
                </p>
                <p>
                  <strong>Price:</strong> ${ticket.event[0].ticket_price}
                </p>
                <p>
                  <strong>Location:</strong> {ticket.event[0].address}
                </p>
                <p>
                  <strong>Purchase Date:</strong>{" "}
                  {new Date(ticket.purchase_date).toISOString().split("T")[0]}
                </p>
                <p>
                  <strong>Purchase Date:</strong>{" "}
                  {
                    new Date(ticket.purchase_date)
                      .toISOString()
                      .split("T")[1]
                      .split(".")[0]
                  }
                </p>
              </div>
              {/* <div className="ticket-actions">
                <button
                  className="view-ticket-btn"
                  onClick={() => handleViewTicket(ticket)}
                >
                  View Ticket
                </button>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
