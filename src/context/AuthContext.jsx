import { createContext, useContext, useEffect, useState } from 'react';
import api, { setToken, clearToken } from '../helpers/api';

const AuthContext = createContext();
const USER_KEY = 'myapp_user_data';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post('/login', { username, password });
      const { token, admin } = res.data.data;

      // Save token and user data
      setToken(token);
      localStorage.setItem(USER_KEY, JSON.stringify(admin));
      setUser(admin);

      return { success: true };
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || 'Login gagal' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.warn('Logout request failed (maybe token expired).');
    }
    clearToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
