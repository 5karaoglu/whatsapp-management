import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Ensure you have jwt-decode installed: npm install jwt-decode
import api from '../services/api';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Check if token is expired
        const isExpired = decodedUser.exp * 1000 < Date.now();
        if (isExpired) {
          logout();
        } else {
          setUser(decodedUser);
          // Set token for subsequent api calls
          api.defaults.headers.common['Authorization'] = token;
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    const decodedUser = jwtDecode(newToken);
    setUser(decodedUser);
    setToken(newToken);
     // Set token for subsequent api calls
    api.defaults.headers.common['Authorization'] = newToken;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const authContextValue = {
    user,
    token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 