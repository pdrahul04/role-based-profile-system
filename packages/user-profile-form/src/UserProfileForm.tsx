import React, { useState, useEffect } from 'react';
import { UserProfileFormProps, UserProfile, Address, ValidationErrors } from './types';
import './UserProfileForm.css';

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    email: '',
    phone: '',
    addresses: [{ id: '1', street: '', city: '', state: '', zipCode: '' }]
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        addresses: initialData.addresses || [{ id: '1', street: '', city: '', state: '', zipCode: '' }]
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validate basic fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    // Validate addresses
    const addressErrors: { [key: string]: { [field: string]: string } } = {};
    formData.addresses.forEach((address, index) => {
      const addressError: { [field: string]: string } = {};
      
      if (!address.street.trim()) addressError.street = 'Street is required';
      if (!address.city.trim()) addressError.city = 'City is required';
      if (!address.state.trim()) addressError.state = 'State is required';
      if (!address.zipCode.trim()) addressError.zipCode = 'Zip code is required';
      
      if (Object.keys(addressError).length > 0) {
        addressErrors[address.id] = addressError;
      }
    });
    
    if (Object.keys(addressErrors).length > 0) {
      newErrors.addresses = addressErrors;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof Omit<UserProfile, 'addresses'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (field in errors && errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddressChange = (addressId: string, field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr =>
        addr.id === addressId ? { ...addr, [field]: value } : addr
      )
    }));

    // Clear address field error when user starts typing
    if (errors.addresses?.[addressId]?.[field]) {
      const newAddressErrors = { ...errors.addresses };
      const addressError = { ...newAddressErrors[addressId] };
      delete addressError[field];
      
      if (Object.keys(addressError).length === 0) {
        delete newAddressErrors[addressId];
      } else {
        newAddressErrors[addressId] = addressError;
      }
      
      setErrors(prev => ({
        ...prev,
        addresses: Object.keys(newAddressErrors).length > 0 ? newAddressErrors : undefined
      }));
    }
  };

  const addAddress = () => {
    const newId = Date.now().toString();
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, { id: newId, street: '', city: '', state: '', zipCode: '' }]
    }));
  };

  const removeAddress = (addressId: string) => {
    if (formData.addresses.length > 1) {
      setFormData(prev => ({
        ...prev,
        addresses: prev.addresses.filter(addr => addr.id !== addressId)
      }));
      
      // Remove errors for the removed address
      if (errors.addresses?.[addressId]) {
        const newAddressErrors = { ...errors.addresses };
        delete newAddressErrors[addressId];
        setErrors(prev => ({
          ...prev,
          addresses: Object.keys(newAddressErrors).length > 0 ? newAddressErrors : undefined
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadonly = mode === 'view';

  return (
    <form onSubmit={handleSubmit} className="user-profile-form">
      <div className="form-group">
        <label htmlFor="fullName">Full Name *</label>
        <input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          readOnly={isReadonly}
          className={errors.fullName ? 'error' : ''}
          data-testid="fullName-input"
        />
        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          readOnly={isReadonly}
          className={errors.email ? 'error' : ''}
          data-testid="email-input"
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone *</label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          readOnly={isReadonly}
          className={errors.phone ? 'error' : ''}
          data-testid="phone-input"
        />
        {errors.phone && <span className="error-text">{errors.phone}</span>}
      </div>

      <div className="addresses-section">
        <div className="addresses-header">
          <h3>Addresses</h3>
          {!isReadonly && (
            <button
              type="button"
              onClick={addAddress}
              className="add-address-btn"
              data-testid="add-address-btn"
            >
              Add Address
            </button>
          )}
        </div>

        {formData.addresses.map((address, index) => (
          <div key={address.id} className="address-block" data-testid={`address-block-${index}`}>
            <div className="address-header">
              <h4>Address {index + 1}</h4>
              {!isReadonly && formData.addresses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAddress(address.id)}
                  className="remove-address-btn"
                  data-testid={`remove-address-${index}`}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`street-${address.id}`}>Street *</label>
                <input
                  id={`street-${address.id}`}
                  type="text"
                  value={address.street}
                  onChange={(e) => handleAddressChange(address.id, 'street', e.target.value)}
                  readOnly={isReadonly}
                  className={errors.addresses?.[address.id]?.street ? 'error' : ''}
                  data-testid={`street-input-${index}`}
                />
                {errors.addresses?.[address.id]?.street && (
                  <span className="error-text">{errors.addresses[address.id].street}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={`city-${address.id}`}>City *</label>
                <input
                  id={`city-${address.id}`}
                  type="text"
                  value={address.city}
                  onChange={(e) => handleAddressChange(address.id, 'city', e.target.value)}
                  readOnly={isReadonly}
                  className={errors.addresses?.[address.id]?.city ? 'error' : ''}
                  data-testid={`city-input-${index}`}
                />
                {errors.addresses?.[address.id]?.city && (
                  <span className="error-text">{errors.addresses[address.id].city}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`state-${address.id}`}>State *</label>
                <input
                  id={`state-${address.id}`}
                  type="text"
                  value={address.state}
                  onChange={(e) => handleAddressChange(address.id, 'state', e.target.value)}
                  readOnly={isReadonly}
                  className={errors.addresses?.[address.id]?.state ? 'error' : ''}
                  data-testid={`state-input-${index}`}
                />
                {errors.addresses?.[address.id]?.state && (
                  <span className="error-text">{errors.addresses[address.id].state}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={`zipCode-${address.id}`}>Zip Code *</label>
                <input
                  id={`zipCode-${address.id}`}
                  type="text"
                  value={address.zipCode}
                  onChange={(e) => handleAddressChange(address.id, 'zipCode', e.target.value)}
                  readOnly={isReadonly}
                  className={errors.addresses?.[address.id]?.zipCode ? 'error' : ''}
                  data-testid={`zipCode-input-${index}`}
                />
                {errors.addresses?.[address.id]?.zipCode && (
                  <span className="error-text">{errors.addresses[address.id].zipCode}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isReadonly && (
        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn"
            data-testid="submit-btn"
          >
            {isSubmitting ? 'Submitting...' : (mode === 'create' ? 'Create User' : 'Update User')}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
              data-testid="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default UserProfileForm;