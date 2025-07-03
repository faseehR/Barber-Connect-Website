import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  getProfile: () => api.get('/auth/profile/'),
};

export const barberService = {
  getAll: (params) => api.get('/barbers/', { params }),
  getById: (id) => api.get(`/barbers/${id}/`),
  getStats: () => api.get('/barbers/stats/'),
};

export const appointmentService = {
  create: (data) => api.post('/appointments/', data),
  getAll: () => api.get('/appointments/'),
  cancel: (id) => api.delete(`/appointments/${id}/`),
  accept: (id) => api.patch(`/appointments/${id}/accept/`),
  reject: (id) => api.patch(`/appointments/${id}/reject/`),
};

export const reviewService = {
  create: (data) => api.post('/reviews/', data),
  getByBarber: (barberId) => api.get('/reviews/barber_reviews/', { params: { barber: barberId } }),
};

export default api;