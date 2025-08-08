import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfileForm from './UserProfileForm';
import { UserProfile } from './types';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

const mockUserData: UserProfile = {
  id: '1',
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '123-456-7890',
  addresses: [
    {
      id: '1',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    }
  ]
};

describe('UserProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Mode', () => {
    test('renders form with empty fields', () => {
      render(<UserProfileForm mode="create" onSubmit={mockOnSubmit} />);
      
      expect(screen.getByTestId('fullName-input')).toHaveValue('');
      expect(screen.getByTestId('email-input')).toHaveValue('');
      expect(screen.getByTestId('phone-input')).toHaveValue('');
      expect(screen.getByTestId('street-input-0')).toHaveValue('');
    });

    test('shows validation errors for empty required fields', async () => {
      render(<UserProfileForm mode="create" onSubmit={mockOnSubmit} />);
      
      fireEvent.click(screen.getByTestId('submit-btn'));
      
      await waitFor(() => {
        expect(screen.getByText('Full name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Phone is required')).toBeInTheDocument();
      });
    });

    test('validates email format', async () => {
      render(<UserProfileForm mode="create" onSubmit={mockOnSubmit} />);
      
      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: 'invalid-email' }
      });
      fireEvent.click(screen.getByTestId('submit-btn'));
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
    });

    test('submits form with valid data', async () => {
      render(<UserProfileForm mode="create" onSubmit={mockOnSubmit} />);
      
      // Fill in form fields
      fireEvent.change(screen.getByTestId('fullName-input'), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: 'john@example.com' }
      });
      fireEvent.change(screen.getByTestId('phone-input'), {
        target: { value: '123-456-7890' }
      });
      fireEvent.change(screen.getByTestId('street-input-0'), {
        target: { value: '123 Main St' }
      });
      fireEvent.change(screen.getByTestId('city-input-0'), {
        target: { value: 'Anytown' }
      });
      fireEvent.change(screen.getByTestId('state-input-0'), {
        target: { value: 'CA' }
      });
      fireEvent.change(screen.getByTestId('zipCode-input-0'), {
        target: { value: '12345' }
      });
      
      fireEvent.click(screen.getByTestId('submit-btn'));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          addresses: [{
            id: expect.any(String),
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345'
          }]
        });
      });
    });
  });

  describe('Edit Mode', () => {
    test('renders form with initial data', () => {
      render(
        <UserProfileForm
          mode="edit"
          initialData={mockUserData}
          onSubmit={mockOnSubmit}
        />
      );
      
      expect(screen.getByTestId('fullName-input')).toHaveValue('John Doe');
      expect(screen.getByTestId('email-input')).toHaveValue('john@example.com');
      expect(screen.getByTestId('phone-input')).toHaveValue('123-456-7890');
      expect(screen.getByTestId('street-input-0')).toHaveValue('123 Main St');
    });

    test('updates existing data on submit', async () => {
      render(
        <UserProfileForm
          mode="edit"
          initialData={mockUserData}
          onSubmit={mockOnSubmit}
        />
      );
      
      fireEvent.change(screen.getByTestId('fullName-input'), {
        target: { value: 'Jane Doe' }
      });
      
      fireEvent.click(screen.getByTestId('submit-btn'));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          ...mockUserData,
          fullName: 'Jane Doe'
        });
      });
    });
  });

  describe('View Mode', () => {
    test('renders form with readonly fields', () => {
      render(
        <UserProfileForm
          mode="view"
          initialData={mockUserData}
          onSubmit={mockOnSubmit}
        />
      );
      
      expect(screen.getByTestId('fullName-input')).toHaveAttribute('readonly');
      expect(screen.getByTestId('email-input')).toHaveAttribute('readonly');
      expect(screen.getByTestId('phone-input')).toHaveAttribute('readonly');
      expect(screen.queryByTestId('submit-btn')).not.toBeInTheDocument();
    });

    test('does not show add/remove address buttons', () => {
      render(
        <UserProfileForm
          mode="view"
          initialData={mockUserData}
          onSubmit={mockOnSubmit}
        />
      );
      
      expect(screen.queryByTestId('add-address-btn')).not.toBeInTheDocument();
      expect(screen.queryByTestId('remove-address-0')).not.toBeInTheDocument();
    });
  });

  describe('Dynamic Address Management', () => {
    test('adds new address block', () => {
      render(<UserProfileForm mode="create" onSubmit={mockOnSubmit} />);
      
      expect(screen.getByTestId('address-block-0')).toBeInTheDocument();
      expect(screen.queryByTestId('address-block-1')).not.toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('add-address-btn'));
      
      expect(screen.getByTestId('address-block-0')).toBeInTheDocument();
      expect(screen.getByTestId('address-block-1')).toBeInTheDocument();
    });

    test('removes address block', () => {
      render(<UserProfileForm mode="create" onSubmit={mockOnSubmit} />);
      
      // Add a second address
      fireEvent.click(screen.getByTestId('add-address-btn'));
      
      expect(screen.getByTestId('address-block-0')).toBeInTheDocument();
      expect(screen.getByTestId('address-block-1')).toBeInTheDocument();
      
      // Remove second address
      fireEvent.click(screen.getByTestId('remove-address-1'));
      
      expect(screen.getByTestId('address-block-0')).toBeInTheDocument();
      expect(screen.queryByTestId('address-block-1')).not.toBeInTheDocument();
    });

    test('prevents removing last address', () => {
      render(<UserProfileForm mode="create" onSubmit={mockOnSubmit} />);
      
      // Should not show remove button when only one address exists
      expect(screen.queryByTestId('remove-address-0')).not.toBeInTheDocument();
    });

    test('validates all address fields', async () => {
      render(<UserProfileForm mode="create" onSubmit={mockOnSubmit} />);
      
      // Fill required non-address fields
      fireEvent.change(screen.getByTestId('fullName-input'), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: 'john@example.com' }
      });
      fireEvent.change(screen.getByTestId('phone-input'), {
        target: { value: '123-456-7890' }
      });
      
      fireEvent.click(screen.getByTestId('submit-btn'));
      
      await waitFor(() => {
        expect(screen.getByText('Street is required')).toBeInTheDocument();
        expect(screen.getByText('City is required')).toBeInTheDocument();
        expect(screen.getByText('State is required')).toBeInTheDocument();
        expect(screen.getByText('Zip code is required')).toBeInTheDocument();
      });
    });
  });

  describe('Cancel Functionality', () => {
    test('calls onCancel when cancel button is clicked', () => {
      render(
        <UserProfileForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );
      
      fireEvent.click(screen.getByTestId('cancel-btn'));
      expect(mockOnCancel).toHaveBeenCalled();
    });

    test('does not show cancel button when onCancel is not provided', () => {
      render(<UserProfileForm mode="create" onSubmit={mockOnSubmit} />);
      
      expect(screen.queryByTestId('cancel-btn')).not.toBeInTheDocument();
    });
  });

  describe('Error Clearing', () => {
    test('clears field error when user starts typing', async () => {
      render(<UserProfileForm mode="create" onSubmit={mockOnSubmit} />);
      
      // Trigger validation error
      fireEvent.click(screen.getByTestId('submit-btn'));
      
      await waitFor(() => {
        expect(screen.getByText('Full name is required')).toBeInTheDocument();
      });
      
      // Start typing in field
      fireEvent.change(screen.getByTestId('fullName-input'), {
        target: { value: 'J' }
      });
      
      expect(screen.queryByText('Full name is required')).not.toBeInTheDocument();
    });

    test('clears address error when user starts typing', async () => {
      render(<UserProfileForm mode="create" onSubmit={mockOnSubmit} />);
      
      // Fill required fields except address
      fireEvent.change(screen.getByTestId('fullName-input'), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: 'john@example.com' }
      });
      fireEvent.change(screen.getByTestId('phone-input'), {
        target: { value: '123-456-7890' }
      });
      
      fireEvent.click(screen.getByTestId('submit-btn'));
      
      await waitFor(() => {
        expect(screen.getByText('Street is required')).toBeInTheDocument();
      });
      
      // Start typing in street field
      fireEvent.change(screen.getByTestId('street-input-0'), {
        target: { value: '1' }
      });
      
      expect(screen.queryByText('Street is required')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Addresses', () => {
    test('handles multiple addresses correctly', () => {
      const multiAddressData: UserProfile = {
        ...mockUserData,
        addresses: [
          {
            id: '1',
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345'
          },
          {
            id: '2',
            street: '456 Oak Ave',
            city: 'Somewhere',
            state: 'NY',
            zipCode: '67890'
          }
        ]
      };

      render(
        <UserProfileForm
          mode="edit"
          initialData={multiAddressData}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByTestId('address-block-0')).toBeInTheDocument();
      expect(screen.getByTestId('address-block-1')).toBeInTheDocument();
      expect(screen.getByTestId('street-input-0')).toHaveValue('123 Main St');
      expect(screen.getByTestId('street-input-1')).toHaveValue('456 Oak Ave');
    });

    test('allows editing individual address fields', async () => {
      render(
        <UserProfileForm
          mode="edit"
          initialData={mockUserData}
          onSubmit={mockOnSubmit}
        />
      );

      // Change street address
      fireEvent.change(screen.getByTestId('street-input-0'), {
        target: { value: '999 New Street' }
      });

      fireEvent.click(screen.getByTestId('submit-btn'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          ...mockUserData,
          addresses: [{
            ...mockUserData.addresses[0],
            street: '999 New Street'
          }]
        });
      });
    });
  });

  describe('Form Submission States', () => {
    test('shows loading state during submission', async () => {
      const slowSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<UserProfileForm mode="create" onSubmit={slowSubmit} />);
      
      // Fill form with valid data
      fireEvent.change(screen.getByTestId('fullName-input'), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: 'john@example.com' }
      });
      fireEvent.change(screen.getByTestId('phone-input'), {
        target: { value: '123-456-7890' }
      });
      fireEvent.change(screen.getByTestId('street-input-0'), {
        target: { value: '123 Main St' }
      });
      fireEvent.change(screen.getByTestId('city-input-0'), {
        target: { value: 'Anytown' }
      });
      fireEvent.change(screen.getByTestId('state-input-0'), {
        target: { value: 'CA' }
      });
      fireEvent.change(screen.getByTestId('zipCode-input-0'), {
        target: { value: '12345' }
      });
      
      fireEvent.click(screen.getByTestId('submit-btn'));
      
      // Check loading state
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
      expect(screen.getByTestId('submit-btn')).toBeDisabled();
      
      // Wait for submission to complete
      await waitFor(() => {
        expect(slowSubmit).toHaveBeenCalled();
      });
    });
  });
});