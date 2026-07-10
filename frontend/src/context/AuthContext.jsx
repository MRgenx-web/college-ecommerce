// Holds the authenticated user + JWT and exposes register/login/logout.
// On mount, if a token exists in localStorage, it re-validates the session
// against GET /auth/me so a page refresh doesn't lose the logged-in state.
import { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { getToken, setToken, clearToken } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user: currentUser } = await authService.getCurrentUser();
        setUser(currentUser);
      } catch {
        clearToken();
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const register = async (data) => {
    const { user: newUser, token } = await authService.registerUser(data);
    setToken(token);
    setUser(newUser);
    return newUser;
  };

  const login = async (credentials) => {
    const { user: loggedInUser, token } = await authService.loginUser(credentials);
    setToken(token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    try {
      await authService.logoutUser();
    } finally {
      clearToken();
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
