import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfileForm } from 'user-profile-form';
import { UserProfile } from 'user-profile-form/dist/types';
import { storageService } from '../../utils/storageService';
import "./CreateProfilePage.css";

const CreateProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: UserProfile) => {
    try {
      // Remove the id if it exists since we're creating a new user
      const { id, ...userData } = formData;
      
      const newUser = storageService.createUser(userData);
      console.log('Created new user:', newUser);
      
      // Show success message and redirect
      alert('User profile created successfully!');
      navigate('/users');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user profile. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <div className="create-profile-page">
      <div className="page-container">
        <div className="page-header">
          <h1>Create New User Profile</h1>
          <p className="page-description">
            Fill in the form below to create a new user profile. All fields marked with * are required.
          </p>
        </div>

        <div className="form-container">
          <UserProfileForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;