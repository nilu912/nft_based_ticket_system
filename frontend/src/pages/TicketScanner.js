import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Html5Qrcode } from "html5-qrcode";
import "./TicketScanner.css";
import axios from "axios";
import { ethers } from "ethers";

import nftABI from "../contracts/MyNFT.json";
// // const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_API_URL);
// const provider = new ethers.BrowserProvider(window.ethereum);
// const signer = await provider.getSigner();

const TicketScanner = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [scanning, setScanning] = useState(true);
  const [scannedResult, setScannedResult] = useState(null);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const qrScannerRef = useRef(null);
  const selectedEventRef = useRef(1);

  useEffect(() => {
    console.log("value set", selectedEvent);
    selectedEventRef.current = selectedEvent;
  }, [selectedEvent]);
  useEffect(() => {
    async function fetchEventData() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/events/orgEvents",
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token"), // Make sure to pass the token
            },
          }
        );
        // console.log(response.data.eventData);
        if (response.data.eventData && response.data.eventData.length > 0) {
          setEvents(response.data.eventData);
          console.log("events", response.data.eventData);
          setSelectedEvent(response.data.eventData[0].event_id);
          // setSelectedEvent(response.data.eventData[0].event_id); // Correct field
        }
        //   if (organizerEvents.length > 0) {
        //     setSelectedEvent(organizerEvents[0].id);
        //   }
      } catch (error) {
        console.error(error);
        return;
      }
    }
    fetchEventData();
  }, []);

  useEffect(() => {
    // Initialize QR scanner when component mounts and scanning is true
    let html5QrCode = null;

    if (scanning && events.length > 0) {
      html5QrCode = new Html5Qrcode("qr-reader");
      qrScannerRef.current = html5QrCode;

      html5QrCode
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Success callback
            try {
              const ticketData = JSON.parse(decodedText);
              setScannedResult(ticketData);
              setScanning(false);
              if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch((err) => {
                  console.error("Failed to stop scanner", err);
                });
              }
              validateTicket(ticketData);
            } catch (error) {
              setTicketStatus({
                valid: false,
                message: "Invalid QR code format",
              });
              setScanning(false);
              if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch((err) => {
                  console.error("Failed to stop scanner", err);
                });
              }
            }
          },
          (errorMessage) => {
            // Error callback - we can ignore most errors as they happen when no QR is detected
            console.log(errorMessage);
          }
        )
        .catch((err) => {
          console.error("Failed to start scanner", err);
        });
    }

    // Cleanup function to stop scanner when component unmounts
    return () => {
      if (qrScannerRef.current) {
        try {
          // Check if scanner is running before attempting to stop it
          if (qrScannerRef.current.isScanning) {
            qrScannerRef.current.stop().catch((err) => {
              console.log("Scanner cleanup:", err);
            });
          }
        } catch (error) {
          console.log("Scanner cleanup error:", error);
        }
      }
    };
  }, [scanning, events.length]);

  const validateTicket = async (ticketData) => {
    try {
      // console.log("contract time",selectedEvent);
      // const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_API_URL);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      console.log(nftABI.abi);
      // console.log("selected event", Number(selectedEventRef.current));
      // Get tickets from localStorage
      const contract = new ethers.Contract(
        ticketData.contractAdd,
        nftABI.abi,
        signer
      );
      try {
        try {
          const cid = await contract.tokenURI(ticketData.id);
        } catch (error) {
          setTicketStatus({
            valid: false,
            message: error.reason,
          });
          console.error(error);
          return;
        }
        const cid = await contract.tokenURI(ticketData.id);
        const ipfsData = (
          await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`)
        ).data;
        const ticketRes = (
          await axios.get(
            `http://localhost:5000/api/tickets/getTicket/${ipfsData.ticket_id}`
          )
        ).data;
        const eventRes = await (
          await axios.get(
            `http://localhost:5000/api/events/byId/${ipfsData.event_id}`
          )
        ).data;

        if (!ipfsData || !ticketRes) {
          setTicketStatus({
            valid: false,
            message: "Ticket not found",
          });
          return;
        }
        if (
          (await contract.ownerOf(ticketData.id)) !== ticketRes.wallet_address
        ) {
          setTicketStatus({
            valid: false,
            message: "Ticket is not purchased by currect NFT holder",
          });
          return;
        }
        if (Number(ipfsData.event_id) !== Number(selectedEventRef.current)) {
          setTicketStatus({
            valid: false,
            message: "Ticket is for a different event",
          });
          return;
        }
        if (ticketRes.status === "used") {
          setTicketStatus({
            valid: false,
            message: "Ticket has already been used",
          });
          return;
        }
        console.log(ticketData.id);
        console.log("ticketData", ticketData);
        try {
          const burn_NFT = await contract.burnNFT(Number(ticketData.id));
          console.log("before update", burn_NFT);
        } catch (error) {
          console.error(error);
          return;
        }
        const updatedResponse = await axios.patch(
          `http://localhost:5000/api/tickets/${ipfsData.ticket_id}`,
          {
            status: "used",
          }
        );
        console.log("after update");
        setTicketStatus({
          valid: true,
          message: "Ticket validated successfully",
          ticket: ticketRes,
          event: eventRes,
        });

        console.log(ticketRes);
        console.log(ipfsData);
        console.log(eventRes);
        console.log(updatedResponse);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      setTicketStatus({
        valid: false,
        message: "Error validating ticket",
      });
    }
  };

  const resetScanner = () => {
    setScanning(true);
    setScannedResult(null);
    setTicketStatus(null);
  };

  const handleEventChange = (e) => {
    console.log(e.target.value);
    setSelectedEvent(e.target.value);
  };

  return (
    <div className="ticket-scanner-container">
      <h1>Ticket Scanner</h1>

      <div className="event-selector">
        <label htmlFor="event-select">Select Event:</label>
        <select
          id="event-select"
          value={selectedEvent}
          onChange={handleEventChange}
          disabled={!scanning}
        >
          {events.map((event) => (
            <option key={event.event_id} value={event.event_id}>
              {event.event_name} -{" "}
              {new Date(event.event_date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {events.length === 0 && (
        <div className="no-events-message">
          <p>You don't have any events to scan tickets for.</p>
          <button onClick={() => navigate("/organizer")}>
            Go to Organizer Dashboard
          </button>
        </div>
      )}
      {events.length > 0 && (
        <div className="scanner-section">
          {scanning ? (
            <div className="qr-reader-container">
              <div
                id="qr-reader"
                style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
              ></div>
              <p className="scanner-instruction">
                Position the QR code in the frame to scan
              </p>
            </div>
          ) : (
            <div className="scan-result">
              {ticketStatus && (
                <div
                  className={`ticket-validation ${
                    ticketStatus.valid ? "valid" : "invalid"
                  }`}
                >
                  <div className="validation-icon">
                    {ticketStatus.valid ? (
                      <i className="fas fa-check-circle"></i>
                    ) : (
                      <i className="fas fa-times-circle"></i>
                    )}
                  </div>
                  <h2>
                    {ticketStatus.valid ? "Valid Ticket" : "Invalid Ticket"}
                  </h2>
                  <p>{ticketStatus.message}</p>

                  {ticketStatus.valid && ticketStatus.ticket && (
                    <div className="ticket-info">
                      <p>
                        <strong>Event:</strong> {ticketStatus.event.event_name}
                      </p>
                      <p>
                        <strong>Ticket ID:</strong>{" "}
                        {ticketStatus.ticket.ticket_id}
                      </p>
                      <p>
                        <strong>Wallet:</strong>{" "}
                        {`${ticketStatus.ticket.wallet_address.slice(
                          0,
                          6
                        )}...${ticketStatus.ticket.wallet_address.slice(-4)}`}
                      </p>
                    </div>
                  )}

                  <button onClick={resetScanner} className="reset-button">
                    Scan Another Ticket
                  </button>
                </div>
              )}
            </div>
          )}
          <div>
            {scanning ? (
              <button onClick={() => setScanning(false)}>Stop Scanning</button>
            ) : (
              <button onClick={() => setScanning(true)}>Start Scanning</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketScanner;
