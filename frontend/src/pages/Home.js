import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to EventGo</h1>
          <p>Discover and attend amazing events with blockchain-powered tickets</p>
          <Link to="/events" className="cta-button">
            Browse Events
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose EventGo?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Secure Tickets</h3>
            <p>NFT-based tickets ensure authenticity and prevent counterfeiting</p>
          </div>
          <div className="feature-card">
            <h3>Easy Transfer</h3>
            <p>Transfer tickets securely through blockchain technology</p>
          </div>
          <div className="feature-card">
            <h3>Quick Verification</h3>
            <p>QR code scanning for instant ticket validation</p>
          </div>
          <div className="feature-card">
            <h3>Transparent Pricing</h3>
            <p>No hidden fees, clear pricing for all events</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 