import axios from 'axios';

const API_BASE_URL = 'http://54.252.53.117/api';
const AUTH_KEY = 'myapp_auth_token';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setToken = (token) => {
  localStorage.setItem(AUTH_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(AUTH_KEY);
};

export default api;
