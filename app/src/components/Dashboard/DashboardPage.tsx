import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserProfile } from 'user-profile-form';
import { storageService } from '../../utils/storageService';
import "./DashboardPage.css";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    recentUsers: [] as UserProfile[]
  });

  useEffect(() => {
    const users = storageService.getAllUsers();
    const recentUsers = users
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    setStats({
      totalUsers: users.length,
      recentUsers
    });
  }, []);

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'admin':
        return 'Welcome back! You have full access to manage all users and profiles.';
      case 'supervisor':
        return 'Welcome back! You can view and edit user profiles.';
      case 'associate':
        return 'Welcome back! You can view user profiles and manage your own.';
      default:
        return 'Welcome to the User Management System!';
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { title: 'Create New User', description: 'Add a new user profile', link: '/create-profile', color: 'blue' },
          { title: 'Manage Users', description: 'View and edit all users', link: '/users', color: 'green' },
          { title: 'System Stats', description: `${stats.totalUsers} total users`, link: '/users', color: 'purple' }
        ];
      case 'supervisor':
        return [
          { title: 'Manage Users', description: 'View and edit user profiles', link: '/users', color: 'green' },
          { title: 'System Stats', description: `${stats.totalUsers} total users`, link: '/users', color: 'purple' }
        ];
      case 'associate':
        return [
          { title: 'My Profile', description: 'View and edit your profile', link: '/my-profile', color: 'blue' },
          { title: 'View Users', description: 'Browse user directory', link: '/users', color: 'green' }
        ];
      default:
        return [];
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="welcome-message">{getWelcomeMessage()}</p>
        </div>

        <div className="dashboard-grid">
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              {getQuickActions().map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`action-card ${action.color}`}
                  data-testid={`action-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Users</h2>
            {stats.recentUsers.length > 0 ? (
              <div className="recent-users-list">
                {stats.recentUsers.map((recentUser) => (
                  <div key={recentUser.id} className="recent-user-item" data-testid={`recent-user-${recentUser.id}`}>
                    <div className="user-avatar">
                      {recentUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{recentUser.fullName}</div>
                      <div className="user-email">{recentUser.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No users found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.recentUsers.length}</div>
              <div className="stat-label">Recent Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{user?.role.toUpperCase()}</div>
              <div className="stat-label">Your Role</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;