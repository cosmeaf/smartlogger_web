import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../services/Connect';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setUser({ accessToken });
    }
    setLoading(false);
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const { access, refresh } = await post('/api/login/', credentials);
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser({ accessToken: access });
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
    }
  };

  const handleSignup = async (userData) => {
    try {
      await post('/api/register/', userData);
      navigate('/signin');
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await post('/api/token/blacklist/', { refresh: localStorage.getItem('refresh_token') });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.clear();
      setUser(null);
      navigate('/');
      setLoading(false)
      window.location.reload();
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      handleLogin,
      handleSignup,
      handleLogout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
