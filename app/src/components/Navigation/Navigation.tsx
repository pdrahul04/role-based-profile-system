import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "./Navigation.css";

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const getNavItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { path: '/dashboard', label: 'Dashboard' },
          { path: '/create-profile', label: 'Create Profile' },
          { path: '/users', label: 'Users List' }
        ];
      case 'supervisor':
        return [
          { path: '/dashboard', label: 'Dashboard' },
          { path: '/users', label: 'Users List' }
        ];
      case 'associate':
        return [
          { path: '/dashboard', label: 'Dashboard' },
          { path: '/my-profile', label: 'My Profile' }
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/dashboard">User Management System</Link>
        </div>
        
        <div className="nav-links">
          {getNavItems().map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{user.fullName}</span>
            <span className="user-role">({user.role})</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;