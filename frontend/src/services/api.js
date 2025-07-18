import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Adjust if your backend runs on a different port
});

// Interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 