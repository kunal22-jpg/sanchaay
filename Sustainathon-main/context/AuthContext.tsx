import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserStats } from '../types';

interface AuthContextType {
  user: any;
  login: (username: string, password?: string) => Promise<void>;
  logout: () => void;
  syncStats: (stats: UserStats) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('sustain_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username: string, password?: string) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { username, password });
      setUser(res.data);
      localStorage.setItem('sustain_user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sustain_user');
  };

  const syncStats = async (stats: UserStats) => {
    if (!user) return;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/sync`, {
        username: user.username,
        stats
      });
      setUser(res.data);
      localStorage.setItem('sustain_user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Sync failed:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, syncStats, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
