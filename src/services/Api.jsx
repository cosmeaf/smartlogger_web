import axios from 'axios';

// Criando uma instância do axios
const api = axios.create({
  baseURL: 'https://api.smartlogger.io', // URL do seu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para obter o token de acesso e o token de refresh
export const login = async (credentials) => {
  try {
    const response = await api.post('/api/login/', credentials);
    const { access, refresh } = response.data;

    // Armazenar tokens no localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Erro ao fazer login');
  }
};

// Função para fazer logout e blacklist do token de refresh
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    await api.post('/api/token/blacklist/', { refresh: refreshToken });

    // Remover tokens do localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Erro ao fazer logout');
  }
};

// Função para renovar o token de acesso usando o token de refresh
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
    const { access } = response.data;

    // Armazenar o novo token de acesso no localStorage
    localStorage.setItem('access_token', access);

    return access;
  } catch (error) {
    throw new Error('Falha ao renovar o token');
  }
};

// Interceptar requisições para adicionar o token de acesso
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptar respostas para lidar com tokens expirados
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Renova o token de acesso
        const newAccessToken = await refreshToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        // Repete a requisição original com o novo token
        return api(originalRequest);
      } catch (err) {
        // Se falhar, faz logout
        await logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
