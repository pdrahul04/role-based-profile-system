export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }
  
  export interface UserProfile {
    id?: string;
    fullName: string;
    email: string;
    phone: string;
    addresses: Address[];
  }
  
  export type FormMode = 'create' | 'edit' | 'view';
  
  export interface UserProfileFormProps {
    mode: FormMode;
    initialData?: Partial<UserProfile>;
    onSubmit: (data: UserProfile) => void;
    onCancel?: () => void;
  }
  
  export interface ValidationErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    addresses?: { [key: string]: { [field: string]: string } };
  }