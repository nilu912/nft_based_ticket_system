import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState(null);

  useEffect(() => {
    // Simulate fetching event details from API
    const fetchEventDetails = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock event data based on ID
        const mockEvent = {
          id,
          title: 'Blockchain Summit 2023',
          date: '2023-12-15',
          time: '10:00 AM',
          endTime: '6:00 PM',
          location: 'San Francisco Convention Center',
          address: '747 Howard St, San Francisco, CA 94103',
          category: 'Conference',
          image: 'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
          description: `Join the premier blockchain event of the year featuring industry leaders and innovators. 
          
          This full-day summit brings together blockchain pioneers, developers, investors, and enthusiasts to explore the latest trends, challenges, and opportunities in the blockchain ecosystem.
          
          Sessions will cover DeFi innovations, NFT marketplaces, enterprise blockchain adoption, regulatory landscapes, and emerging crypto technologies.`,
          organizer: 'Blockchain Innovation Group',
          ticketTypes: [
            {
              id: 't1',
              name: 'General Admission',
              price: '0.05 ETH',
              description: 'Access to all general sessions and exhibition area',
              available: 150
            },
            {
              id: 't2',
              name: 'VIP Pass',
              price: '0.12 ETH',
              description: 'General admission plus exclusive networking reception and premium seating',
              available: 50
            },
            {
              id: 't3',
              name: 'Workshop Package',
              price: '0.08 ETH',
              description: 'General admission plus access to hands-on developer workshops',
              available: 75
            }
          ]
        };
        
        setEvent(mockEvent);
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [id]);

  const handleTicketPurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!selectedTicketType) {
      return;
    }
    
    setPurchaseLoading(true);
    
    try {
      // Simulate API delay for purchase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful purchase
      setPurchaseSuccess(true);
      
      // Redirect to tickets page after a delay
      setTimeout(() => {
        navigate('/my-tickets');
      }, 2000);
      
    } catch (error) {
      console.error('Error purchasing ticket:', error);
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container">
        <div className="not-found">
          <h2>Event not found</h2>
          <p>The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container event-details">
      <div className="event-details-header">
        <h1>{event.title}</h1>
      </div>
      
      <div className="event-details-card">
        <div 
          className="event-details-image"
          style={{ backgroundImage: `url(${event.image})` }}
        ></div>
        
        <div className="event-details-content">
          <div className="event-meta">
            <div className="event-meta-item">
              <i className="fas fa-calendar-alt"></i>
              <span>
                {new Date(event.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="event-meta-item">
              <i className="fas fa-clock"></i>
              <span>{event.time} - {event.endTime}</span>
            </div>
            
            <div className="event-meta-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>{event.location}</span>
            </div>
            
            <div className="event-meta-item">
              <i className="fas fa-user-tie"></i>
              <span>{event.organizer}</span>
            </div>
          </div>
          
          <div className="event-description">
            {event.description.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <div className="ticket-types">
            <h3>Tickets</h3>
            
            {purchaseSuccess ? (
              <div className="purchase-success">
                <i className="fas fa-check-circle"></i>
                <p>Purchase successful! Redirecting to your tickets...</p>
              </div>
            ) : (
              <>
                {event.ticketTypes.map(ticket => (
                  <div key={ticket.id} className="ticket-type">
                    <div className="ticket-type-details">
                      <h4>{ticket.name}</h4>
                      <p>{ticket.description}</p>
                      <small>{ticket.available} tickets available</small>
                    </div>
                    
                    <div className="ticket-type-actions">
                      <div className="ticket-price">{ticket.price}</div>
                      <button 
                        className={`btn ${selectedTicketType === ticket.id ? 'btn-selected' : ''}`}
                        onClick={() => setSelectedTicketType(ticket.id)}
                      >
                        {selectedTicketType === ticket.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="purchase-actions">
                  <button 
                    className="btn btn-primary"
                    disabled={!selectedTicketType || purchaseLoading}
                    onClick={handleTicketPurchase}
                  >
                    {purchaseLoading ? 'Processing...' : 'Purchase Ticket as NFT'}
                  </button>
                  
                  {!isAuthenticated && (
                    <div className="login-notice">
                      <i className="fas fa-info-circle"></i>
                      <p>You'll need to login to complete your purchase</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="event-location-detail">
        <h3>Location</h3>
        <p><i className="fas fa-map-marker-alt"></i> {event.address}</p>
        <div className="event-map">
          {/* Map would go here - using placeholder for now */}
          <div className="map-placeholder">
            <i className="fas fa-map"></i>
            <p>Interactive map would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage; 