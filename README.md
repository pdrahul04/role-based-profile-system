# Role-Based User Profile Management System

A complete React + TypeScript application with role-based authentication and user profile management, featuring two reusable NPM packages and comprehensive testing.

## 🏗️ Project Structure

```
role-based-profile-system/
├── packages/
│   ├── user-profile-form/          # NPM Package 1
│   │   ├── src/
│   │   │   ├── UserProfileForm.tsx
│   │   │   ├── types.ts
│   │   │   ├── index.ts
│   │   │   ├── UserProfileForm.test.tsx
│   │   │   └── setupTests.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── dist/                   # Built files
│   └── user-list/                  # NPM Package 2
│       ├── src/
│       │   ├── UserList.tsx
│       │   ├── types.ts
│       │   ├── index.ts
│       │   ├── UserList.test.tsx
│       │   └── setupTests.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── dist/                   # Built files
└── app/                            # Main React Application
    ├── src/
    │   ├── components/
    │   │   └── Navigation.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── pages/
    │   │   ├── LoginPage.tsx
    │   │   ├── DashboardPage.tsx
    │   │   ├── UsersListPage.tsx
    │   │   ├── CreateProfilePage.tsx
    │   │   ├── UserDetailPage.tsx
    │   │   └── ForbiddenPage.tsx
    │   ├── routes/
    │   │   └── ProtectedRoute.tsx
    │   ├── utils/
    │   │   └── storage.ts
    │   ├── App.tsx
    │   └── App.test.tsx
    ├── package.json
    └── public/
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd role-based-profile-system
   ```

2. **Build Package 1 (user-profile-form):**
   ```bash
   cd packages/user-profile-form
   npm install
   npm run build
   npm test
   cd ../..
   ```

3. **Build Package 2 (user-list):**
   ```bash
   cd packages/user-list
   npm install
   npm run build
   npm test
   cd ../..
   ```

4. **Setup and run the main application:**
   ```bash
   cd app
   npm install
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔐 Demo Credentials

The application comes with three pre-configured user roles:

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| **Admin** | `admin` | `admin123` | Full Access: Create, Edit, View, Delete Users |
| **Supervisor** | `supervisor` | `supervisor123` | Edit & View Users (no Create/Delete) |
| **Associate** | `associate` | `associate123` | View Users only |

## ✨ Features

### 🔒 Authentication & Authorization
- **Hardcoded login** with three distinct roles
- **Role-based navigation** - menu items change based on user role
- **Protected routes** with automatic redirects
- **403 Forbidden page** for unauthorized access attempts

### 👤 User Profile Management
- **Dynamic form validation** with real-time error feedback
- **Multiple address management** - add/edit/delete unlimited addresses
- **Three form modes**: Create, Edit, View
- **Persistent data storage** using localStorage

### 📦 Reusable NPM Packages

#### Package 1: user-profile-form
- **Props**: `mode`, `initialData`, `onSubmit`, `onCancel`
- **Features**: Dynamic address blocks, form validation, responsive design
- **Fully tested** with comprehensive test coverage

#### Package 2: user-list
- **Props**: `users`, `role`, `onEdit`, `onView`, `onDelete`
- **Features**: Search, pagination, role-based button visibility
- **Responsive design** with mobile-friendly layout

### 🧪 Testing
- **Unit tests** for all components using React Testing Library
- **Integration tests** for main application flows
- **Role-based rendering tests**
- **Form validation tests**

## 🧭 Navigation Structure

### Admin Users
- Dashboard
- Create Profile
- Users List

### Supervisor Users
- Dashboard
- Users List

### Associate Users
- Dashboard
- My Profile

## 🛠️ Development Commands

### For NPM Packages (run in each package directory)

```bash
# Install dependencies
npm install

# Build package
npm run build

# Run tests
npm test

# Watch tests
npm run test:watch
```

### For Main Application (run in app directory)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🧪 Running Tests

### Test Individual Packages

```bash
# Test user-profile-form package
cd packages/user-profile-form
npm test

# Test user-list package
cd packages/user-list
npm test
```

### Test Main Application

```bash
cd app
npm test
```

### Run All Tests

```bash
# From project root, run this script:
./run-all-tests.sh
```

Or manually:
```bash
cd packages/user-profile-form && npm test && cd ../user-list && npm test && cd ../../app && npm test
```

## 💾 Data Storage

The application uses **localStorage** for data persistence with:

- **Pre-populated demo data** (5 sample users)
- **Automatic initialization** on first load
- **Data persistence** across browser sessions
- **CRUD operations** (Create, Read, Update, Delete)

### Sample Data Structure

```typescript
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}
```

## 🔧 Technical Implementation

### Tech Stack
- **React 18** with TypeScript
- **React Router** for navigation
- **Context API** for state management
- **Jest** + **React Testing Library** for testing
- **CSS-in-JS** with styled-jsx for styling

### Architecture Patterns
- **Component composition** with reusable packages
- **Custom hooks** for authentication logic
- **Protected routes** with role-based access control
- **Separation of concerns** with dedicated utilities

### Key Design Decisions
- **No external UI libraries** - custom styled components
- **LocalStorage** instead of external database for simplicity
- **Hardcoded authentication** for demo purposes
- **Responsive design** with mobile-first approach

## 🚀 Production Deployment

### Build for Production

```bash
# Build packages first
cd packages/user-profile-form
npm run build

cd ../user-list
npm run build

# Build main application
cd ../../app
npm run build
```

### Environment Configuration

For production deployment, consider:

1. **Replace hardcoded authentication** with real auth service
2. **Replace localStorage** with proper database
3. **Add environment variables** for configuration
4. **Implement proper error boundaries**
5. **Add logging and monitoring**

## 🧩 Package Usage Examples

### Using user-profile-form Package

```typescript
import { UserProfileForm } from 'user-profile-form';

function MyComponent() {
  const handleSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <UserProfileForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
```

### Using user-list Package

```typescript
import { UserList } from 'user-list';

function MyComponent() {
  const users = [/* user data */];
  
  return (
    <UserList
      users={users}
      role="admin"
      onEdit={(user) => console.log('Edit:', user)}
      onView={(user) => console.log('View:', user)}
      onDelete={(id) => console.log('Delete:', id)}
    />
  );
}
```

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Ensure packages are built: `npm run build` in package directories
   - Check if node_modules are installed: `npm install`

2. **Tests failing**
   - Clear Jest cache: `npm test -- --clearCache`
   - Ensure all dependencies are installed

3. **Package linking issues**
   - Try removing node_modules and reinstalling: `rm -rf node_modules && npm install`

4. **TypeScript errors**
   - Ensure all packages are built with TypeScript declarations
   - Check tsconfig.json configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and add tests
4. Ensure all tests pass: `npm test`
5. Commit changes: `git commit -m "Description"`
6. Push to branch: `git push origin feature-name`
7. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Next Steps / Future Enhancements

- [ ] Implement real authentication with JWT
- [ ] Add database integration (PostgreSQL/MongoDB)
- [ ] Implement user avatar uploads
- [ ] Add advanced search and filtering
- [ ] Implement audit logging
- [ ] Add email notifications
- [ ] Create admin analytics dashboard
- [ ] Add bulk user operations
- [ ] Implement user groups/departments
- [ ] Add export/import functionality
