import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './TicketDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const qrCodeRef = useRef(null);

  // Enhanced download function to create a complete ticket card
  const downloadTicketCard = () => {
    if (!qrCodeRef.current) return;
    
    // Get the SVG element
    const svgElement = qrCodeRef.current.querySelector('svg');
    
    if (!svgElement) return;
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions for a ticket card
    canvas.width = 800;
    canvas.height = 400;
    
    // Create an image from the SVG
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      // Fill background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 800, 0);
      gradient.addColorStop(0, '#4a6cf7');
      gradient.addColorStop(1, '#6a3ef7');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 80);
      
      // Fill main background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 80, 800, 320);
      
      // Add event title
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(ticket.eventTitle, 400, 50);
      
      // Draw the QR code
      ctx.drawImage(img, 50, 100, 200, 200);
      
      // Add ticket info
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = '#4a6cf7';
      ctx.textAlign = 'left';
      ctx.fillText('EVENT DETAILS', 300, 120);
      
      ctx.font = '16px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(`Date: ${new Date(ticket.eventDate).toLocaleDateString()}`, 300, 150);
      ctx.fillText(`Time: ${ticket.eventTime}`, 300, 180);
      ctx.fillText(`Location: ${ticket.eventLocation}`, 300, 210);
      
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = '#4a6cf7';
      ctx.fillText('TICKET DETAILS', 300, 250);
      
      ctx.font = '16px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(`Ticket ID: ${ticket.id}`, 300, 280);
      ctx.fillText(`Quantity: ${ticket.quantity}`, 300, 310);
      ctx.fillText(`Price: $${ticket.price}`, 300, 340);
      ctx.fillText(`Purchase Date: ${new Date(ticket.purchaseDate).toLocaleDateString()}`, 300, 370);
      
      // Add status badge
      ctx.fillStyle = ticket.status === 'valid' ? '#28a745' : '#6c757d';
      ctx.beginPath();
      ctx.roundRect(650, 30, 120, 30, 15);
      ctx.fill();
      
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(ticket.status.toUpperCase(), 710, 50);
      
      // Add wallet info
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'left';
      const walletText = `${ticket.walletAddress.slice(0, 6)}...${ticket.walletAddress.slice(-4)}`;
      ctx.fillText(`Wallet: ${walletText}`, 50, 330);
      
      // Convert to data URL and download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `EventGo-Ticket-${ticket.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      URL.revokeObjectURL(svgUrl);
    };
    
    img.src = svgUrl;
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        console.log('Fetched tickets:', tickets);
        console.log('Looking for ticket with ID:', id);
        
        // Convert both IDs to strings for comparison
        const foundTicket = tickets.find(t => String(t.id) === String(id));
        console.log('Found ticket:', foundTicket);
        
        if (foundTicket) {
          setTicket(foundTicket);
        } else {
          setError('Ticket not found');
        }
      } catch (err) {
        setError('Error loading ticket details');
        console.error('Error fetching ticket:', err);
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

  if (error) {
    return (
      <div className="ticket-detail-error">
        <p>{error}</p>
        <button onClick={() => navigate('/my-tickets')}>Back to My Tickets</button>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-detail-error">
        <p>Ticket not found</p>
        <button onClick={() => navigate('/my-tickets')}>Back to My Tickets</button>
      </div>
    );
  }

  // Create ticket data for QR code
  const ticketData = JSON.stringify({
    id: ticket.id,
    eventId: ticket.eventId,
    eventTitle: ticket.eventTitle,
    quantity: ticket.quantity,
    walletAddress: ticket.walletAddress,
    status: ticket.status
  });

  return (
    <div className="ticket-detail-container">
      <div className="ticket-detail">
        <div className="ticket-header">
          <h1>{ticket.eventTitle}</h1>
          <div className={`ticket-status status-${ticket.status}`}>
            {ticket.status}
          </div>
        </div>
        
        <div className="ticket-body">
          <div className="ticket-qr" ref={qrCodeRef}>
            <QRCodeSVG value={ticketData} size={200} level="H" />
            <p className="ticket-id">ID: {ticket.id}</p>
            <button onClick={downloadTicketCard} className="download-qr-button">
              <i className="fas fa-download"></i> Download Ticket
            </button>
          </div>
          
          <div className="ticket-info">
            <div className="info-group">
              <h3>Event Details</h3>
              <div className="info-item">
                <i className="fas fa-calendar"></i>
                <span>{new Date(ticket.eventDate).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <span>{ticket.eventTime}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>{ticket.eventLocation}</span>
              </div>
            </div>
            
            <div className="info-group">
              <h3>Ticket Details</h3>
              <div className="info-item">
                <i className="fas fa-ticket-alt"></i>
                <span>Quantity: {ticket.quantity}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-money-bill-wave"></i>
                <span>Price: ${ticket.price}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-shopping-cart"></i>
                <span>Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="info-group">
              <h3>Blockchain Details</h3>
              <div className="info-item">
                <i className="fas fa-wallet"></i>
                <span>Wallet: {`${ticket.walletAddress.slice(0, 6)}...${ticket.walletAddress.slice(-4)}`}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="ticket-actions">
          <button onClick={() => navigate('/my-tickets')} className="back-button">
            Back to My Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;