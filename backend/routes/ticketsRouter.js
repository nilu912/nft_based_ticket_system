const { Router } = require("express");
const { ticketModel, userModel, transactionModel } = require("../db/db");
const {userMiddleware} = require("../middlewares/userMiddleware");
const uploadJsonToPinata = require("../comman_functions/upload")
const ticketsRouter = Router();
const {mintNFT} = require("../scripts/mint-nft");


async function getTicketId() {
  const maxUser = await ticketModel.findOne().sort({ ticket_id: -1 }).limit(1);
  const maxUserId = maxUser ? maxUser.ticket_id : 0; // Corrected to maxUser.ticket_id
  return maxUserId + 1;
}

async function getTransactionId() {
  const maxTransaction = await transactionModel.findOne().sort({ transaction_id: -1 }).limit(1);
  const maxTransactionId = maxTransaction ? maxTransaction.transaction_id : 0; // Corrected to maxTransaction.transaction_id
  return maxTransactionId + 1;
}

// Buy a ticket (wallet address required, triggers NFT minting)
ticketsRouter.post("/buy", userMiddleware, async (req, res, next) => {
  try {
    const { event_id, amount_paid } = req.body;
    const ticket_id = await getTicketId();
    const walletAddress = req.walletAddress;
    const userData = await userModel.find({
      wallet_address: walletAddress,
    });
    const userId = userData[0].user_id; // Make sure you're accessing the first element in the userData array.
    
    // Upload the JSON to Pinata and get the CID
    const CID = await uploadJsonToPinata({ ticket_id, event_id, userId });

    const txHash = await mintNFT(CID,walletAddress);
    console.log("NFT minted, txhash : " + txHash);

    // Create the ticket in the database
    const newTicket = await ticketModel.create({
      ticket_id,
      event_id,
      wallet_address: walletAddress,
      token_id: txHash.tokenId,
    });
    
    const newTransaction = await transactionModel.create({
      transaction_id: await getTransactionId(),
      wallet_address: walletAddress,
      event_id,
      ticket_id,
      amount_paid,
      transaction_hash: txHash.hash
    })

    // Return success response with CID
    res.status(200).json({ message: "Ticket generated successfully!", newTicket, CID, newTransaction });
  } catch (error) {
    console.error("Error creating ticket:", error);
    next(error); // Pass error to the error handler middleware
  }
});

ticketsRouter.get("/", userMiddleware, async (req, res, next) => {
    try{
        const wallet_address = req.walletAddress;
        const ticketInfo = await ticketModel.find({wallet_address});
        if(!ticketInfo) res.status(404).json({message: "Ticket not found!"})
        res.status(200).json(ticketInfo)
    }catch(error){
        res.status(500).json({error: "Internal server error!", details: error.message})
    }
});

module.exports = {
  ticketsRouter,
};

// thike by gn check kr ke jata hu tab tak kr tu
// han good night TC