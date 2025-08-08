import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the storage service
jest.mock('./utils/storage', () => ({
  storageService: {
    init: jest.fn(),
    getAllUsers: jest.fn(() => []),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn()
  }
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders login page when not authenticated', () => {
    render(<App />);
    expect(screen.getByText('User Management System')).toBeInTheDocument();
    expect(screen.getByText('Please sign in to your account')).toBeInTheDocument();
  });

  test('login flow works correctly', async () => {
    render(<App />);
    
    // Fill in admin credentials
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'admin' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'admin123' }
    });
    
    // Submit login form
    fireEvent.click(screen.getByTestId('login-btn'));
    
    // Should redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  test('invalid login shows error', async () => {
    render(<App />);
    
    // Fill in invalid credentials
    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'invalid' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'wrong' }
    });
    
    // Submit login form
    fireEvent.click(screen.getByTestId('login-btn'));
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });

  test('demo credentials work', async () => {
    render(<App />);
    
    // Click on admin demo credentials
    fireEvent.click(screen.getByTestId('demo-admin'));
    
    // Credentials should be filled in
    expect(screen.getByTestId('username-input')).toHaveValue('admin');
    expect(screen.getByTestId('password-input')).toHaveValue('admin123');
    
    // Submit login form
    fireEvent.click(screen.getByTestId('login-btn'));
    
    // Should redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  test('navigation shows correct items for admin', async () => {
    // Login as admin first
    render(<App />);
    fireEvent.click(screen.getByTestId('demo-admin'));
    fireEvent.click(screen.getByTestId('login-btn'));
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    
    // Check navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create Profile')).toBeInTheDocument();
    expect(screen.getByText('Users List')).toBeInTheDocument();
  });

  test('navigation shows correct items for supervisor', async () => {
    // Login as supervisor first
    render(<App />);
    fireEvent.click(screen.getByTestId('demo-supervisor'));
    fireEvent.click(screen.getByTestId('login-btn'));
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    
    // Check navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Create Profile')).not.toBeInTheDocument();
    expect(screen.getByText('Users List')).toBeInTheDocument();
  });

  test('navigation shows correct items for associate', async () => {
    // Login as associate first
    render(<App />);
    fireEvent.click(screen.getByTestId('demo-associate'));
    fireEvent.click(screen.getByTestId('login-btn'));
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    
    // Check navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Create Profile')).not.toBeInTheDocument();
    expect(screen.queryByText('Users List')).not.toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
  });

  test('logout functionality works', async () => {
    // Login first
    render(<App />);
    fireEvent.click(screen.getByTestId('demo-admin'));
    fireEvent.click(screen.getByTestId('login-btn'));
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    
    // Click logout
    fireEvent.click(screen.getByText('Logout'));
    
    // Should redirect to login page
    await waitFor(() => {
      expect(screen.getByText('Please sign in to your account')).toBeInTheDocument();
    });
  });

  test('protected routes redirect to login when not authenticated', () => {
    // Try to access dashboard directly without login
    window.history.pushState({}, 'Dashboard', '/dashboard');
    render(<App />);
    
    // Should show login page
    expect(screen.getByText('Please sign in to your account')).toBeInTheDocument();
  });

  test('role-based access control works', async () => {
    // Login as associate
    render(<App />);
    fireEvent.click(screen.getByTestId('demo-associate'));
    fireEvent.click(screen.getByTestId('login-btn'));
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    
    // Try to access admin-only route
    window.history.pushState({}, 'Create Profile', '/create-profile');
    
    // Should redirect to 403 page
    await waitFor(() => {
      expect(screen.getByText('Access Forbidden')).toBeInTheDocument();
    });
  });
});