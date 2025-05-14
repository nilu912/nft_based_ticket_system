const { Router } = require("express");
const { userModel, nonceModel } = require("../db/db");
const jwt = require('jsonwebtoken');
const { ethers } = require("ethers");
const { utils } = require("ethers");

const dotenv = require("dotenv");
dotenv.config();

const usersRouter = Router();

async function getUserId() {
  const maxUser = await userModel.findOne().sort({ user_id: -1 }).limit(1);
  const maxUserId = maxUser ? maxUser.user_id : 0; // Default to 0 if no users exist
  return maxUserId + 1;
}

usersRouter.post("/signup", async (req, res, next) => {
  console.log("Im in signup");
  const { username, walletAddress, signature } = req.body;

  if (!username || !walletAddress || !signature) {
    return res
      .status(400)
      .json({ error: "Username, wallet address, and signature are required" });
  }

  try {
    // Fetch nonce value for the provided wallet address
    const nonce_val = await nonceModel.findOne({
      wallet_address: walletAddress,
    });

    if (!nonce_val || !nonce_val.nonce_value) {
      return res
        .status(400)
        .json({ error: "Nonce not found for this wallet address" });
    }

    const nonce = nonce_val.nonce_value;
    console.log("Nonce:", nonce);

    // Verify the signature using ethers.js
    const recoveredAddress = ethers.verifyMessage(nonce.toString(), signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res
        .status(401)
        .json({ error: "Invalid signature! Could not sign you up" });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({
      wallet_address: walletAddress,
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const userId = await getUserId();
    // Create a new user
    await userModel.create({
      user_id: userId,
      username: username,
      wallet_address: walletAddress,
    });

    // Delete the nonce after successful signup
    await nonceModel.deleteOne({
      wallet_address: walletAddress,
    });

    // Respond with success
    res.status(201).json({
      message: "You are signed up successfully",
    });
  } catch (error) {
    console.error("Error during signup:", error);
    // res.status(500).json({ error: "Internal server error during signup", description: error.message });
  }
});

usersRouter.post("/signin", async (req, res, next) => {
  const { walletAddress, signature } = req.body;

  // Find the nonce for the wallet address
  const nonce_val = await nonceModel.findOne({
    wallet_address: walletAddress,
  });

  // Delete the nonce from the database to prevent replay attacks
  await nonceModel.deleteOne({
    wallet_address: walletAddress,
  });

  const user = await userModel.findOne({ wallet_address: walletAddress });
  if (!user) {
    return next("user not registered!");
  }

  // Check if the nonce exists
  if (!nonce_val) {
    return res.status(400).json({ error: "Nonce not found" });
  }

  const nonce = nonce_val.nonce_value;

  try {
    // Verify the signature with the nonce
    const recoveredAddress = ethers.verifyMessage(nonce.toString(), signature);
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Generate a JWT token if the signature is valid
    const token = jwt.sign(
      { walletAddress: walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Set an expiry time for the token (optional)
    );
    // Return the token in the response
    res.status(200).json({
      token
    });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
});

usersRouter.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

usersRouter.post("/getuser", async (req, res, next) => {
  try {
    const { wallet_address } = req.body; // Get wallet_address from the body
    if (!wallet_address) {
      return res.status(400).json({ error: "Wallet address required" });
    }

    // Search for the user by wallet address
    const userData = await userModel.findOne({
      wallet_address: wallet_address,
    });

    // If no user is found, return a 404 error
    if (!userData) {
      return res.status(404).json(null); // Returning null in case user is not found
    }

    // Send back the user data
    res.status(200).json({ userData });
  } catch (error) {
    // Handle any server errors
    res
      .status(500)
      .json({ error: "Internal server error.", description: error.message });
  }
});

usersRouter.post("/nonce", async (req, res, next) => {
  try {
    const { wallet_address } = req.body;
    if (!wallet_address)
      return res.status(400).json({ error: "Wallet address required" });

    const nonce = Math.floor(Math.random() * 1000000).toString();
    await nonceModel.create({
      wallet_address: wallet_address,
      nonce_value: nonce,
    });

    res.json({ nonce });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error.", description: error.message });
  }
});
usersRouter.delete("/delete", async (req, res, next) => {
  try {
    const { wallet_address } = req.body;
    if (!wallet_address)
      res.status(404).json({ message: "please provide wallete address!" });
    await nonceModel.findOneAndDelete({
      wallet_address,
    });

    res.status(200).json({ message: "nonce deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});
module.exports = {
  usersRouter: usersRouter,
};
