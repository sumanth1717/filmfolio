import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, signupUser, updateProfile, getReceivedReplies } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('filmfolio_token') || null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load user on startup if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await getMe();
          if (data.success) {
            setUser(data.user);
            fetchUnreadReplies();
          } else {
            logout();
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid server response.');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const fetchUnreadReplies = async () => {
    try {
      const data = await getReceivedReplies();
      if (data.success && data.replies) {
        const pending = data.replies.filter((r) => r.status === 'pending');
        setUnreadCount(pending.length);
      }
    } catch (err) {
      // Ignore background check failure
    }
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    if (data.token) {
      localStorage.setItem('filmfolio_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const signup = async (formData) => {
    const data = await signupUser(formData);
    if (data.token) {
      localStorage.setItem('filmfolio_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const updateUserProfile = async (formData) => {
    const data = await updateProfile(formData);
    if (data.user) {
      setUser(data.user);
    }
    return data;
  };

  const updateUserFollowing = (followingArray) => {
    setUser((prev) => (prev ? { ...prev, following: followingArray } : prev));
  };

  const updateUserBlocked = (blockedArray) => {
    setUser((prev) => (prev ? { ...prev, blockedUsers: blockedArray } : prev));
  };

  const logout = () => {
    localStorage.removeItem('filmfolio_token');
    setToken(null);
    setUser(null);
    setUnreadCount(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        unreadCount,
        login,
        signup,
        logout,
        updateUserProfile,
        updateUserFollowing,
        updateUserBlocked,
        fetchUnreadReplies,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
