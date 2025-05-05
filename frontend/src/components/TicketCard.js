import React from 'react';
import { Link } from 'react-router-dom';
import './TicketCard.css';

const TicketCard = ({ ticket }) => {
  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <h3>{ticket.eventTitle}</h3>
        <div className={`ticket-status status-${ticket.status}`}>
          {ticket.status}
        </div>
      </div>
      
      <div className="ticket-body">
        <div className="ticket-info">
          <div className="ticket-info-item">
            <i className="fas fa-calendar"></i>
            <span>{new Date(ticket.eventDate).toLocaleDateString()}</span>
          </div>
          <div className="ticket-info-item">
            <i className="fas fa-clock"></i>
            <span>{ticket.eventTime}</span>
          </div>
          <div className="ticket-info-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{ticket.eventLocation}</span>
          </div>
        </div>
        
        <div className="ticket-quantity">
          <span>Quantity:</span>
          <span>{ticket.quantity}</span>
        </div>
        
        <div className="ticket-actions">
          <Link to={`/tickets/${ticket.id}`} className="view-button">
            View Ticket
          </Link>
          <button className="qr-button">
            <i className="fas fa-qrcode"></i> QR Code
          </button>
        </div>
        
        <div className="ticket-date">
          Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;