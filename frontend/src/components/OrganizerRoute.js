import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrganizerRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ height: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return currentUser && (currentUser.role === 'organizer' || currentUser.role === 'admin') 
    ? children 
    : <Navigate to="/dashboard" />;
};

export default OrganizerRoute; 