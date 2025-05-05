import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    ticketsOwned: 0,
    ticketsSold: 0,
    eventsCreated: 0,
    eventsAttended: 0
  });
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchDashboardData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for dashboard
        const mockStats = {
          ticketsOwned: 3,
          ticketsSold: 0,
          eventsCreated: 1,
          eventsAttended: 2
        };
        
        const mockEvents = [
          {
            id: '101',
            title: 'My Web3 Meetup',
            date: '2023-12-30',
            time: '6:30 PM',
            location: 'Tech Hub, San Francisco',
            attendees: 12,
            ticketsSold: 12,
            totalTickets: 50,
            revenue: '0.24 ETH',
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
          }
        ];
        
        setStats(mockStats);
        setUserEvents(mockEvents);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name || 'User'}</p>
      </div>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3><i className="fas fa-ticket-alt"></i> My Tickets</h3>
          <div className="count">{stats.ticketsOwned}</div>
          <Link to="/my-tickets">View tickets</Link>
        </div>
        
        <div className="dashboard-card">
          <h3><i className="fas fa-calendar-check"></i> Events Attended</h3>
          <div className="count">{stats.eventsAttended}</div>
          <Link to="/my-tickets">View history</Link>
        </div>
        
        <div className="dashboard-card">
          <h3><i className="fas fa-calendar-plus"></i> Events Created</h3>
          <div className="count">{stats.eventsCreated}</div>
          <Link to="/create-event">Create event</Link>
        </div>
        
        <div className="dashboard-card">
          <h3><i className="fas fa-money-bill-wave"></i> Tickets Sold</h3>
          <div className="count">{stats.ticketsSold}</div>
          <Link to="/my-sales">View sales</Link>
        </div>
      </div>
      
      <div className="dashboard-section">
        <div className="section-header">
          <h2>My Events</h2>
          <Link to="/create-event" className="btn">Create New Event</Link>
        </div>
        
        {userEvents.length > 0 ? (
          <div className="event-grid">
            {userEvents.map(event => (
              <div key={event.id} className="event-card">
                <div 
                  className="event-image"
                  style={{ backgroundImage: `url(${event.image})` }}
                ></div>
                <div className="event-content">
                  <div className="event-status">
                    <span className={`status-badge ${event.status}`}>
                      {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
                    </span>
                  </div>
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
                  
                  <div className="event-stats">
                    <div className="stat">
                      <span className="stat-label">Tickets Sold:</span>
                      <span className="stat-value">{event.ticketsSold}/{event.totalTickets}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Revenue:</span>
                      <span className="stat-value">{event.revenue}</span>
                    </div>
                  </div>
                  
                  <div className="event-actions">
                    <Link to={`/events/${event.id}`} className="event-link">View Event</Link>
                    <Link to={`/events/${event.id}/manage`} className="event-link">Manage</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <i className="fas fa-calendar-plus"></i>
            <h3>No events created yet</h3>
            <p>Create your first event to start selling NFT tickets</p>
            <Link to="/create-event" className="btn">Create Event</Link>
          </div>
        )}
      </div>
      
      <div className="dashboard-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-ticket-alt"></i>
            </div>
            <div className="activity-content">
              <p>You purchased a ticket for <strong>Blockchain Summit 2023</strong></p>
              <div className="activity-meta">2 days ago</div>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-calendar-plus"></i>
            </div>
            <div className="activity-content">
              <p>You created a new event: <strong>My Web3 Meetup</strong></p>
              <div className="activity-meta">1 week ago</div>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-ticket-alt"></i>
            </div>
            <div className="activity-content">
              <p>You purchased a ticket for <strong>NFT Art Exhibition</strong></p>
              <div className="activity-meta">2 weeks ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 