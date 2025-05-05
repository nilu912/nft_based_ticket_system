import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './WalletConnect.css';

const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        setIsConnected(true);
        setWalletAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
      }
    } catch (error) {
      console.error('Error checking if wallet is connected:', error);
      setError('Error connecting to wallet');
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setIsConnected(true);
      setWalletAddress(accounts[0]);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      setError('');
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setError('Error connecting to wallet');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setProvider(null);
  };

  return (
    <div className="wallet-connect">
      {error && <div className="wallet-error">{error}</div>}
      
      {!isConnected ? (
        <button 
          className="wallet-connect-btn" 
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <div className="wallet-address">
            {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
          </div>
          <button 
            className="wallet-disconnect-btn" 
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 