import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';
import EventTicketNFT from '../contracts/EventTicketNFT.json';

const Web3Context = createContext();

export function useWeb3() {
  return useContext(Web3Context);
}

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [networkId, setNetworkId] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize web3 connection
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          // Modern dapp browsers
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          
          try {
            // Request account access
            const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccounts(accs);
            setConnected(true);
            
            // Get network ID
            const netId = await web3Instance.eth.net.getId();
            setNetworkId(netId);
          } catch (err) {
            // User denied access
            console.warn('User denied account access');
            setConnected(false);
          }
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accs) => {
            setAccounts(accs);
            setConnected(accs.length > 0);
          });
          
          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } else if (window.web3) {
          // Legacy dapp browsers
          const web3Instance = new Web3(window.web3.currentProvider);
          setWeb3(web3Instance);
          
          // Get accounts
          const accs = await web3Instance.eth.getAccounts();
          setAccounts(accs);
          setConnected(accs.length > 0);
          
          // Get network ID
          const netId = await web3Instance.eth.net.getId();
          setNetworkId(netId);
        } else {
          // Fallback to local provider (for development)
          const provider = new Web3.providers.HttpProvider('http://localhost:8545');
          const web3Instance = new Web3(provider);
          setWeb3(web3Instance);
          setConnected(false);
          console.log('No Ethereum browser extension detected, using Local Web3.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error initializing web3:', err);
        setError('Failed to connect to blockchain. Please install MetaMask or another Ethereum wallet.');
        setLoading(false);
      }
    };
    
    initWeb3();
    
    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);
  
  // Connect wallet manually
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Ethereum wallet not found. Please install MetaMask.');
      return false;
    }
    
    try {
      setLoading(true);
      // Request account access
      const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccounts(accs);
      setConnected(true);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet.');
      setLoading(false);
      return false;
    }
  };
  
  // Get specific NFT contract instance
  const getContractInstance = (contractAddress) => {
    if (!web3 || !contractAddress) return null;
    
    try {
      return new web3.eth.Contract(EventTicketNFT.abi, contractAddress);
    } catch (err) {
      console.error('Error getting contract instance:', err);
      setError('Failed to interact with the contract.');
      return null;
    }
  };
  
  // Mint ticket NFT
  const mintTicket = async (contractAddress, price) => {
    if (!web3 || !connected) {
      setError('Please connect your wallet first.');
      return { success: false, message: 'Wallet not connected' };
    }
    
    try {
      const contract = getContractInstance(contractAddress);
      if (!contract) {
        return { success: false, message: 'Contract not found' };
      }
      
      const weiPrice = web3.utils.toWei(price.toString(), 'ether');
      
      // Call mint function
      const tx = await contract.methods.mintTicket(
        accounts[0],
        'https://eventgo.io/api/tickets/metadata', // Would be replaced by actual metadata URL
        JSON.stringify({ createdAt: new Date().toISOString() })
      ).send({
        from: accounts[0],
        value: weiPrice,
        gas: 500000
      });
      
      return {
        success: true,
        data: {
          transactionHash: tx.transactionHash,
          tokenId: tx.events.TicketMinted.returnValues.tokenId
        }
      };
    } catch (err) {
      console.error('Error minting ticket:', err);
      setError('Failed to mint ticket NFT.');
      return { success: false, message: err.message };
    }
  };
  
  // Transfer ticket NFT
  const transferTicket = async (contractAddress, tokenId, toAddress) => {
    if (!web3 || !connected) {
      setError('Please connect your wallet first.');
      return { success: false, message: 'Wallet not connected' };
    }
    
    try {
      const contract = getContractInstance(contractAddress);
      if (!contract) {
        return { success: false, message: 'Contract not found' };
      }
      
      // Call transfer function
      const tx = await contract.methods.safeTransferFrom(
        accounts[0],
        toAddress,
        tokenId
      ).send({
        from: accounts[0],
        gas: 200000
      });
      
      return {
        success: true,
        data: {
          transactionHash: tx.transactionHash
        }
      };
    } catch (err) {
      console.error('Error transferring ticket:', err);
      setError('Failed to transfer ticket NFT.');
      return { success: false, message: err.message };
    }
  };
  
  // Clear error
  const clearError = () => {
    setError(null);
  };

  const disconnectWallet = () => {
    setAccounts([]);
    setConnected(false);
  };

  const value = {
    web3,
    accounts,
    networkId,
    connected,
    loading,
    error,
    connectWallet,
    getContractInstance,
    mintTicket,
    transferTicket,
    clearError,
    disconnectWallet
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Context; 