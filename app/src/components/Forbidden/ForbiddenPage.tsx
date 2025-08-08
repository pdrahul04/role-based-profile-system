import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "./ForbiddenPage.css";

const ForbiddenPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="forbidden-page">
      <div className="forbidden-container">
        <div className="error-code">403</div>
        <h1>Access Forbidden</h1>
        <p className="error-message">
          You don't have permission to access this page. 
          {user && (
            <span> Your current role is <strong>{user.role}</strong>.</span>
          )}
        </p>
        
        <div className="actions">
          <Link to="/dashboard" className="primary-btn">
            Go to Dashboard
          </Link>
          <Link to="/users" className="secondary-btn">
            View Users
          </Link>
        </div>

        <div className="help-section">
          <h3>Need access?</h3>
          <p>Contact your administrator if you believe you should have access to this page.</p>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;