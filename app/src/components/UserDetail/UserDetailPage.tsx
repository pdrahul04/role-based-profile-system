import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserProfileForm } from 'user-profile-form';
import { UserProfile, FormMode } from 'user-profile-form/dist/types';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../utils/storageService';
import "./UserDetailPage.css";

const UserDetailPage: React.FC = () => {
  const { userId, mode } = useParams<{ userId: string; mode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('User ID is required');
      setIsLoading(false);
      return;
    }

    loadUser(userId);
  }, [userId]);

  const loadUser = (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const userProfile = storageService.getUserById(id);
      if (!userProfile) {
        setError('User not found');
        return;
      }

      // Convert storage format to form format
      const formattedUser: UserProfile = {
        id: userProfile.id,
        fullName: userProfile.fullName,
        email: userProfile.email,
        phone: userProfile.phone,
        addresses: userProfile.addresses
      };

      setUserData(formattedUser);
    } catch (error) {
      console.error('Error loading user:', error);
      setError('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: UserProfile) => {
    if (!userId) return;

    try {
      const { id, ...updateData } = formData;
      const updatedUser = storageService.updateUser(userId, updateData);
      
      if (!updatedUser) {
        throw new Error('Failed to update user');
      }

      alert('User profile updated successfully!');
      navigate('/users');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user profile. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  const getFormMode = (): FormMode => {
    if (mode === 'edit' && (user?.role === 'admin' || user?.role === 'supervisor')) {
      return 'edit';
    }
    return 'view';
  };

  const getPageTitle = () => {
    const formMode = getFormMode();
    switch (formMode) {
      case 'edit':
        return 'Edit User Profile';
      case 'view':
        return 'View User Profile';
      default:
        return 'User Profile';
    }
  };

  const getPageDescription = () => {
    const formMode = getFormMode();
    switch (formMode) {
      case 'edit':
        return 'Update the user profile information below. All fields marked with * are required.';
      case 'view':
        return 'View user profile information and details.';
      default:
        return 'User profile details';
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Error</h2>
          <p>{error || 'User data not available'}</p>
          <button onClick={() => navigate('/users')} className="back-btn">
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const formMode = getFormMode();

  return (
    <div className="user-detail-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <h1>{getPageTitle()}</h1>
            <p className="page-description">{getPageDescription()}</p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => navigate('/users')}
              className="back-btn"
              data-testid="back-btn"
            >
              Back to Users
            </button>
            {formMode === 'view' && (user?.role === 'admin' || user?.role === 'supervisor') && (
              <button
                onClick={() => navigate(`/users/${userId}/edit`)}
                className="edit-btn"
                data-testid="edit-btn"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="form-container">
          <UserProfileForm
            mode={formMode}
            initialData={userData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;