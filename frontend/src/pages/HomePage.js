import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1>Welcome to EventGo</h1>
          <p>The Next Generation Blockchain NFT Ticketing Platform</p>
          <div className="hero-buttons">
            <Link to="/events" className="nav-link btn">Browse Events</Link>
            <Link to="/register" className="nav-link btn">Sign Up</Link>
          </div>
        </div>
      </section>
      
      <section className="features">
        <div className="container">
          <h2>Key Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <i className="fas fa-ticket-alt feature-icon"></i>
              <h3>NFT Tickets</h3>
              <p>Secure ownership with blockchain-backed NFT tickets</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-qrcode feature-icon"></i>
              <h3>QR Verification</h3>
              <p>Fast and reliable ticket validation with QR codes</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-exchange-alt feature-icon"></i>
              <h3>Secure Transfers</h3>
              <p>Transfer tickets safely with blockchain verification</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-calendar-alt feature-icon"></i>
              <h3>Event Management</h3>
              <p>Create and manage events with powerful tools</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="upcoming-events">
        <div className="container">
          <h2>Upcoming Events</h2>
          <div className="event-grid">
            <div className="event-card">
              <div className="event-image" style={{backgroundImage: 'url(https://picsum.photos/800/500?random=1)'}}></div>
              <div className="event-content">
                <h3>Blockchain Conference 2023</h3>
                <p className="event-date"><i className="far fa-calendar-alt"></i> Dec 15, 2023</p>
                <p className="event-location"><i className="fas fa-map-marker-alt"></i> San Francisco, CA</p>
                <Link to="/events/1" className="event-link">View Details</Link>
              </div>
            </div>
            <div className="event-card">
              <div className="event-image" style={{backgroundImage: 'url(https://picsum.photos/800/500?random=2)'}}></div>
              <div className="event-content">
                <h3>NFT Art Exhibition</h3>
                <p className="event-date"><i className="far fa-calendar-alt"></i> Nov 20, 2023</p>
                <p className="event-location"><i className="fas fa-map-marker-alt"></i> New York, NY</p>
                <Link to="/events/2" className="event-link">View Details</Link>
              </div>
            </div>
            <div className="event-card">
              <div className="event-image" style={{backgroundImage: 'url(https://picsum.photos/800/500?random=3)'}}></div>
              <div className="event-content">
                <h3>Web3 Developer Summit</h3>
                <p className="event-date"><i className="far fa-calendar-alt"></i> Jan 10, 2024</p>
                <p className="event-location"><i className="fas fa-map-marker-alt"></i> Austin, TX</p>
                <Link to="/events/3" className="event-link">View Details</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join our platform today and experience the future of event ticketing</p>
          <Link to="/register" className="nav-link btn">Sign Up Now</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 