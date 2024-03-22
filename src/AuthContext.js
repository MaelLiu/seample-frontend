// src/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAccountName, setUserAccountName] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const login = (accountName, role, email) => {
    setIsAuthenticated(true);
    setUserAccountName(accountName); // Save the user's account name
    setUserRole(role);
    setUserEmail(email);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserAccountName(null); // Clear the user's account name
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userAccountName, userRole, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};