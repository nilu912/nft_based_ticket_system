import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CreateEventPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    address: '',
    category: '',
    image: '',
    organizer: user?.name || '',
    ticketTypes: [
      {
        name: 'General Admission',
        price: '',
        quantity: 100,
        description: 'Standard ticket with access to all general areas'
      }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTicketChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTicketTypes = [...formData.ticketTypes];
    updatedTicketTypes[index] = {
      ...updatedTicketTypes[index],
      [name]: value
    };
    
    setFormData({
      ...formData,
      ticketTypes: updatedTicketTypes
    });
  };

  const addTicketType = () => {
    setFormData({
      ...formData,
      ticketTypes: [
        ...formData.ticketTypes,
        {
          name: '',
          price: '',
          quantity: 50,
          description: ''
        }
      ]
    });
  };

  const removeTicketType = (index) => {
    const updatedTicketTypes = [...formData.ticketTypes];
    updatedTicketTypes.splice(index, 1);
    
    setFormData({
      ...formData,
      ticketTypes: updatedTicketTypes
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form
      if (formData.ticketTypes.some(ticket => !ticket.name || !ticket.price)) {
        throw new Error('All ticket types must have a name and price');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulated successful event creation
      setSuccess(true);
      
      // Redirect to event page after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to create event. Please try again.');
      console.error('Event creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container">
        <div className="success-container">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2>Event Created Successfully!</h2>
          <p>Your event has been created and tickets are ready to be sold as NFTs.</p>
          <p>Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Create New Event</h1>
      </div>
      
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-section">
          <h2>Event Details</h2>
          
          <div className="form-group">
            <label htmlFor="title" className="form-label">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea
              id="description"
              name="description"
              className="form-input"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="category" className="form-label">Category *</label>
            <select
              id="category"
              name="category"
              className="form-input"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="Meetup">Meetup</option>
              <option value="Exhibition">Exhibition</option>
              <option value="Concert">Concert</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="image" className="form-label">Event Image URL *</label>
            <input
              type="url"
              id="image"
              name="image"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Date & Location</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date" className="form-label">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="startTime" className="form-label">Start Time *</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                className="form-input"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endTime" className="form-label">End Time *</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                className="form-input"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="location" className="form-label">Venue/Location Name *</label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-input"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address" className="form-label">Full Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Tickets</h2>
          <p className="form-info">
            <i className="fas fa-info-circle"></i>
            Each ticket will be minted as an NFT when purchased
          </p>
          
          {formData.ticketTypes.map((ticket, index) => (
            <div key={index} className="ticket-form-item">
              <div className="ticket-form-header">
                <h3>Ticket Type #{index + 1}</h3>
                {formData.ticketTypes.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-ticket-btn"
                    onClick={() => removeTicketType(index)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ticket Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={ticket.name}
                    onChange={(e) => handleTicketChange(index, e)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Price (ETH) *</label>
                  <input
                    type="text"
                    name="price"
                    className="form-input"
                    placeholder="e.g. 0.05"
                    value={ticket.price}
                    onChange={(e) => handleTicketChange(index, e)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Quantity Available *</label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    className="form-input"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketChange(index, e)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  name="description"
                  className="form-input"
                  value={ticket.description}
                  onChange={(e) => handleTicketChange(index, e)}
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            className="btn btn-outline add-ticket-btn"
            onClick={addTicketType}
          >
            <i className="fas fa-plus"></i> Add Another Ticket Type
          </button>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage; 