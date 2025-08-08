export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }
  
  export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    addresses: Address[];
    createdAt: string;
    updatedAt: string;
  }
  
  const STORAGE_KEY = 'userProfiles';
  
  // Initialize with some demo data
  const DEMO_DATA: UserProfile[] = [
    {
      id: '1',
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      addresses: [
        {
          id: '1',
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        {
          id: '2',
          street: '456 Business Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10002'
        }
      ],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '(555) 987-6543',
      addresses: [
        {
          id: '3',
          street: '789 Oak Lane',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210'
        }
      ],
      createdAt: '2024-01-16T14:20:00Z',
      updatedAt: '2024-01-16T14:20:00Z'
    },
    {
      id: '3',
      fullName: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '(555) 456-7890',
      addresses: [
        {
          id: '4',
          street: '321 Pine Street',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601'
        }
      ],
      createdAt: '2024-01-17T09:15:00Z',
      updatedAt: '2024-01-17T09:15:00Z'
    },
    {
      id: '4',
      fullName: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '(555) 234-5678',
      addresses: [
        {
          id: '5',
          street: '654 Elm Drive',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101'
        }
      ],
      createdAt: '2024-01-18T16:45:00Z',
      updatedAt: '2024-01-18T16:45:00Z'
    },
    {
      id: '5',
      fullName: 'David Wilson',
      email: 'david.wilson@example.com',
      phone: '(555) 345-6789',
      addresses: [
        {
          id: '6',
          street: '987 Maple Court',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101'
        }
      ],
      createdAt: '2024-01-19T11:30:00Z',
      updatedAt: '2024-01-19T11:30:00Z'
    }
  ];
  
  export const storageService = {
    // Initialize storage with demo data if empty
    init(): void {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_DATA));
      }
    },
  
    // Get all user profiles
    getAllUsers(): UserProfile[] {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error('Error reading users from localStorage:', error);
        return [];
      }
    },
  
    // Get user by ID
    getUserById(id: string): UserProfile | null {
      const users = this.getAllUsers();
      return users.find(user => user.id === id) || null;
    },
  
    // Create new user
    createUser(userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): UserProfile {
      const users = this.getAllUsers();
      const newUser: UserProfile = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      return newUser;
    },
  
    // Update existing user
    updateUser(id: string, userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): UserProfile | null {
      const users = this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        return null;
      }
      
      const updatedUser: UserProfile = {
        ...userData,
        id,
        createdAt: users[userIndex].createdAt,
        updatedAt: new Date().toISOString()
      };
      
      users[userIndex] = updatedUser;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      return updatedUser;
    },
  
    // Delete user
    deleteUser(id: string): boolean {
      const users = this.getAllUsers();
      const filteredUsers = users.filter(user => user.id !== id);
      
      if (filteredUsers.length === users.length) {
        return false; // User not found
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredUsers));
      return true;
    },
  
    // Search users
    searchUsers(query: string): UserProfile[] {
      const users = this.getAllUsers();
      const lowerQuery = query.toLowerCase();
      
      return users.filter(user =>
        user.fullName.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.phone.includes(lowerQuery)
      );
    },
  
    // Clear all data (for testing purposes)
    clearAll(): void {
      localStorage.removeItem(STORAGE_KEY);
    },
  
    // Export data
    exportData(): string {
      return JSON.stringify(this.getAllUsers(), null, 2);
    },
  
    // Import data
    importData(jsonData: string): boolean {
      try {
        const data = JSON.parse(jsonData);
        if (Array.isArray(data)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error importing data:', error);
        return false;
      }
    }
  };