import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserList } from 'user-list';
import { User } from 'user-list/dist/types';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../utils/storageService';
import "./UsersListPage.css";

const UsersListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setIsLoading(true);
    try {
      const userProfiles = storageService.getAllUsers();
      // Convert UserProfile to User format expected by UserList component
      const formattedUsers: User[] = userProfiles.map(profile => ({
        id: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        addresses: profile.addresses
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (selectedUser: User) => {
    navigate(`/users/${selectedUser.id}/view`);
  };

  const handleEdit = (selectedUser: User) => {
    navigate(`/users/${selectedUser.id}/edit`);
  };

  const handleDelete = (userId: string) => {
    try {
      const success = storageService.deleteUser(userId);
      if (success) {
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user');
    }
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case 'admin':
        return 'Manage Users';
      case 'supervisor':
        return 'User Directory';
      case 'associate':
        return 'User Directory';
      default:
        return 'Users';
    }
  };

  const getPageDescription = () => {
    switch (user?.role) {
      case 'admin':
        return 'View, edit, and delete user profiles. You have full administrative access.';
      case 'supervisor':
        return 'View and edit user profiles. You can modify existing user information.';
      case 'associate':
        return 'Browse the user directory. You can view user profiles and their information.';
      default:
        return 'User management interface';
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="users-list-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <h1>{getPageTitle()}</h1>
            <p className="page-description">{getPageDescription()}</p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/create-profile')}
              className="create-user-btn"
              data-testid="create-user-btn"
            >
              Create New User
            </button>
          )}
        </div>

        <div className="users-list-container">
          <UserList
            users={users}
            role={user?.role || 'associate'}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={user?.role === 'admin' ? handleDelete : undefined}
            searchPlaceholder="Search users by name, email, or phone..."
            itemsPerPage={10}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersListPage;