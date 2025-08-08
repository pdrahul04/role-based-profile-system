import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { username: 'admin', password: 'admin123', role: 'Admin' },
    { username: 'supervisor', password: 'supervisor123', role: 'Supervisor' },
    { username: 'associate', password: 'associate123', role: 'Associate' }
  ];

  const fillCredentials = (username: string, password: string) => {
    setUsername(username);
    setPassword(password);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>User Management System</h1>
            <p>Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                data-testid="username-input"
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                data-testid="password-input"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="error-message" data-testid="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="login-btn"
              data-testid="login-btn"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="demo-credentials">
            <h3>Demo Credentials</h3>
            <p>Click on any role to auto-fill credentials:</p>
            <div className="credentials-grid">
              {demoCredentials.map((cred) => (
                <div
                  key={cred.username}
                  className="credential-card"
                  onClick={() => fillCredentials(cred.username, cred.password)}
                  data-testid={`demo-${cred.username}`}
                >
                  <div className="credential-role">{cred.role}</div>
                  <div className="credential-details">
                    <div>Username: {cred.username}</div>
                    <div>Password: {cred.password}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;