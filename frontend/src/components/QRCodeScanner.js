import React, { useState, useEffect, useRef } from 'react';
// Import QR scanner using HTML5-QRCode library instead
import { Html5QrcodeScanner } from 'html5-qrcode';
import './QRCodeScanner.css';

const QRCodeScanner = ({ onSuccess }) => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [ticketStatus, setTicketStatus] = useState(null);
  const scannerRef = useRef(null);
  
  useEffect(() => {
    // Cleanup scanner on unmount
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error("Failed to clear scanner", error);
        }
      }
    };
  }, []);

  const handleScan = async (decodedText) => {
    if (decodedText) {
      setScanResult(decodedText);
      setIsScanning(false);
      
      try {
        // In a real app, this would verify the ticket with the blockchain
        // Mock verification for demonstration
        const isValid = Math.random() > 0.2; // 80% chance of success for demo
        
        if (isValid) {
          setTicketStatus({
            valid: true,
            message: 'Valid ticket! Entry approved.',
            ticketData: {
              id: decodedText,
              eventName: 'Sample Event',
              time: new Date().toLocaleString(),
              seat: 'GA-' + Math.floor(Math.random() * 100)
            }
          });
          if (onSuccess) onSuccess(decodedText);
        } else {
          setTicketStatus({
            valid: false,
            message: 'Invalid ticket. Entry denied.',
            error: 'Ticket has already been used or is counterfeit.'
          });
        }
        
        // Stop scanner after successful scan
        if (scannerRef.current) {
          try {
            scannerRef.current.clear();
          } catch (error) {
            console.error("Failed to clear scanner after scan", error);
          }
        }
      } catch (err) {
        console.error('Error validating ticket:', err);
        setError('Error validating ticket');
        setTicketStatus({
          valid: false,
          message: 'Error validating ticket',
          error: err.message || 'Unknown error'
        });
      }
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner error:', err);
    setError('Error accessing camera: ' + (err.message || err));
    setIsScanning(false);
  };

  const startScanning = () => {
    setScanResult(null);
    setTicketStatus(null);
    setError('');
    setIsScanning(true);
    
    // Clear the qr-reader div to avoid duplicate elements
    const qrReaderElement = document.getElementById('qr-reader');
    if (qrReaderElement) {
      qrReaderElement.innerHTML = '';
    }
    
    // Create and render the scanner with better config
    try {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", 
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          aspectRatio: 1.0
        },
        /* verbose= */ false
      );
      
      html5QrcodeScanner.render(handleScan, handleError);
      scannerRef.current = html5QrcodeScanner;
    } catch (error) {
      console.error("Error initializing scanner:", error);
      setError("Failed to start scanner: " + (error.message || "Unknown error"));
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (error) {
        console.error("Failed to clear scanner", error);
      }
    }
  };

  return (
    <div className="qr-scanner-container">
      <h2>Ticket Authentication</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {!isScanning ? (
        <button 
          className="scan-button"
          onClick={startScanning}
        >
          Scan Ticket QR Code
        </button>
      ) : (
        <div className="scanner-wrapper">
          <div id="qr-reader"></div>
          <button 
            className="cancel-scan-button"
            onClick={stopScanning}
          >
            Cancel Scan
          </button>
        </div>
      )}
      
      {ticketStatus && (
        <div className={`ticket-status ${ticketStatus.valid ? 'valid' : 'invalid'}`}>
          <h3>{ticketStatus.message}</h3>
          
          {ticketStatus.valid ? (
            <div className="ticket-details">
              <p><strong>Ticket ID:</strong> {ticketStatus.ticketData.id}</p>
              <p><strong>Event:</strong> {ticketStatus.ticketData.eventName}</p>
              <p><strong>Time:</strong> {ticketStatus.ticketData.time}</p>
              <p><strong>Seat/Section:</strong> {ticketStatus.ticketData.seat}</p>
            </div>
          ) : (
            <p className="error-details">{ticketStatus.error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner; 