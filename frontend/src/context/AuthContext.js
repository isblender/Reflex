// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check localStorage for an authentication token on mount
  
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      // Optionally, decode the token to set more detailed user info.
      setUser({ token });
    }
  }, []);

  const login = (token) => {
    sessionStorage.setItem('token', token);
    setUser({ token });
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};