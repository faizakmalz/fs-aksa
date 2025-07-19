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

      setToken(token);
      localStorage.setItem(USER_KEY, JSON.stringify(admin));
      setUser(admin);

      return { success: true };
    } catch (err) {
      console.error('login failed', err.message);
      return 'Login gagal';
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('logout failed');
    }
    clearToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const updateProfile = async (name, email, phone) => {
    try {
      const res = await api.put("/admin/profile", {
        username: user?.username,
        name,
        email,
        phone,
      });
      console.log("res", res)
      setUser((prev) => ({
        ...prev,
        name,
        email,
        phone,
      }));
    } catch (err) {
      console.error("fail", err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
