import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  // Добавляем transformRequest для явной сериализации данных
  transformRequest: [(data, headers) => {
    if (data && headers['Content-Type'] === 'application/json') {
      console.log('Transforming request data:', data); // Debug log
      return JSON.stringify(data);
    }
    return data;
  }],
});

// Добавляем токен авторизации к каждому запросу
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Добавляем интерцептор для логирования исходящих запросов
api.interceptors.request.use(
  (config) => {
    console.log('Outgoing request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => Promise.reject(error)
);

// Обработка ошибок (например, 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Добавляем интерцептор для логирования ошибок 400
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 400) {
      console.error('400 Bad Request details:', {
        url: error.config.url,
        data: error.config.data,
        response: error.response.data,
      });
    }
    return Promise.reject(error);
  }
);

export default api;