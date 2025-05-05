import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    walletAddress: user?.walletAddress || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' // Mock wallet address
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      updateUser({
        ...user,
        ...formData
      });
      
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setEditing(!editing);
    setSuccess(false);
    setError('');
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>My Profile</h1>
      </div>
      
      {success && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i> Profile updated successfully!
        </div>
      )}
      
      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      <div className="profile-content">
        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="profile-info">
              <h2>{user?.name || 'User'}</h2>
              <p className="profile-email">{user?.email || 'No email set'}</p>
            </div>
            <button className="btn btn-outline" onClick={toggleEdit}>
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          
          {editing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio" className="form-label">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  className="form-input"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <button type="submit" className="form-button" disabled={loading}>
                {loading ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <div className="profile-details">
              <div className="profile-detail">
                <h3>Bio</h3>
                <p>{user?.bio || 'No bio set. Tell us about yourself!'}</p>
              </div>
              
              <div className="profile-detail">
                <h3>Account Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Member Since:</span>
                  <span className="detail-value">November 1, 2023</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Account Type:</span>
                  <span className="detail-value">Standard User</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="profile-section">
          <h2>Wallet Information</h2>
          <div className="wallet-info">
            <div className="detail-row">
              <span className="detail-label">Connected Wallet:</span>
              <span className="detail-value wallet-address">
                <i className="fas fa-wallet"></i>
                {formData.walletAddress}
              </span>
            </div>
            <p className="wallet-note">
              <i className="fas fa-info-circle"></i>
              This is the wallet that will receive your NFT tickets and can be used for purchases
            </p>
          </div>
        </div>
        
        <div className="profile-section">
          <h2>Account Security</h2>
          <div className="security-options">
            <button className="btn btn-outline">
              <i className="fas fa-lock"></i> Change Password
            </button>
            <button className="btn btn-outline">
              <i className="fas fa-shield-alt"></i> Enable Two-Factor Authentication
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 