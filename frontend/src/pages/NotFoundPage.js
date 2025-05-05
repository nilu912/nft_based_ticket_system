import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container">
      <div className="not-found-page">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for doesn't exist or has been moved.</p>
          <div className="not-found-actions">
            <Link to="/" className="btn">
              <i className="fas fa-home"></i> Go Home
            </Link>
            <Link to="/events" className="btn btn-outline">
              <i className="fas fa-calendar-alt"></i> Browse Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 