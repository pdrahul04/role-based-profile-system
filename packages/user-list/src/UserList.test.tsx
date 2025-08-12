import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from './UserList';
import { User } from './types';

const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    addresses: [{
      id: '1',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    }]
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '098-765-4321',
    addresses: [{
      id: '2',
      street: '456 Oak Ave',
      city: 'Somewhere',
      state: 'NY',
      zipCode: '67890'
    }]
  },
  {
    id: '3',
    fullName: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '555-123-4567',
    addresses: []
  }
];

const mockOnEdit = jest.fn();
const mockOnView = jest.fn();
const mockOnDelete = jest.fn();

describe('UserList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders user list with all users', () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    test('displays correct user information', () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );

      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('123-456-7890')).toBeInTheDocument();
      expect(screen.getByText('123 Main St, Anytown, CA 12345')).toBeInTheDocument();
      expect(screen.getByText('No address')).toBeInTheDocument();
    });

    test('shows empty state when no users', () => {
      render(
        <UserList
          users={[]}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('No users available.')).toBeInTheDocument();
    });
  });

  describe('Role-based Permissions', () => {
    test('admin sees view, edit, and delete buttons', () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByTestId('view-btn-1')).toBeInTheDocument();
      expect(screen.getByTestId('edit-btn-1')).toBeInTheDocument();
      expect(screen.getByTestId('delete-btn-1')).toBeInTheDocument();
    });

    test('supervisor sees view and edit buttons but no delete', () => {
      render(
        <UserList
          users={mockUsers}
          role="supervisor"
          onEdit={mockOnEdit}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByTestId('view-btn-1')).toBeInTheDocument();
      expect(screen.getByTestId('edit-btn-1')).toBeInTheDocument();
      expect(screen.queryByTestId('delete-btn-1')).not.toBeInTheDocument();
    });

    test('associate sees only view button', () => {
      render(
        <UserList
          users={mockUsers}
          role="associate"
          onEdit={mockOnEdit}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByTestId('view-btn-1')).toBeInTheDocument();
      expect(screen.queryByTestId('edit-btn-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('delete-btn-1')).not.toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    test('filters users by name', async () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'John' } });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });
    });

    test('filters users by email', async () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'jane@' } });

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      });
    });

    test('filters users by phone', async () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: '555' } });

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      });
    });

    test('shows no results message when search has no matches', async () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      await waitFor(() => {
        expect(screen.getByText('No users found matching your search.')).toBeInTheDocument();
      });
    });

    test('case insensitive search', async () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'JOHN' } });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });
    });
  });

  describe('Pagination', () => {
    const manyUsers: User[] = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      fullName: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `${i + 1}23-456-7890`,
      addresses: []
    }));

    test('shows pagination when users exceed itemsPerPage', () => {
      render(
        <UserList
          users={manyUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
          itemsPerPage={10}
        />
      );

      expect(screen.getByTestId('page-1')).toBeInTheDocument();
      expect(screen.getByTestId('page-2')).toBeInTheDocument();
      expect(screen.getByTestId('page-3')).toBeInTheDocument();
      expect(screen.getByTestId('next-page')).toBeInTheDocument();
    });

    test('navigates to next page', () => {
      render(
        <UserList
          users={manyUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
          itemsPerPage={10}
        />
      );

      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.queryByText('User 11')).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId('next-page'));

      expect(screen.queryByText('User 1')).not.toBeInTheDocument();
      expect(screen.getByText('User 11')).toBeInTheDocument();
    });

    test('disables previous button on first page', () => {
      render(
        <UserList
          users={manyUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
          itemsPerPage={10}
        />
      );

      const prevButton = screen.getByTestId('prev-page');
      expect(prevButton).toBeDisabled();
    });

    test('disables next button on last page', () => {
      render(
        <UserList
          users={manyUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
          itemsPerPage={10}
        />
      );

      // Go to last page
      fireEvent.click(screen.getByTestId('page-3'));

      const nextButton = screen.getByTestId('next-page');
      expect(nextButton).toBeDisabled();
    });

    test('resets to first page when search changes', async () => {
      render(
        <UserList
          users={manyUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
          itemsPerPage={10}
        />
      );

      // Go to page 2
      fireEvent.click(screen.getByTestId('page-2'));
      expect(screen.getByText('User 11')).toBeInTheDocument();

      // Search for specific user
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'User 1' } });

      await waitFor(() => {
        // Should be back on first page showing search results
        expect(screen.getByText('User 1')).toBeInTheDocument();
      });
    });

    test('hides pagination when total pages is 1 or less', () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
          itemsPerPage={10}
        />
      );

      expect(screen.queryByTestId('page-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('next-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('prev-page')).not.toBeInTheDocument();
    });
  });

  describe('Action Callbacks', () => {
    test('calls onView when view button is clicked', () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );

      fireEvent.click(screen.getByTestId('view-btn-1'));
      expect(mockOnView).toHaveBeenCalledWith(mockUsers[0]);
    });

    test('calls onEdit when edit button is clicked', () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );

      fireEvent.click(screen.getByTestId('edit-btn-1'));
      expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0]);
    });

    test('calls onDelete when delete button is clicked and confirmed', () => {
      // Mock window.confirm
      const originalConfirm = window.confirm;
      window.confirm = jest.fn().mockReturnValue(true);

      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.click(screen.getByTestId('delete-btn-1'));
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete John Doe?');
      expect(mockOnDelete).toHaveBeenCalledWith('1');

      // Restore original confirm
      window.confirm = originalConfirm;
    });

    test('does not call onDelete when deletion is cancelled', () => {
      // Mock window.confirm
      const originalConfirm = window.confirm;
      window.confirm = jest.fn().mockReturnValue(false);

      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.click(screen.getByTestId('delete-btn-1'));
      expect(window.confirm).toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();

      // Restore original confirm
      window.confirm = originalConfirm;
    });
  });

  describe('Results Info', () => {
    test('displays correct results count', () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
          itemsPerPage={2}
        />
      );

      expect(screen.getByText('Showing 2 of 3 users')).toBeInTheDocument();
    });

    test('updates results count after search', async () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );
    
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'John Doe' } });
    
      await waitFor(() => {
        // "John Doe" only matches one user exactly
        expect(screen.getByText('Showing 1 of 1 users')).toBeInTheDocument();
      });
    });
  });

  describe('Custom Props', () => {
    test('uses custom search placeholder', () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
          searchPlaceholder="Custom search placeholder"
        />
      );

      expect(screen.getByPlaceholderText('Custom search placeholder')).toBeInTheDocument();
    });

    test('uses custom items per page', () => {
      const manyUsers: User[] = Array.from({ length: 5 }, (_, i) => ({
        id: `${i + 1}`,
        fullName: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        phone: `${i + 1}23-456-7890`,
        addresses: []
      }));

      render(
        <UserList
          users={manyUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
          itemsPerPage={2}
        />
      );

      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 2')).toBeInTheDocument();
      expect(screen.queryByText('User 3')).not.toBeInTheDocument();
      expect(screen.getByTestId('page-3')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty search gracefully', async () => {
      render(
        <UserList
          users={mockUsers}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );

      const searchInput = screen.getByTestId('search-input');
      
      // Search with spaces only
      fireEvent.change(searchInput, { target: { value: '   ' } });

      await waitFor(() => {
        // Should show all users when search is only spaces
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });
    });

    test('handles users without addresses correctly', () => {
      const usersWithoutAddresses: User[] = [
        {
          id: '1',
          fullName: 'No Address User',
          email: 'noaddress@example.com',
          phone: '555-0000',
          addresses: []
        }
      ];

      render(
        <UserList
          users={usersWithoutAddresses}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );

      expect(screen.getByText('No address')).toBeInTheDocument();
    });

    test('handles very long user data gracefully', () => {
      const userWithLongData: User[] = [
        {
          id: '1',
          fullName: 'This Is A Very Long Name That Should Not Break The Layout',
          email: 'verylongemailaddressthatmightcauseissues@verylongdomainname.com',
          phone: '555-123-4567-ext-99999',
          addresses: [{
            id: '1',
            street: 'A Very Long Street Address That Goes On And On And Should Be Handled Gracefully',
            city: 'VeryLongCityNameThatShouldNotBreakTheLayout',
            state: 'CA',
            zipCode: '12345'
          }]
        }
      ];

      render(
        <UserList
          users={userWithLongData}
          role="admin"
          onEdit={mockOnEdit}
          onView={mockOnView}
        />
      );

      expect(screen.getByText('This Is A Very Long Name That Should Not Break The Layout')).toBeInTheDocument();
    });
  });
});