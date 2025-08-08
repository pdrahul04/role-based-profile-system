export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }
  
  export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    addresses: Address[];
  }
  
  export type UserRole = 'admin' | 'supervisor' | 'associate';
  
  export interface UserListProps {
    users: User[];
    role: UserRole;
    onEdit: (user: User) => void;
    onView: (user: User) => void;
    onDelete?: (userId: string) => void;
    searchPlaceholder?: string;
    itemsPerPage?: number;
  }
  
  export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  }