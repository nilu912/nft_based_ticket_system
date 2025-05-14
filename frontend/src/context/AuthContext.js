import React, { createContext, useState, useContext, useEffect } from "react";
import { ethers } from "ethers";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already connected on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token === null) return;
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const userData = await fetchUserData(accounts[0]);
          setUser(userData);
        }
      }
    } catch (err) {
      console.error("Error checking wallet connection:", err);
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this feature");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error(
          "No accounts found. Please unlock MetaMask or create an account."
        );
      }

      // Check if user exists
      const response = await fetch(
        `http://localhost:5001/api/users/wallet/${address}`
      );
      let userData;

      if (response.status === 404) {
        // User doesn't exist, create new user
        const username = `User${address.slice(0, 6)}`;
        const createResponse = await fetch("http://localhost:5001/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            walletAddress: address,
            role: "user",
          }),
        });
        userData = await createResponse.json();
      } else {
        userData = await response.json();
      }

      setUser(userData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setUser(null);
    }
  };

  const disconnectWallet = async () => {
    try {
      console.log(localStorage.getItem("token"));
      localStorage.removeItem("token");
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUserData = async (address) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/users/wallet/${address}`
      );
      if (!response.ok) {
        throw new Error("User not found");
      }
      return await response.json();
    } catch (err) {
      console.error("Error fetching user data:", err);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, connectWallet, disconnectWallet }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
