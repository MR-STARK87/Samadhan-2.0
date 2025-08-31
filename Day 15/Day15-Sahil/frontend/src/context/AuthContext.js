// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // This effect runs when the component mounts and whenever the token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // The login function updates the token state
  const login = (newToken) => {
    setToken(newToken);
  };

  // The logout function clears the token state
  const logout = () => {
    setToken(null);
  };
  
  // The value provided to consuming components
  const value = {
    token,
    isAuthenticated: !!token, // Convert token string to a boolean
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};