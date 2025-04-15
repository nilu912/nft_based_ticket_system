import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';
import { ethers } from 'ethers';

const Navbar = () => {
  const { user, connectWallet, disconnectWallet } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('')

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleWalletAction = async () => {
    if (user) {
      await disconnectWallet();
    } else {
      await connectWallet();
    }
    closeMobileMenu();
  };

  const connectWalletHandller = async () => {
    if(!window.ethereum){
      alert("Metamask not installed. Please install it!");
      return;
    }
    try{
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      
      // Fetch the nonce from the server
      const nonceResponse = await fetch("http://localhost:5000/api/users/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: account }),
      });
      const {nonce} = await nonceResponse.json();

      const signature = await signer.signMessage(nonce);

      const verifyResponse = await fetch("http://localhost:5000/api/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: account, signature }),
      });
      const { token } = await verifyResponse.json();
      if (!token) {
        alert("You are not registered yet. please register first!");
        console.log("Token not found!");
        return;
      }
      localStorage.setItem("token", token);
      setWalletAddress(account)
      alert("Login successful!");
      
    }catch(error){
      console.error(error)
    }
  }
  const disconnectWalletHandller = () => {
    setWalletAddress('');
    localStorage.removeItem("token");
  }
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <img src="/logo.svg" alt="EventGo Logo" />
          EventGo
        </Link>

        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/events"
            className={`nav-link ${isActive('/events') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Events
          </Link>
          <Link
            to="/my-tickets"
            className={`nav-link ${isActive('/my-tickets') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            My Tickets
          </Link>
          <Link
            to="/organizer"
            className={`nav-link ${isActive('/organizer') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Organizer
          </Link>

          {walletAddress ? (
            <>
              <div className="wallet-address">
                <span>Connected: </span>
                <span>
                  {user && user.walletAddress ? 
                    `${String(user.walletAddress).slice(0, 6)}...${String(user.walletAddress).slice(-4)}` : 
                    'Unknown Address'}
                </span>
              </div>
              <button
                className="disconnect-wallet-btn"
                onClick={disconnectWalletHandller}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              className="wallet-button"
              onClick={connectWalletHandller}
              disabled={false}
            >
              Connect Wallet
            </button>
          )}{!walletAddress && 
          <button
              className="wallet-button"
              onClick={()=>{ window.location.href = '/register';}}
              disabled={false}
            >
              Sign Up
            </button>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;