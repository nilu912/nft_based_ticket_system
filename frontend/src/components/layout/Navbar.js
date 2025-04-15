import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { connected, connectWallet, accounts } = useWeb3();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          EventGo <i className="fas fa-ticket-alt"></i>
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/events" className="nav-link">
              Events
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
          
          {currentUser ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/my-tickets" className="nav-link">
                  My Tickets
                </Link>
              </li>
              {(currentUser.role === 'organizer' || currentUser.role === 'admin') && (
                <li className="nav-item">
                  <Link to="/organizer" className="nav-link">
                    Organizer
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link btn">
                  Register
                </Link>
              </li>
            </>
          )}

          {connected ? (
            <li className="nav-item">
              <span className="nav-link">
                {formatAddress(accounts[0])}
              </span>
            </li>
          ) : (
            <li className="nav-item">
              <button className="nav-link btn" onClick={connectWallet}>
                Connect Wallet
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 