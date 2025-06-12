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