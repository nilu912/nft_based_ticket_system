import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MyTicketsPage = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching tickets from API
    const fetchTickets = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for tickets
        const mockTickets = [
          {
            id: 'nft123',
            eventId: '1',
            eventName: 'Blockchain Summit 2023',
            eventDate: '2023-12-15',
            eventTime: '10:00 AM',
            location: 'San Francisco Convention Center',
            ticketType: 'VIP Pass',
            price: '0.12 ETH',
            purchaseDate: '2023-11-05',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EVENTGO-TICKET-NFT123',
            transferable: true,
            status: 'valid'
          },
          {
            id: 'nft456',
            eventId: '3',
            eventName: 'Web3 Developer Workshop',
            eventDate: '2023-12-05',
            eventTime: '9:00 AM',
            location: 'Online',
            ticketType: 'Workshop Package',
            price: '0.08 ETH',
            purchaseDate: '2023-10-28',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EVENTGO-TICKET-NFT456',
            transferable: true,
            status: 'valid'
          },
          {
            id: 'nft789',
            eventId: '4',
            eventName: 'Crypto Comedy Night',
            eventDate: '2023-12-20',
            eventTime: '8:00 PM',
            location: 'Austin Theater',
            ticketType: 'General Admission',
            price: '0.015 ETH',
            purchaseDate: '2023-10-15',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EVENTGO-TICKET-NFT789',
            transferable: true,
            status: 'valid'
          }
        ];
        
        setTickets(mockTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, []);

  const handleTransferTicket = (ticketId) => {
    // This would open a modal for transferring the ticket in a real implementation
    console.log(`Opening transfer dialog for ticket ${ticketId}`);
    alert(`Transfer functionality would open here for ticket ${ticketId}`);
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>My NFT Tickets</h1>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : tickets.length > 0 ? (
        <div className="tickets-list">
          {tickets.map(ticket => (
            <div key={ticket.id} className="ticket-container">
              <div className="ticket-header">
                <h3>{ticket.eventName}</h3>
                <span className={`ticket-status ${ticket.status}`}>
                  {ticket.status === 'valid' ? 'Valid' : 'Used'}
                </span>
              </div>
              
              <div className="ticket-body">
                <div className="ticket-qr">
                  <img src={ticket.qrCode} alt="Ticket QR Code" />
                  <div className="nft-id">NFT ID: {ticket.id}</div>
                </div>
                
                <div className="ticket-details">
                  <div className="ticket-info">
                    <i className="fas fa-ticket-alt"></i> <span>{ticket.ticketType}</span>
                  </div>
                  
                  <div className="ticket-info">
                    <i className="fas fa-calendar-alt"></i> <span>
                      {new Date(ticket.eventDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <div className="ticket-info">
                    <i className="fas fa-clock"></i> <span>{ticket.eventTime}</span>
                  </div>
                  
                  <div className="ticket-info">
                    <i className="fas fa-map-marker-alt"></i> <span>{ticket.location}</span>
                  </div>
                  
                  <div className="ticket-info">
                    <i className="fas fa-coins"></i> <span>{ticket.price}</span>
                  </div>
                  
                  <div className="ticket-info">
                    <i className="fas fa-shopping-cart"></i> <span>Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="ticket-actions">
                    <Link 
                      to={`/events/${ticket.eventId}`} 
                      className="ticket-button secondary"
                    >
                      <i className="fas fa-info-circle"></i> Event Details
                    </Link>
                    
                    {ticket.transferable && ticket.status === 'valid' && (
                      <button 
                        className="ticket-button"
                        onClick={() => handleTransferTicket(ticket.id)}
                      >
                        <i className="fas fa-exchange-alt"></i> Transfer
                      </button>
                    )}
                    
                    <button className="ticket-button">
                      <i className="fas fa-download"></i> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-tickets">
          <i className="fas fa-ticket-alt"></i>
          <h3>No tickets yet</h3>
          <p>You haven't purchased any tickets yet. Browse events to find something you'd like to attend.</p>
          <Link to="/events" className="btn">Browse Events</Link>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage; 