import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    // Simulate fetching events from API
    const fetchEvents = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for events
        const mockEvents = [
          {
            id: '1',
            title: 'Blockchain Summit 2023',
            date: '2023-12-15',
            time: '10:00 AM',
            location: 'San Francisco, CA',
            category: 'Conference',
            image: 'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
            description: 'Join the premier blockchain event of the year with industry leaders and innovators.',
            price: '0.05 ETH'
          },
          {
            id: '2',
            title: 'NFT Art Exhibition',
            date: '2023-11-28',
            time: '6:00 PM',
            location: 'New York, NY',
            category: 'Exhibition',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
            description: 'Experience digital art like never before at this exclusive NFT exhibition.',
            price: '0.03 ETH'
          },
          {
            id: '3',
            title: 'Web3 Developer Workshop',
            date: '2023-12-05',
            time: '9:00 AM',
            location: 'Online',
            category: 'Workshop',
            image: 'https://images.unsplash.com/photo-1616499600301-0ae29414fab1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            description: 'Learn how to build decentralized applications with hands-on guidance from experts.',
            price: '0.02 ETH'
          },
          {
            id: '4',
            title: 'Crypto Comedy Night',
            date: '2023-12-20',
            time: '8:00 PM',
            location: 'Austin, TX',
            category: 'Entertainment',
            image: 'https://images.unsplash.com/photo-1511795409834-c954f237c7f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
            description: 'Laugh your way through the highs and lows of crypto with top comedians.',
            price: '0.015 ETH'
          },
          {
            id: '5',
            title: 'DeFi Investment Summit',
            date: '2024-01-10',
            time: '11:00 AM',
            location: 'Miami, FL',
            category: 'Conference',
            image: 'https://images.unsplash.com/photo-1559526324-593bc073d8f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            description: 'Discover the latest strategies and opportunities in decentralized finance.',
            price: '0.04 ETH'
          },
          {
            id: '6',
            title: 'Metaverse Music Festival',
            date: '2023-12-25',
            time: '4:00 PM',
            location: 'Virtual Reality',
            category: 'Entertainment',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            description: 'Experience the future of music in the metaverse with top artists and immersive environments.',
            price: '0.025 ETH'
          }
        ];
        
        setEvents(mockEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Filter events based on search term and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory ? event.category === filterCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [...new Set(events.map(event => event.category))];

  return (
    <div className="container events-container">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        <Link to="/create-event" className="btn">Create Event</Link>
      </div>
      
      <div className="events-filters">
        <input
          type="text"
          placeholder="Search events..."
          className="filter-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          className="filter-input"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="event-grid">
          {filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              <div 
                className="event-image"
                style={{ backgroundImage: `url(${event.image})` }}
              ></div>
              <div className="event-content">
                <h3>{event.title}</h3>
                <div className="event-date">
                  <i className="fas fa-calendar-alt"></i>
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} at {event.time}
                </div>
                <div className="event-location">
                  <i className="fas fa-map-marker-alt"></i>
                  {event.location}
                </div>
                <div className="event-price">
                  <i className="fas fa-ticket-alt"></i>
                  {event.price}
                </div>
                <Link to={`/events/${event.id}`} className="event-link">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <i className="fas fa-calendar-times"></i>
          <p>No events found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage; 