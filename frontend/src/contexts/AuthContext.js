import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserProvider, JsonRpcProvider } from "ethers";
import { ethers } from "ethers";
const AuthContext = createContext();

// Add the RPC URL definition here
const rpcUrl = "https://ethereum.publicnode.com"; // Using a public Ethereum node

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ walletAddress, setWalletAddress] = useState('')
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      // fetch(`http://localhost:5000/api/users/${setUser.walletAddress}`)
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          // Make sure we have a valid address and convert it to string
          const address = accounts[0] ? accounts[0].address : null;
          if (address) {
            setUser({
              walletAddress: address,
              provider: provider,
            });
          }
          setWalletAddress(address);
        }
      }
    } catch (err) {
      console.error("Error checking wallet connection:", err);
      setError("Failed to check wallet connection");
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask to use this application");
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      const response = await fetch("http://localhost:5000/api/users/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: address }),
      });
      const { nonce } = await response.json();

      // Ask user to sign the message
      const signature = await signer.signMessage(nonce);

      // Send signed message to backend for verification
      const verifyResponse = await fetch(
        "http://localhost:5000/api/users/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress: address, signature }),
        }
      );

      const data = await verifyResponse.json();

      if (verifyResponse.ok) {
        localStorage.setItem("authToken", data.token);
        alert("Login successful!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectWallet = async () => {
    try {
      setUser(null);
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
      setError("Failed to disconnect wallet");
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    walletAddress
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
