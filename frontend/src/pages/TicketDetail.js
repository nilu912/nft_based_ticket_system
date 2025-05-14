import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import "./TicketDetail.css";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const qrCodeRef = useRef(null);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const downloadTicketCard = () => {
    const qrCanvas = qrCodeRef.current?.querySelector("canvas");
    if (!qrCanvas || !ticket || !event) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    const qrImage = new Image();
    qrImage.onload = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#4a6cf7");
      gradient.addColorStop(1, "#6a3ef7");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, 100);

      ctx.fillStyle = "white";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText(event.event_name || "Untitled Event", canvas.width / 2, 65);

      ctx.drawImage(qrImage, 100, 150, 400, 400);

      ctx.fillStyle = "#000";
      ctx.font = "28px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Date: ${formatDate(event.event_date)}`, 550, 180);
      ctx.fillText(`Time: ${event.duration}`, 550, 230);
      ctx.fillText(`Location: ${event.address}`, 550, 280);

      ctx.fillText(`Ticket ID: ${ticket.ticket_id}`, 550, 360);
      ctx.fillText(`Price: $${event.ticket_price}`, 550, 410);
      ctx.fillText(`Purchased: ${formatDate(ticket.created_at)}`, 550, 460);

      const walletShort = `${ticket.wallet_address?.slice(0, 6)}...${ticket.wallet_address?.slice(-4)}`;
      ctx.fillText(`Wallet: ${walletShort}`, 100, 600);

      ctx.fillStyle = ticket.status === "valid" ? "#28a745" : "#6c757d";
      ctx.beginPath();
      ctx.roundRect(1550, 40, 250, 50, 25);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.font = "bold 30px Arial";
      ctx.textAlign = "center";
      ctx.fillText(ticket.status?.toUpperCase(), 1675, 75);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `EventGo-Ticket-${ticket.ticket_id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    qrImage.src = qrCanvas.toDataURL("image/png");
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketRes = await axios.get(`http://localhost:5000/api/tickets/getTicket/${id}`);
        const eventRes = await axios.get(`http://localhost:5000/api/events/byId/${ticketRes.data.event_id}`);
        setTicket(ticketRes.data);
        setEvent(eventRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load ticket details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="ticket-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (error || !ticket || !event) {
    return (
      <div className="ticket-detail-error">
        <p>{error || "Ticket not found."}</p>
        <button onClick={() => navigate("/my-tickets")}>Back to My Tickets</button>
      </div>
    );
  }

  const ticketData = JSON.stringify({
    id: ticket.token_id,
    eventId: ticket.event_id,
    eventTitle: event.event_name,
    contractAdd: process.env.REACT_APP_CONTRACT_ADDRESS || "N/A",
    walletAddress: ticket.wallet_address,
    status: ticket.status,
  });

  return (
    <div className="ticket-detail-container">
      <div className="ticket-detail">
        <div className="ticket-header">
          <h1>{event.event_name}</h1>
          <div className={`ticket-status status-${ticket.status}`}>{ticket.status}</div>
        </div>

        <div className="ticket-body">
          <div className="ticket-qr" ref={qrCodeRef}>
            <QRCodeCanvas value={ticketData} size={1200} level="H" style={{ width: 200, height: 200 }}/>
            <p className="ticket-id">ID: {ticket.ticket_id}</p>
            <button onClick={downloadTicketCard} className="download-qr-button">
              <i className="fas fa-download"></i> Download Ticket
            </button>
          </div>

          <div className="ticket-info">
            <div className="info-group">
              <h3>Event Details</h3>
              <div className="info-item">
                <i className="fas fa-calendar"></i>
                <span>{formatDate(event.event_date)}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <span>{event.duration}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>{event.address}</span>
              </div>
            </div>

            <div className="info-group">
              <h3>Ticket Details</h3>
              <div className="info-item">
                <i className="fas fa-money-bill-wave"></i>
                <span>Price: ${event.ticket_price}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-shopping-cart"></i>
                <span>Purchased: {formatDate(ticket.purchase_date)}</span>
              </div>
            </div>

            <div className="info-group">
              <h3>Blockchain Details</h3>
              <div className="info-item">
                <i className="fas fa-wallet"></i>
                <span>
                  Wallet: {ticket.wallet_address
                    ? `${ticket.wallet_address.slice(0, 6)}...${ticket.wallet_address.slice(-4)}`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="ticket-actions">
          <button onClick={() => navigate("/my-tickets")} className="back-button">
            Back to My Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
