# 🎟️ NFT Event Ticketing dApp

A full-stack decentralized application for organizing and attending events with NFT-based tickets. Built using **Solidity**, **Hardhat**, **Node.js**, **Express.js**, **MongoDB**, **React**, **Vite**, and **Ethers.js**.

---

## 🗂 Project Structure

nft-event-project/
├── backend/ # Backend server + Smart Contract
│ ├── contracts/ # Solidity Smart Contracts
│ │ ├── Lock.sol
│ │ └── MyNFT.sol # Main NFT Ticket contract
│ ├── db/ # MongoDB configuration
│ │ └── db.js
│ ├── middlewares/ # Express middlewares
│ │ └── userMiddleware.js
│ ├── routes/ # Express routes
│ │ ├── concertsRouter.js
│ │ ├── ticketsRouter.js
│ │ ├── transactionsRouter.js
│ │ └── usersRouter.js
│ ├── scripts/ # Hardhat deployment/mint scripts
│ │ ├── deploy.js
│ │ └── mint-nft.js
│ ├── server.js # Entry point for backend server
│ ├── hardhat.config.js # Hardhat setup
│ ├── .env
│ └── .env.example

├── frontend/ # React + Vite frontend
│ ├── public/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── context/ # Auth and shared contexts
│ │ ├── contexts/ # Other React contexts
│ │ ├── contracts/ # ABI and contract address
│ │ ├── pages/ # Page-based structure
│ │ │ ├── CreateEventPage.js
│ │ │ ├── DashboardPage.js
│ │ │ ├── EventDetailPage.js
│ │ │ ├── EventsPage.js
│ │ │ ├── HomePage.js
│ │ │ ├── LoginPage.js
│ │ │ ├── MyTicketsPage.js
│ │ │ ├── OrganizerDashboard.js
│ │ │ ├── ProfilePage.js
│ │ │ ├── RegisterPage.js
│ │ │ ├── TicketDetail.js
│ │ │ └── TicketScanner.js
│ │ ├── App.js
│ │ └── index.js
│ ├── .env
│ └── vite.config.js


---

## 🚀 Getting Started

###
1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install


2. Environment Setup
Update the .env files in both backend/ and frontend/ directories.

Example backend .env:
ini
Copy
Edit
SEPOLIA_RPC_URL=<your_sepolia_rpc_url>
PRIVATE_KEY=<your_wallet_private_key>
MONGO_URI=<your_mongodb_connection_string>
PORT=5000

3. Deploy Smart Contract to Sepolia
bash
Copy
Edit
cd backend
npx hardhat run scripts/deploy.js --network sepolia
The deployed contract address and ABI will be used in the frontend.

4. Start Backend Server
bash
Copy
Edit
cd backend
node server.js
Starts the Express.js API to interact with MongoDB and smart contract.

5. Start Frontend
bash
Copy
Edit
cd frontend
npm run dev
Launches the React app at http://localhost:5173 (default Vite port).

🦊 MetaMask Setup
Connect MetaMask wallet.

Switch to Sepolia Testnet.

Fund wallet with test ETH via Sepolia Faucet.

✨ Features
🎫 Mint and scan NFT tickets for events

📅 Organizers can create, manage, and list events

👤 Users can browse, buy, and view their tickets

🔒 Smart contract-based ownership and verification

🌐 Fully decentralized on Ethereum Sepolia testnet

📄 Technologies Used
Smart Contracts: Solidity, Hardhat

Backend: Node.js, Express.js, MongoDB

Frontend: React, Vite, Ethers.js

Blockchain: Ethereum Sepolia Testnet

Wallet: MetaMask

📌 To-Do (Optional Enhancements)
QR code-based ticket scanning

Etherscan contract verification

IPFS-based NFT metadata storage

Admin dashboard for analytics
