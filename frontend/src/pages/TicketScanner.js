import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Html5Qrcode } from 'html5-qrcode';
import './TicketScanner.css';

const TicketScanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scanning, setScanning] = useState(true);
  const [scannedResult, setScannedResult] = useState(null);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const qrScannerRef = useRef(null);

  useEffect(() => {
    // Load events from localStorage without checking user role first
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    // If user exists, filter events by organizer
    if (user && user.walletAddress) {
      const organizerEvents = storedEvents.filter(event => 
        event.organizerId === user.id || event.organizerWallet === user.walletAddress
      );
      setEvents(organizerEvents);
      
      if (organizerEvents.length > 0) {
        setSelectedEvent(organizerEvents[0].id);
      }
    } else {
      // If no user, just show all events for demo purposes
      setEvents(storedEvents);
      if (storedEvents.length > 0) {
        setSelectedEvent(storedEvents[0].id);
      }
    }
  }, [user]);

  useEffect(() => {
    // Initialize QR scanner when component mounts and scanning is true
    let html5QrCode = null;
    
    if (scanning && events.length > 0) {
      html5QrCode = new Html5Qrcode("qr-reader");
      qrScannerRef.current = html5QrCode;
      
      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // Success callback
          try {
            const ticketData = JSON.parse(decodedText);
            setScannedResult(ticketData);
            setScanning(false);
            if (html5QrCode && html5QrCode.isScanning) {
              html5QrCode.stop().catch(err => {
                console.error("Failed to stop scanner", err);
              });
            }
            validateTicket(ticketData);
          } catch (error) {
            setTicketStatus({
              valid: false,
              message: 'Invalid QR code format'
            });
            setScanning(false);
            if (html5QrCode && html5QrCode.isScanning) {
              html5QrCode.stop().catch(err => {
                console.error("Failed to stop scanner", err);
              });
            }
          }
        },
        (errorMessage) => {
          // Error callback - we can ignore most errors as they happen when no QR is detected
          console.log(errorMessage);
        }
      ).catch(err => {
        console.error("Failed to start scanner", err);
      });
    }

    // Cleanup function to stop scanner when component unmounts
    return () => {
      if (qrScannerRef.current) {
        try {
          // Check if scanner is running before attempting to stop it
          if (qrScannerRef.current.isScanning) {
            qrScannerRef.current.stop().catch(err => {
              console.log("Scanner cleanup:", err);
            });
          }
        } catch (error) {
          console.log("Scanner cleanup error:", error);
        }
      }
    };
  }, [scanning, events.length]);

  const validateTicket = (ticketData) => {
    try {
      // Get tickets from localStorage
      const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      
      // Find the ticket with matching ID
      const ticket = tickets.find(t => t.id === ticketData.id);
      
      if (!ticket) {
        setTicketStatus({
          valid: false,
          message: 'Ticket not found'
        });
        return;
      }
      
      // Check if ticket is for the selected event
      if (ticket.eventId !== selectedEvent) {
        setTicketStatus({
          valid: false,
          message: 'Ticket is for a different event'
        });
        return;
      }
      
      // Check if ticket has already been used
      if (ticket.status === 'used') {
        setTicketStatus({
          valid: false,
          message: 'Ticket has already been used'
        });
        return;
      }
      
      // Ticket is valid, mark it as used
      const updatedTickets = tickets.map(t => {
        if (t.id === ticket.id) {
          return { ...t, status: 'used' };
        }
        return t;
      });
      
      // Save updated tickets to localStorage
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));
      
      setTicketStatus({
        valid: true,
        message: 'Ticket validated successfully',
        ticket: ticket
      });
      
    } catch (error) {
      setTicketStatus({
        valid: false,
        message: 'Error validating ticket'
      });
    }
  };

  const resetScanner = () => {
    setScanning(true);
    setScannedResult(null);
    setTicketStatus(null);
  };

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  return (
    <div className="ticket-scanner-container">
      <h1>Ticket Scanner</h1>
      
      <div className="event-selector">
        <label htmlFor="event-select">Select Event:</label>
        <select 
          id="event-select" 
          value={selectedEvent} 
          onChange={handleEventChange}
          disabled={!scanning}
        >
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.title} - {new Date(event.date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>
      
      {events.length === 0 && (
        <div className="no-events-message">
          <p>You don't have any events to scan tickets for.</p>
          <button onClick={() => navigate('/organizer')}>Go to Organizer Dashboard</button>
        </div>
      )}
      
      {events.length > 0 && (
        <div className="scanner-section">
          {scanning ? (
            <div className="qr-reader-container">
              <div id="qr-reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
              <p className="scanner-instruction">Position the QR code in the frame to scan</p>
            </div>
          ) : (
            <div className="scan-result">
              {ticketStatus && (
                <div className={`ticket-validation ${ticketStatus.valid ? 'valid' : 'invalid'}`}>
                  <div className="validation-icon">
                    {ticketStatus.valid ? (
                      <i className="fas fa-check-circle"></i>
                    ) : (
                      <i className="fas fa-times-circle"></i>
                    )}
                  </div>
                  <h2>{ticketStatus.valid ? 'Valid Ticket' : 'Invalid Ticket'}</h2>
                  <p>{ticketStatus.message}</p>
                  
                  {ticketStatus.valid && ticketStatus.ticket && (
                    <div className="ticket-info">
                      <p><strong>Event:</strong> {ticketStatus.ticket.eventTitle}</p>
                      <p><strong>Ticket ID:</strong> {ticketStatus.ticket.id}</p>
                      <p><strong>Quantity:</strong> {ticketStatus.ticket.quantity}</p>
                      <p><strong>Wallet:</strong> {`${ticketStatus.ticket.walletAddress.slice(0, 6)}...${ticketStatus.ticket.walletAddress.slice(-4)}`}</p>
                    </div>
                  )}
                  
                  <button onClick={resetScanner} className="reset-button">
                    Scan Another Ticket
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketScanner;