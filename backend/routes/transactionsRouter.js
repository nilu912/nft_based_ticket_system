const { Router } = require("express");
const { transactionModel } = require("../db/db");
// const {userMiddleware} = require("../middlewares/userMiddleware");
const transactionsRouter = Router();

// Fetch transaction history of a user
transactionsRouter.get("/",  async (req, res) => {
  try {
      const wallet_address = req.walletAddress;
      const transactions = await transactionModel.find({ wallet_address });
      
      if (!transactions.length) {
          return res.status(404).json({ message: "No transactions found for this wallet address." });
      }

      res.json(transactions);

      // Send transaction details separately
    //   res.json(transactions.map(tx => ({
    //     transaction_id: tx.transaction_id,
    //     wallet_address: tx.wallet_address,
    //     concert_id: tx.concert_id,
    //     amount_paid: tx.amount_paid,
    //     transaction_hash: tx.transaction_hash,
    //     timestamp: tx.timestamp
    // })));

  } catch (error) {
      res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Fetch transactions for a specific event
transactionsRouter.get("/event/:event_id", async (req, res) => {
  try {
      const event_id = req.params.event_id;
      const transactions = await transactionModel.find({ event_id: event_id });
      
      if (!transactions.length) {
          return res.status(404).json({ message: "No transactions found for this event." });
      }

      res.json(transactions); //extract all the details in front-end or send each tuple from here
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = {
  transactionsRouter,
};
