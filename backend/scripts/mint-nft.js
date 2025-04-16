require("dotenv").config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
const contractAddress = process.env.CONTRACT_ADDRESS;
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

// Create transaction
async function mintNFT(tokenURI, recipientAddress) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");

  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods
      .mintNFT(recipientAddress, tokenURI)
      .encodeABI(),
  };

  try {
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    const hash =  receipt.transactionHash;
    console.log("Transaction successful!");
    console.log("Transaction Hash:", receipt.transactionHash);
    console.log(receipt.to);

    // Extract tokenId from Transfer event
    const transferEvent = receipt.logs.find(
      (log) => log.topics[0] === web3.utils.sha3("Transfer(address,address,uint256)")
    );

    if (transferEvent) {
      const tokenIdHex = transferEvent.topics[3]; // 4th topic is tokenId
      const tokenId = web3.utils.hexToNumber(tokenIdHex);
      console.log("Minted Token ID:", tokenId);
      return {tokenId, hash}
    } else {
      console.log("⚠️ Transfer event not found. Cannot extract tokenId.");
    }
  } catch (error) {
    console.error("Error during transaction:", error);
  }
}


module.exports = { mintNFT };
