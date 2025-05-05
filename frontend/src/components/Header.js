import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WalletConnect from './WalletConnect';
import './Header.css';

const Header = () => {
  const { user, connectWallet, disconnectWallet } = useAuth();

  const disconnectWalletHandller = () => {
    localStorage.removeItem('token');
  }
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          EventGo
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/events" className="nav-link">Events</Link>
          {user && (
            <>
              <Link to="/my-tickets" className="nav-link">My Tickets</Link>
              {user.role === 'organizer' && (
                <Link to="/organizer" className="nav-link">Organizer Dashboard</Link>
              )}
            </>
          )}
        </nav>

        <div className="auth-section">
          {user ? (
            <div className="user-menu">
              <span className="username">{user.username}</span>
              <button onClick={disconnectWalletHandller} className="disconnect-btn">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={connectWallet} className="connect-btn">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 