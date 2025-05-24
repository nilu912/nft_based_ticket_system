import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Add this import
import "./EventDetail.css";
import axios from "axios";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { user } = useAuth(); // Add this line to get the user from context
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseProcessing, setPurchaseProcessing] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        // API call to fetch event by event_id
        const response = await fetch(
          `http://localhost:5000/api/events/byId/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token"), // Make sure to pass the token
            },
          }
        );

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

        const data = await response.json();
        console.log("event data", data);

        // Assuming the API returns a single event object, not an array
        const foundEvent = data; // Assuming the event data is in eventData property

        if (foundEvent) {
          // Set the event data directly from the API response
          setEvent({
            id: foundEvent.event_id,
            title: foundEvent.event_name,
            date: foundEvent.event_date,
            time: foundEvent.duration,
            price: foundEvent.ticket_price,
            sold_tickets: foundEvent.sold_tickets,
            availableTickets:
              Number(foundEvent.total_tickets) -
              Number(foundEvent.sold_tickets),
            description: foundEvent.description,
            address: foundEvent.address,
            walletAddress: foundEvent.wallet_address,
            createdAt: foundEvent.created_at,
          });
        } else {
          setError("Event not found");
        }
      } catch (err) {
        setError("Error loading event details");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]); // Dependency array with id to re-run if id changes

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= event.availableTickets) {
      setQuantity(value);
    }
  };

  const handlePurchase = () => {
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = async () => {
    setPurchaseProcessing(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/tickets/buy",
        {
          event_id: event.id,
          amount_paid: event.price * quantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );

      const data = response.data;
      console.log(data);
      console.log("Event data:", event);
      const updateResponse = await axios.patch(
        `http://localhost:5000/api/events/${event.id}`,
        {
          sold_tickets: parseInt(event.sold_tickets) + 1,
        },
        {
          type: "PATCH",
        }
      );
      console.log(updateResponse.data);

      // Check for connected wallet with improved detection
      // const connectedWallet =
      //   localStorage.getItem("walletAddress") ||
      //   localStorage.getItem("connectedWallet");

      // // Log the wallet status for debugging
      // console.log("Wallet connection status:", {
      //   walletAddress: localStorage.getItem("walletAddress"),
      //   connectedWallet: localStorage.getItem("connectedWallet"),
      //   userWallet: user?.walletAddress, // Add this line to check user context
      // });

      // // Check if wallet is connected from the auth context
      // if (!connectedWallet && !user?.walletAddress) {
      //   throw new Error("Please connect your wallet to purchase tickets");
      // }

      // // Use the wallet address from either localStorage or user context
      // const buyerWalletAddress = connectedWallet || user?.walletAddress;

      // // Get current events and tickets
      // const events = JSON.parse(localStorage.getItem("events") || "[]");
      // const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");

      // // // Update event's available tickets
      // const updatedEvents = events.map((e) => {
      //   if (e.id === event.id) {
      //     return {
      //       ...e,
      //       availableTickets: e.availableTickets - quantity,
      //     };
      //   }
      //   return e;
      // });

      // // Create new ticket with wallet address
      // const newTicket = {
      //   id: `ticket-${Date.now()}`,
      //   eventId: event.id,
      //   walletAddress: buyerWalletAddress,
      //   eventTitle: event.title,
      //   eventDate: event.date,
      //   eventTime: event.time,
      //   eventLocation: event.location,
      //   quantity: quantity,
      //   price: event.price * quantity,
      //   purchaseDate: new Date().toISOString(),
      //   status: "valid",
      // };

      // // Update localStorage
      // localStorage.setItem("events", JSON.stringify(updatedEvents));
      // localStorage.setItem("tickets", JSON.stringify([...tickets, newTicket]));

      // Show success message and redirect
      alert("Tickets purchased successfully!");
      navigate("/my-tickets");
    } catch (err) {
      alert(err.message || "Error purchasing tickets");
    } finally {
      setPurchaseProcessing(false);
      setShowPurchaseModal(false);
    }
  };

  if (loading) {
    return (
      <div className="event-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-detail-error">
        <p>{error}</p>
        <button onClick={() => navigate("/events")}>Back to Events</button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail-error">
        <p>Event not found</p>
        <button onClick={() => navigate("/events")}>Back to Events</button>
      </div>
    );
  }

  return (
    <div className="event-detail">
      <div className="event-detail-header">
        <h1>{event.title}</h1>
        <div className="event-category">{event.category}</div>
      </div>

      <div className="event-detail-content">
        <div className="event-detail-main">
          <div className="event-image">
            <img
              // src="./eventImg.png"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnDlmtDo5QoWqGFMdioUQHqAp-NvqTZht_ag&s"
              alt={event.title}
            />
          </div>

          <div className="event-info">
            <div className="event-date-time">
              <div className="info-item">
                <i className="fas fa-calendar"></i>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <span>{event.time}</span>
              </div>
            </div>

            <div className="event-location">
              <i className="fas fa-map-marker-alt"></i>
              <span>{event.address}</span>
            </div>

            <div className="event-price">
              <span className="price-label">Price per ticket:</span>
              <span className="price-value">${event.price}</span>
            </div>

            <div className="event-description">
              <h3>About this event</h3>
              <p>{event.description}</p>
            </div>
          </div>
        </div>

        <div className="event-detail-sidebar">
          <div className="purchase-card">
            <div className="available-tickets">
              <span className="label">Available Tickets:</span>
              <span className="value">{event.availableTickets}</span>
            </div>

            <div className="quantity-selector">
              <label htmlFor="quantity">Number of tickets: 1</label>
              {/* <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={event.availableTickets}
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(event.availableTickets, quantity + 1))
                  }
                  disabled={quantity >= event.availableTickets}
                >
                  +
                </button> */}
              {/* </div> */}
            </div>

            <div className="total-price">
              <span className="label">Total Price:</span>
              <span className="value">${event.price}</span>
            </div>

            <button
              className="purchase-button"
              onClick={handlePurchase}
              disabled={event.availableTickets === 0}
            >
              {event.availableTickets === 0 ? "Sold Out" : "Purchase Tickets"}
            </button>
          </div>
        </div>
      </div>

      {showPurchaseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Purchase</h2>
            <div className="purchase-summary">
              <p>
                <strong>Event:</strong> {event.title}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {event.time}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Quantity:</strong> {1}
              </p>
              <p>
                <strong>Total Price:</strong> ${event.price}
              </p>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowPurchaseModal(false)}
                disabled={purchaseProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                disabled={purchaseProcessing}
                className="confirm-button"
              >
                {purchaseProcessing ? "Processing..." : "Confirm Purchase"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
