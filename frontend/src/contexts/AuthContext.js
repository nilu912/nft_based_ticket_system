import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserProvider, JsonRpcProvider } from "ethers";
import { ethers } from "ethers";
import axios from "axios";
const AuthContext = createContext();

// Add the RPC URL definition here
const rpcUrl = "https://ethereum.publicnode.com"; // Using a public Ethereum node

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [ provider, setProvider] = useState(null)
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token === null) return;
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      // fetch(`http://localhost:5000/api/users/${setUser.walletAddress}`)
      setIsAuthenticated(true);
      console.log("checking");
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const userData = (
          await axios.post(`http://localhost:5000/api/users/getuser/`, {
            wallet_address: address,
          })
        ).data;
        if (
          userData.userData.wallet_address.toLowerCase() ===
          address.toString().toLowerCase()
        ) {
          // setUser({
          //   walletAddress: address,
          //   provider: provider,
          // });
          setIsAuthenticated(true);
          setWalletAddress(address);
        }
      }
    } catch (err) {
      console.error("Error checking wallet connection:", err);
      setError("Failed to check wallet connection");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Metamask not installed. Please install it!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      // Fetch the nonce from the server
      const nonceResponse = await fetch(
        "http://localhost:5000/api/users/nonce",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet_address: account }),
        }
      );
      const { nonce } = await nonceResponse.json();

      const signature = await signer.signMessage(nonce);

      const verifyResponse = await fetch(
        "http://localhost:5000/api/users/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress: account, signature }),
        }
      );
      const { token } = await verifyResponse.json();
      if (!token) {
        alert("You are not registered yet. please register first!");
        console.log("Token not found!");
        return;
      }

      localStorage.setItem("token", token);
      // setUser({
      //   walletAddress: account,
      //   provider: provider,
      // });
      setIsAuthenticated(true);
      setWalletAddress(account);
      alert("Login successful!");
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectWallet = async () => {
    try {
      // setUser(null);
      setWalletAddress(null);
      setIsAuthenticated(null);
      localStorage.removeItem('token')
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
      setError("Failed to disconnect wallet");
      throw err;
    }
  };

  const value = {
    // user,
    // loading,
    error,
    connectWallet,
    disconnectWallet,
    walletAddress,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
