import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { storageService } from './utils/storageService';
import Navigation from './components/Navigation/Navigation';
import LoginPage from './components/Login/LoginPage';
import ForbiddenPage from './components/Forbidden/ForbiddenPage';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardPage from './components/Dashboard/DashboardPage';
import UsersListPage from './components/UsersList/UsersListPage';
import UserDetailPage from './components/UserDetail/UserDetailPage';
import CreateProfilePage from './components/CreateProfile/CreateProfilePage';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize storage with demo data
    storageService.init();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/403" element={<ForbiddenPage />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersListPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/users/:userId/:mode"
                element={
                  <ProtectedRoute>
                    <UserDetailPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/create-profile"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <CreateProfilePage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/my-profile"
                element={
                  <ProtectedRoute allowedRoles={['associate']}>
                    <div style={{ padding: '24px', textAlign: 'center' }}>
                      <h1>My Profile</h1>
                      <p>This feature would show the associate's own profile for editing.</p>
                      <p>For demo purposes, this redirects to the users list.</p>
                      <Navigate to="/users" replace />
                    </div>
                  </ProtectedRoute>
                }
              />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 fallback */}
              <Route
                path="*"
                element={
                  <div style={{ 
                    padding: '48px', 
                    textAlign: 'center',
                    minHeight: '50vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <h1 style={{ fontSize: '48px', margin: '0 0 16px 0', color: '#6b7280' }}>404</h1>
                    <h2 style={{ fontSize: '24px', margin: '0 0 16px 0', color: '#1f2937' }}>Page Not Found</h2>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                      The page you're looking for doesn't exist.
                    </p>
                    <a 
                      href="/dashboard" 
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: '600'
                      }}
                    >
                      Go to Dashboard
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;